# Tasks: Dog Walking Platform

**Input**: Design documents from `/specs/001-dog-walking-platform/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Tests are REQUIRED. Follow TDD strictly: write tests first, confirm they fail for the expected reason, then implement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5, US6, US7)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Rust backend workspace, React frontend, tooling, configuration, and documented architectural decisions.

- [X] T001 Create Rust backend Cargo workspace with crates in `backend/Cargo.toml`, `backend/crates/walkmanager-domain/`, `backend/crates/walkmanager-application/`, `backend/crates/walkmanager-infrastructure/`, and `backend/crates/walkmanager-api/`
- [X] T002 Create Rust crate test folders in `backend/crates/walkmanager-domain/tests/`, `backend/crates/walkmanager-application/tests/`, `backend/crates/walkmanager-infrastructure/tests/`, and `backend/crates/walkmanager-api/tests/`
- [X] T003 Create React TypeScript frontend project structure in `frontend/src/app/`, `frontend/src/features/`, `frontend/src/shared/`, and `frontend/tests/`
- [X] T004 Configure Rust workspace dependency boundaries and shared lint settings in `backend/Cargo.toml`
- [X] T005 [P] Add API crate dependencies for Axum, Tokio, WebSockets, JWT/auth middleware, OpenAPI generation, tracing, and serde in `backend/crates/walkmanager-api/Cargo.toml`
- [X] T006 [P] Add Application crate dependencies for async traits, validation helpers, time handling, domain error mapping, and serde contracts in `backend/crates/walkmanager-application/Cargo.toml`
- [X] T007 [P] Add Infrastructure crate dependencies for SeaORM, SeaORM migrations, PostgreSQL/PostGIS support, SeaweedFS integration, DragonflyDB integration, and background workers in `backend/crates/walkmanager-infrastructure/Cargo.toml`
- [X] T008 [P] Add Domain crate dependencies for time/value-object support and test utilities in `backend/crates/walkmanager-domain/Cargo.toml`
- [X] T009 [P] Add frontend dependency packages for React, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, Zod, and WebSocket client utilities in `frontend/package.json`
- [X] T010 [P] Configure Rust formatting, clippy, and deny-warning policy in `backend/rustfmt.toml` and `backend/.cargo/config.toml`
- [X] T011 [P] Configure frontend linting, formatting, and TypeScript rules in `frontend/eslint.config.js`, `frontend/prettier.config.js`, and `frontend/tsconfig.json`
- [X] T012 [P] Create local environment template for PostgreSQL, DragonflyDB, SeaweedFS, JWT keys, and notification providers in `.env.example`
- [X] T013 [P] Record architecture and dependency decisions for Rust, Axum, Tokio, SeaORM, WebSockets, PostGIS, SeaweedFS, DragonflyDB, and frontend libraries in `docs/adr/001-dog-walking-platform.md`
- [X] T014 Create development quickstart alignment notes in `README.md` referencing `specs/001-dog-walking-platform/quickstart.md`

---

- [X] T029 Implement DragonflyDB cache, rate-limit, notification coordination, and presence abstractions in `backend/crates/walkmanager-infrastructure/src/caching/`
- [X] T030 Implement notification abstraction and dispatch queue contract in `backend/crates/walkmanager-application/src/notifications/`
- [X] T032 Implement OpenAPI generation configuration with bearer auth and standardized error schemas in `backend/crates/walkmanager-api/src/openapi/`
- [X] T034 Implement shared frontend validation, error display, responsive layout for 375px, 768px, and 1024px viewports, and API client utilities in `frontend/src/shared/`)
- [X] T035 Update OpenAPI source contract alignment comments in `specs/001-dog-walking-platform/contracts/openapi.yaml`
- [X] T042 Create UserAccount, Role, Cuil, Email, PhoneNumber, and account status value objects in `backend/crates/walkmanager-domain/src/identity/`

**Checkpoint**: Foundation complete. User story implementation can now begin in priority order or in parallel by story.

---
## Phase 4: User Story 2 - Publish Walker Services (Priority: P1)

**Goal**: Dog walkers can manage public profile details, pricing, working hours, availability, service zone, photos, and simultaneous dog capacity.

## Phase 5: User Story 3 - Search and Request a Walk (Priority: P1)

**Goal**: Customers can search walkers by filters, see nearest-first results, and create Pending bookings for valid future time ranges without over-capacity conflicts.

**Independent Test**: Search as a customer, apply filters, verify nearest-first ordering, and create a Pending booking for an available walker.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T070 [P] [US3] Add OpenAPI contract tests for `/walkers/search` and `/bookings` creation in `backend/crates/walkmanager-api/tests/search_and_booking_contract.rs`
- [ ] T071 [P] [US3] Add Rust domain tests for booking creation, valid time ranges, dog count, and Pending status in `backend/crates/walkmanager-domain/tests/booking_creation.rs`
- [ ] T072 [P] [US3] Add Rust application tests for availability validation against schedules, accepted bookings, dog capacity, and neighborhood proximity in `backend/crates/walkmanager-application/tests/availability_validation.rs`
- [ ] T073 [P] [US3] Add SeaORM/PostGIS integration tests for distance filtering and nearest-first ordering in `backend/crates/walkmanager-infrastructure/tests/walker_search_query.rs`
- [ ] T074 [P] [US3] Add frontend feature tests for search filters and booking request form in `frontend/tests/features/search/SearchAndBookingRequest.test.tsx`

### Implementation for User Story 3

- [ ] T075 [P] [US3] Create Booking aggregate, BookingStatus enum, dog-count rules, and time-range value object in `backend/crates/walkmanager-domain/src/bookings/`
- [ ] T076 [P] [US3] Create search query contracts and booking creation command contracts in `backend/crates/walkmanager-application/src/search/contracts.rs` and `backend/crates/walkmanager-application/src/bookings/contracts.rs`
- [ ] T077 [US3] Implement availability validation service using schedules, accepted bookings, capacity, and timezone normalization in `backend/crates/walkmanager-application/src/bookings/availability.rs`
- [ ] T078 [US3] Implement walker search use case with pagination, filters, PostGIS distance, and suspended-walker exclusion hook in `backend/crates/walkmanager-application/src/search/`
- [ ] T079 [US3] Implement create pending booking use case with past-date, invalid-range, and over-capacity domain errors in `backend/crates/walkmanager-application/src/bookings/create_booking.rs`
- [ ] T080 [US3] Implement SeaORM entities and migrations for Booking and geospatial indexes in `backend/crates/walkmanager-infrastructure/src/persistence/entities/bookings.rs` and `backend/crates/walkmanager-infrastructure/migration/src/`
- [ ] T081 [US3] Implement PostGIS walker search repository in `backend/crates/walkmanager-infrastructure/src/persistence/repositories/walker_search_repository.rs`
- [ ] T082 [US3] Implement Axum search and booking creation routes with OpenAPI metadata in `backend/crates/walkmanager-api/src/http/search.rs` and `backend/crates/walkmanager-api/src/http/bookings.rs`
- [ ] T083 [US3] Implement search API client, filter schemas, and booking request schemas in `frontend/src/features/search/api/`
- [ ] T084 [US3] Implement customer search page, filter controls, result list, and nearest-distance display in `frontend/src/features/search/`
- [ ] T085 [US3] Implement booking request form and Pending booking feedback in `frontend/src/features/bookings/components/CreateBookingRequestForm.tsx`

**Checkpoint**: User Story 3 completes the core marketplace P1 flow from identity to profile to search and request.

---

## Phase 6: User Story 4 - Confirm and Manage Requests (Priority: P2)

**Goal**: Walkers can accept, reject, cancel, and later report service results while capacity and state transitions remain concurrency-safe.

**Independent Test**: Create a Pending booking, accept it as the walker, reject another request, prevent concurrent over-capacity acceptance, expire stale requests, and assign one valid Service Result.

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T086 [P] [US4] Add OpenAPI contract tests for booking detail, accept, reject, cancel, result report, confirm, and dispute routes in `backend/crates/walkmanager-api/tests/booking_lifecycle_contract.rs`
- [ ] T087 [P] [US4] Add Rust domain tests for Booking Status transitions and terminal-state rules in `backend/crates/walkmanager-domain/tests/booking_status_transitions.rs`
- [ ] T088 [P] [US4] Add Rust domain tests for Service Result assignment, final-result uniqueness, and Disputed transition rules in `backend/crates/walkmanager-domain/tests/service_result_transitions.rs`
- [ ] T089 [P] [US4] Add SeaORM integration tests for concurrent booking acceptance and capacity preservation in `backend/crates/walkmanager-infrastructure/tests/concurrent_booking_acceptance.rs`
- [ ] T090 [P] [US4] Add Rust application tests for pending booking expiration processing and result auto-finalization in `backend/crates/walkmanager-application/tests/booking_lifecycle_workers.rs`
- [ ] T091 [P] [US4] Add frontend feature tests for walker service dashboard and customer booking detail views in `frontend/tests/features/bookings/BookingLifecycle.test.tsx`

### Implementation for User Story 4

- [ ] T092 [P] [US4] Extend Booking aggregate with accept, reject, cancel, expire, report result, confirm result, and dispute result methods in `backend/crates/walkmanager-domain/src/bookings/booking.rs`
- [ ] T093 [P] [US4] Create lifecycle command contracts in `backend/crates/walkmanager-application/src/bookings/contracts.rs`
- [ ] T094 [US4] Implement atomic accept booking use case with transaction-bound availability recheck in `backend/crates/walkmanager-application/src/bookings/accept_booking.rs`
- [ ] T095 [US4] Implement reject, cancel, and expire booking use cases in `backend/crates/walkmanager-application/src/bookings/lifecycle.rs`
- [ ] T096 [US4] Implement service result report, confirmation period, confirm, dispute, and auto-finalization use cases in `backend/crates/walkmanager-application/src/bookings/service_results.rs`
- [ ] T097 [US4] Implement SeaORM transaction-bound booking repository in `backend/crates/walkmanager-infrastructure/src/persistence/repositories/booking_repository.rs`
- [ ] T098 [US4] Implement pending expiration and result auto-finalization Tokio workers in `backend/crates/walkmanager-infrastructure/src/workers/booking_lifecycle_worker.rs`
- [ ] T099 [US4] Implement Axum booking lifecycle and service result routes with OpenAPI metadata in `backend/crates/walkmanager-api/src/http/bookings.rs` and `backend/crates/walkmanager-api/src/http/service_results.rs`
- [ ] T100 [US4] Implement booking update notification generation in `backend/crates/walkmanager-application/src/notifications/booking_notification_service.rs`
- [ ] T101 [US4] Implement walker service dashboard API client and schemas in `frontend/src/features/bookings/api/`
- [ ] T102 [US4] Implement walker service dashboard, request actions, result reporting, and customer dispute UI in `frontend/src/features/bookings/`

**Checkpoint**: User Story 4 is independently testable for operational booking management.

---

## Phase 7: User Story 5 - Chat and Notifications (Priority: P2)

**Goal**: Customers and walkers can use public inquiry chats before booking and booking-specific chats after request creation, with persisted history, WebSocket updates, presence, and notifications.

**Independent Test**: Start an inquiry chat, create a booking, exchange booking chat messages, verify histories stay separate, receive WebSocket updates, and verify notification records/preferences.

### Tests for User Story 5

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T103 [P] [US5] Add OpenAPI contract tests for inquiry chat creation, inquiry chat messages, booking chat messages, notifications, and notification preference routes in `backend/crates/walkmanager-api/tests/chat_notification_contract.rs`
- [ ] T104 [P] [US5] Add Rust domain tests for public inquiry chat, booking chat, participants, and notification entities in `backend/crates/walkmanager-domain/tests/chat_conversation.rs`
- [ ] T105 [P] [US5] Add Rust application tests for chat access validation, inquiry rate limiting, historical booking chat access, and notification preferences in `backend/crates/walkmanager-application/tests/chat_notification_use_cases.rs`
- [ ] T106 [P] [US5] Add WebSocket authorization, message delivery (within 5 seconds), booking update, notification delivery, and presence tests in `backend/crates/walkmanager-api/tests/websocket_realtime.rs`
- [ ] T107 [P] [US5] Add SeaORM repository tests for chats, messages, notifications, and preferences in `backend/crates/walkmanager-infrastructure/tests/chat_notification_repository.rs`
- [ ] T108 [P] [US5] Add frontend feature tests for inquiry chat, booking chat, WebSocket updates, presence, notification preferences, and notification list UI in `frontend/tests/features/chats/ChatAndNotifications.test.tsx`

### Implementation for User Story 5

- [ ] T109 [P] [US5] Create PublicInquiryChat, BookingChatConversation, ChatMessage, Notification, and NotificationPreference domain models in `backend/crates/walkmanager-domain/src/chats/` and `backend/crates/walkmanager-domain/src/notifications/`
- [ ] T110 [P] [US5] Create chat, WebSocket event, and notification command/query contracts in `backend/crates/walkmanager-application/src/chats/contracts.rs` and `backend/crates/walkmanager-application/src/notifications/contracts.rs`
- [ ] T111 [US5] Implement public inquiry chat creation, ignore/archive behavior, and DragonflyDB-backed rate limiting use cases in `backend/crates/walkmanager-application/src/chats/public_inquiry.rs`; rate limits are deployment-configuration-driven (out of scope for this spec)
- [ ] T112 [US5] Implement booking chat creation hook and historical access rules in `backend/crates/walkmanager-application/src/chats/booking_chats.rs`
- [ ] T113 [US5] Implement send/list message use cases with participant and restriction validation in `backend/crates/walkmanager-application/src/chats/messages.rs`
- [ ] T114 [US5] Implement notification preference, notification persistence, and dispatch preparation in `backend/crates/walkmanager-application/src/notifications/`
- [ ] T115 [US5] Implement SeaORM entities and migrations for chats, messages, notifications, and notification preferences in `backend/crates/walkmanager-infrastructure/src/persistence/entities/chats.rs` and `backend/crates/walkmanager-infrastructure/migration/src/`
- [ ] T116 [US5] Implement DragonflyDB rate limiter, notification coordination, and presence support in `backend/crates/walkmanager-infrastructure/src/caching/realtime_cache.rs`
- [ ] T117 [US5] Implement Axum WebSocket handlers for chats, booking updates, notifications, and presence in `backend/crates/walkmanager-api/src/websockets/`
- [ ] T118 [US5] Implement Axum chat and notification HTTP routes with OpenAPI metadata in `backend/crates/walkmanager-api/src/http/chats.rs` and `backend/crates/walkmanager-api/src/http/notifications.rs`
- [ ] T119 [US5] Implement frontend WebSocket client utilities for real-time updates within 5 seconds in `frontend/src/shared/realtime/`
- [ ] T120 [US5] Implement inquiry chat, booking chat, notification preference settings, presence indicators, and notification UI in `frontend/src/features/chats/` and `frontend/src/features/notifications/`

**Checkpoint**: User Story 5 is independently testable for real-time communication and notification workflows.

---

## Phase 8: User Story 6 - Complete Service Reviews (Priority: P3)

**Goal**: Customers can submit moderated ratings and reviews only for bookings with eligible final Service Results, and walkers cannot reply.

**Independent Test**: Assign Successful or Failed result, submit review, approve it through moderation, and confirm ineligible bookings cannot receive public reviews.

### Tests for User Story 6

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T121 [P] [US6] Add OpenAPI contract tests for review submission, public walker review display, and review moderation approve/reject routes in `backend/crates/walkmanager-api/tests/review_contract.rs`
- [ ] T122 [P] [US6] Add Rust domain tests for review eligibility by Booking Status and Service Result in `backend/crates/walkmanager-domain/tests/review_eligibility.rs`
- [ ] T123 [P] [US6] Add Rust application tests for moderation-required review submission and publication rules in `backend/crates/walkmanager-application/tests/review_moderation.rs`
- [ ] T124 [P] [US6] Add Rust validation tests for rating and comment input in `backend/crates/walkmanager-application/tests/review_validation.rs`
- [ ] T125 [P] [US6] Add SeaORM repository tests for Review persistence and public review query filtering in `backend/crates/walkmanager-infrastructure/tests/review_repository.rs`
- [ ] T126 [P] [US6] Add frontend feature tests for review submission, rating display, and blocked review states in `frontend/tests/features/reviews/Reviews.test.tsx`

### Implementation for User Story 6

- [ ] T127 [P] [US6] Create Review domain model and moderation status value object in `backend/crates/walkmanager-domain/src/reviews/`
- [ ] T128 [P] [US6] Create review command/query contracts and public review summary contracts in `backend/crates/walkmanager-application/src/reviews/contracts.rs`
- [ ] T129 [US6] Implement review eligibility and submit-for-moderation use cases in `backend/crates/walkmanager-application/src/reviews/`
- [ ] T130 [US6] Implement review approval/rejection use cases in `backend/crates/walkmanager-application/src/moderation/reviews.rs`
- [ ] T131 [US6] Implement SeaORM entities and migrations for Review in `backend/crates/walkmanager-infrastructure/src/persistence/entities/reviews.rs` and `backend/crates/walkmanager-infrastructure/migration/src/`
- [ ] T132 [US6] Implement Axum review and moderation review routes with OpenAPI metadata in `backend/crates/walkmanager-api/src/http/reviews.rs` and `backend/crates/walkmanager-api/src/http/moderation.rs`
- [ ] T133 [US6] Extend walker public profile query with approved reviews and rating summary in `backend/crates/walkmanager-application/src/profiles/public_walker_profile.rs`
- [ ] T134 [US6] Implement review API client and schemas in `frontend/src/features/reviews/api/`
- [ ] T135 [US6] Implement rating display, review submission, and moderation pending states in `frontend/src/features/reviews/`
- [ ] T136 [US6] Ensure walker UI exposes no review reply action in `frontend/src/features/walker-profile/pages/PublicWalkerProfilePage.tsx`

**Checkpoint**: User Story 6 is independently testable for review eligibility and moderation.

---

## Phase 9: User Story 7 - Track Reliability and Incidents (Priority: P3)

**Goal**: The platform records reliability incidents and lets Moderators manage reports, disputes, restrictions, visibility reductions, and temporary suspensions.

**Independent Test**: Record incidents for both roles, apply restriction thresholds, resolve a dispute as Moderator, verify suspended walkers are hidden from search, and verify restricted accounts lose booking or messaging access.

### Tests for User Story 7

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T137 [P] [US7] Add Rust domain tests for incident severity, restriction types, Moderator work items, and active restriction effects in `backend/crates/walkmanager-domain/tests/moderation_incident_restriction.rs`
- [ ] T138 [P] [US7] Add Rust application tests for incident recording from no-shows, cancellations, disputes, failures, and repeated rejections in `backend/crates/walkmanager-application/tests/incident_recording.rs`
- [ ] T139 [P] [US7] Add Rust application tests for transparent restriction threshold rules and Moderator dispute resolution in `backend/crates/walkmanager-application/tests/moderation_rules.rs`
- [ ] T140 [P] [US7] Add SeaORM/PostGIS integration tests proving suspended walkers are excluded from search in `backend/crates/walkmanager-infrastructure/tests/suspended_walker_search.rs`
- [ ] T141 [P] [US7] Add Rust API authorization tests for restricted account booking/messaging limits and Moderator-only routes in `backend/crates/walkmanager-api/tests/restricted_account_access.rs`
- [ ] T142 [P] [US7] Add frontend feature tests for moderation dashboards and restricted account messaging in `frontend/tests/features/moderation/ModerationAndRestrictions.test.tsx`

### Implementation for User Story 7

- [ ] T143 [P] [US7] Create IncidentRecord, AccountRestriction, ModeratorWorkItem, and moderation action domain models in `backend/crates/walkmanager-domain/src/moderation/`
- [ ] T144 [P] [US7] Create incident, restriction, report, dispute, and moderation command/query contracts in `backend/crates/walkmanager-application/src/moderation/contracts.rs`
- [ ] T145 [US7] Implement incident recording service for booking rejections, cancellations, no-shows, disputes, and failures in `backend/crates/walkmanager-application/src/moderation/incidents.rs`
- [ ] T146 [US7] Implement transparent restriction rule evaluator in `backend/crates/walkmanager-application/src/moderation/restrictions.rs`
- [ ] T147 [US7] Implement active restriction authorization checks for booking and messaging use cases in `backend/crates/walkmanager-application/src/moderation/access.rs`
- [ ] T148 [US7] Implement Moderator report management and disputed service resolution use cases in `backend/crates/walkmanager-application/src/moderation/work_items.rs`
- [ ] T149 [US7] Implement suspended walker exclusion in walker search repository in `backend/crates/walkmanager-infrastructure/src/persistence/repositories/walker_search_repository.rs`
- [ ] T150 [US7] Implement SeaORM entities and migrations for IncidentRecord, AccountRestriction, and ModeratorWorkItem in `backend/crates/walkmanager-infrastructure/src/persistence/entities/moderation.rs` and `backend/crates/walkmanager-infrastructure/migration/src/`
- [ ] T151 [US7] Implement Axum moderation routes for incidents, restrictions, suspensions, reports, and dispute resolution with OpenAPI metadata in `backend/crates/walkmanager-api/src/http/moderation.rs`
- [ ] T152 [US7] Implement restriction-aware Axum route guards and WebSocket guards in `backend/crates/walkmanager-api/src/middleware/restrictions.rs` and `backend/crates/walkmanager-api/src/websockets/restrictions.rs`
- [ ] T153 [US7] Implement moderation API client and schemas in `frontend/src/features/moderation/api/`
- [ ] T154 [US7] Implement moderation dashboard, report list, dispute resolution, incident list, and account restriction UI in `frontend/src/features/moderation/`
- [ ] T155 [US7] Implement restricted/suspended account user messaging in `frontend/src/shared/ui/RestrictionNotice.tsx`

**Checkpoint**: User Story 7 is independently testable for internal reliability and moderation behavior.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, documentation, performance, and complete quality gate execution across all stories.

- [ ] T156 [P] Update OpenAPI contract coverage for all implemented HTTP routes and WebSocket event schemas in `specs/001-dog-walking-platform/contracts/openapi.yaml`
- [ ] T157 [P] Update implementation notes and runbook details in `docs/operations/dog-walking-platform.md`
- [ ] T158 [P] Add end-to-end smoke scenarios for registration, profile, search, booking, chat, review, and moderation in `frontend/tests/e2e/dog-walking-platform.spec.ts`
- [ ] T159 Review SeaORM/PostgreSQL queries for pagination, spatial index use, transaction boundaries, and N+1 avoidance in `backend/crates/walkmanager-infrastructure/src/persistence/`
- [ ] T160 Review security handling for CUIL, identity documents, chats, bookings, incidents, secrets, JWT signing, WebSockets, and exception logs in `backend/crates/walkmanager-api/src/` and `backend/crates/walkmanager-infrastructure/src/`
- [ ] T161 Run Rust formatting, clippy, and backend tests using commands documented in `specs/001-dog-walking-platform/quickstart.md`
- [ ] T162 Run frontend linting, tests, and build using commands documented in `specs/001-dog-walking-platform/quickstart.md`
- [ ] T163 Run OpenAPI and contract validation and synchronize generated API docs with `backend/crates/walkmanager-api/src/openapi/`
- [ ] T164 Complete checklist review and record findings in `specs/001-dog-walking-platform/checklists/booking-domain.md`
- [ ] T165 Update ADRs for any architecture or dependency changes discovered during implementation in `docs/adr/001-dog-walking-platform.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 10)**: Depends on all selected user stories being complete.

