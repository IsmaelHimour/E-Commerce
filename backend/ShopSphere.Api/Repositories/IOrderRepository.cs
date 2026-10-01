using ShopSphere.Api.Entities;

namespace ShopSphere.Api.Repositories;

public interface IOrderRepository
{
    Task<IReadOnlyList<Order>> GetByUserIdAsync(int userId);

    Task<IReadOnlyList<Order>> GetAllAsync();

    Task<Order?> GetByIdAsync(int id);

    Task<Order> CreateFromCartAsync(Cart cart);

    Task SaveChangesAsync();
}
