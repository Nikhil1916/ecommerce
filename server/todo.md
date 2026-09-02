HIGH PRIORITY
-------------
[ ] Reservation Expiry Job
[ ] Queue for Payment Processing

Day 10
------
[ ] Payment Idempotency
[ ] Reservation Expiry (TTL/Job)
[ ] Queue (BullMQ)
[ ] Kafka Notify-Me Flow



[ ] Move Redis to hosted Redis (Upstash / Redis Cloud)
[ ] Move BullMQ workers to production process
[ ] Verify delayed jobs survive server restart
[ ] Verify reservation expiry on deployed environment

TODO:
Use transaction inside expiry worker

[ ] Move Redis connection to env vars
[ ] Use Redis Cloud / Upstash
[ ] Use same redisConnection in all queues/workers
[ ] Run workers through PM2 in production


[ ] Introduce InventoryService
[ ] Remove direct repository usage from CheckoutService
[ ] Create dependency container/composition root
[ ] Centralize service/repository instantiation
[ ] Make repositories swappable (Mongo/Postgres)


## Post-Frontend Backend Features

### User
- [ ] Order history API
- [ ] User profile API
- [ ] Update profile
- [ ] User-specific order details

### Search Analytics
- [ ] Track product searches
- [ ] Track category searches
- [ ] Most searched products API
- [ ] Most searched categories API
- [ ] Search analytics aggregation

### Admin Analytics / Dashboard
- [ ] Sales dashboard APIs
- [ ] Sales over time
- [ ] Sales by product
- [ ] Sales by category
- [ ] Revenue analytics
- [ ] Order analytics
- [ ] Top-selling products
- [ ] Top-selling categories
- [ ] Most searched products/categories
- [ ] Date-range filtering
- [ ] Admin dashboard graphs

- [ ] Rename StorageProvider → StorageProvider
- [ ] Move generic upload/download/delete abstraction
- [ ] Implement StorageFactory
- [ ] Inject storage instead of `new CloudinaryProvider()`

Storage
├── upload
├── download/stream
├── delete
└── signed URL generation (if needed)

Import
├── store fileKey
├── worker downloads/streams using fileKey
└── GET import history/download

## Post Deployment
- [ ] Configure Razorpay webhook with deployed public API URL
- [ ] Test `payment.captured` webhook end-to-end
- [ ] Test `payment.failed` webhook end-to-end
- [ ] Verify Razorpay webhook signature validation
- [ ] Verify duplicate webhook handling / idempotency
- [ ] Verify payment transaction updates order, inventory and cart correctly
- [ ] Verify payment success queue is triggered only after transaction commit

OUTBOX PATTERN

ADD SEND GRID OR AWS FOR EMAILS