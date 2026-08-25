# Server Backend Implementation Report

**Review date:** 2026-08-24  
**Estimated completion:** approximately **60%**  
**Architecture maturity:** early-career to lower-mid level; good foundations, not production-ready yet.

## 1. Executive Summary

The server has a real modular backend structure and several important ecommerce foundations are working: authentication, users, products, categories, cart, inventory reservation, MongoDB transactions, Redis caching, file upload abstractions, and BullMQ workers.

The remaining work is concentrated around production safety and completion of the commerce workflow. Payment integration, real email delivery, notification completion, order lifecycle APIs, and several business modules are unfinished. Some existing routes also need authentication and authorization immediately.

## 2. Status At A Glance

| Area | Status | Notes |
| --- | --- | --- |
| Project structure | DONE | Feature modules with controllers, services, repositories, routes, models, and validators. |
| Authentication | MOSTLY DONE | Register, login, JWT cookies, refresh rotation, logout, logout-all, account locking. |
| Authorization | PARTIAL | Middleware exists, but several mutation routes do not use it. |
| User profile | DONE | `GET /users/me` and `PATCH /users/me`. |
| Products | MOSTLY DONE | CRUD, search, filtering, pagination, sorting, slug, SKU, soft delete, uploads. |
| Categories | PARTIAL | CRUD exists, but routes are not protected or fully validated. |
| Cart | DONE | Add, update, remove, clear, and product enrichment. |
| Inventory | MOSTLY DONE | Atomic stock operations exist, but public routes are a critical security issue. |
| Checkout | PARTIAL | Checkout and reservation-expiry flow exist, but the workflow is not fully atomic. |
| Orders | PARTIAL | Model, repository, service, and expiry/payment state updates exist; public order APIs are missing. |
| Payment | NOT DONE | Fake gateway only; webhook security, validation, and real provider integration are missing. |
| Notifications | PARTIAL | Back-in-stock subscription and worker exist; notification completion/idempotency is missing. |
| Email | NOT DONE | Queue and worker exist, but no real email provider or delivery tracking exists. |
| Redis | PARTIAL | Product caching works conceptually; startup and failure behavior need improvement. |
| Testing | NOT DONE | No automated test files were found. |

## 3. What Is Implemented Correctly

### Architecture

- Express application and API versioning are set up in `server/src/app.ts`.
- Features are separated into modules rather than placing all logic in route handlers.
- Controllers delegate to services.
- Services delegate persistence to repository abstractions.
- Mongoose and Prisma are isolated behind repositories in most modules.
- Shared concerns have dedicated middleware for authentication, authorization, validation, errors, logging, and request IDs.

### Authentication

Implemented in `server/src/modules/auth`:

- Registration with password hashing.
- Login with account lockout checks.
- Access and refresh JWTs.
- Refresh-token persistence using hashed tokens.
- Refresh-token rotation.
- Logout and logout from all devices.
- Account activity and password-change invalidation checks.
- HTTP-only cookie configuration.

The main implementation is in [auth.service.ts](server/src/modules/auth/services/auth.service.ts) and [authenticate.middleware.ts](server/src/middlewares/authenticate.middleware.ts).

### Products

Implemented:

- Product creation and duplicate checks.
- Product listing with search, filtering, pagination, and sorting.
- Slugs and SKUs.
- Product image upload abstraction with Cloudinary.
- Upload rollback when product creation fails.
- Soft deletion through `isActive`.
- Redis caching for product reads and invalidation on update/delete.

### Cart

Implemented:

- User-specific cart access.
- Add, update, remove, and clear operations.
- Quantity and stock checks.
- Atomic MongoDB operations using `$inc`, `$push`, `$set`, and `$pull`.
- Aggregation lookup to return cart items with product data.

### Inventory

The inventory repository uses conditional atomic MongoDB updates. The reservation check correctly compares available stock using `stock - reservedStock`, which helps prevent overselling under concurrent requests.

The back-in-stock worker now connects to MongoDB before processing jobs, which fixes the previous Mongoose buffering timeout.

### Infrastructure

Present:

