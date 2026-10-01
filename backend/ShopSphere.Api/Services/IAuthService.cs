using System.Security.Claims;
using ShopSphere.Api.DTOs.Auth;

namespace ShopSphere.Api.Services;

public interface IAuthService
{
    Task<ServiceResult<AuthResponseDto>> RegisterAsync(RegisterDto dto);

    Task<ServiceResult<AuthResponseDto>> LoginAsync(LoginDto dto);

    Task<UserProfileDto?> GetProfileAsync(ClaimsPrincipal userPrincipal);
}
