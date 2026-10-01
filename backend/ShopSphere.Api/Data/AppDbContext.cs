using Microsoft.EntityFrameworkCore;
using ShopSphere.Api.Entities;

namespace ShopSphere.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureCategories(modelBuilder);
        ConfigureProducts(modelBuilder);
        ConfigureUsers(modelBuilder);
        ConfigureCarts(modelBuilder);
        ConfigureCartItems(modelBuilder);
        ConfigureOrders(modelBuilder);
        ConfigureOrderItems(modelBuilder);
        SeedCatalog(modelBuilder);
    }

    private static void ConfigureCategories(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.Property(category => category.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(category => category.Description)
                .HasMaxLength(500)
                .IsRequired();
        });
    }

    private static void ConfigureProducts(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(product => product.Name)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(product => product.Description)
                .HasMaxLength(1000)
                .IsRequired();

            entity.Property(product => product.Price)
                .HasPrecision(18, 2);

            entity.Property(product => product.ImageUrl)
                .HasMaxLength(500)
                .IsRequired();

            entity.HasOne(product => product.Category)
                .WithMany(category => category.Products)
                .HasForeignKey(product => product.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureUsers(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(user => user.FullName)
                .HasMaxLength(120)
                .IsRequired();

            entity.Property(user => user.Email)
                .HasMaxLength(160)
                .IsRequired();

            entity.HasIndex(user => user.Email)
                .IsUnique();

            entity.Property(user => user.PasswordHash)
                .HasMaxLength(500)
                .IsRequired();

            entity.Property(user => user.Role)
                .HasMaxLength(30)
                .IsRequired();
        });
    }

    private static void ConfigureCarts(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasOne(cart => cart.User)
                .WithOne(user => user.Cart)
                .HasForeignKey<Cart>(cart => cart.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureCartItems(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasOne(item => item.Cart)
                .WithMany(cart => cart.Items)
                .HasForeignKey(item => item.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(item => item.Product)
                .WithMany(product => product.CartItems)
                .HasForeignKey(item => item.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(item => new { item.CartId, item.ProductId })
                .IsUnique();
        });
    }

    private static void ConfigureOrders(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            entity.Property(order => order.TotalPrice)
                .HasPrecision(18, 2);

            entity.Property(order => order.Status)
                .HasMaxLength(40)
                .IsRequired();

            entity.HasOne(order => order.User)
                .WithMany(user => user.Orders)
                .HasForeignKey(order => order.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureOrderItems(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.Property(item => item.UnitPrice)
                .HasPrecision(18, 2);

            entity.HasOne(item => item.Order)
                .WithMany(order => order.Items)
                .HasForeignKey(item => item.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(item => item.Product)
                .WithMany(product => product.OrderItems)
                .HasForeignKey(item => item.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void SeedCatalog(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Audio", Description = "Headphones, earbuds, and speakers for everyday listening." },
            new Category { Id = 2, Name = "Wearables", Description = "Smart watches and accessories for active lifestyles." },
            new Category { Id = 3, Name = "Home Office", Description = "Desk essentials for a productive workspace." }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = 1,
                Name = "Pulse Wireless Headphones",
                Description = "Noise-isolating wireless headphones with soft ear cushions and 30-hour battery life.",
                Price = 129.99m,
                StockQuantity = 24,
                ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
                CategoryId = 1
            },
            new Product
            {
                Id = 2,
                Name = "Tempo Smart Watch",
                Description = "A lightweight smart watch with fitness tracking, notifications, and all-day battery.",
                Price = 189.99m,
                StockQuantity = 18,
                ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
                CategoryId = 2
            },
            new Product
            {
                Id = 3,
                Name = "Orbit Desk Lamp",
                Description = "Adjustable LED desk lamp with warm, neutral, and cool lighting modes.",
                Price = 59.99m,
                StockQuantity = 40,
                ImageUrl = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
                CategoryId = 3
            }
        );
    }
}
