using Microsoft.AspNetCore.Mvc;

namespace ShopSphere.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "Healthy",
            service = "ShopSphere API",
            timestamp = DateTime.UtcNow
        });
    }
}
