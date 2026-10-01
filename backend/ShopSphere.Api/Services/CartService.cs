using System.Security.Claims;
using ShopSphere.Api.DTOs.Cart;
using ShopSphere.Api.Entities;
using ShopSphere.Api.Repositories;

namespace ShopSphere.Api.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;

    public CartService(ICartRepository cartRepository, IProductRepository productRepository)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
    }

    public async Task<ServiceResult<CartDto>> GetCartAsync(ClaimsPrincipal userPrincipal)
    {
        var userId = GetUserId(userPrincipal);
        if (userId is null)
        {
            return ServiceResult<CartDto>.Failure("User is not authenticated.");
        }

        var cart = await _cartRepository.GetOrCreateByUserIdAsync(userId.Value);
        return ServiceResult<CartDto>.Success(MapToDto(cart));
    }

    public async Task<ServiceResult<CartDto>> AddItemAsync(ClaimsPrincipal userPrincipal, AddCartItemDto dto)
    {
        var userId = GetUserId(userPrincipal);
        if (userId is null)
        {
            return ServiceResult<CartDto>.Failure("User is not authenticated.");
        }

        var product = await _productRepository.GetByIdAsync(dto.ProductId);
        if (product is null)
        {
            return ServiceResult<CartDto>.Failure("Product was not found.");
        }

        if (product.StockQuantity <= 0)
        {
            return ServiceResult<CartDto>.Failure("Product is out of stock.");
        }

        var cart = await _cartRepository.GetOrCreateByUserIdAsync(userId.Value);
        var existingItem = await _cartRepository.GetItemAsync(cart.Id, dto.ProductId);
        var requestedQuantity = dto.Quantity + (existingItem?.Quantity ?? 0);

        if (requestedQuantity > product.StockQuantity)
        {
            return ServiceResult<CartDto>.Failure("Requested quantity exceeds available stock.");
        }

        if (existingItem is null)
        {
            await _cartRepository.AddItemAsync(new CartItem
            {
                CartId = cart.Id,
                ProductId = product.Id,
                Quantity = dto.Quantity
            });
        }
        else
        {
            existingItem.Quantity = requestedQuantity;
            await _cartRepository.SaveChangesAsync();
        }

        var updatedCart = await _cartRepository.GetOrCreateByUserIdAsync(userId.Value);
        return ServiceResult<CartDto>.Success(MapToDto(updatedCart));
    }

    public async Task<ServiceResult<CartDto>> UpdateItemAsync(ClaimsPrincipal userPrincipal, int productId, UpdateCartItemDto dto)
    {
        var userId = GetUserId(userPrincipal);
        if (userId is null)
        {
            return ServiceResult<CartDto>.Failure("User is not authenticated.");
        }

        var product = await _productRepository.GetByIdAsync(productId);
        if (product is null)
        {
            return ServiceResult<CartDto>.Failure("Product was not found.");
        }

        if (dto.Quantity > product.StockQuantity)
        {
            return ServiceResult<CartDto>.Failure("Requested quantity exceeds available stock.");
        }

        var cart = await _cartRepository.GetOrCreateByUserIdAsync(userId.Value);
        var item = await _cartRepository.GetItemAsync(cart.Id, productId);
        if (item is null)
        {
            return ServiceResult<CartDto>.Failure("Cart item was not found.");
        }

        item.Quantity = dto.Quantity;
        await _cartRepository.SaveChangesAsync();

        var updatedCart = await _cartRepository.GetOrCreateByUserIdAsync(userId.Value);
        return ServiceResult<CartDto>.Success(MapToDto(updatedCart));
    }

    public async Task<ServiceResult<bool>> RemoveItemAsync(ClaimsPrincipal userPrincipal, int productId)
    {
        var userId = GetUserId(userPrincipal);
        if (userId is null)
        {
            return ServiceResult<bool>.Failure("User is not authenticated.");
        }

        var cart = await _cartRepository.GetOrCreateByUserIdAsync(userId.Value);
        var item = await _cartRepository.GetItemAsync(cart.Id, productId);
        if (item is null)
        {
            return ServiceResult<bool>.Failure("Cart item was not found.");
        }

        await _cartRepository.DeleteItemAsync(item);
        return ServiceResult<bool>.Success(true);
    }

    public async Task<ServiceResult<bool>> ClearAsync(ClaimsPrincipal userPrincipal)
    {
        var userId = GetUserId(userPrincipal);
        if (userId is null)
        {
            return ServiceResult<bool>.Failure("User is not authenticated.");
        }

        var cart = await _cartRepository.GetOrCreateByUserIdAsync(userId.Value);
        await _cartRepository.ClearAsync(cart);
        return ServiceResult<bool>.Success(true);
    }

    private static int? GetUserId(ClaimsPrincipal userPrincipal)
    {
        var userIdValue = userPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdValue, out var userId) ? userId : null;
    }

    private static CartDto MapToDto(Cart cart)
    {
        var items = cart.Items
            .OrderBy(item => item.Product?.Name)
            .Select(MapItemToDto)
            .ToList();

        return new CartDto
        {
            Id = cart.Id,
            Items = items,
            TotalItems = items.Sum(item => item.Quantity),
            TotalPrice = items.Sum(item => item.LineTotal)
        };
    }

    private static CartItemDto MapItemToDto(CartItem item)
    {
        var product = item.Product;
        var unitPrice = product?.Price ?? 0m;

        return new CartItemDto
        {
            Id = item.Id,
            ProductId = item.ProductId,
            ProductName = product?.Name ?? string.Empty,
            ImageUrl = product?.ImageUrl ?? string.Empty,
            UnitPrice = unitPrice,
            Quantity = item.Quantity,
            StockQuantity = product?.StockQuantity ?? 0,
            LineTotal = unitPrice * item.Quantity
        };
    }
}
