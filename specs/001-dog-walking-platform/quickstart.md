# Quickstart: Dog Walking Platform

## Prerequisites

- Rust stable toolchain
- Cargo
- Node.js LTS
- PostgreSQL with PostGIS enabled
- SeaweedFS instance or local-compatible service
- DragonflyDB instance
- Environment variables for database, JWT signing keys, media storage, cache, and notification providers

## Setup

1. Restore/check backend dependencies.

   ```powershell
   cargo fetch --manifest-path backend/Cargo.toml
   cargo check --manifest-path backend/Cargo.toml
   ```

2. Install frontend dependencies.

   ```powershell
   npm install --prefix frontend
   ```

3. Configure local environment variables.

   ```powershell
   $env:DATABASE_URL = "postgres://walkmanager:walkmanager@localhost:5432/walkmanager"
   $env:DRAGONFLY_URL = "redis://localhost:6379"
   $env:SEAWEEDFS_ENDPOINT = "http://localhost:8333"
   $env:JWT_PRIVATE_KEY_PATH = "local-dev-private-key.pem"
   $env:JWT_PUBLIC_KEY_PATH = "local-dev-public-key.pem"
   ```

4. Apply database migrations after they exist.

   ```powershell
   cargo run --manifest-path backend/Cargo.toml -p walkmanager-infrastructure --bin migrate -- up
   ```

5. Start the backend API after the application crate exists.

   ```powershell
   cargo run --manifest-path backend/Cargo.toml -p walkmanager-api
   ```

## Test-First Workflow

Before implementing each task:

1. Add or update failing tests for the required domain rule, boundary validator, API contract, repository behavior, WebSocket behavior, persistence behavior, or UI workflow.
2. Run the targeted tests and confirm they fail for the expected reason.
3. Implement the smallest production change.
4. Run targeted tests again and confirm they pass.
5. Run the full relevant suite before finishing the task.

## Expected Verification Commands

Backend:

```powershell
cargo test --manifest-path backend/Cargo.toml
cargo fmt --manifest-path backend/Cargo.toml --check
cargo clippy --manifest-path backend/Cargo.toml --all-targets -- -D warnings
```

Frontend:

```powershell
npm run lint --prefix frontend
npm run test --prefix frontend
npm run build --prefix frontend
```

Contracts:

```powershell
cargo test --manifest-path backend/Cargo.toml -p walkmanager-api openapi
```

## Critical Scenarios To Cover First

- CUIL uniqueness across all accounts.
- Protected access to CUIL, identity documents, private chats, booking data, incidents, and restrictions.
- Walker capacity checks using booking dog count and accepted overlapping bookings.
- Atomic booking acceptance under concurrent requests.
- Booking Status transitions: Pending, Accepted, Rejected, Expired, Cancelled.
- Service Result rules: Successful, CustomerAbsent, WalkerAbsent, Failed, Disputed.
- Review eligibility only for Successful and Failed final results.
- Public inquiry chats versus booking-specific chats.
- WebSocket authorization for chats, booking updates, notifications, and presence.
- Suspended walker exclusion from search.
- Restricted/suspended account booking and messaging limits.
