# Feature Specification: Dog Walking Platform

**Feature Branch**: `001-dog-walking-platform`

**Created**: 2026-05-22

**Status**: Draft

**Input**: User description: "Build a platform that connects dog walkers with customers looking for dog walking services. The system must support dog walkers and customers, registration with CUIL identity data, authentication and authorization, walker profiles, service management, customer search and booking, neighborhood-based distance calculations, chat, notifications, ratings, moderated reviews, responsive UI, persistence, input validation, personal information protection, and booking consistency."

## Clarifications

### Session 2026-05-23

- Q: How should booking capacity, booking lifecycle, service outcomes, chats, reviews, cancellations, incidents, and restrictions behave? -> A: Walkers define simultaneous dog capacity; booking status and service result are independent state systems; public inquiry and booking chats are distinct; reliability incidents drive simple transparent moderation; reviews are allowed only for Successful or Failed final results; availability and acceptance must be concurrency-safe.

### Session 2026-05-29

- Q: What is the role and authority of Moderators? -> A: Moderator is an internal operative role with authority to suspend accounts, manage reports, and resolve service disputes.

### Session 2026-06-04

- Q: How should Moderator accounts and work items be modeled? -> A: Moderator is a UserAccount role without customer or walker profiles; ModeratorWorkItems track reports, disputes, restriction reviews, suspension reviews, and review moderation, and moderators can resolve reports and lift restrictions or suspensions.

### Session 2026-06-05

- Q: What validation and relationship rules apply to UserAccount? -> A: Role is DogWalker, Customer, or Moderator; email, phoneNumber, fullName, and cuil are required; cuil is globally unique; sensitive identity fields are protected from public responses; Moderator accounts are internal operative accounts and do not create DogWalkerProfile or CustomerProfile records.
- Q: What relationships may a UserAccount have? -> A: One DogWalkerProfile or one CustomerProfile when role is DogWalker or Customer; Moderator accounts may have ModeratorWorkItems and moderation actions; many notifications, incident records, and account restrictions per account.
- Q: How should ModeratorWorkItem be modeled? -> A: Fields include id, workItemType, status, subjectUserAccountId, relatedBookingId, relatedReviewId, assignedModeratorUserId, summary, resolutionNotes, createdAt, assignedAt, resolvedAt; assignedModeratorUserId must reference a Moderator UserAccount; work item types include reports, disputed services, restriction reviews, suspension reviews, and review moderation; resolved disputed-service items may replace a Disputed Service Result with a final resolved Service Result.
- Q: Which moderation API capabilities close FR-063? -> A: List moderation reports and work items (`GET /moderation/reports`), resolve a report or work item (`POST /moderation/reports/{workItemId}/resolve`), and lift an active restriction or suspension (`POST /moderation/restrictions/{restrictionId}/lift`).
- Q: What rate limits apply to public inquiry chats? -> A: Rate limits SHALL be deployment-specific configuration and are out of scope for this specification.
- Q: What is the timing requirement for real-time chat updates? -> A: 95% of availability updates shall be reflected in the user interface within 5 seconds of the underlying data change.
- Q: What viewport widths must be supported for responsive UI without horizontal scrolling? -> A: 90% of users shall be able to complete the core flow without horizontal scrolling on supported viewports: 375px, 768px, and 1024px widths.

### Session 2026-08-14

- Q: What libraries and techniques should be used for frontend animations, layout morphing, responsive UI, interactive banners, and dynamic text? -> A: The frontend shall utilize `motion` and `pretext` for animations, layout morphing, responsive UI transitions, interactive banners, and dynamic text rendering.
- Q: What icon library must be used for frontend iconography? -> A: The frontend user interface shall use the Lucide Icons library (`lucide-react`) for all application icons.

### Session 2026-08-15

- Q: How should database migrations, SeaweedFS storage setup, and seeding of >= 100 mock test records for PostgreSQL, SeaweedFS, and DragonflyDB be structured and executed? -> A: Implement SeaORM migration scripts for PostgreSQL/PostGIS schema paired with a dedicated Rust seeder binary (`walkmanager-seed`) that populates >= 100 realistic records across PostgreSQL/PostGIS, uploads avatar images to SeaweedFS, and populates DragonflyDB cache keys.


