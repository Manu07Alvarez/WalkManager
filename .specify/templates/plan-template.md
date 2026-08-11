# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [.NET 8 C# backend, React frontend or NEEDS CLARIFICATION]

**Primary Dependencies**: [FluentValidation, OpenAPI tooling, PostgreSQL client/ORM, React libraries or NEEDS CLARIFICATION]

**Storage**: [PostgreSQL or N/A]

**Testing**: [Backend/frontend test frameworks; TDD tests must be written first or NEEDS CLARIFICATION]

**Target Platform**: [e.g., Linux server, browser, Kubernetes or NEEDS CLARIFICATION]

**Project Type**: [web application, backend API, frontend app, library or NEEDS CLARIFICATION]

**Performance Goals**: [domain-specific, e.g., <200ms p95 for key endpoints or NEEDS CLARIFICATION]

**Constraints**: [validation, OpenAPI, standardized errors, logging, security, pagination, N+1 avoidance or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., expected users, entities, endpoints, screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Library-first**: Core behavior is isolated in independently testable library/application code.
- **TDD**: Tests are planned before implementation and include failing-first validation.
- **Backend architecture**: .NET 8 C# uses Clean Architecture boundaries and DTOs at process/API boundaries.
- **Frontend architecture**: React code is organized by feature with shared code extracted only when justified.
- **Validation**: All external input is validated; backend validation uses FluentValidation.
- **API contract**: Public endpoints have OpenAPI documentation and standardized error responses.
- **Domain errors**: Expected domain failures are represented explicitly.
- **Data access**: PostgreSQL usage avoids N+1 queries and paginates large collections.
- **Security and operations**: Secrets, password hashing, asymmetric JWT signing, and exception logging are addressed.
- **Dependency discipline**: New dependencies and architectural decisions are justified and recorded.
- **Quality automation**: Formatting, linting, and full test execution are part of the merge gate.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
|-- plan.md              # This file (/speckit-plan command output)
|-- research.md          # Phase 0 output (/speckit-plan command)
|-- data-model.md        # Phase 1 output (/speckit-plan command)
|-- quickstart.md        # Phase 1 output (/speckit-plan command)
|-- contracts/           # Phase 1 output (/speckit-plan command)
`-- tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused areas and expand the chosen structure with
  real paths.
-->

```text
backend/
|-- src/
|   |-- Domain/
|   |-- Application/
|   |-- Infrastructure/
|   `-- Api/
`-- tests/

frontend/
|-- src/
|   |-- features/
|   |-- shared/
|   `-- app/
`-- tests/
```

**Structure Decision**: [Document the selected structure and reference the real directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., extra abstraction] | [current need] | [why framework-native solution is insufficient] |
| [e.g., new dependency] | [specific problem] | [why existing platform/library capability is insufficient] |
