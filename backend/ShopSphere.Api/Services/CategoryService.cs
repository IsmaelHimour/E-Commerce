using ShopSphere.Api.DTOs.Categories;
using ShopSphere.Api.Entities;
using ShopSphere.Api.Repositories;

namespace ShopSphere.Api.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IReadOnlyList<CategoryDto>> GetAllAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return categories.Select(MapToDto).ToList();
    }

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        return category is null ? null : MapToDto(category);
    }

    public async Task<ServiceResult<CategoryDto>> CreateAsync(CreateCategoryDto dto)
    {
        if (await _categoryRepository.NameExistsAsync(dto.Name))
        {
            return ServiceResult<CategoryDto>.Failure("A category with this name already exists.");
        }

        var category = new Category
        {
            Name = dto.Name.Trim(),
            Description = dto.Description.Trim()
        };

        var createdCategory = await _categoryRepository.AddAsync(category);
        return ServiceResult<CategoryDto>.Success(MapToDto(createdCategory));
    }

    public async Task<ServiceResult<CategoryDto>> UpdateAsync(int id, UpdateCategoryDto dto)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category is null)
        {
            return ServiceResult<CategoryDto>.Failure("Category was not found.");
        }

        if (await _categoryRepository.NameExistsAsync(dto.Name, id))
        {
            return ServiceResult<CategoryDto>.Failure("A category with this name already exists.");
        }

        category.Name = dto.Name.Trim();
        category.Description = dto.Description.Trim();

        await _categoryRepository.UpdateAsync(category);
        return ServiceResult<CategoryDto>.Success(MapToDto(category));
    }

    public async Task<ServiceResult<bool>> DeleteAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category is null)
        {
            return ServiceResult<bool>.Failure("Category was not found.");
        }

        if (category.Products.Count > 0)
        {
            return ServiceResult<bool>.Failure("Category cannot be deleted while products are assigned to it.");
        }

        await _categoryRepository.DeleteAsync(category);
        return ServiceResult<bool>.Success(true);
    }

    private static CategoryDto MapToDto(Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ProductCount = category.Products.Count
        };
    }
}