## User Scenarios & Testing *(mandatory)*

### User Story 1 - Register and Manage Identity (Priority: P1)

Dog walkers and customers create secure accounts with role-specific identity information so they can access the platform according to their permissions.

**Why this priority**: The marketplace cannot operate unless both roles can be reliably identified, authenticated, and authorized.

**Independent Test**: Can be fully tested by registering one dog walker and one customer, signing in as each role, and confirming each sees only role-appropriate features.

**Acceptance Scenarios**:

1. **Given** a new dog walker has full name, email, phone number, CUIL, and an ID/passport style profile photo, **When** they register, **Then** the account is created and the CUIL is stored as a unique identifier.
2. **Given** a new customer has full name, email, phone number, and CUIL, **When** they register, **Then** the account is created and the CUIL is stored as a unique identifier.
3. **Given** a user submits a CUIL already used by another account, **When** registration is attempted, **Then** the system rejects the registration and explains that the identifier is already registered.
4. **Given** an authenticated dog walker, **When** they access customer-only account actions, **Then** access is denied.

---

### User Story 2 - Publish Walker Services (Priority: P1)

Dog walkers create and maintain public profiles, pricing, working hours, available days, service schedules, simultaneous dog capacity, and service zones so customers can evaluate and request their services.

**Why this priority**: Search and booking quality depend on complete, current walker information.

**Independent Test**: Can be fully tested by creating a walker profile with pricing, description, dog preferences, maximum simultaneous dog capacity, working hours, availability, and neighborhood zone, then viewing it as a customer.

**Acceptance Scenarios**:

1. **Given** an authenticated dog walker, **When** they update their public description, dog types, maximum simultaneous dog capacity, price per service, working hours, available days, availability schedule, neighborhood zone, and profile photo, **Then** the public profile reflects the updated information.
2. **Given** a walker has no available service schedule for a requested time, **When** a customer views the walker profile for that time, **Then** the walker is not shown as available for that request.
3. **Given** a walker has customer ratings and approved reviews, **When** a customer views the walker profile, **Then** the profile displays the rating summary and approved review comments.
4. **Given** a walker reduces their maximum simultaneous dog capacity below the number already committed for an accepted booking, **When** the capacity change is saved, **Then** existing accepted bookings remain valid and the walker is notified about the capacity conflict for future scheduling.

---

### User Story 3 - Search and Request a Walk (Priority: P1)

Customers search for dog walkers by neighborhood, distance, availability, price, rating, working hours, and available days, then request a walk for a specific date and time range.

**Why this priority**: This is the core customer value: finding a suitable nearby walker and starting a booking.

**Independent Test**: Can be fully tested by searching from a customer account, applying filters, confirming nearest walkers appear first, and creating a pending service request for one available walker.

**Acceptance Scenarios**:

1. **Given** multiple walkers match a customer's filters, **When** search results are displayed, **Then** walkers are ordered by nearest distance first.
2. **Given** a customer chooses a walker and a valid date/time range, **When** they request service, **Then** the booking is created with Booking Status Pending.
3. **Given** a requested date/time conflicts with the walker's accepted bookings or would exceed the walker's simultaneous dog capacity, **When** a customer submits the request, **Then** the system prevents the overbooking.
4. **Given** a requested date/time falls outside the walker's working hours or available days, **When** a customer submits the request, **Then** the system rejects the request with an availability explanation.
5. **Given** a customer enters a past date or invalid time range, **When** they request a service, **Then** the system rejects the request before creating a booking.

---

### User Story 4 - Confirm and Manage Requests (Priority: P2)

Dog walkers review incoming service requests and accept, reject, cancel, or later report the service result while the booking lifecycle remains separate from the service outcome.

**Why this priority**: Customers need explicit confirmation before relying on a booking, and walkers need control over their commitments.

**Independent Test**: Can be fully tested by creating a pending request, accepting it as the walker, observing the confirmed booking, then creating another overlapping request and verifying it cannot be confirmed.

