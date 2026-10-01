using System.ComponentModel.DataAnnotations;

namespace ShopSphere.Api.DTOs.Cart;

public class AddCartItemDto
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; init; }

    [Range(1, 100)]
    public int Quantity { get; init; } = 1;
}
