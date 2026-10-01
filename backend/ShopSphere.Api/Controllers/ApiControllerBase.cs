using Microsoft.AspNetCore.Mvc;

namespace ShopSphere.Api.Controllers;

public abstract class ApiControllerBase : ControllerBase
{
    protected ActionResult ErrorProblem(int statusCode, string title, string? detail)
    {
        return Problem(
            statusCode: statusCode,
            title: title,
            detail: detail);
    }
}
