---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED. Follow TDD strictly: write tests first, confirm they fail for the expected reason, then implement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/Domain/`, `backend/src/Application/`, `backend/src/Infrastructure/`, `backend/src/Api/`, `backend/tests/`
- **Frontend**: `frontend/src/features/`, `frontend/src/shared/`, `frontend/src/app/`, `frontend/tests/`
- **Documentation**: `docs/`, `specs/[###-feature]/`, `docs/adr/` or project decision log

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  - Constitution gates for TDD, validation, OpenAPI, standardized errors,
    logging, security, pagination, N+1 avoidance, ADRs, formatting, and linting

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize .NET 8 backend and React frontend projects with justified dependencies
- [ ] T003 [P] Configure automatic linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup PostgreSQL schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework with asymmetric JWT signing
- [ ] T006 [P] Setup API routing and middleware structure
- [ ] T007 Create base domain entities and DTO conventions that all stories depend on
- [ ] T008 Configure standardized error responses and explicit domain error handling
- [ ] T009 Setup environment/Kubernetes secret configuration management
- [ ] T010 Configure OpenAPI generation for public endpoints
- [ ] T011 Configure exception logging and security-safe diagnostics

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T012 [P] [US1] Contract test for [endpoint] in backend/tests/contract/[name]
- [ ] T013 [P] [US1] Integration test for [user journey] in backend/tests/integration/[name]
- [ ] T014 [P] [US1] Unit tests for domain/application behavior in backend/tests/unit/[name]
- [ ] T015 [P] [US1] Validation tests for external input in backend/tests/validation/[name]
- [ ] T016 [P] [US1] Frontend feature tests in frontend/tests/[name]

### Implementation for User Story 1

- [ ] T017 [P] [US1] Create domain model in backend/src/Domain/[path]
- [ ] T018 [P] [US1] Create DTOs in backend/src/Application/[path]
- [ ] T019 [US1] Implement application service/use case in backend/src/Application/[path] (depends on T017, T018)
- [ ] T020 [US1] Implement FluentValidation validators in backend/src/Application/[path]
- [ ] T021 [US1] Implement endpoint and OpenAPI metadata in backend/src/Api/[path]
- [ ] T022 [US1] Add standardized error handling and logging
- [ ] T023 [US1] Implement feature UI in frontend/src/features/[feature]

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T024 [P] [US2] Contract test for [endpoint] in backend/tests/contract/[name]
- [ ] T025 [P] [US2] Integration test for [user journey] in backend/tests/integration/[name]
- [ ] T026 [P] [US2] Unit and validation tests for [behavior] in backend/tests/[name]
- [ ] T027 [P] [US2] Frontend feature tests in frontend/tests/[name]

### Implementation for User Story 2

- [ ] T028 [P] [US2] Create domain/application components in backend/src/[layer]/[path]
- [ ] T029 [US2] Implement [endpoint/feature] with DTOs, validation, and OpenAPI metadata
- [ ] T030 [US2] Implement feature UI in frontend/src/features/[feature]
- [ ] T031 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T032 [P] [US3] Contract test for [endpoint] in backend/tests/contract/[name]
- [ ] T033 [P] [US3] Integration test for [user journey] in backend/tests/integration/[name]
- [ ] T034 [P] [US3] Unit and validation tests for [behavior] in backend/tests/[name]
- [ ] T035 [P] [US3] Frontend feature tests in frontend/tests/[name]

### Implementation for User Story 3

- [ ] T036 [P] [US3] Create domain/application components in backend/src/[layer]/[path]
- [ ] T037 [US3] Implement [endpoint/feature] with DTOs, validation, and OpenAPI metadata
- [ ] T038 [US3] Implement feature UI in frontend/src/features/[feature]

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit, integration, and contract tests in tests/
- [ ] TXXX Security hardening
- [ ] TXXX Verify PostgreSQL queries avoid N+1 access patterns and paginate large collections
- [ ] TXXX Update ADRs or decision log for architectural/dependency decisions
- [ ] TXXX Run formatting, linting, and full test suite
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 -> P2 -> P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Domain models before application services
- Application services before endpoints
- DTOs and validators before endpoint wiring
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Contract test for [endpoint] in backend/tests/contract/[name]"
Task: "Integration test for [user journey] in backend/tests/integration/[name]"
Task: "Unit tests for domain/application behavior in backend/tests/unit/[name]"
Task: "Frontend feature tests in frontend/tests/[name]"

# Launch independent model/DTO work for User Story 1 together:
Task: "Create domain model in backend/src/Domain/[path]"
Task: "Create DTOs in backend/src/Application/[path]"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Write failing tests for User Story 1
4. Complete Phase 3: User Story 1
5. **STOP and VALIDATE**: Test User Story 1 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational -> Foundation ready
2. Add User Story 1 -> Test independently -> Deploy/Demo
3. Add User Story 2 -> Test independently -> Deploy/Demo
4. Add User Story 3 -> Test independently -> Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
