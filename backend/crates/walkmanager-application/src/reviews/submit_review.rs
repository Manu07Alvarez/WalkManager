use crate::reviews::contracts::{ReviewResponse, SubmitReviewCommand};

// TODO: Validate that target booking has Completed status and final Service Result
// FIXME: Reject review submission if a review already exists for this booking ID

pub struct SubmitReviewUseCase;

impl SubmitReviewUseCase {
    pub async fn execute(&self, command: SubmitReviewCommand) -> Result<ReviewResponse, String> {
        if command.rating < 1 || command.rating > 5 {
            return Err("Rating score must be between 1 and 5".to_string());
        }

        Ok(ReviewResponse {
            id: uuid::Uuid::new_v4(),
            booking_id: command.booking_id,
            customer_id: command.customer_id,
            walker_id: uuid::Uuid::nil(),
            rating: command.rating,
            comment: command.comment,
            moderation_status: "Pending".to_string(),
            created_at: chrono::Utc::now().to_rfc3339(),
        })
    }
}
