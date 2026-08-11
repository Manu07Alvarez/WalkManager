# Data Model: Dog Walking Platform

## UserAccount

Represents an authenticated platform user.

**Fields**: `id`, `role`, `fullName`, `email`, `phoneNumber`, `cuil`, `passwordHash`, `accountStatus`, `notificationPreference`, `createdAt`, `updatedAt`.

**Validation**: `role` is DogWalker, Customer, or Moderator. `email`, `phoneNumber`, `fullName`, and `cuil` are required. `cuil` is globally unique across all accounts. Sensitive identity fields are protected from public responses. Moderator accounts are internal operative accounts and do not create DogWalkerProfile or CustomerProfile records.

**Relationships**: One UserAccount may have one DogWalkerProfile or one CustomerProfile when the role is DogWalker or Customer. Moderator accounts may have ModeratorWorkItems and moderation actions. One UserAccount may have many notifications, incident records, and account restrictions.

## DogWalkerProfile

Represents public and operational walker service details.

**Fields**: `id`, `userAccountId`, `profilePhotoMediaId`, `identityPhotoMediaId`, `publicDescription`, `usualDogTypes`, `maxSimultaneousDogs`, `servicePrice`, `serviceZoneId`, `averageRating`, `reviewCount`, `visibilityStatus`, `createdAt`, `updatedAt`.

**Validation**: `maxSimultaneousDogs` must be positive. `identityPhotoMediaId` is protected. Suspended walkers are excluded from public search. Capacity changes are prospective and do not invalidate accepted bookings.

**Relationships**: Belongs to UserAccount. Has many AvailabilitySchedules, Bookings, PublicInquiryChats, Reviews, and IncidentRecords.

## CustomerProfile

Represents customer-specific platform details.

**Fields**: `id`, `userAccountId`, `createdAt`, `updatedAt`.

**Validation**: Email and phone edits occur through UserAccount validation.

**Relationships**: Belongs to UserAccount. Has many Bookings, PublicInquiryChats, Reviews, and IncidentRecords.

## NeighborhoodZone

Represents a human-readable service area with geospatial reference data.

**Fields**: `id`, `name`, `slug`, `boundary`, `centroid`, `createdAt`, `updatedAt`.

**Validation**: `name` is unique enough for customer selection. Spatial data must be valid for kilometer distance calculations.

**Relationships**: Used by DogWalkerProfile, AvailabilitySchedule, Booking, and search filters.

## AvailabilitySchedule

Represents a walker's available working pattern.

**Fields**: `id`, `walkerProfileId`, `dayOfWeek`, `startTime`, `endTime`, `timezone`, `effectiveFrom`, `effectiveTo`, `isActive`.

**Validation**: `startTime` must be before `endTime`. Schedule comparisons use the platform's consistent timezone strategy. Availability must be considered with accepted bookings and capacity.

**Relationships**: Belongs to DogWalkerProfile.

## Booking

Represents a customer's requested dog walking service.

**Fields**: `id`, `customerProfileId`, `walkerProfileId`, `neighborhoodZoneId`, `scheduledStart`, `scheduledEnd`, `timezone`, `dogCount`, `bookingStatus`, `serviceResult`, `serviceResultReportedBy`, `serviceResultReportedAt`, `serviceResultAutoFinalizesAt`, `cancellationReason`, `cancelledByUserId`, `cancelledAt`, `createdAt`, `updatedAt`, `finalizedAt`.

**Validation**: Bookings cannot be created for past dates or invalid time ranges. `dogCount` must be positive. New bookings start with Booking Status Pending. Service Result can be assigned only when Booking Status is Accepted and timing/incident rules are satisfied. A booking can have at most one final Service Result.

**Relationships**: Belongs to CustomerProfile, DogWalkerProfile, and NeighborhoodZone. Has one BookingChatConversation. May have one Review. May produce IncidentRecords and Notifications.

## BookingStatus

Operational lifecycle state for a Booking.

**Values**: Pending, Accepted, Rejected, Expired, Cancelled.

**Transitions**:

- Pending -> Accepted when walker atomically accepts and availability/capacity still pass.
- Pending -> Rejected when walker rejects.
- Pending -> Expired when scheduled start has passed without confirmation.
- Accepted -> Cancelled before service completion by customer or walker.
- Accepted remains the lifecycle status when a Service Result is assigned.
- Expired cannot transition back to active states.

