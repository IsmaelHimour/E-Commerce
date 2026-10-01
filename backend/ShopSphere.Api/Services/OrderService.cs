using System.Security.Claims;
using ShopSphere.Api.DTOs.Orders;
using ShopSphere.Api.Entities;
using ShopSphere.Api.Repositories;

namespace ShopSphere.Api.Services;

public class OrderService : IOrderService
{
    private readonly ICartRepository _cartRepository;
    private readonly IOrderRepository _orderRepository;

    public OrderService(ICartRepository cartRepository, IOrderRepository orderRepository)
    {
        _cartRepository = cartRepository;
        _orderRepository = orderRepository;
    }

    public async Task<ServiceResult<OrderDto>> CreateOrderAsync(ClaimsPrincipal userPrincipal)
    {
        var userId = GetUserId(userPrincipal);
        if (userId is null)
        {
            return ServiceResult<OrderDto>.Failure("User is not authenticated.");
        }

        var cart = await _cartRepository.GetByUserIdAsync(userId.Value);
        if (cart is null || cart.Items.Count == 0)
        {
            return ServiceResult<OrderDto>.Failure("Cart is empty.");
        }

        foreach (var item in cart.Items)
        {
            if (item.Product is null)
            {
                return ServiceResult<OrderDto>.Failure("A cart product was not found.");
            }

            if (item.Quantity > item.Product.StockQuantity)
            {
                return ServiceResult<OrderDto>.Failure($"Only {item.Product.StockQuantity} units of {item.Product.Name} are available.");
            }
        }

        var order = await _orderRepository.CreateFromCartAsync(cart);
        var createdOrder = await _orderRepository.GetByIdAsync(order.Id);

        return ServiceResult<OrderDto>.Success(MapToDto(createdOrder ?? order));
    }

    public async Task<ServiceResult<IReadOnlyList<OrderDto>>> GetMyOrdersAsync(ClaimsPrincipal userPrincipal)
    {
        var userId = GetUserId(userPrincipal);
        if (userId is null)
        {
            return ServiceResult<IReadOnlyList<OrderDto>>.Failure("User is not authenticated.");
        }

        var orders = await _orderRepository.GetByUserIdAsync(userId.Value);
        return ServiceResult<IReadOnlyList<OrderDto>>.Success(orders.Select(MapToDto).ToList());
    }

    public async Task<ServiceResult<OrderDto>> GetMyOrderByIdAsync(ClaimsPrincipal userPrincipal, int orderId)
    {
        var userId = GetUserId(userPrincipal);
        if (userId is null)
        {
            return ServiceResult<OrderDto>.Failure("User is not authenticated.");
        }

        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order is null || order.UserId != userId.Value)
        {
            return ServiceResult<OrderDto>.Failure("Order was not found.");
        }

        return ServiceResult<OrderDto>.Success(MapToDto(order));
    }

    public async Task<IReadOnlyList<AdminOrderDto>> GetAllForAdminAsync()
    {
        var orders = await _orderRepository.GetAllAsync();
        return orders.Select(MapToAdminDto).ToList();
    }

    public async Task<ServiceResult<AdminOrderDto>> UpdateStatusAsync(int orderId, UpdateOrderStatusDto dto)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order is null)
        {
            return ServiceResult<AdminOrderDto>.Failure("Order was not found.");
        }

        order.Status = dto.Status;
        await _orderRepository.SaveChangesAsync();

        var updatedOrder = await _orderRepository.GetByIdAsync(orderId);
        return ServiceResult<AdminOrderDto>.Success(MapToAdminDto(updatedOrder ?? order));
    }

    private static int? GetUserId(ClaimsPrincipal userPrincipal)
    {
        var userIdValue = userPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdValue, out var userId) ? userId : null;
    }

    private static OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderDate = order.OrderDate,
            TotalPrice = order.TotalPrice,
            Status = order.Status,
            Items = order.Items.Select(MapItemToDto).ToList()
        };
    }

    private static AdminOrderDto MapToAdminDto(Order order)
    {
        return new AdminOrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            CustomerName = order.User?.FullName ?? string.Empty,
            CustomerEmail = order.User?.Email ?? string.Empty,
            OrderDate = order.OrderDate,
            TotalPrice = order.TotalPrice,
            Status = order.Status,
            Items = order.Items.Select(MapItemToDto).ToList()
        };
    }

    private static OrderItemDto MapItemToDto(OrderItem item)
    {
        return new OrderItemDto
        {
            Id = item.Id,
            ProductId = item.ProductId,
            ProductName = item.Product?.Name ?? string.Empty,
            ImageUrl = item.Product?.ImageUrl ?? string.Empty,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            LineTotal = item.UnitPrice * item.Quantity
        };
    }
}
