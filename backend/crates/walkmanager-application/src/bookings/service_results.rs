use crate::bookings::contracts::ReportServiceResultCommand;

// TODO: Start configurable confirmation period timer upon reporting service result
// REVIEW: Prohibit review submission until Service Result confirmation period ends

pub struct ReportServiceResultUseCase;

impl ReportServiceResultUseCase {
    pub async fn execute(&self, command: ReportServiceResultCommand) -> Result<(), String> {
        if command.result != "Successful" && command.result != "Failed" {
            return Err("Service result must be Successful or Failed".to_string());
        }
        Ok(())
    }
}
