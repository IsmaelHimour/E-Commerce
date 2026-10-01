using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopSphere.Api.DTOs.Common;
using ShopSphere.Api.DTOs.Products;
using ShopSphere.Api.Services;

namespace ShopSphere.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ApiControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResultDto<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PagedResultDto<ProductDto>>> GetPaged([FromQuery] ProductQueryParameters query)
    {
        var products = await _productService.GetPagedAsync(query);
        return Ok(products);
    }

    [HttpGet("featured")]
    [ProducesResponseType(typeof(IReadOnlyList<ProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ProductDto>>> GetFeatured([FromQuery] int count = 4)
    {
        var products = await _productService.GetFeaturedAsync(count);
        return Ok(products);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> GetById(int id)
    {
        var product = await _productService.GetByIdAsync(id);
        return product is null
            ? ErrorProblem(StatusCodes.Status404NotFound, "Resource not found.", "Product was not found.")
            : Ok(product);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ProductDto>> Create(CreateProductDto dto)
    {
        var result = await _productService.CreateAsync(dto);
        if (!result.Succeeded)
        {
            return ToProductErrorResponse(result.Error);
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<ProductDto>> Update(int id, UpdateProductDto dto)
    {
        var result = await _productService.UpdateAsync(id, dto);
        if (!result.Succeeded)
        {
            return ToProductErrorResponse(result.Error);
        }

        return Ok(result.Data);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _productService.DeleteAsync(id);
        if (!result.Succeeded)
        {
            return ToProductErrorResponse(result.Error);
        }

        return NoContent();
    }

    private ActionResult ToProductErrorResponse(string? error)
    {
        if (error?.Contains("not found", StringComparison.OrdinalIgnoreCase) == true)
        {
            return ErrorProblem(StatusCodes.Status404NotFound, "Resource not found.", error);
        }

        return ErrorProblem(StatusCodes.Status400BadRequest, "Request could not be completed.", error);
    }
}
