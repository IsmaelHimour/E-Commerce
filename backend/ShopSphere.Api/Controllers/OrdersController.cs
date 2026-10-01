using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopSphere.Api.DTOs.Orders;
using ShopSphere.Api.Services;

namespace ShopSphere.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class OrdersController : ApiControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<OrderDto>> Create()
    {
        var result = await _orderService.CreateOrderAsync(User);
        if (!result.Succeeded)
        {
            return ToOrderErrorResponse(result.Error);
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<OrderDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetMine()
    {
        var result = await _orderService.GetMyOrdersAsync(User);
        return result.Succeeded
            ? Ok(result.Data)
            : ErrorProblem(StatusCodes.Status401Unauthorized, "Authentication failed.", result.Error);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrderDto>> GetById(int id)
    {
        var result = await _orderService.GetMyOrderByIdAsync(User, id);
        if (!result.Succeeded)
        {
            return ToOrderErrorResponse(result.Error);
        }

        return Ok(result.Data);
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IReadOnlyList<AdminOrderDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IReadOnlyList<AdminOrderDto>>> GetAllForAdmin()
    {
        var orders = await _orderService.GetAllForAdminAsync();
        return Ok(orders);
    }

    [HttpPatch("admin/{id:int}/status")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(AdminOrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AdminOrderDto>> UpdateStatus(int id, UpdateOrderStatusDto dto)
    {
        var result = await _orderService.UpdateStatusAsync(id, dto);
        if (!result.Succeeded)
        {
            return ToOrderErrorResponse(result.Error);
        }

        return Ok(result.Data);
    }

    private ActionResult ToOrderErrorResponse(string? error)
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
