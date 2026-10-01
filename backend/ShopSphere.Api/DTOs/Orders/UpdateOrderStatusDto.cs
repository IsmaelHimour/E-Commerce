using System.ComponentModel.DataAnnotations;

namespace ShopSphere.Api.DTOs.Orders;

public class UpdateOrderStatusDto
{
    [Required]
    [RegularExpression("Pending|Processing|Shipped|Delivered|Cancelled")]
    public string Status { get; init; } = string.Empty;
}
