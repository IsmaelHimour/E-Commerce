using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopSphere.Api.DTOs.Cart;
using ShopSphere.Api.Services;

namespace ShopSphere.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class CartController : ApiControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<CartDto>> GetCart()
    {
        var result = await _cartService.GetCartAsync(User);
        return result.Succeeded
            ? Ok(result.Data)
            : ErrorProblem(StatusCodes.Status401Unauthorized, "Authentication failed.", result.Error);
    }

    [HttpPost("items")]
    [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CartDto>> AddItem(AddCartItemDto dto)
    {
        var result = await _cartService.AddItemAsync(User, dto);
        if (!result.Succeeded)
        {
            return ToCartErrorResponse(result.Error);
        }

        return Ok(result.Data);
    }

    [HttpPut("items/{productId:int}")]
    [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CartDto>> UpdateItem(int productId, UpdateCartItemDto dto)
    {
        var result = await _cartService.UpdateItemAsync(User, productId, dto);
        if (!result.Succeeded)
        {
            return ToCartErrorResponse(result.Error);
        }

        return Ok(result.Data);
    }

    [HttpDelete("items/{productId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveItem(int productId)
    {
        var result = await _cartService.RemoveItemAsync(User, productId);
        if (!result.Succeeded)
        {
            return ToCartErrorResponse(result.Error);
        }

        return NoContent();
    }

    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Clear()
    {
        var result = await _cartService.ClearAsync(User);
        return result.Succeeded
            ? NoContent()
            : ErrorProblem(StatusCodes.Status401Unauthorized, "Authentication failed.", result.Error);
    }

    private ActionResult ToCartErrorResponse(string? error)
    {
        if (error?.Contains("not found", StringComparison.OrdinalIgnoreCase) == true)
        {
            return ErrorProblem(StatusCodes.Status404NotFound, "Resource not found.", error);
        }

        if (error?.Contains("authenticated", StringComparison.OrdinalIgnoreCase) == true)
        {
            return ErrorProblem(StatusCodes.Status401Unauthorized, "Authentication failed.", error);
        }

        return ErrorProblem(StatusCodes.Status400BadRequest, "Request could not be completed.", error);
    }
}
