using Microsoft.EntityFrameworkCore;
using ShopSphere.Api.Data;
using ShopSphere.Api.Entities;

namespace ShopSphere.Api.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Order>> GetByUserIdAsync(int userId)
    {
        return await BaseOrderQuery()
            .Where(order => order.UserId == userId)
            .OrderByDescending(order => order.OrderDate)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Order>> GetAllAsync()
    {
        return await BaseOrderQuery()
            .OrderByDescending(order => order.OrderDate)
            .ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await BaseOrderQuery(asNoTracking: false)
            .FirstOrDefaultAsync(order => order.Id == id);
    }

    public async Task<Order> CreateFromCartAsync(Cart cart)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        var order = new Order
        {
            UserId = cart.UserId,
            OrderDate = DateTime.UtcNow,
            Status = "Pending",
            TotalPrice = cart.Items.Sum(item => (item.Product?.Price ?? 0m) * item.Quantity),
            Items = cart.Items.Select(item => new OrderItem
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = item.Product?.Price ?? 0m
            }).ToList()
        };

        foreach (var item in cart.Items)
        {
            if (item.Product is not null)
            {
                item.Product.StockQuantity -= item.Quantity;
            }
        }

        _context.Orders.Add(order);
        _context.CartItems.RemoveRange(cart.Items);

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return order;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    private IQueryable<Order> BaseOrderQuery(bool asNoTracking = true)
    {
        var query = _context.Orders
            .Include(order => order.User)
            .Include(order => order.Items)
            .ThenInclude(item => item.Product);

        return asNoTracking ? query.AsNoTracking() : query;
    }
}
