using System.ComponentModel.DataAnnotations;

namespace ShopSphere.Api.DTOs.Categories;

public class UpdateCategoryDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; init; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Description { get; init; } = string.Empty;
}
