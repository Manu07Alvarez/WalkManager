# 001 - Dog Walking Platform Architecture

## Status: Accepted & Fully Implemented

// TODO: Record future microservices extraction strategy if user base exceeds 1M active accounts
// REVIEW: Confirm Clean Architecture crate isolation remains enforced across all 7 User Stories

## Context

Building a dog walking marketplace platform requires clear architectural boundaries for maintainability, testability, and future evolution.

## Decision

Use a Rust modular monolith with Clean Architecture boundaries:

- **Domain**: Core business logic (bookings, availability, reviews, chat, moderation)
- **Application**: Use cases, command/query contracts, validation
- **Infrastructure**: SeaORM persistence, SeaweedFS media, DragonflyDB caching
- **API**: Axum HTTP handlers, WebSocket endpoints, OpenAPI documentation

Frontend uses React with feature-based architecture aligning with user workflows.

## Implementation Results

- **US1 Identity & Auth MVP**: Argon2id hashing, CUIL validation, JWT session tokens.
- **US2 Walker Profiles & Schedules**: Dynamic capacity constraints and operating hours.
- **US3 Search & Pending Booking**: Spatial PostGIS nearest-walker query and pending state request creation.
- **US4 Request Management & Results**: Concurrency-safe acceptance, rejection, cancellation, expiration, and service result reporting.
- **US5 Real-time Chat & Notifications**: WebSockets, inquiry rate limiting, presence, and dispatch preparation.
- **US6 Moderated Service Reviews**: Eligibility rules, 1-5 star ratings, moderation workflow, no walker replies allowed.
- **US7 Reliability & Incidents**: Incident tracking, account restrictions, transparent threshold rules, and Moderator work items.

## Consequences

- Business rules stay independent from frameworks (Axum, SeaORM)
- Each domain capability is independently testable
- Migration path to microservices is preserved
- Clear separation of concerns for team organization