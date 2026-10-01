namespace ShopSphere.Api.DTOs.Cart;

public class CartDto
{
    public int Id { get; init; }

    public IReadOnlyList<CartItemDto> Items { get; init; } = [];

    public int TotalItems { get; init; }

    public decimal TotalPrice { get; init; }
}