**Acceptance Scenarios**:

1. **Given** a pending request is still in the future and the walker remains available with enough simultaneous dog capacity, **When** the walker accepts it, **Then** the booking status becomes Accepted and the customer is notified.
2. **Given** a pending request is not suitable, **When** the walker rejects it, **Then** the request is marked rejected and the customer is notified.
3. **Given** a pending request's requested time has passed, **When** the system evaluates pending requests, **Then** the request automatically expires and cannot be accepted.
4. **Given** two customers request overlapping times with the same walker, **When** one acceptance would exceed the walker's capacity, **Then** only an atomic acceptance that preserves capacity may succeed.
5. **Given** an accepted booking reaches its scheduled service time or a service-related incident occurs, **When** the walker reports the result, **Then** exactly one Service Result can be assigned for that accepted booking.
6. **Given** a reported result is within the customer confirmation period, **When** the customer disputes it, **Then** the Service Result transitions to Disputed and moderation review is required.

---

### User Story 5 - Chat and Notifications (Priority: P2)

Customers and walkers communicate through public inquiry chats before booking and booking-specific chats after request creation, and both roles receive notifications about requests, responses, messages, and booking updates through their preferred channel.

**Why this priority**: Coordination and timely updates reduce failed walks and improve trust.

**Independent Test**: Can be fully tested by starting a public inquiry chat, creating a booking request, exchanging booking-specific messages, confirming each conversation remains separately associated with its context, and verifying notifications are generated according to each user's preferred channel.

**Acceptance Scenarios**:

1. **Given** a customer is viewing a walker profile, **When** the customer starts a public inquiry, **Then** a pre-booking conversation can be created unless rate limits or restrictions prevent it.
2. **Given** a customer has created a booking request, **When** either party opens the booking conversation, **Then** chat is available and associated with that specific booking.
3. **Given** a booking expires, is rejected, or is cancelled, **When** either participant returns later, **Then** the booking-related chat remains accessible for historical reference.
4. **Given** a user selects email or phone messaging as their preferred notification channel, **When** a relevant event occurs, **Then** the notification is prepared for that channel.
5. **Given** a walker receives a public inquiry, **When** they choose not to engage, **Then** the inquiry may be ignored or later archived without creating a booking.

---

### User Story 6 - Complete Service Reviews (Priority: P3)

Customers rate and review walkers only after bookings with eligible final service results, and approved reviews become publicly visible on walker profiles.

**Why this priority**: Reviews strengthen marketplace trust, but they depend on completed bookings and moderation.

**Independent Test**: Can be fully tested by assigning a Successful or Failed final service result, submitting a rating and written review as the customer, approving it through moderation, and confirming it appears publicly without any walker reply option.

**Acceptance Scenarios**:

1. **Given** a customer has a booking with final Service Result Successful or Failed, **When** they submit a rating and written review, **Then** the review is stored for moderation before public display.
2. **Given** a review is approved, **When** a customer views the walker profile, **Then** the rating and review are publicly visible with a visual scoring indicator.
3. **Given** a dog walker views a public review, **When** they interact with the review, **Then** no reply action is available.
4. **Given** a booking was cancelled, expired, rejected, marked CustomerAbsent, marked WalkerAbsent, or currently disputed, **When** the customer attempts to review it, **Then** the system prevents a public review and records the relevant reliability signal instead.

---

### User Story 7 - Track Reliability and Incidents (Priority: P3)

The platform tracks no-shows, late cancellations, disputed services, repeated service failures, repeated booking rejections, and moderation outcomes for customers and dog walkers, with Moderators handling reports, restrictions, suspensions, and disputed services.

**Why this priority**: Internal reliability signals protect marketplace trust while avoiding opaque reputation scoring in the initial implementation.

**Independent Test**: Can be fully tested by recording incidents for both roles and verifying a Moderator can review reports, resolve disputes, and apply transparent warnings, temporary restrictions, visibility reduction, booking limits, or suspensions according to simple moderation rules.

**Acceptance Scenarios**:

