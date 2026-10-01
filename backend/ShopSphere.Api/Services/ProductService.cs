using ShopSphere.Api.DTOs.Common;
using ShopSphere.Api.DTOs.Products;
using ShopSphere.Api.Entities;
using ShopSphere.Api.Repositories;

namespace ShopSphere.Api.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;

    public ProductService(IProductRepository productRepository, ICategoryRepository categoryRepository)
    {
        _productRepository = productRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<PagedResultDto<ProductDto>> GetPagedAsync(ProductQueryParameters query)
    {
        var pageNumber = Math.Max(query.PageNumber, 1);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        var (items, totalCount) = await _productRepository.GetPagedAsync(
            query.Search,
            query.CategoryId,
            query.MinPrice,
            query.MaxPrice,
            pageNumber,
            pageSize);

        return new PagedResultDto<ProductDto>
        {
            Items = items.Select(MapToDto).ToList(),
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<IReadOnlyList<ProductDto>> GetFeaturedAsync(int count)
    {
        var safeCount = Math.Clamp(count, 1, 12);
        var products = await _productRepository.GetFeaturedAsync(safeCount);
        return products.Select(MapToDto).ToList();
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product is null ? null : MapToDto(product);
    }

    public async Task<ServiceResult<ProductDto>> CreateAsync(CreateProductDto dto)
    {
        var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
        if (category is null)
        {
            return ServiceResult<ProductDto>.Failure("Category was not found.");
        }

        var product = new Product
        {
            Name = dto.Name.Trim(),
            Description = dto.Description.Trim(),
            Price = dto.Price,
            StockQuantity = dto.StockQuantity,
            ImageUrl = dto.ImageUrl.Trim(),
            CategoryId = dto.CategoryId,
            Category = category
        };

        var createdProduct = await _productRepository.AddAsync(product);

        return ServiceResult<ProductDto>.Success(MapToDto(createdProduct));
    }

    public async Task<ServiceResult<ProductDto>> UpdateAsync(int id, UpdateProductDto dto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product is null)
        {
            return ServiceResult<ProductDto>.Failure("Product was not found.");
        }

        var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
        if (category is null)
        {
            return ServiceResult<ProductDto>.Failure("Category was not found.");
        }

        product.Name = dto.Name.Trim();
        product.Description = dto.Description.Trim();
        product.Price = dto.Price;
        product.StockQuantity = dto.StockQuantity;
        product.ImageUrl = dto.ImageUrl.Trim();
        product.CategoryId = dto.CategoryId;
        product.Category = category;

        await _productRepository.UpdateAsync(product);

        return ServiceResult<ProductDto>.Success(MapToDto(product));
    }

    public async Task<ServiceResult<bool>> DeleteAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product is null)
        {
            return ServiceResult<bool>.Failure("Product was not found.");
        }

        await _productRepository.DeleteAsync(product);
        return ServiceResult<bool>.Success(true);
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            ImageUrl = product.ImageUrl,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name ?? string.Empty
        };
    }
}
