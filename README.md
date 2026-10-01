# ShopSphere

ShopSphere is a full-stack e-commerce portfolio application built with ASP.NET Core 8 Web API, Entity Framework Core, SQL Server, React, TypeScript, Vite, Tailwind CSS, JWT authentication, and a protected admin dashboard.

The goal of this project is to show practical junior full-stack skills: layered backend architecture, relational data modeling, secure authentication, API integration, responsive UI, protected routes, validation, error handling, and a clean developer setup.

## Tech Stack

Backend:
- ASP.NET Core 8 Web API
- Entity Framework Core
- SQL Server LocalDB
- JWT bearer authentication
- Swagger/OpenAPI
- Repository and service layers

Frontend:
- React with TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Context API and custom hooks
- Framer Motion
- React Hot Toast
- Lucide React icons

## Features

Customer experience:
- Home page with hero, categories, and featured products
- Product grid with search, category filters, and pagination
- Product details page
- Register and login
- JWT-backed session persistence
- Shopping cart with quantity controls and remove/clear actions
- Checkout order creation
- User profile
- Order history
- Dark mode
- Toast notifications, skeleton loading, and responsive layouts

Admin experience:
- Protected admin route
- Product create, edit, and delete
- Category create, edit, and delete
- Order list with customer details
- Order status updates
- Admin dashboard metrics

Backend capabilities:
- Product CRUD
- Category CRUD
- Cart endpoints
- Order endpoints
- Admin-only API endpoints
- Search, filtering, and pagination
- DTO validation
- Global error handling with ProblemDetails
- Swagger with bearer token support
- EF Core migrations and seed data

## Architecture

The backend uses a layered structure:
- Controllers receive HTTP requests and return API responses.
- DTOs define the public API contract and validation rules.
- Services contain business rules such as checkout, cart validation, and authentication.
- Repositories isolate EF Core database access.
- Entities model the database.
- Data configures EF Core relationships, indexes, precision, and seed data.
- Middleware centralizes unexpected error handling.

The frontend uses a feature-oriented React structure:
- Pages represent route-level screens.
- Components hold reusable UI.
- Services contain Axios API calls.
- Hooks coordinate loading, refresh, and page-specific state.
- Context stores cross-cutting state such as authentication, cart, and theme.
- Routes define public, protected, and admin-only navigation.
- Types keep API contracts explicit across the client.

This separation keeps each file small enough for a junior developer to explain in an interview while still looking like a real application.

## Project Structure

```text
.
|-- backend/
|   `-- ShopSphere.Api/
|       |-- Controllers/
|       |-- Data/
|       |-- DTOs/
|       |-- Entities/
|       |-- Middleware/
|       |-- Migrations/
|       |-- Repositories/
|       |-- Services/
|       `-- Program.cs
|-- frontend/
|   `-- shopsphere.client/
|       |-- src/
|       |   |-- components/
|       |   |-- context/
|       |   |-- hooks/
|       |   |-- layouts/
|       |   |-- pages/
|       |   |-- routes/
|       |   |-- services/
|       |   |-- types/
|       |   `-- utils/
|       `-- package.json
|-- dotnet-tools.json
|-- ShopSphere.slnx
`-- README.md
```

## Prerequisites

Install:
- .NET 8 SDK
- Node.js 20 or later
- SQL Server LocalDB
- EF Core local tool, restored through `dotnet tool restore`

## Backend Setup

From the repository root:

```powershell
dotnet restore .\ShopSphere.slnx
dotnet tool restore
dotnet tool run dotnet-ef database update --project .\backend\ShopSphere.Api\ShopSphere.Api.csproj --startup-project .\backend\ShopSphere.Api\ShopSphere.Api.csproj
dotnet run --project .\backend\ShopSphere.Api\ShopSphere.Api.csproj --urls http://localhost:5298
```

Backend URLs:
- API: `http://localhost:5298`
- Swagger: `http://localhost:5298/swagger`
- Health check: `http://localhost:5298/api/health`

The development connection string points to:

```text
Server=(localdb)\MSSQLLocalDB;Database=ShopSphereDb;Trusted_Connection=True;TrustServerCertificate=True
```

## Frontend Setup

In a second terminal:

```powershell
cd .\frontend\shopsphere.client
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Frontend URL:
- `http://127.0.0.1:5173`

The Axios client points to `http://localhost:5298/api` by default.

## Admin User For Local Testing

New users register as `Customer` by default. To test the admin dashboard locally:

1. Register a normal user through the UI.
2. Promote that user in LocalDB:

```sql
UPDATE Users
SET Role = 'Admin'
WHERE Email = 'your-email@example.com';
```

3. Log out and log back in.
4. Open `/admin`.

This mirrors a common real-world setup where users do not self-register as administrators.

## Useful Commands

Backend:

```powershell
dotnet build .\ShopSphere.slnx --no-restore
dotnet tool run dotnet-ef migrations add MigrationName --project .\backend\ShopSphere.Api\ShopSphere.Api.csproj --startup-project .\backend\ShopSphere.Api\ShopSphere.Api.csproj --output-dir Migrations
dotnet tool run dotnet-ef database update --project .\backend\ShopSphere.Api\ShopSphere.Api.csproj --startup-project .\backend\ShopSphere.Api\ShopSphere.Api.csproj
```

Frontend:

```powershell
cd .\frontend\shopsphere.client
npm run lint
npm run build
```

## API Overview

Public:
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/products/featured`
- `GET /api/categories`
- `POST /api/auth/register`
- `POST /api/auth/login`

Authenticated customer:
- `GET /api/auth/me`
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/{id}`
- `DELETE /api/cart/items/{id}`
- `DELETE /api/cart`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/{id}`

Admin:
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`
- `GET /api/orders/admin`
- `PATCH /api/orders/admin/{id}/status`

## Data Model

Main entities:
- Category
- Product
- User
- Cart
- CartItem
- Order
- OrderItem

Important relationships:
- A category has many products.
- A user has one cart.
- A cart has many cart items.
- A user has many orders.
- An order has many order items.
- Products are referenced by cart items and order items.

## Portfolio Talking Points

This project is useful in an interview because it demonstrates:
- Authentication with JWT and role-based authorization.
- A real relational schema with one-to-one, one-to-many, and restricted delete relationships.
- DTO-based API boundaries instead of exposing EF entities directly.
- Service-layer business rules for checkout and cart validation.
- Repository-layer database access.
- Frontend API services separated from UI components.
- Protected React routes for authenticated and admin-only pages.
- Loading, empty, and error states across the UI.
- Responsive Tailwind design with dark mode.

## Notes For Production

Before deploying a real store, replace the development JWT key, move secrets into user secrets or environment variables, add payment integration, add refresh tokens, add image upload/storage, add automated tests, and configure a production SQL Server connection.
