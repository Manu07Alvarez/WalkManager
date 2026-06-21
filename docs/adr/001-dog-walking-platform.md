# 001 - Dog Walking Platform Architecture

## Status: Accepted

## Context

Building a dog walking marketplace platform requires clear architectural boundaries for maintainability, testability, and future evolution.

## Decision

Use a Rust modular monolith with Clean Architecture boundaries:

- **Domain**: Core business logic (bookings, availability, reviews, chat, moderation)
- **Application**: Use cases, command/query contracts, validation
- **Infrastructure**: SeaORM persistence, SeaweedFS media, DragonflyDB caching
- **API**: Axum HTTP handlers, WebSocket endpoints, OpenAPI documentation

Frontend uses React with feature-based architecture aligning with user workflows.

## Consequences

- Business rules stay independent from frameworks (Axum, SeaORM)
- Each domain capability is independently testable
- Migration path to microservices is preserved
- Clear separation of concerns for team organization

## Alternatives Considered

- NestJS with TypeScript (rejected: less performant for concurrent booking logic)
- Microservices from start (rejected: premature complexity for MVP)
- Single crate Rust (rejected: tight coupling would impede testing)