- MongoDB through Mongoose.
- PostgreSQL through Prisma.
- Redis through `redis` and BullMQ through `ioredis` connections.
- Pino structured logging.
- Docker-related files.
- Environment validation with Zod.

## 4. Routes Where Authentication Is Missing

These are the most important current security problems.

### Critical: inventory mutation routes

All four routes currently have validation but no authentication or authorization:

- `POST /api/v1/inventory/reserve`
- `POST /api/v1/inventory/release`
- `POST /api/v1/inventory/increase`
- `POST /api/v1/inventory/decrease`

Location: [inventory.routes.ts](server/src/modules/inventory/routes/inventory.routes.ts)

Recommended protection:

- Reserve/release should normally be called only by checkout/order application services, not exposed publicly.
- Increase/decrease should require `ADMIN` or `SUPER_ADMIN`.

### Critical: product mutation routes

These routes are currently public:

- `PATCH /api/v1/products/:id`
- `DELETE /api/v1/products/:id`

Location: [product.routes.ts](server/src/modules/product/routes/product.routes.ts)

They should require authentication and admin authorization.

### Critical: category mutation routes

These routes are currently public:

- `POST /api/v1/categories`
- `PATCH /api/v1/categories/:id`
- `DELETE /api/v1/categories/:id`

Location: [category.routes.ts](server/src/modules/category/routes/category.routes.ts)

They should require authentication and admin authorization.

### Routes that already use authentication

- Cart routes.
- Checkout start route.
- Payment creation route.
- User profile routes.
- Back-in-stock subscription route.
- Product creation route.
- Product-by-ID route, currently restricted to admins.

### Routes that are correctly public

- Health check.
- Registration.
- Login.
- Refresh token.
- Product listing and slug lookup, assuming public catalog behavior is intended.

Logout does not require authentication because it can revoke the refresh token from the cookie, but invalid JWT errors should still be normalized to HTTP 401.

## 5. Payment Status

Payment is **not complete**.

Currently implemented:

- Payment service abstraction.
- Payment gateway interface.
- Fake payment gateway.
- Authenticated payment creation route.
- Webhook route.
- MongoDB transaction that marks an order paid or failed.
- Inventory decrease on successful payment.
- Inventory release on failed payment.
- Cart clearing after successful payment.
- Payment-success BullMQ queue.

Not implemented or unsafe:

- Real payment provider integration.
- Webhook signature verification.
- Webhook payload validation.
- Payment amount verification against the order.
- Provider event ID/idempotency storage.
- Payment record/model with provider status and transaction history.
- Safe retry behavior for duplicate webhook requests.
- Customer-facing order/payment status APIs.

The current fake gateway trusts arbitrary request data in [fake-payment.gateway.ts](server/src/modules/payment/gateways/fake-payment.gateway.ts). It is suitable only for local testing.

## 6. Notification Status

Back-in-stock notification is **partially implemented**.

Implemented:

- Authenticated subscription endpoint.
- Product stock check before subscription.
- Duplicate pending-subscription check.
- MongoDB notification model.
- Pending notification repository methods.
- Queue job created when stock increases from zero.
- Worker connects to MongoDB and finds pending subscribers.
- Worker queues email jobs.

Not complete:

- The back-in-stock worker never calls `markAsNotified()`.
- The same subscriber can receive duplicate messages when a job retries.
- Email-job idempotency is not implemented.
- Notification delivery status and failure tracking are missing.
- Notification endpoint validation for `productId` is missing.
- There is no unsubscribe endpoint.
- There is no notification history or retry policy beyond BullMQ defaults.

Important files:

- [back-in-stock.worker.ts](server/src/modules/notification/workers/back-in-stock.worker.ts)
- [mongo-stock-notification.repository.ts](server/src/modules/notification/repositories/mongo-stock-notification.repository.ts)
- [stock-notification.model.ts](server/src/modules/notification/models/stock-notification.model.ts)

## 7. Email Status

Email delivery is **not implemented**.

Currently present:

- Email queue.
- Email worker.
- Jobs from back-in-stock processing.
- Payment-success queue intended for confirmation emails.

