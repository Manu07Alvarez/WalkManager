<!--
Sync Impact Report
Version change: unversioned template -> 1.0.0
Modified principles:
- Placeholder principles -> I. Library-First Design
- Placeholder principles -> II. Test-First Delivery
- Placeholder principles -> III. Clean Architecture and Feature-Based Frontend
- Placeholder principles -> IV. Validated, Documented, Standardized APIs
- Placeholder principles -> V. Secure, Observable, and Efficient Data Access
Added sections:
- Technology Standards
- Development Workflow and Quality Gates
Removed sections:
- Placeholder SECTION_2_NAME
- Placeholder SECTION_3_NAME
Templates requiring updates:
- [updated] .specify/templates/plan-template.md
- [updated] .specify/templates/spec-template.md
- [updated] .specify/templates/tasks-template.md
- [updated] .specify/templates/checklist-template.md
- [pending] .specify/templates/commands/*.md not present
Follow-up TODOs:
- None
-->
# WalkManager Constitution

## Core Principles

### I. Library-First Design
Every feature MUST be designed around reusable, independently testable library code
before delivery through an API, UI, worker, or integration shell. Business behavior
MUST live in cohesive domain/application units with clear contracts, not in
controllers, UI components, or infrastructure glue. Framework-native solutions are
preferred over unnecessary abstractions, and every new dependency MUST be justified
by a concrete capability, maintenance, security, or interoperability need.

Rationale: Library-first design keeps core behavior portable, testable, and easier
to evolve without coupling product decisions to delivery mechanisms.

### II. Test-First Delivery
TDD is mandatory and non-negotiable. Tests MUST be written before implementation,
MUST fail for the expected reason before production code is added, and MUST pass
after implementation and refactoring. Unit, integration, contract, validation, and
security-sensitive tests MUST be added according to the risk and scope of each
change. All tests MUST pass before merging.

Rationale: Test-first delivery turns requirements into executable contracts and
prevents regressions from being discovered late.

### III. Clean Architecture and Feature-Based Frontend
Backend code MUST use Rust with Clean Architecture boundaries: Domain,
Application, Infrastructure, and API layers. Data crossing process or API
boundaries MUST use DTOs or explicit request/response contract types. Domain
errors MUST be represented explicitly rather than hidden in generic errors,
panics, or ambiguous option values.

Frontend code MUST use React and a feature-based architecture. UI, state, API
client code, and tests for a user-facing capability SHOULD be colocated by feature
unless shared reuse is proven. Object-oriented patterns SHOULD be used where they
model domain behavior or reduce complexity; they MUST NOT introduce ceremony that
obscures simple workflows.

Rationale: Clear boundaries protect domain behavior from framework churn while
feature-based UI organization keeps user-facing work discoverable and cohesive.

### IV. Validated, Documented, Standardized APIs
AAll external input MUST be validated before use. Backend validation MUST be
explicit, centralized at application/API boundaries, and covered by tests.
All public endpoints MUST be documented with OpenAPI and kept in
sync with implementation and tests. APIs MUST return standardized error responses,
including explicit domain errors and validation failures. Large collections MUST
use pagination.

Rationale: Validated and documented API contracts make integrations safer,
debuggable, and predictable for clients.

### V. Secure, Observable, and Efficient Data Access
PostgreSQL is the system database. Database queries MUST avoid N+1 access patterns
and MUST be reviewed for collection size, pagination, and transaction boundaries.
Unhandled exceptions MUST be logged without exposing secrets. Secrets MUST be
stored only in environment variables or Kubernetes Secrets. Passwords MUST be
hashed with an accepted password hashing algorithm. JWT tokens MUST be signed using
asymmetric keys.

Rationale: Data access, security, and observability failures create production
risk; the system must make safe behavior the default.

## Technology Standards

The backend technology baseline is Rust. Backend HTTP APIs use Axum, async
execution uses Tokio, persistence uses PostgreSQL with SeaORM, schema migrations
use SeaORM migrations, and real-time communication uses native WebSockets.
API documentation uses OpenAPI, persistence uses PostgreSQL, and architecture
follows Clean Architecture with explicit boundary contract types. The frontend
technology baseline is React with feature-based architecture.

Architectural decisions MUST be recorded in ADRs or an equivalent project decision
log whenever a choice affects architecture, dependencies, persistence, security,
public contracts, or long-term maintainability. Redundant generated files,
temporary artifacts, build outputs, local secrets, and environment-specific files
MUST be excluded through `.gitignore`.

## Development Workflow and Quality Gates

Every feature plan MUST pass a constitution check before research and again after
design. The check MUST verify library-first design, TDD coverage, architecture
boundaries, validation, OpenAPI coverage, standardized errors, logging, security,
pagination, and N+1 avoidance where applicable.

Implementation tasks MUST include failing tests before production code. Code
formatting and linting MUST be enforced automatically for backend and frontend
code. A change is mergeable only when tests, formatting, linting, and contract
documentation checks pass.

## Governance

This constitution supersedes conflicting project practices, templates, and ad hoc
instructions. Amendments MUST update this file, include a Sync Impact Report, and
propagate any changed requirements to Spec Kit templates and runtime guidance.

Versioning follows semantic versioning:
- MAJOR for incompatible governance changes or removal/redefinition of principles.
- MINOR for new principles, new required sections, or materially expanded rules.
- PATCH for clarifications, wording fixes, or non-semantic refinements.

Compliance review is required for every feature plan and pull request. Any
intentional violation MUST be documented in the plan's Complexity Tracking section
with the reason, rejected simpler alternative, and mitigation.

**Version**: 1.0.0 | **Ratified**: 2026-05-21 | **Last Amended**: 2026-05-21
