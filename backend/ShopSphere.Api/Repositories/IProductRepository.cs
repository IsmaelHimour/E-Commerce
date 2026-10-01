using ShopSphere.Api.Entities;

namespace ShopSphere.Api.Repositories;

public interface IProductRepository
{
    Task<(IReadOnlyList<Product> Items, int TotalCount)> GetPagedAsync(
        string? search,
        int? categoryId,
        decimal? minPrice,
        decimal? maxPrice,
        int pageNumber,
        int pageSize);

    Task<IReadOnlyList<Product>> GetFeaturedAsync(int count);

    Task<Product?> GetByIdAsync(int id);

    Task<bool> ExistsAsync(int id);

    Task<Product> AddAsync(Product product);

    Task UpdateAsync(Product product);

    Task DeleteAsync(Product product);
}
