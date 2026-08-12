use crate::moderation::contracts::RecordIncidentCommand;

// TODO: Trigger automatic restriction evaluator upon recording new reliability incident
// REVIEW: Store transparent audit trail for recorded incidents

pub struct RecordIncidentUseCase;

impl RecordIncidentUseCase {
    pub async fn execute(&self, command: RecordIncidentCommand) -> Result<uuid::Uuid, String> {
        if command.description.trim().is_empty() {
            return Err("Incident description cannot be empty".to_string());
        }
        Ok(uuid::Uuid::new_v4())
    }
}