Still required:

- Email provider such as Resend, SendGrid, SES, or SMTP.
- Provider configuration and environment variables.
- Email templates.
- Delivery status and provider message IDs.
- Retry and dead-letter handling.
- Idempotency keys.
- Failure alerts and operational logging.
- Password reset and email-verification messages.

The current email worker only logs the recipient in [email.worker.ts](server/src/modules/notification/workers/email.worker.ts); it does not send an email.

## 8. Main Correctness And Architecture Problems

### Checkout is not one transaction

Checkout reserves products one at a time and creates the order afterward in [checkout.service.ts](server/src/modules/checkout/services/checkout.service.ts). A process failure between those actions can leave stock reserved without a valid order.

Recommended approach: create the order and reserve all inventory in one MongoDB transaction, then enqueue the expiry job after the transaction commits.

### Refresh-token rotation is not atomic

The old refresh token is revoked and the new token is created in separate operations. Concurrent refresh requests may both succeed.

Use a transaction or a conditional update that revokes the old token only when it is still active.

### Redis startup is not awaited

`connectRedis()` returns immediately and catches errors internally. The server can start accepting traffic before Redis is ready.

Return a promise and await it during startup, or explicitly make Redis optional for every feature that depends on it.

### Error responses are inconsistent

Some services throw `ApiError`, while others throw plain `Error`. Plain errors become generic 500 responses even for normal cases such as “product not found”.

Use `ApiError` consistently and map Mongoose cast/duplicate-key errors to useful 400/409 responses.

### Mixed databases need a written boundary

PostgreSQL is used for users and refresh tokens, while MongoDB is used for catalog, cart, inventory, order, and notification data. This is workable, but cross-database transactions are not available. The report should document why this split exists and which consistency guarantees are expected.

### Direct construction reduces testability

Many route modules instantiate repositories and services directly at import time. A composition root or module factory would make integration tests and dependency replacement easier.

## 9. Missing Features

- Forgot-password flow.
- Reset-password flow.
- Change-password endpoint.
- Complete email verification flow.
- Public order APIs.
- Order history and order detail endpoints.
- Real payment provider.
- Payment records and webhook idempotency.
- Email delivery.
- Notification unsubscribe/status APIs.
- Wishlist.
- Coupons.
- Addresses.
- Reviews and ratings.
- Admin management APIs.
- Rate limiting.
- Request body size policy and security hardening.
- Automated tests.

## 10. Build And Tooling Issues

Current diagnostics show:

- TypeScript uses deprecated `moduleResolution: "node"` in [tsconfig.json](server/tsconfig.json).
- Prisma tooling reports that the datasource `url` form in [schema.prisma](server/prisma/schema.prisma) is incompatible with the detected Prisma 7 configuration rules.
- There are remaining `console.log`, `console.error`, and `any` usages.
- The server package has no test script and no test files were detected.

## 11. Recommended Priority

1. Add authentication and admin authorization to inventory, product mutation, and category mutation routes.
2. Remove or internally restrict public inventory reserve/release endpoints.
3. Make checkout reservation and order creation transactional.
4. Implement notification idempotency and call `markAsNotified()` only after email acceptance/success according to the chosen delivery design.
5. Add a real email provider and delivery tracking.
6. Secure payment webhooks and add payment event idempotency.
7. Add order and payment APIs for customers and admins.
8. Add integration tests for auth, authorization, inventory concurrency, checkout rollback, workers, and webhook retries.
9. Fix TypeScript and Prisma configuration.
10. Replace debug console output with structured logger calls.

## 12. Final Assessment

This is a legitimate **approximately 60% complete backend foundation**, not a complete ecommerce backend.

The strongest parts are the module organization, repository/service separation, authentication foundation, atomic inventory updates, cart implementation, and worker setup.

The largest gap is production correctness: several write routes are unauthenticated, checkout is not fully atomic, payment is still fake, email is only logging, notification delivery is not idempotent, and automated tests are absent.

After the priority items above are addressed, the project could move from a learning/prototype backend toward a production-capable modular monolith.
