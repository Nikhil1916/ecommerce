# Backend Implementation Report

## 1. Project Structure

### Server entry points
- [server/src/app.ts](server/src/app.ts): mounts the main API routers and middleware.
- [server/src/server.ts](server/src/server.ts): initializes Redis, connects MongoDB, and starts the HTTP server.

### Core folders
- [server/src/config](server/src/config): environment validation and shared config.
- [server/src/core](server/src/core): shared response/error/async helpers.
- [server/src/lib](server/src/lib): database connection and logging utilities.
- [server/src/middlewares](server/src/middlewares): authentication, authorization, validation, error handling, request ID, and logging middleware.
- [server/src/modules](server/src/modules): feature modules for auth, user, product, category, cart, inventory, and more.
- [server/src/redis](server/src/redis): Redis connection, interfaces, service, and cache keys.
- [server/src/storage](server/src/storage): upload/multer/storage provider abstraction.
- [server/src/utils](server/src/utils): JWT, cookie, slug, SKU helpers.

## 2. Authentication & Authorization

### Auth flow implemented
- Registration: implemented in [server/src/modules/auth/services/auth.service.ts](server/src/modules/auth/services/auth.service.ts).
- Login: implemented in [server/src/modules/auth/services/auth.service.ts](server/src/modules/auth/services/auth.service.ts).
- Refresh token: implemented in [server/src/modules/auth/services/auth.service.ts](server/src/modules/auth/services/auth.service.ts).
- Logout: implemented in [server/src/modules/auth/services/auth.service.ts](server/src/modules/auth/services/auth.service.ts).
- Logout all devices: implemented in [server/src/modules/auth/services/auth.service.ts](server/src/modules/auth/services/auth.service.ts).

### JWT / session handling
- JWT utilities are in [server/src/utils/jwt.util.ts](server/src/utils/jwt.util.ts).
- Access and refresh tokens are generated and verified there.
- Refresh tokens are persisted in PostgreSQL via Prisma model [server/prisma/schema.prisma](server/prisma/schema.prisma).

### Authentication middleware
- [server/src/middlewares/authenticate.middleware.ts](server/src/middlewares/authenticate.middleware.ts) reads the access token from cookies, verifies it, loads the user, checks account activity, and populates `req.user`.

### Authorization middleware
- [server/src/middlewares/authorize.middleware.ts](server/src/middlewares/authorize.middleware.ts) checks `req.user.role` against allowed roles.

### How `req.user` is populated
- Populated in [server/src/middlewares/authenticate.middleware.ts](server/src/middlewares/authenticate.middleware.ts).
- Typed in [server/src/types/express.d.ts](server/src/types/express.d.ts).

### Roles
- Prisma enum `Role` includes `CUSTOMER`, `ADMIN`, `SUPER_ADMIN` in [server/prisma/schema.prisma](server/prisma/schema.prisma).

## 3. Database Architecture

### PostgreSQL usage
- Confirmed: Prisma is configured with PostgreSQL in [server/prisma/schema.prisma](server/prisma/schema.prisma).
- User and refresh token data are stored in PostgreSQL.

### MongoDB usage
- Confirmed: MongoDB is configured via Mongoose in [server/src/lib/database.ts](server/src/lib/database.ts).
- Products, categories, carts are implemented as MongoDB/Mongoose documents.

### Prisma / ORM
- Prisma is used for PostgreSQL auth/user/refresh-token data.
- Prisma client is initialized in [server/src/config/prisma.ts](server/src/config/prisma.ts).

### Mongoose
- Mongoose is used for MongoDB collections.
- Product model: [server/src/modules/product/models/product.model.ts](server/src/modules/product/models/product.model.ts)
- Category model: [server/src/modules/category/models/category.model.ts](server/src/modules/category/models/category.model.ts)
- Cart model: [server/src/modules/cart/models/cart.model.ts](server/src/modules/cart/models/cart.model.ts)

### Confirmed database placement
- User: PostgreSQL via Prisma.
- Cart: MongoDB via Mongoose.
- Product: MongoDB via Mongoose.

## 4. Product Module

### Product CRUD
- Create product: implemented in [server/src/modules/product/controllers/product.controller.ts](server/src/modules/product/controllers/product.controller.ts) and [server/src/modules/product/services/product.service.ts](server/src/modules/product/services/product.service.ts).
- Get product by id: implemented.
- Update product: implemented.
- Delete product: implemented as soft delete (`isActive: false`) in [server/src/modules/product/repositories/mongo-product.repository.ts](server/src/modules/product/repositories/mongo-product.repository.ts).
- Get products list: implemented with pagination/filtering/search support in repository/service flow.
- Get product by slug: implemented.

