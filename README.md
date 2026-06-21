# WalkManager

A dog walking platform connecting customers with dog walkers through role-based identity, walker profiles, neighborhood proximity search, booking workflows, and moderated reviews.

## Development Quickstart

See [specs/001-dog-walking-platform/quickstart.md](specs/001-dog-walking-platform/quickstart.md) for detailed development setup and testing commands.

### Prerequisites
- Rust 1.70+ with Cargo
- Node.js 18+ with npm/yarn
- PostgreSQL 14+ with PostGIS extension
- DragonflyDB (Redis-compatible)
- SeaweedFS

### Commands

```bash
# Backend - run from backend/
cargo test                    # Run all tests
cargo fmt && cargo clippy     # Format and lint
cargo build                   # Build all crates

# Frontend - run from frontend/
npm run dev                   # Start dev server
npm run test                  # Run frontend tests
npm run lint                  # Lint TypeScript
```