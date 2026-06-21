# Research: Dog Walking Platform

## Backend Architecture

**Decision**: Use Rust as a modular monolith with separate Domain, Application, Infrastructure, and API crates.

**Rationale**: The updated constitution requires Rust and clear backend boundaries. Booking capacity, lifecycle transitions, service results, reliability rules, and moderation actions are domain-heavy and need memory-safe, strongly typed, independently testable code outside persistence, HTTP handlers, and WebSocket transports.

**Alternatives considered**: A single Axum application crate was rejected because it would concentrate business rules near transport concerns. A microservice split was rejected for the initial implementation because strong transactional booking consistency and operational simplicity are more important than distributed scaling complexity.

## HTTP API Framework

**Decision**: Use Axum for backend HTTP APIs.

**Rationale**: Axum composes naturally with Tokio, typed extractors, middleware, and Rust application services. It supports clear request/response contract boundaries while keeping domain workflows outside handlers.

**Alternatives considered**: Actix Web was considered but rejected because the requested stack names Axum. A custom HTTP layer was rejected as unnecessary.

## Async Runtime

**Decision**: Use Tokio as the asynchronous runtime.

**Rationale**: Tokio is the standard async runtime for Axum, WebSockets, database clients, cache clients, and background workers. It supports concurrent chat, booking update, notification, and presence workflows without making domain logic transport-specific.

**Alternatives considered**: async-std was rejected because the requested stack specifies Tokio and Axum ecosystem support is stronger with Tokio.

## Frontend Architecture

**Decision**: Use React with TypeScript and feature-based folders, supported by Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, and Zod.

**Rationale**: The existing plan and user direction retain React. Feature organization aligns with auth, search, bookings, chats, reviews, moderation, and notifications. TanStack Query handles server-state freshness, React Hook Form and Zod support form UX, and Tailwind/shadcn provide consistent responsive UI primitives.

**Alternatives considered**: A global page/component split was rejected because workflows are feature-heavy. Replacing backend validation with shared frontend validation was rejected because backend validation must remain authoritative.

## Persistence and Geospatial Search

**Decision**: Use PostgreSQL as the authoritative store with PostGIS for distance calculations, proximity filtering, and nearest-first ordering.

**Rationale**: PostgreSQL remains the source of truth, and PostGIS supports indexed spatial queries while preserving relational consistency for users, bookings, availability, chats, reviews, incidents, and restrictions.

**Alternatives considered**: Storing only neighborhood names without coordinates was rejected because it cannot support reliable kilometer distances. External map/search services were rejected for the initial implementation because the spec does not require interactive maps and local PostGIS queries are simpler.

## ORM and Migrations

**Decision**: Use SeaORM for entity mapping, query execution, schema migrations, and repository implementations.

**Rationale**: SeaORM provides async Rust database access and migration support while keeping repository implementations in Infrastructure. Domain models remain independent from generated database entities and transport contracts.

**Alternatives considered**: SQLx was considered for compile-time SQL checking, but SeaORM was selected because the requested stack explicitly requires entity mapping and migrations through SeaORM. Diesel was rejected because async support and migration ergonomics are less aligned with the Tokio/Axum stack.

## Booking Consistency

**Decision**: Enforce booking acceptance and capacity checks inside PostgreSQL transactions through infrastructure repositories, using accepted bookings, requested dog count, walker capacity, working hours, available days, schedules, and timezone-normalized time ranges.

**Rationale**: The spec requires concurrency-safe acceptance and overbooking prevention. PostgreSQL must remain authoritative so cache or realtime layers cannot create conflicting bookings.

**Alternatives considered**: Cache-based booking locks were rejected as authoritative controls because DragonflyDB may expire or diverge. Optimistic UI-only checks were rejected because they cannot guarantee correctness under concurrency.

## Workflow State Model

**Decision**: Model Booking Status and Service Result independently using explicit Rust domain enums.

**Rationale**: The spec explicitly requires independent state systems. Strong enum modeling prevents invalid states from spreading through application code and keeps lifecycle and outcome transitions testable.

