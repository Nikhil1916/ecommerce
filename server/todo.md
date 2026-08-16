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