using ShopSphere.Api.DTOs.Categories;

namespace ShopSphere.Api.Services;

public interface ICategoryService
{
    Task<IReadOnlyList<CategoryDto>> GetAllAsync();

    Task<CategoryDto?> GetByIdAsync(int id);

    Task<ServiceResult<CategoryDto>> CreateAsync(CreateCategoryDto dto);

    Task<ServiceResult<CategoryDto>> UpdateAsync(int id, UpdateCategoryDto dto);

    Task<ServiceResult<bool>> DeleteAsync(int id);
}
