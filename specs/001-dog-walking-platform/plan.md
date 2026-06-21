# Implementation Plan: Dog Walking Platform

**Branch**: `001-dog-walking-platform` | **Date**: 2026-06-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-dog-walking-platform/spec.md`

## Summary

Build a web application that connects customers with dog walkers through role-based identity, walker profiles, neighborhood proximity search, booking and service-result workflows, public and booking-specific chat, moderated reviews, notifications, reliability tracking, and internal moderator operations. The backend will be a Rust modular monolith using Axum for HTTP APIs, Tokio for async execution, SeaORM for PostgreSQL/PostGIS persistence and migrations, native WebSockets for real-time communication, SeaweedFS for media, and DragonflyDB for cache/rate-limited temporary coordination while preserving PostgreSQL as the source of truth for booking consistency.

## Technical Context

**Language/Version**: Rust backend; React with TypeScript frontend.

**Primary Dependencies**: Axum, Tokio, SeaORM, SeaORM migrations, PostgreSQL/PostGIS, native WebSockets, OpenAPI tooling, SeaweedFS client/integration, DragonflyDB client/integration, React, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, Zod.

**Storage**: PostgreSQL is the authoritative relational store; PostGIS supports neighborhood proximity search; SeaweedFS stores public and protected media; DragonflyDB stores session cache, rate limits, temporary availability snapshots, notification coordination, and presence state only.

**Testing**: TDD is mandatory. Backend tests will cover domain/application units, boundary validation, API contracts, repository behavior, SeaORM migrations, booking concurrency, WebSocket authorization, and security-sensitive flows. Frontend tests will cover feature behavior, form validation, real-time UI state, and API contract integration.

**Target Platform**: Browser-based responsive web application with Rust backend services deployable on Linux containers or equivalent server runtime.

**Project Type**: Full-stack web application with backend HTTP APIs, WebSocket endpoints, frontend app, and independently testable domain/application crates.

**Performance Goals**: 95% of customer searches with active matching walkers display filtered results in under 2 seconds; 95% of chat messages become visible to the other participant within 5 seconds during normal operation; pending request expiration is processed within 15 minutes; accepted booking operations preserve capacity correctness in 100% of concurrent acceptance scenarios.

**Constraints**: Use Rust with clear Domain, Application, Infrastructure, and API boundaries; validate all external input explicitly at API/application boundaries; document public endpoints with OpenAPI; return standardized errors and explicit domain errors; paginate large collections; avoid N+1 data access; hash passwords with accepted algorithms; sign JWTs using asymmetric keys; log exceptions without secrets; store secrets only in environment variables or Kubernetes Secrets; business rules must remain independent from persistence, Axum handlers, and WebSocket implementation details.

**Scale/Scope**: Initial marketplace scope is a modular monolith with two primary marketplace roles, an internal Moderator role, registration/authentication, walker profiles, search/filtering, booking lifecycle, service results, public inquiry chats, booking chats, notifications, reviews, moderation, restrictions/suspensions, incidents, media storage, and responsive customer/walker/moderation interfaces. Architecture should remain evolvable toward service decomposition without premature distributed-system complexity.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Library-first**: PASS. Booking, availability, service result, moderation, reliability, identity, and notification behavior will live in independently testable Rust domain/application crates before API, WebSocket, or persistence integration.
- **TDD**: PASS. Tasks must require failing tests before production code for domain rules, validators, API contracts, repositories, migrations, concurrency, WebSockets, and frontend feature workflows.
- **Backend architecture**: PASS. Backend uses Rust with Domain, Application, Infrastructure, and API layers; explicit request/response contract types cross API/process boundaries.
- **Frontend architecture**: PASS. React code is organized by feature with shared code extracted only when justified.
- **Validation**: PASS. All external input is validated explicitly at backend API/application boundaries and covered by tests; frontend React Hook Form and Zod provide usability validation only.
- **API contract**: PASS. Public endpoints are documented in OpenAPI and return standardized success/error contracts.
- **Domain errors**: PASS. Booking conflicts, invalid status/result transitions, unavailable schedules, restricted accounts, expired bookings, and moderation outcomes are explicit domain errors.
- **Data access**: PASS. PostgreSQL/PostGIS through SeaORM avoids N+1 queries, paginates large collections, and defines transaction boundaries.
- **Security and operations**: PASS. Password hashing, asymmetric JWT signing, protected media access, secret storage, and exception logging constraints are included.
- **Dependency discipline**: PASS. Axum, Tokio, SeaORM, WebSockets, PostGIS, SeaweedFS, DragonflyDB, TanStack Query, React Hook Form, Zod, Tailwind CSS, and shadcn/ui are justified in research.md.
- **Quality automation**: PASS. Formatting, linting, OpenAPI validation, backend/frontend tests, and contract checks are required merge gates.

## Project Structure

### Documentation (this feature)

```text
specs/001-dog-walking-platform/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- openapi.yaml
|-- checklists/
|   |-- booking-domain.md
|   `-- requirements.md
`-- tasks.md
```

### Source Code (repository root)

```text
backend/
|-- Cargo.toml
|-- crates/
|   |-- walkmanager-domain/
|   |   |-- src/
|   |   |   |-- identity/
|   |   |   |-- profiles/
|   |   |   |-- scheduling/
|   |   |   |-- bookings/
|   |   |   |-- chats/
|   |   |   |-- reviews/
|   |   |   |-- moderation/
|   |   |   `-- notifications/
|   |   `-- tests/
|   |-- walkmanager-application/
|   |   |-- src/
|   |   |   |-- identity/
|   |   |   |-- profiles/
|   |   |   |-- search/
|   |   |   |-- bookings/
|   |   |   |-- chats/
|   |   |   |-- reviews/
|   |   |   |-- moderation/
|   |   |   `-- notifications/
|   |   `-- tests/
|   |-- walkmanager-infrastructure/
|   |   |-- src/
|   |   |   |-- persistence/
|   |   |   |-- media/
|   |   |   |-- realtime/
|   |   |   |-- caching/
|   |   |   `-- notifications/
|   |   |-- migration/
|   |   `-- tests/
|   `-- walkmanager-api/
|       |-- src/
|       |   |-- http/
|       |   |-- websockets/
|       |   |-- contracts/
|       |   `-- middleware/
|       `-- tests/

frontend/
|-- src/
|   |-- app/
|   |-- features/
|   |   |-- auth/
|   |   |-- walker-profile/
|   |   |-- search/
|   |   |-- bookings/
|   |   |-- chats/
|   |   |-- reviews/
|   |   |-- moderation/
|   |   `-- notifications/
|   |-- shared/
|   |   |-- api/
|   |   |-- realtime/
|   |   |-- ui/
|   |   `-- validation/
|   `-- test/
`-- tests/
```