1. **Given** a user repeatedly causes no-shows, late cancellations, disputed services, repeated failures, or repeated rejections, **When** incident thresholds are met or a Moderator applies an action after review, **Then** the account receives the appropriate warning, temporary restriction, or temporary suspension.
2. **Given** a walker is suspended, **When** customers search for walkers, **Then** that walker does not appear in public search results.
3. **Given** an account is restricted or suspended, **When** it attempts to create bookings, accept bookings, or participate in messaging, **Then** access is reduced or blocked according to the active restriction.
4. **Given** a cancellation is recorded, **When** moderation evaluates severity, **Then** timing, incident frequency, and service completion history are considered.
5. **Given** a service result is disputed, **When** a Moderator resolves the dispute, **Then** the final resolved Service Result is recorded and any reliability or restriction consequences are applied.

### Edge Cases

- A user attempts to register with invalid, incomplete, duplicate, or malformed identity/contact data.
- A dog walker attempts to publish a profile without required service details needed for search and booking.
- A customer searches in a neighborhood where no walkers match the selected filters.
- Distance cannot be calculated for a neighborhood because location reference data is missing or invalid.
- A requested service spans midnight, has an end time before the start time, or uses a date/time in the past.
- A pending request reaches its requested start time without walker confirmation.
- Multiple customers attempt to reserve the same walker for overlapping time ranges at nearly the same moment or beyond the walker's simultaneous dog capacity.
- A chat participant tries to access a conversation for a request they do not belong to.
- A public inquiry chat receives abusive or spam-like activity and must be rate-limited or archived.
- A customer attempts to review a booking that is pending, rejected, expired, cancelled, disputed, no-show related, or otherwise ineligible.
- A review is rejected during moderation and must not appear publicly.
- A suspended walker would otherwise match public search filters.
- A restricted or suspended account attempts to create, accept, cancel, or message about a booking.
- A walker attempts to assign a Service Result before the scheduled service time without a service-related incident.
- A user attempts to assign more than one final Service Result to a booking.
- A disputed Service Result is replaced by moderation with a final resolved result.
- A Moderator attempts to access or modify a report, dispute, restriction, or suspension outside their operative permissions.
- A capacity change conflicts with already accepted bookings.
- Large search result sets require bounded result pages so customers can continue browsing without excessive load.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support Dog Walker and Customer as primary marketplace roles, plus Moderator as an internal operative role, with authentication and authorization for role-specific capabilities.
- **FR-002**: The system MUST allow Dog Walkers to register with full name, email, contact phone number, CUIL, and an ID/passport style profile photo.
- **FR-003**: The system MUST allow Customers to register with full name, email, contact phone number, and CUIL.
- **FR-004**: The system MUST enforce CUIL uniqueness globally across all registered accounts.
- **FR-005**: The system MUST allow Customers to edit their email and contact phone number after registration.
- **FR-006**: The system MUST allow Dog Walkers to create and manage a public profile containing profile photo, public description, usual dog types, maximum simultaneous dog capacity, service pricing, working hours, available days, availability schedules, and service neighborhood/zone.
- **FR-007**: The system MUST provide Dog Walkers with a profile management view and a service management dashboard.
- **FR-008**: The system MUST allow Customers to access a dedicated search interface for available Dog Walkers.
- **FR-009**: The system MUST allow Customers to view walker profiles, ratings, reviews, prices, descriptions, service zones, working hours, available days, and availability.
- **FR-010**: The system MUST allow Customers to filter walkers by neighborhood, distance, availability, price, rating, working hours, and available days.
- **FR-011**: The system MUST calculate neighborhood-based distances in kilometers for walker filtering and result ordering.
- **FR-012**: Search results MUST prioritize nearest matching walkers first after applying selected filters.
- **FR-013**: The system MUST allow Customers to request dog walking services for a specific future date and valid time range.
- **FR-014**: Every new booking request MUST initially have Booking Status Pending.
- **FR-015**: The system MUST allow Dog Walkers to accept or reject incoming service requests.
- **FR-016**: The system MUST validate walker availability before a request can be created or confirmed, considering accepted bookings, simultaneous dog capacity, working hours, available days, availability schedules, neighborhood proximity, and a consistent timezone strategy.
- **FR-017**: The system MUST prevent overlapping accepted bookings that would exceed the walker's simultaneous dog capacity for the same time range.
- **FR-018**: Booking acceptance operations MUST be atomic and concurrency-safe to prevent simultaneous overbooking conflicts.
- **FR-019**: Pending requests MUST automatically expire when the requested service start date/time has passed without confirmation.
- **FR-020**: The system MUST support public inquiry chats initiated by customers before booking, with walkers able to accept, ignore, or allow inactivity archival for those inquiries.
- **FR-021**: The system MUST automatically create or enable booking-specific chats after a booking request is created and keep each booking chat associated with its corresponding booking.
- **FR-022**: Booking-related chats MUST remain accessible for historical reference after booking expiration, rejection, cancellation, or completion.
- **FR-023**: Public inquiry chats MAY be rate-limited to reduce spam and abusive behavior; rate limits are deployment-specific configuration and out of scope for this specification.
- **FR-024**: The chat system MUST support real-time message delivery with 95% of updates reflected in the user interface within 5 seconds of underlying data change, and persistent conversation history.
- **FR-025**: The system MUST notify users about new service requests, request acceptance or rejection, cancellations, incoming chat messages, booking updates, and service result updates.
- **FR-026**: Users MUST be able to select a preferred notification channel of email or phone messaging platform.
- **FR-027**: Booking Status MUST be modeled independently from Service Result.
- **FR-028**: Booking Status MUST support Pending, Accepted, Rejected, Expired, and Cancelled.
- **FR-029**: Service Result MUST support Successful, CustomerAbsent, WalkerAbsent, Failed, and Disputed.
- **FR-030**: Service Results MUST be assigned only to Accepted bookings and only after the scheduled service start time or after a service-related incident prevents normal completion.
- **FR-031**: A booking MUST be considered finalized when it is Rejected, Cancelled, Expired, or has an assigned final Service Result.
- **FR-032**: A booking MUST have no more than one final Service Result.
- **FR-033**: Expired bookings MUST NOT transition back to active states.
- **FR-034**: Dog Walkers MUST be responsible for reporting Service Results after the scheduled service time or qualifying service-related incident.
- **FR-035**: Customers MUST be able to confirm or dispute a reported Service Result during a configurable confirmation period.
- **FR-036**: Reported Service Results MUST become final automatically after the confirmation period if no dispute is submitted.
- **FR-037**: Service Results MAY transition to Disputed during the customer confirmation period.
- **FR-038**: Moderation review MUST be able to replace a Disputed result with a final resolved Service Result.
- **FR-039**: Both Customers and Dog Walkers MUST be able to cancel Accepted bookings before service completion, with optional reason messages for reliability and moderation tracking.
- **FR-040**: The system MUST record no-shows, late cancellations, disputed services, repeated service failures, repeated booking rejections, incident severity levels, and affected role.
- **FR-041**: The system MUST track reliability and service-related incidents for both Customers and Dog Walkers.
- **FR-042**: Accounts MAY receive warnings, reduced booking capabilities, temporary visibility reduction, temporary booking or messaging restrictions, or temporary suspension based on simple transparent moderation rules.
- **FR-043**: Cancellation severity MUST consider cancellation timing, frequency of incidents, and service completion history.
- **FR-044**: Restrictions and suspensions MAY be applied automatically or through moderation review.
- **FR-045**: Suspended walkers MUST NOT appear in public search results.
- **FR-046**: Suspended accounts MUST NOT create, accept, or participate in bookings.
- **FR-047**: Restricted or suspended accounts MAY lose access to booking creation and messaging features according to the active restriction.
- **FR-048**: The initial reliability and moderation model MUST prioritize simple and transparent rules over complex automated reputation scoring.
- **FR-049**: The system MUST allow Customers to leave ratings and written reviews only for bookings with final Service Result Successful or Failed.
- **FR-050**: Bookings that are Cancelled, Expired, Rejected, CustomerAbsent, WalkerAbsent, or Disputed MUST NOT receive public reviews.
- **FR-051**: Disputed results MUST block public reviews until moderation resolution produces an eligible final result.
- **FR-052**: No-show incidents and cancellations MUST affect internal reliability and moderation systems rather than public reviews.
- **FR-053**: Reviews MUST be moderated before becoming publicly visible.
- **FR-054**: Approved ratings and reviews MUST be publicly visible on Dog Walker profiles.
- **FR-055**: Ratings MUST use a visual scoring system such as stars, dog treats, or similar dog-themed indicators.
- **FR-056**: Dog Walkers MUST NOT be able to reply to customer reviews.
- **FR-057**: The system MUST provide responsive user interfaces for desktop and mobile devices, utilizing `motion` and `pretext` for smooth animations, layout morphing, interactive banners, dynamic text, and responsive component transitions, and using the Lucide Icons library (`lucide-react`) for all application iconography.
- **FR-058**: The system MUST persist users, bookings, chats, reviews, schedules, availability data, service results, cancellations, restrictions, suspensions, and incident records.
- **FR-059**: The system MUST validate all external input before processing it.
- **FR-060**: The system MUST protect sensitive personal information from unauthorized viewing or modification.
- **FR-061**: Large result collections, including search results, chats, requests, reviews, and incident histories, MUST support bounded browsing or pagination.
- **FR-062**: Expected domain errors, including invalid identity data, unavailable time ranges, over-capacity bookings, expired requests, unauthorized access, invalid result transitions, restricted account actions, and moderation rejection, MUST be represented explicitly to users or operators as appropriate.
- **FR-063**: Moderators MUST be able to list moderation reports and work items, resolve reports and work items (including disputed services), apply account restrictions and temporary suspensions, and lift active restrictions or suspensions according to moderation rules.
- **FR-064**: Moderator capabilities MUST be restricted to operative moderation functions and MUST NOT grant access to unrelated private customer or walker actions; Moderator UserAccounts MUST NOT create DogWalkerProfile or CustomerProfile records.
- **FR-065**: The system MUST include complete SeaORM database migrations for PostgreSQL/PostGIS schema and provide an executable database seeder (`walkmanager-seed`) capable of populating at least 100 realistic records across PostgreSQL/PostGIS (user accounts, walker profiles, customer profiles, availability schedules, bookings, reviews, and incidents), uploading sample media to SeaweedFS, and warming initial DragonflyDB cache keys for automated testing and development purposes.