### User Story Dependencies

- **US1 Register and Manage Identity (P1)**: Starts after Foundation and is the MVP.
- **US2 Publish Walker Services (P1)**: Depends on US1 authentication and walker identity.
- **US3 Search and Request a Walk (P1)**: Depends on US1 identities and US2 walker profiles/schedules.
- **US4 Confirm and Manage Requests (P2)**: Depends on US3 bookings.
- **US5 Chat and Notifications (P2)**: Depends on US1 identities and can integrate with US3/US4 booking contexts.
- **US6 Complete Service Reviews (P3)**: Depends on US4 Service Results.
- **US7 Track Reliability and Incidents (P3)**: Depends on US4 lifecycle events and integrates with US3 search and US5 messaging restrictions.

### Within Each User Story

- Tests MUST be written and fail before implementation.
- Domain models before application services.
- Application contracts and validators before Axum route wiring.
- Application services before API handlers, WebSocket adapters, and frontend integration.
- SeaORM entities/migrations before repository integration tests pass.
- Story checkpoint must pass before moving to the next priority in a sequential implementation.

---

## Parallel Opportunities

- Setup tasks T005 through T013 can run in parallel after T001 through T004 are established.
- Foundational tests T015 through T020 can run in parallel before foundational implementation.
- Within each story, contract/domain/application/repository/frontend tests marked `[P]` can be written in parallel.
- US5 can begin after US1 and foundational WebSocket/auth support are ready, while US4 continues, by using booking chat contract stubs until booking endpoints are finalized.
- US6 review UI and contract tests can be prepared while US4 Service Result implementation is underway.
- US7 incident and restriction domain tests can be prepared while US4 lifecycle events are being implemented.

