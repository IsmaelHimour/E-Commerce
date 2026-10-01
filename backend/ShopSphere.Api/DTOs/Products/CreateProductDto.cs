using System.ComponentModel.DataAnnotations;

namespace ShopSphere.Api.DTOs.Products;

public class CreateProductDto
{
    [Required]
    [MaxLength(150)]
    public string Name { get; init; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; init; } = string.Empty;

    [Range(0.01, 999999.99)]
    public decimal Price { get; init; }

    [Range(0, int.MaxValue)]
    public int StockQuantity { get; init; }

    [Required]
    [MaxLength(500)]
    public string ImageUrl { get; init; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int CategoryId { get; init; }
}
