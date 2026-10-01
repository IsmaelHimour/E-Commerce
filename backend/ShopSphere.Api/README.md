# ShopSphere API

This is the ASP.NET Core 8 Web API for ShopSphere. It owns authentication, catalog management, cart behavior, checkout, order history, admin order management, and the SQL Server database model.

## Architecture Decisions

Controllers stay focused on HTTP concerns: route binding, status codes, authorization attributes, and response shape.

Services hold business rules. For example, checkout belongs in `OrderService` because it must validate the cart, calculate totals, reduce stock, create order records, and clear the cart as one workflow.

Repositories wrap EF Core queries and commands. This keeps persistence details out of controllers and makes the service layer easier to read.

DTOs define the API contract. The app does not expose EF entities directly because database objects and public API objects change for different reasons.

`AppDbContext` owns database mapping, relationships, precision, indexes, and seed data in one predictable place.

`ErrorHandlingMiddleware` and `ApiControllerBase` keep API errors consistent by returning ProblemDetails-style responses.

## Database Setup

This project uses Entity Framework Core with SQL Server LocalDB for development.

Restore packages and local tools:

```powershell
dotnet restore ..\..\ShopSphere.slnx
dotnet tool restore
```

Create or update the development database:

```powershell
dotnet tool run dotnet-ef database update --project .\ShopSphere.Api.csproj --startup-project .\ShopSphere.Api.csproj
```

Add a new migration after changing entity or database mapping code:

```powershell
dotnet tool run dotnet-ef migrations add MigrationName --project .\ShopSphere.Api.csproj --startup-project .\ShopSphere.Api.csproj --output-dir Migrations
```

## Authentication

JWT settings live under the `Jwt` section in `appsettings.json`. The included key is for local development only; use user secrets or environment variables for real deployments.

After logging in through `POST /api/auth/login`, copy the returned token into Swagger's `Authorize` dialog as a bearer token to test protected endpoints.

Product and category read endpoints are public. Create, update, and delete endpoints require a JWT for a user with the `Admin` role.

## Error Responses

Validation failures, business-rule failures, missing resources, and unexpected server errors use ASP.NET Core `ProblemDetails` responses. This gives the React frontend a consistent shape for displaying API errors.

## Folder Guide

- `Controllers`: API endpoints and authorization rules.
- `Data`: EF Core `AppDbContext`.
- `DTOs`: request and response contracts.
- `Entities`: database models.
- `Middleware`: global exception handling.
- `Migrations`: EF Core schema history.
- `Repositories`: database access abstractions and EF implementations.
- `Services`: application business logic.
- `Program.cs`: dependency injection, authentication, CORS, Swagger, and middleware pipeline.
