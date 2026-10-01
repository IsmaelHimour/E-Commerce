namespace ShopSphere.Api.DTOs.Orders;

public class OrderDto
{
    public int Id { get; init; }

    public DateTime OrderDate { get; init; }

    public decimal TotalPrice { get; init; }

    public string Status { get; init; } = string.Empty;

    public IReadOnlyList<OrderItemDto> Items { get; init; } = [];
}
