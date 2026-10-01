using ShopSphere.Api.Entities;

namespace ShopSphere.Api.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);

    Task<User?> GetByEmailAsync(string email);

    Task<bool> EmailExistsAsync(string email);

    Task<User> AddAsync(User user);
}