### Product fields present in schema
- name
- description
- price
- stock
- reservedStock
- categoryId
- images
- isActive
- slug
- sku

### Stock and reservation fields
- `stock` and `reservedStock` are defined in [server/src/modules/product/models/product.model.ts](server/src/modules/product/models/product.model.ts).

### Validation
- Product create validation schema exists in [server/src/modules/product/validator/create-product.validation.ts](server/src/modules/product/validator/create-product.validation.ts).
- Product query validation exists in [server/src/modules/product/validator/product-query.validator.ts](server/src/modules/product/validator/product-query.validator.ts).
- Product slug validation exists in [server/src/modules/product/validator/product-slug.validator.ts](server/src/modules/product/validator/product-slug.validator.ts).

### Repository/service/controller structure
- Controller: [server/src/modules/product/controllers/product.controller.ts](server/src/modules/product/controllers/product.controller.ts)
- Service: [server/src/modules/product/services/product.service.ts](server/src/modules/product/services/product.service.ts)
- Repository: [server/src/modules/product/repositories/mongo-product.repository.ts](server/src/modules/product/repositories/mongo-product.repository.ts)

## 5. Cart Module

### Implemented cart endpoints
Routes are defined in [server/src/modules/cart/routes/cart.routes.ts](server/src/modules/cart/routes/cart.routes.ts):
- POST /api/v1/cart/items
- GET /api/v1/cart
- DELETE /api/v1/cart/items/:productId
- PATCH /api/v1/cart/items/:productId
- DELETE /api/v1/cart/

### Implemented behaviors
- Create/get cart: implemented in [server/src/modules/cart/services/cart.service.ts](server/src/modules/cart/services/cart.service.ts) and [server/src/modules/cart/repositories/mongo-cart.repository.ts](server/src/modules/cart/repositories/mongo-cart.repository.ts).
- Add item: implemented.
- Update quantity: implemented.
- Remove item: implemented.
- Clear cart: implemented.

### Stock validation in cart
- Cart service checks product stock before adding/updating cart items in [server/src/modules/cart/services/cart.service.ts](server/src/modules/cart/services/cart.service.ts).
- It throws `400 Insufficient stock` when quantity exceeds available stock.

### Duplicate product handling
- The service checks for an existing item by `productId` and updates quantity instead of adding a duplicate item.

### Atomic MongoDB operations in cart
- Implemented using Mongoose update operations:
  - `$inc` in [server/src/modules/cart/repositories/mongo-cart.repository.ts](server/src/modules/cart/repositories/mongo-cart.repository.ts)
  - `$push` in [server/src/modules/cart/repositories/mongo-cart.repository.ts](server/src/modules/cart/repositories/mongo-cart.repository.ts)
  - `$set` in [server/src/modules/cart/repositories/mongo-cart.repository.ts](server/src/modules/cart/repositories/mongo-cart.repository.ts)
  - `$pull` in [server/src/modules/cart/repositories/mongo-cart.repository.ts](server/src/modules/cart/repositories/mongo-cart.repository.ts)

### Cart aggregation / enriched response
- The cart repository uses aggregation with:
  - `$match`
  - `$unwind`
  - `$lookup`
  - `$group`
- This enriches cart items with product data in [server/src/modules/cart/repositories/mongo-cart.repository.ts](server/src/modules/cart/repositories/mongo-cart.repository.ts).

### Empty cart handling
- The service returns the existing cart when it has zero items, and the repository can clear the cart to an empty array.

## 6. Inventory / Reservation

### Implemented inventory reservation logic
- Inventory repository: [server/src/modules/inventory/repositories/inventory.repository.ts](server/src/modules/inventory/repositories/inventory.repository.ts)

### Implemented methods
- reserveStock
- releaseStock
- decreaseStock
- increaseStock

### Atomic inventory update details
- Uses MongoDB update operations with `$inc`.
- Uses `$expr` and `$subtract` in reserveStock to check available stock before reserving.
- Uses `findOneAndUpdate` for atomic updates.

