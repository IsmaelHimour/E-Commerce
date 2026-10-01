namespace ShopSphere.Api.DTOs.Auth;

public class AuthResponseDto
{
    public string Token { get; init; } = string.Empty;

    public DateTime ExpiresAt { get; init; }

    public UserProfileDto User { get; init; } = new();
}
