# Payment and Order Implementation Analysis

## Project Context
This is a Node.js/MERN backend for an e-commerce app. The current implementation is a partial order + payment flow built around MongoDB/Mongoose, with a fake payment gateway, BullMQ queue workers, and inventory reservation logic.

## Current implementation status

### 1) Order models / schemas
File: `server/src/modules/order/models/order.model.ts`

Key model fields:
- `orderNumber`
- `userId`
- `items[]` with:
  - `productId`
  - `name`
  - `price`
  - `quantity`
  - `subtotal`
- `totalAmount`
- `status`
- `paymentStatus`
- timestamps

Order status enum: `server/src/modules/order/types/order.types.ts`
- `PENDING`
- `CONFIRMED`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`
- `EXPIRED`

Payment status enum:
- `PENDING`
- `PAID`
- `FAILED`

Important note: there is no separate Prisma `Order` model in `server/prisma/schema.prisma`. Orders are MongoDB/Mongoose models, not Prisma models.

### 2) Order repositories
File: `server/src/modules/order/repositories/order.repository.ts`

Interface methods:
- `createOrder`
- `markOrderAsPaid`
- `markOrderAsPaymentFailed`
- `findById`
- `markOrderAsExpired`

Implementation: `server/src/modules/order/repositories/mongo-order-repository.ts`

Important methods:
- `createOrder(order, session?)`
- `markOrderAsPaid(orderId, session?)`
- `markOrderAsPaymentFailed(orderId, session?)`
- `findById(orderId, session?)`
- `markOrderAsExpired(orderId, session?)`

### 3) Order services
File: `server/src/modules/order/service/order.service.ts`

Methods:
- `createOrder(userId, items, session?)`
- `markOrderAsPaid(orderId, session?)`
- `markOrderAsPaymentFailed(orderId, session?)`
- `getOrderById(orderId, session?)`
- `markOrderAsExpired(orderId, session?)`

Behavior:
- Creates order with `status: PENDING` and `paymentStatus: PENDING`
- Calculates `totalAmount`
- Uses `orderNumber = ORD-${Date.now()}`

### 4) Order controllers/routes
I did not find a dedicated order controller/router module in `server/src/modules/order`.

The app exposes checkout/payment endpoints from:
- `server/src/modules/checkout/routes/checkout.routes.ts`
- `server/src/modules/payment/routes/payment.routes.ts`

App-level route registration is in:
- `server/src/app.ts`

### 5) Payment-related models / schemas
I did not find any dedicated payment model or schema.

There is no `Payment` collection or `Payment` Mongoose model.

Payment state is stored on the `Order` document via `paymentStatus`.

### 6) Payment repositories / services / controllers
Payment gateway interface:
- `server/src/modules/payment/interfaces/payment.gateway.interface.ts`

Methods:
- `createPayment(orderId, amount)`
- `handleWebhook(payload)`

Concrete gateway implementation:
- `server/src/modules/payment/gateways/fake-payment.gateway.ts`

This is the only payment provider implementation currently. It is a fake provider, not a real Stripe/Razorpay integration.

Payment service:
- `server/src/modules/payment/services/payment.service.ts`

Methods:
- `createPayment(orderId, amount)`
- `handleWebhook(payload)`

Behavior:
- Calls provider `handleWebhook(payload)`
- Starts a Mongo session
- Reads order by `event.orderId`
- If order is not pending, ignores duplicate webhook
- If event status is `SUCCESS`:
  - marks order as paid
  - decreases inventory stock
  - clears cart
  - enqueues payment success email job
- If event status is `FAILED`:
  - marks order as payment failed
  - releases reserved stock

Payment controller:
- `server/src/modules/payment/controllers/payment.controller.ts`

Methods:
- `createPayment`
- `handleWebhook`

Payment routes:
- `server/src/modules/payment/routes/payment.routes.ts`

Routes:
- `POST /api/v1/payment/create`
- `POST /api/v1/payment/webhook`

### 7) Existing payment provider integration
There is no real payment provider integration yet.

Evidence:
- No Stripe or Razorpay SDK in `server/package.json`
- No Stripe/Razorpay env vars in `server/src/config/env.ts`
- Fake gateway is the only implementation

Current provider is effectively a mock/fake payment gateway.

### 8) Existing interfaces / abstractions for a PaymentProvider
Yes: there is already a payment gateway interface that can be extended:

`server/src/modules/payment/interfaces/payment.gateway.interface.ts`

This is the likely abstraction to use for a real provider implementation.

The architecture pattern is consistent with the rest of the app:
- interface
- concrete provider implementation
- service using the interface

A similar abstraction pattern exists in storage:
- `server/src/storage/interfaces/image-storage.interface.ts`

### 9) How order status is represented
Defined in `server/src/modules/order/types/order.types.ts` and enforced in `server/src/modules/order/models/order.model.ts`.

Values:
- `PENDING`
- `CONFIRMED`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`
- `EXPIRED`

### 10) How payment status is represented
Also defined in `server/src/modules/order/types/order.types.ts` and stored on `Order`.

Values:
- `PENDING`
- `PAID`
- `FAILED`

This is a simple per-order payment state, not a dedicated payment ledger model.

### 11) How cart / checkout currently works
Cart module:
- `server/src/modules/cart/models/cart.model.ts`
- `server/src/modules/cart/repositories/mongo-cart.repository.ts`
- `server/src/modules/cart/services/cart.service.ts`
- `server/src/modules/cart/controllers/cart.controller.ts`
- `server/src/modules/cart/routes/cart.routes.ts`