### Concurrency / race-condition handling
- The repository uses atomic conditional update logic in `reserveStock` with `$expr` and `$subtract`, which is a form of concurrency guard at the database layer.
- There is a TODO comment in [server/src/modules/product/repositories/mongo-product.repository.ts](server/src/modules/product/repositories/mongo-product.repository.ts) noting that SKU generation should be replaced with a counter service using atomic `$inc` to avoid race conditions.

### Reservation / release / checkout / order creation
- Reservation endpoints exist at `/api/v1/inventory/reserve`, `/release`, `/increase`, `/decrease`.
- Checkout and order creation are not implemented in the codebase inspected.

### Status summary
- IMPLEMENTED: stock reservation/release/decrease/increase endpoints and MongoDB atomic update logic.
- PARTIALLY IMPLEMENTED: cart uses stock checks, but no checkout/order flow is wired.
- NOT IMPLEMENTED: order creation/checkout flow.

## 7. Redis

### Redis setup
- Connection setup in [server/src/redis/config/redis.config.ts](server/src/redis/config/redis.config.ts).
- Client created with `createClient` using `REDIS_URL` from config.

### Redis service
- [server/src/redis/services/redis.service.ts](server/src/redis/services/redis.service.ts) wraps `get`, `set`, `del`, `exists`.

### Cache keys
- [server/src/redis/cache-keys.ts](server/src/redis/cache-keys.ts)

### TTL
- The Redis service uses `EX` in `set` calls in [server/src/redis/services/redis.service.ts](server/src/redis/services/redis.service.ts), so TTL support is present.

### Cache invalidation
- Product cache invalidation is done on update/delete in [server/src/modules/product/services/product.service.ts](server/src/modules/product/services/product.service.ts).

### Where Redis is used
- Product service uses Redis for product fetch caching in [server/src/modules/product/services/product.service.ts](server/src/modules/product/services/product.service.ts).

### Status
- Redis is integrated into business logic for product caching.
- It is not used for cart, auth, inventory, or checkout in the code inspected.

## 8. Error Handling

### Global error handler
- [server/src/middlewares/error.middleware.ts](server/src/middlewares/error.middleware.ts)

### API error class
- [server/src/core/ApiError.ts](server/src/core/ApiError.ts)

### Async handler
- [server/src/core/asyncHandler.ts](server/src/core/asyncHandler.ts)

### Logging
- [server/src/lib/logger.ts](server/src/lib/logger.ts) uses `pino`.
- [server/src/middlewares/logger.middleware.ts](server/src/middlewares/logger.middleware.ts) uses `pino-http`.

### Request ID handling
- [server/src/middlewares/requestId.middleware.ts](server/src/middlewares/requestId.middleware.ts)

### Validation error handling
- The global error handler handles `ZodError` and returns a structured error response.

## 9. Validation

### Validation middleware
- [server/src/middlewares/validate.middleware.ts](server/src/middlewares/validate.middleware.ts)

### Zod schemas present
- Auth register schema: [server/src/modules/auth/schemas/register-user.schema.ts](server/src/modules/auth/schemas/register-user.schema.ts)
- Auth login schema: [server/src/modules/auth/schemas/login-user.schema.ts](server/src/modules/auth/schemas/login-user.schema.ts)
- Product create/query/slug validators: [server/src/modules/product/validator](server/src/modules/product/validator)
- Cart validators: [server/src/modules/cart/validators](server/src/modules/cart/validators)
- Inventory validator: [server/src/modules/inventory/validators/update-inventory.validator.ts](server/src/modules/inventory/validators/update-inventory.validator.ts)
- User update schema: [server/src/modules/user/schemas/update-user-schema.ts](server/src/modules/user/schemas/update-user-schema.ts)

### Where validation is used
- Product routes
- Cart routes
- Inventory routes
- Auth routes
- User routes

## 10. API Routes

