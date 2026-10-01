using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using ShopSphere.Api.DTOs.Auth;
using ShopSphere.Api.Entities;
using ShopSphere.Api.Repositories;

namespace ShopSphere.Api.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<User> _passwordHasher;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _passwordHasher = new PasswordHasher<User>();
    }

    public async Task<ServiceResult<AuthResponseDto>> RegisterAsync(RegisterDto dto)
    {
        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

        if (await _userRepository.EmailExistsAsync(normalizedEmail))
        {
            return ServiceResult<AuthResponseDto>.Failure("A user with this email already exists.");
        }

        var user = new User
        {
            FullName = dto.FullName.Trim(),
            Email = normalizedEmail,
            Role = "Customer",
            Cart = new Cart()
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        var createdUser = await _userRepository.AddAsync(user);
        return ServiceResult<AuthResponseDto>.Success(CreateAuthResponse(createdUser));
    }

    public async Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user is null)
        {
            return ServiceResult<AuthResponseDto>.Failure("Invalid email or password.");
        }

        var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
        if (verificationResult == PasswordVerificationResult.Failed)
        {
            return ServiceResult<AuthResponseDto>.Failure("Invalid email or password.");
        }

        return ServiceResult<AuthResponseDto>.Success(CreateAuthResponse(user));
    }

    public async Task<UserProfileDto?> GetProfileAsync(ClaimsPrincipal userPrincipal)
    {
        var userIdValue = userPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdValue, out var userId))
        {
            return null;
        }

        var user = await _userRepository.GetByIdAsync(userId);
        return user is null ? null : MapToProfileDto(user);
    }

    private AuthResponseDto CreateAuthResponse(User user)
    {
        var expiresAt = DateTime.UtcNow.AddMinutes(GetTokenLifetimeMinutes());

        return new AuthResponseDto
        {
            Token = GenerateJwtToken(user, expiresAt),
            ExpiresAt = expiresAt,
            User = MapToProfileDto(user)
        };
    }

    private string GenerateJwtToken(User user, DateTime expiresAt)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key is not configured.");
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private int GetTokenLifetimeMinutes()
    {
        return int.TryParse(_configuration["Jwt:ExpiresInMinutes"], out var minutes)
            ? minutes
            : 60;
    }

    private static UserProfileDto MapToProfileDto(User user)
    {
        return new UserProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role
        };
    }
}
