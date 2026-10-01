using ShopSphere.Api.DTOs.Common;
using ShopSphere.Api.DTOs.Products;

namespace ShopSphere.Api.Services;

public interface IProductService
{
    Task<PagedResultDto<ProductDto>> GetPagedAsync(ProductQueryParameters query);

    Task<IReadOnlyList<ProductDto>> GetFeaturedAsync(int count);

    Task<ProductDto?> GetByIdAsync(int id);

    Task<ServiceResult<ProductDto>> CreateAsync(CreateProductDto dto);

    Task<ServiceResult<ProductDto>> UpdateAsync(int id, UpdateProductDto dto);

    Task<ServiceResult<bool>> DeleteAsync(int id);
}