| METHOD | ROUTE | MODULE | AUTH REQUIRED | VALIDATION | STATUS |
| --- | --- | --- | --- | --- | --- |
| GET | /api/v1/health | health | No | No | Implemented |
| POST | /api/v1/auth/register | auth | No | Yes | Implemented |
| POST | /api/v1/auth/login | auth | No | Yes | Implemented |
| POST | /api/v1/auth/refresh-token | auth | No | No | Implemented |
| POST | /api/v1/auth/logout | auth | No | No | Implemented |
| POST | /api/v1/auth/logout-all | auth | No | No | Implemented |
| GET | /api/v1/users/me | user | Yes | No | Implemented |
| PATCH | /api/v1/users/me | user | Yes | Yes | Implemented |
| POST | /api/v1/products | product | Yes (admin) | Yes | Implemented |
| GET | /api/v1/products | product | No | Yes | Implemented |
| GET | /api/v1/products/:id | product | Yes (admin) | No | Implemented |
| GET | /api/v1/products/slug/:slug | product | No | Yes | Implemented |
| PATCH | /api/v1/products/:id | product | No | No | Implemented |
| DELETE | /api/v1/products/:id | product | No | No | Implemented |
| POST | /api/v1/categories | category | No | No | Implemented |
| GET | /api/v1/categories/:id | category | No | No | Implemented |
| PATCH | /api/v1/categories/:id | category | No | No | Implemented |
| DELETE | /api/v1/categories/:id | category | No | No | Implemented |
| POST | /api/v1/cart/items | cart | Yes | Yes | Implemented |
| GET | /api/v1/cart | cart | Yes | No | Implemented |
| DELETE | /api/v1/cart/items/:productId | cart | Yes | Yes | Implemented |
| PATCH | /api/v1/cart/items/:productId | cart | Yes | Yes | Implemented |
| DELETE | /api/v1/cart | cart | Yes | No | Implemented |
| POST | /api/v1/inventory/reserve | inventory | No | Yes | Implemented |
| POST | /api/v1/inventory/release | inventory | No | Yes | Implemented |
| POST | /api/v1/inventory/increase | inventory | No | Yes | Implemented |
| POST | /api/v1/inventory/decrease | inventory | No | Yes | Implemented |

## 11. Testing / Status

### Implemented
- Auth flow
- Product CRUD
- Category CRUD
- Cart CRUD and enrichment
- Inventory reserve/release/increase/decrease
- Redis integration for product caching
- Validation and global error handling

### Missing or not implemented in the inspected code
- Forgot password/reset password/change password
- Email verification completion flow beyond repository methods
- Order module
- Checkout module
- Payment module
- Coupon module
- Wishlist module
- Reviews module
- Admin module beyond role enforcement and product route guard
- Address module
- Notifications module

## 12. Architecture Patterns Observed

### Confirmed patterns
- Repository Pattern: present in auth, product, category, cart, inventory modules.
- Service Layer: present in auth, product, category, cart, inventory, user modules.
- Dependency Injection: used in controller/service/repository constructors.
- Middleware-based request processing: present.

### Not confirmed from code
- Factory Pattern
- Strategy Pattern
- Event-driven architecture

## 13. Ecommerce Modules Status

| Module | Status |
| --- | --- |
| Product | IMPLEMENTED |
| Cart | IMPLEMENTED |
| Inventory | IMPLEMENTED |
| Order | NOT STARTED |
| Checkout | NOT STARTED |
| Payment | NOT STARTED |
| User | IMPLEMENTED |
| Admin | PARTIAL |
| Category | IMPLEMENTED |
| Coupon | NOT STARTED |
| Wishlist | NOT STARTED |
| Reviews | NOT STARTED |
| Notifications | NOT STARTED |

## 14. Infrastructure

### Present in codebase
- Docker: present under [docker](docker) directory, but no inspected compose file content was read.
- Redis container/config: Redis configured via env and client initialization.
- MongoDB: configured via Mongoose and env.
- PostgreSQL: configured via Prisma and env.

### Not confirmed from the code inspected
- AWS
- EC2
- Nginx
- PM2

## 15. Final Summary

COMPLETED
- Auth flow is implemented.
- User persistence is implemented in PostgreSQL via Prisma.
- Product, category, and cart modules are implemented with MongoDB/Mongoose.
- Inventory reservation/release/decrease/increase logic is implemented.
- Redis caching is integrated into product reads.
- Validation and error handling are present.

IN PROGRESS
- The codebase shows a multi-module backend structure with core ecommerce features partially connected, but the order/checkout/payment side is not present.

NOT STARTED
- Checkout, order, payment, coupon, wishlist, review, notification modules.

IMPORTANT ARCHITECTURAL DECISIONS ALREADY PRESENT
- PostgreSQL is used for auth/user/refresh-token data.
- MongoDB is used for product, category, and cart data.
- Controllers delegate to services, which delegate to repositories.
- Inventory reservation uses atomic MongoDB updates.
- Redis is used for product-level caching.

CURRENT NEXT LOGICAL STEP
- Implement the checkout/order flow on top of the existing cart and inventory modules.
