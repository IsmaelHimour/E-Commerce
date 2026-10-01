using System.ComponentModel.DataAnnotations;

namespace ShopSphere.Api.DTOs.Auth;

public class RegisterDto
{
    [Required]
    [MaxLength(120)]
    public string FullName { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(160)]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(6)]
    [MaxLength(100)]
    public string Password { get; init; } = string.Empty;
}
