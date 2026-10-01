using System.ComponentModel.DataAnnotations;

namespace ShopSphere.Api.DTOs.Products;

public class ProductQueryParameters
{
    [MaxLength(100)]
    public string? Search { get; init; }

    public int? CategoryId { get; init; }

    [Range(0, 999999.99)]
    public decimal? MinPrice { get; init; }

    [Range(0, 999999.99)]
    public decimal? MaxPrice { get; init; }

    [Range(1, int.MaxValue)]
    public int PageNumber { get; init; } = 1;

    [Range(1, 100)]
    public int PageSize { get; init; } = 12;
}
