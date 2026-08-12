use crate::moderation::contracts::ApplyRestrictionCommand;

// TODO: Evaluate transparent threshold rules: 3 cancellations = BookingLimited, 5 = Suspended
// REVIEW: Expiration time default = 7 days for temporary suspensions

pub struct RestrictionEvaluatorUseCase;

impl RestrictionEvaluatorUseCase {
    pub async fn apply_restriction(&self, command: ApplyRestrictionCommand) -> Result<uuid::Uuid, String> {
        if command.reason.trim().is_empty() {
            return Err("Restriction reason must be specified".to_string());
        }
        Ok(uuid::Uuid::new_v4())
    }
}