## Parallel Example: User Story 3

```text
Task: "T070 [US3] Add OpenAPI contract tests for search and booking creation"
Task: "T071 [US3] Add Rust domain tests for booking creation"
Task: "T072 [US3] Add Rust application tests for availability validation"
Task: "T073 [US3] Add SeaORM/PostGIS integration tests for walker search"
Task: "T074 [US3] Add frontend feature tests for search and booking request"
```

## Parallel Example: User Story 5

```text
Task: "T103 [US5] Add OpenAPI contract tests for chat and notification endpoints"
Task: "T104 [US5] Add Rust domain tests for chat participant rules"
Task: "T106 [US5] Add WebSocket authorization and delivery tests"
Task: "T107 [US5] Add SeaORM repository tests for chat and notifications"
Task: "T108 [US5] Add frontend feature tests for chat and notifications"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 Setup.
2. Complete Phase 2 Foundation.
3. Complete Phase 3 US1 registration/authentication.
4. Stop and validate US1 independently.

### Marketplace Core Increment

1. Complete US2 walker profile management.
2. Complete US3 customer search and pending booking creation.
3. Validate the P1 marketplace path from registration to booking request.

### Operations Increment

1. Complete US4 booking lifecycle and service results.
2. Complete US5 chats, WebSockets, presence, and notifications.
3. Validate booking management and communication independently.

### Trust & Safety Increment

1. Complete US6 moderated reviews.
2. Complete US7 reliability, incidents, restrictions, suspensions, reports, and disputes.
3. Run full quality gates and checklist review.

## Notes

- `[P]` tasks use different files or can proceed before dependent implementation exists.
- Every implementation task should be preceded by its failing test task.
- PostgreSQL remains authoritative for booking consistency; DragonflyDB must not decide capacity.
- Keep OpenAPI, Rust contract types, validation functions, frontend schemas, and WebSocket event schemas aligned as tasks are completed.
