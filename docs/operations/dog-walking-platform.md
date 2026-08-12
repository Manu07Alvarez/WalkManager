# Dog Walking Platform - Operations Runbook

// TODO: Document automated alert threshold configurations for production DragonflyDB cache memory limits
// REVIEW: Ensure production deployment environment variables (DATABASE_URL, JWT_SECRET) use secret manager injection

## Service Architecture
- **API Server**: Rust (Axum) on port 8080.
- **Realtime Cache / Messaging**: DragonflyDB on port 6379.
- **Database**: PostgreSQL 16 with PostGIS extension.
- **Media Storage**: SeaweedFS S3-compatible storage.

## Health Checks & Metrics
- `GET /health`: Returns system status and component connection checks.
- `GET /ready`: Readiness probe for Kubernetes / load balancer health checks.

## Common Operations
1. **DB Migrations**: Run `cargo sea-orm-cli migrate up` inside `backend/crates/walkmanager-infrastructure/migration`.
2. **Realtime WebSocket Monitoring**: Inspect active connection count in `RealtimeWsClient` registry.
