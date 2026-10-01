using ShopSphere.Api.Entities;

namespace ShopSphere.Api.Repositories;

public interface ICartRepository
{
    Task<Cart?> GetByUserIdAsync(int userId);

    Task<Cart> GetOrCreateByUserIdAsync(int userId);

    Task<CartItem?> GetItemAsync(int cartId, int productId);

    Task AddItemAsync(CartItem item);

    Task DeleteItemAsync(CartItem item);

    Task ClearAsync(Cart cart);

    Task SaveChangesAsync();
}
