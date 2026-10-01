namespace ShopSphere.Api.DTOs.Orders;

public class AdminOrderDto : OrderDto
{
    public int UserId { get; init; }

    public string CustomerName { get; init; } = string.Empty;

    public string CustomerEmail { get; init; } = string.Empty;
}
