using ShopSphere.Api.Entities;

namespace ShopSphere.Api.Repositories;

public interface ICategoryRepository
{
    Task<IReadOnlyList<Category>> GetAllAsync();

    Task<Category?> GetByIdAsync(int id);

    Task<bool> ExistsAsync(int id);

    Task<bool> NameExistsAsync(string name, int? excludedId = null);

    Task<Category> AddAsync(Category category);

    Task UpdateAsync(Category category);

    Task DeleteAsync(Category category);
}