### Key Entities *(include if feature involves data)*

- **User Account**: Represents an authenticated person with role (`DogWalker`, `Customer`, or `Moderator`), required full name, email, phone number, and globally unique CUIL, plus account status, notification preference, and protected identity data. Sensitive identity fields MUST NOT appear in public responses. Dog Walker and Customer accounts have exactly one role-specific profile; Moderator accounts are internal operative accounts without Dog Walker Profile or Customer Profile records. One account may have many notifications, incident records, and account restrictions; Moderator accounts may additionally have Moderator Work Items and moderation actions.
- **Dog Walker Profile**: Represents public walker information, including profile photo, description, dog type preferences, maximum simultaneous dog capacity, pricing, working hours, available days, availability schedules, service neighborhood/zone, ratings summary, and approved reviews.
- **Customer Profile**: Represents customer account details that can be used for requests, contact updates, chats, and reviews.
- **Neighborhood/Zone**: Represents a service area used for search, proximity filtering, and distance calculation in kilometers.
- **Availability Schedule**: Represents the times and days a walker can provide services, including recurring working hours and service-specific availability.
- **Booking**: Represents a customer's requested walk with walker, customer, date, time range, dog count, neighborhood context, Booking Status, optional Service Result, lifecycle timestamps, cancellation details, and finalization state.
- **Booking Status**: Represents the operational lifecycle of a booking, with Pending, Accepted, Rejected, Expired, and Cancelled states.
- **Service Result**: Represents the final outcome of the scheduled service, with Successful, CustomerAbsent, WalkerAbsent, Failed, and Disputed states.
- **Public Inquiry Chat**: Represents pre-booking customer-to-walker messages that may be accepted, ignored, rate-limited, or archived after inactivity.
- **Booking Chat Conversation**: Represents booking-linked messages between one customer and one dog walker, including message history, read/delivery state, and the related booking.
- **Notification Preference and Notification**: Represents each user's preferred delivery channel and generated events for requests, chats, and booking updates.
- **Rating and Review**: Represents post-service customer feedback with rating value, written comment, moderation status, public visibility state, and related eligible booking.
- **Incident Record**: Represents no-shows, late cancellations, disputed services, repeated failures, repeated rejections, severity, affected role, reason notes, and moderation impact.
- **Account Restriction**: Represents warnings, reduced booking capabilities, temporary visibility reduction, messaging limitations, or temporary suspensions applied to a user account.
- **Moderator Work Item**: Represents an operative moderation item handled by a Moderator, with fields for work item type, status, subject user account, related booking or review, assigned moderator, summary, resolution notes, and lifecycle timestamps (`createdAt`, `assignedAt`, `resolvedAt`). Work item types include reports, disputed services, restriction reviews, suspension reviews, and review moderation. `assignedModeratorUserId` MUST reference a Moderator UserAccount when assigned. Resolved disputed-service work items MAY replace a Disputed Service Result with a final resolved Service Result.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% of new Dog Walkers and Customers can complete registration and first sign-in in under 3 minutes using valid information.
- **SC-002**: 95% of customer searches with active matching walkers display filtered results in under 2 seconds.
- **SC-003**: 100% of search result sets with multiple matching walkers order results by nearest calculated distance before lower-priority ordering factors.
- **SC-004**: 100% of accepted bookings prevent overlapping commitments that exceed the walker's simultaneous dog capacity.
- **SC-005**: 99% of pending requests whose requested start time has passed are marked expired within 15 minutes.
- **SC-006**: 95% of chat messages become visible to the other participant within 5 seconds during normal operation.
- **SC-007**: 100% of public walker reviews are associated with bookings whose final Service Result is Successful or Failed and approved through moderation before appearing publicly.
- **SC-008**: 90% of users can complete the core flow from search to pending request on supported viewports (375px, 768px, and 1024px widths) without horizontal scrolling or blocked actions.
- **SC-009**: No user can access another user's protected identity information, private chats, or booking management actions without authorization during role-based access testing.
- **SC-010**: 100% of accepted bookings have at most one final Service Result, and results cannot be assigned to non-accepted bookings.
- **SC-011**: 100% of suspended walkers are excluded from public search results while the suspension is active.
- **SC-012**: 95% of eligible reported Service Results become final automatically within the configured confirmation period when no dispute is submitted.
- **SC-013**: 100% of no-shows, late cancellations, disputed services, repeated failures, and repeated rejections create internal reliability records rather than public reviews when the booking is ineligible for review.

## Assumptions

- Authentication uses standard email-based account credentials unless a later feature specifies external identity providers.
- CUIL is treated as sensitive personal information and is not displayed publicly.
- Dog walker profile photos are public, while ID/passport style identity photos are protected and visible only to authorized operational workflows.
- Neighborhood and zone reference data is available to support kilometer-based distance calculations without requiring an interactive map.
- Phone messaging notifications are represented as a generic phone messaging channel in this iteration; exact provider selection is deferred.
- Refunds, penalties, and rescheduling rules are outside this iteration; cancellations, cancellation reasons, and reliability impacts are included.
- Moderation workflow exists for determining whether submitted reviews are approved or rejected before public visibility.
- Moderation workflow exists for disputed Service Results and account restrictions or suspensions.
- Moderator is an internal operative role rather than a primary marketplace role; moderator-facing capabilities are limited to report management, dispute resolution, and restriction or suspension actions.
- The Service Result confirmation period is configurable and will be set during planning or operations.
- All scheduling operations use one consistent timezone strategy across search, booking creation, expiration, cancellation, and result reporting.
- Capacity changes apply prospectively and do not invalidate already accepted bookings.
