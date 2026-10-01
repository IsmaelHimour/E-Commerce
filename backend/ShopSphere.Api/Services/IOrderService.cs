using System.Security.Claims;
using ShopSphere.Api.DTOs.Orders;

namespace ShopSphere.Api.Services;

public interface IOrderService
{
    Task<ServiceResult<OrderDto>> CreateOrderAsync(ClaimsPrincipal userPrincipal);

    Task<ServiceResult<IReadOnlyList<OrderDto>>> GetMyOrdersAsync(ClaimsPrincipal userPrincipal);

    Task<ServiceResult<OrderDto>> GetMyOrderByIdAsync(ClaimsPrincipal userPrincipal, int orderId);

    Task<IReadOnlyList<AdminOrderDto>> GetAllForAdminAsync();

    Task<ServiceResult<AdminOrderDto>> UpdateStatusAsync(int orderId, UpdateOrderStatusDto dto);
}
