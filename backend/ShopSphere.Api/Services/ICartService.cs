using System.Security.Claims;
using ShopSphere.Api.DTOs.Cart;

namespace ShopSphere.Api.Services;

public interface ICartService
{
    Task<ServiceResult<CartDto>> GetCartAsync(ClaimsPrincipal userPrincipal);

    Task<ServiceResult<CartDto>> AddItemAsync(ClaimsPrincipal userPrincipal, AddCartItemDto dto);

    Task<ServiceResult<CartDto>> UpdateItemAsync(ClaimsPrincipal userPrincipal, int productId, UpdateCartItemDto dto);

    Task<ServiceResult<bool>> RemoveItemAsync(ClaimsPrincipal userPrincipal, int productId);

    Task<ServiceResult<bool>> ClearAsync(ClaimsPrincipal userPrincipal);
}