Cart is keyed by `userId` and stores `items[]` with product quantities.

Checkout service:
- `server/src/modules/checkout/services/checkout.service.ts`

Current flow:
1. Get cart and ensure it is not empty
2. Reserve stock for each cart item
3. Create an order
4. Schedule reservation expiration job using BullMQ
5. Return the order

This does not yet complete payment or redirect the user to a payment gateway. It is a stock reservation + pending-order flow.

### 12) Existing transaction/session usage
Yes, there are Mongoose sessions used.

Examples:
- `server/src/modules/payment/services/payment.service.ts`
- `server/src/modules/order/workers/reservation-expiry.worker.ts`
- `server/src/modules/inventory/services/inventory.service.ts`

They use:
- `mongoose.startSession()`
- `session.withTransaction(async () => {...})`

Important gap: checkout is not wrapped inside a single transaction even though it reserves stock and creates an order.

### 13) Existing idempotency implementation
I did not find any real idempotency implementation.

Search for `idempot` / `idempotency` returned nothing meaningful.

The TODO file explicitly mentions:
- `server/todo.md`
- `[ ] Payment Idempotency`

There is one duplicate-check pattern in `PaymentService.handleWebhook`:
- if `order.paymentStatus !== "PENDING"`, ignore the webhook

This is not true idempotency; it is a basic duplicate-event guard.

### 14) Webhook-related code
Yes, there is webhook code:
- `server/src/modules/payment/routes/payment.routes.ts`
- `server/src/modules/payment/controllers/payment.controller.ts`
- `server/src/modules/payment/services/payment.service.ts`
- `server/src/modules/payment/gateways/fake-payment.gateway.ts`

Current behavior:
- `POST /payment/webhook`
- Gateway parses `payload`
- Service updates order state based on event status

Missing:
- webhook signature verification
- provider-specific signature parsing
- event persistence
- replay protection
- idempotency key tracking

### 15) Environment variables/config related to payments
Config file: `server/src/config/env.ts`

Current envs include:
- `PORT`
- `MONGODB_URI`
- `JWT_*`
- `DATABASE_URL`
- `REDIS_URL`
- `CLOUDINARY_*`

There are no payment-related env vars like:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `PAYMENT_WEBHOOK_SECRET`

### 16) Payment provider dependencies
`server/package.json` includes:
- `bullmq`
- `redis`
- `ioredis`
- `mongoose`
- `@prisma/client`

It does NOT include Stripe or Razorpay SDKs.

### 17) Current architecture overview
The project is organized by domain modules under `server/src/modules/`:
- auth
- cart
- category
- checkout
- counter
- imports
- inventory
- notification
- order
- payment
- product
- user

Each module follows a common pattern:
- `models`
- `repositories`
- `services`
- `controllers` / `controller`
- `routes`
- sometimes `queues`, `workers`, `validators`, `interfaces`, or `gateways`

Shared infrastructure is outside modules:
- `server/src/config`
- `server/src/core`
- `server/src/lib`
- `server/src/middlewares`
- `server/src/redis`
- `server/src/storage`

## Extra relevant files

BullMQ queues:
- `server/src/modules/order/queues/reservation-expiry.queue.ts`
- `server/src/modules/payment/queues/payment-success.queue.ts`

BullMQ workers:
- `server/src/modules/order/workers/reservation-expiry.worker.ts`
- `server/src/modules/payment/worker/payment-success.worker.ts`

Redis config:
- `server/src/redis/config/redis.config.ts`

Inventory repository:
- `server/src/modules/inventory/repositories/inventory.repository.ts`

Inventory interface:
- `server/src/modules/inventory/interfaces/inventory.repository.interface.ts`

## Important findings
- The app already has the shape of a payment system, but it is still a fake gateway implementation.
- Orders are the source of truth for payment state, not a standalone `Payment` model.
- There is no real provider, no verification, no idempotency, and no dedicated order API layer yet.
- The architecture is broadly suitable for a real payment provider integration, as long as the provider abstraction is implemented consistently.

## What is already implemented
- Cart flow
- Checkout reservation flow
- Pending order creation
- Order status transitions for paid/failed/expired
- Inventory reservation/release/decrease flow
- Payment gateway abstraction layer
- Fake payment webhook flow
- BullMQ queue + worker skeleton

## What is missing
- Real provider SDK integration
- Payment env configuration
- Webhook verification
- Idempotency
- Dedicated order routes/controllers
- Payment record / event persistence
- Robust checkout transaction safety
- Production-critical provider handling and reconciliation

## What should be implemented next
1. Choose a payment provider (Stripe or Razorpay)
2. Implement the real provider under the existing `IPaymentGateway` contract
3. Add provider env vars and webhook secret config
4. Add idempotency for payment creation and webhook handling
5. Add real webhook verification and event processing
6. Add order retrieval APIs
7. Strengthen transaction boundaries between checkout, order creation, and inventory mutation

## Architectural recommendation
Do not redesign the whole structure. Keep the existing repository/service/provider/module pattern. Extend the current `IPaymentGateway` and wrap the real provider integration in the same way the storage provider and fake payment provider are structured.

The most important change before real payments is to add idempotency and webhook verification on top of the existing architecture rather than refactoring the whole backend.
