namespace ShopSphere.Api.DTOs.Cart;

public class CartItemDto
{
    public int Id { get; init; }

    public int ProductId { get; init; }

    public string ProductName { get; init; } = string.Empty;

    public string ImageUrl { get; init; } = string.Empty;

    public decimal UnitPrice { get; init; }

    public int Quantity { get; init; }

    public int StockQuantity { get; init; }

    public decimal LineTotal { get; init; }
}
