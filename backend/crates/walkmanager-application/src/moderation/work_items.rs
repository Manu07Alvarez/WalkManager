use crate::moderation::contracts::ResolveDisputeCommand;

// TODO: Allow Moderators to resolve disputed walk service results with final judgment
// REVIEW: Ensure dispute resolution notifies both customer and walker

pub struct ModeratorWorkItemsUseCase;

impl ModeratorWorkItemsUseCase {
    pub async fn resolve_dispute(&self, command: ResolveDisputeCommand) -> Result<(), String> {
        if command.resolved_result != "Successful" && command.resolved_result != "Failed" {
            return Err("Resolved result must be Successful or Failed".to_string());
        }
        Ok(())
    }
}