## ServiceResult

Final outcome state for the scheduled service.

**Values**: Successful, CustomerAbsent, WalkerAbsent, Failed, Disputed.

**Rules**: Results can be assigned only to Accepted bookings. Walkers report results after scheduled service start or after a qualifying service-related incident. Customers may confirm or dispute during the configurable confirmation period. Reported results auto-finalize if no dispute is submitted. Moderation may replace Disputed with a final resolved result.

## PublicInquiryChat

Represents a pre-booking customer-to-walker conversation.

**Fields**: `id`, `customerProfileId`, `walkerProfileId`, `status`, `lastMessageAt`, `archivedAt`, `createdAt`.

**Validation**: May be rate-limited. Restricted or suspended accounts may lose messaging access. Walkers may accept, ignore, or allow inactivity archival.

**Relationships**: Has many ChatMessages. Not tied to a Booking.

## BookingChatConversation

Represents booking-specific conversation history.

**Fields**: `id`, `bookingId`, `createdAt`, `lastMessageAt`, `archivedAt`.

**Validation**: Automatically available after booking request creation. Remains associated with the booking and accessible for historical reference after terminal booking states.

**Relationships**: Belongs to one Booking. Has many ChatMessages.

## ChatMessage

Represents a persisted chat message.

**Fields**: `id`, `conversationType`, `conversationId`, `senderUserId`, `body`, `sentAt`, `readAt`, `deliveryState`.

**Validation**: Sender must be a participant and must not be blocked by account restrictions. Message body is required and externally validated.

## MediaAsset

Represents uploaded media in SeaweedFS.

**Fields**: `id`, `ownerUserId`, `storageKey`, `mediaType`, `accessLevel`, `purpose`, `createdAt`.

**Validation**: `accessLevel` separates public profile photos from protected identity verification images.

## Notification

Represents a notification event and delivery state.

**Fields**: `id`, `recipientUserId`, `type`, `channel`, `payloadSummary`, `status`, `createdAt`, `sentAt`, `failureReason`.

**Validation**: Channel must match user preference or allowed fallback. Sensitive payloads must not expose protected data.

## Review

Represents moderated customer feedback for eligible bookings.

**Fields**: `id`, `bookingId`, `customerProfileId`, `walkerProfileId`, `rating`, `comment`, `moderationStatus`, `createdAt`, `moderatedAt`, `publishedAt`.

**Validation**: Allowed only when final Service Result is Successful or Failed. Blocked for Cancelled, Expired, Rejected, CustomerAbsent, WalkerAbsent, or Disputed bookings. Dog walkers cannot reply.

## IncidentRecord

Represents reliability-relevant events.

**Fields**: `id`, `userAccountId`, `bookingId`, `incidentType`, `severity`, `description`, `source`, `createdAt`, `resolvedAt`.

**Validation**: Supports no-shows, late cancellations, disputed services, repeated failures, repeated rejections, and moderation impacts. Severity considers timing, frequency, and service completion history.

## AccountRestriction

Represents warnings, restrictions, visibility reductions, or suspensions.

**Fields**: `id`, `userAccountId`, `restrictionType`, `reason`, `startsAt`, `endsAt`, `isActive`, `createdBy`, `createdAt`.

**Validation**: Suspended accounts cannot create, accept, or participate in bookings. Suspended walkers are excluded from search. Active restrictions may reduce booking and messaging capabilities.

## ModeratorWorkItem

Represents an operative moderation item handled by a Moderator.

**Fields**: `id`, `workItemType`, `status`, `subjectUserAccountId`, `relatedBookingId`, `relatedReviewId`, `assignedModeratorUserId`, `summary`, `resolutionNotes`, `createdAt`, `assignedAt`, `resolvedAt`.

**Validation**: `assignedModeratorUserId` must reference a UserAccount with role Moderator when assigned. Work items may represent reports, disputed services, restriction reviews, suspension reviews, or review moderation. Resolved disputed service work items may replace a Disputed Service Result with a final resolved Service Result.

**Relationships**: May belong to one subject UserAccount, Booking, Review, and assigned Moderator UserAccount.