**Alternatives considered**: A single combined status enum was rejected because it mixes lifecycle and outcome states and makes transitions ambiguous.

## Real-Time Communication

**Decision**: Use native WebSockets for customer/walker chats, booking status updates, notification delivery, and presence-related features.

**Rationale**: The updated technical direction requires WebSockets. WebSocket handlers will be transport adapters that call application services and publish persisted events; business workflows remain independent from connection/session details.

**Alternatives considered**: SignalR was rejected because the backend is no longer ASP.NET Core. Polling was rejected for chat because it provides poorer user experience and higher unnecessary load.

## Media Storage

**Decision**: Use SeaweedFS for walker profile photos, protected identity verification documents, and moderation-related uploads, with separate public and protected access paths.

**Rationale**: Media should not be stored in PostgreSQL. SeaweedFS supports object-style storage while keeping identity documents non-public.

**Alternatives considered**: Database BLOB storage was rejected due to database growth and access-control concerns. Public-only object storage paths were rejected because identity documents require protection.

## Cache and Temporary Coordination

**Decision**: Use DragonflyDB for session caching, rate limiting, temporary availability caching, notification coordination, and presence tracking, but never as the authoritative source for booking consistency.

**Rationale**: DragonflyDB can reduce repeated reads and support low-latency temporary state. Critical booking decisions must still use PostgreSQL transactions.

**Alternatives considered**: Using DragonflyDB locks as the main overbooking safeguard was rejected because the spec and constitution prioritize transactional consistency.

## Notifications

**Decision**: Generate notification records for booking requests, acceptance/rejection, cancellations, chat messages, booking updates, and service result updates, then dispatch through email or generic phone messaging providers.

**Rationale**: The spec requires user channel preference but defers exact provider selection. Recording notifications first makes delivery retry and audit behavior possible without binding the domain to provider details.

**Alternatives considered**: Direct provider-only sending was rejected because it risks losing notification history and complicates retries.

## Security and Sensitive Data

**Decision**: Treat CUIL, identity verification documents, private chats, booking data, incidents, restrictions, and suspensions as protected data. Use role-based authorization, asymmetric JWT signing, accepted password hashing, secret storage outside source, and exception logs without secrets.

**Rationale**: The spec and constitution require sensitive personal information protection and explicit authorization for private resources.

**Alternatives considered**: Public identity media URLs were rejected. Symmetric JWT signing was rejected by the constitution.

## Validation and API Contracts

**Decision**: Use explicit backend validation at Axum/API and application boundaries, plus OpenAPI for public endpoint documentation with standardized error responses. Use Zod and React Hook Form for frontend feedback only.

**Rationale**: Backend validation is the source of truth and is constitutionally required. Rust request/command types and validation functions keep boundary validation explicit and testable. Frontend validation improves usability but must not replace server rules.

**Alternatives considered**: Frontend-only validation was rejected. Undocumented endpoints were rejected by the constitution. A .NET-specific FluentValidation approach was rejected because the backend is Rust.

## Reliability and Moderation

**Decision**: Store incident records and account restrictions explicitly, using transparent rule thresholds and moderator review rather than complex automated reputation scoring in the initial implementation.

**Rationale**: The spec prioritizes simple, explainable moderation behavior for no-shows, late cancellations, disputed services, repeated failures, repeated rejections, and moderator operations.

**Alternatives considered**: A hidden reputation score was rejected because it conflicts with transparency. Manual-only moderation was rejected because repeated clear incidents should be able to trigger simple restrictions.

## Testing Strategy

**Decision**: Plan test-first coverage across Rust domain units, application use cases, boundary validation, OpenAPI contracts, SeaORM repository integration, migrations, booking concurrency, WebSocket authorization, frontend feature behavior, and accessibility-relevant UI states.

**Rationale**: The constitution requires TDD and full test execution before merge. The highest-risk workflows are booking consistency, state transitions, protected access, WebSocket authorization, and moderation/review eligibility.

**Alternatives considered**: End-to-end-only coverage was rejected because domain rules need fast isolated tests. Unit-only coverage was rejected because persistence concurrency, migrations, WebSocket access, and API contracts require integration checks.