**Structure Decision**: Use a Rust workspace with separate crates for Domain, Application, Infrastructure, and API so business rules stay independent from Axum, WebSockets, SeaORM, DragonflyDB, and SeaweedFS. Use a React feature-based frontend aligned to major user workflows, with shared UI/API/realtime/validation modules only for cross-feature reuse.

## Phase 0 Research Summary

Research decisions are captured in [research.md](./research.md). All technical-context unknowns are resolved: Rust backend architecture, Axum APIs, Tokio runtime, SeaORM persistence/migrations, PostgreSQL/PostGIS geospatial strategy, native WebSockets, media storage, cache responsibilities, concurrency strategy, authentication/security, validation, OpenAPI, and testing approach.

## Phase 1 Design Summary

Design artifacts are captured in [data-model.md](./data-model.md), [contracts/openapi.yaml](./contracts/openapi.yaml), and [quickstart.md](./quickstart.md). The design models Booking Status and Service Result as independent state systems, stores booking dog count for capacity checks, separates public inquiry chats from booking chats, protects identity media, and keeps DragonflyDB out of authoritative booking decisions.

## Post-Design Constitution Check

- **Library-first**: PASS. Data model and contracts map domain workflows to Rust application use cases and API/WebSocket contract types without moving business rules into handlers, repositories, or WebSocket transports.
- **TDD**: PASS. quickstart.md and later tasks require test-first verification for booking capacity, state transitions, validators, contract behavior, repository behavior, and UI workflows.
- **Backend architecture**: PASS. Planned backend layout follows Domain/Application/Infrastructure/API crate boundaries with explicit boundary contracts.
- **Frontend architecture**: PASS. Planned frontend layout uses feature folders and shared modules for cross-cutting UI/API/realtime code.
- **Validation**: PASS. Backend boundary validation is explicit and test-covered; frontend Zod schemas support UX feedback.
- **API contract**: PASS. Initial OpenAPI contract exists and must be expanded/kept in sync during implementation.
- **Domain errors**: PASS. OpenAPI includes standardized error shape and named domain error codes.
- **Data access**: PASS. PostgreSQL remains authoritative; SeaORM, PostGIS, pagination, migrations, and transaction boundaries are explicit.
- **Security and operations**: PASS. Protected media, sensitive CUIL/identity data, auth, authorization, and logging constraints are documented.
- **Dependency discipline**: PASS. Each non-baseline dependency has a recorded decision and alternative in research.md.
- **Quality automation**: PASS. quickstart.md defines expected test, lint, format, and contract checks.

## Complexity Tracking

No constitution violations are required. Additional dependencies are justified in research.md and kept within the architecture constraints.
