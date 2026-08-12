use uuid::Uuid;

// TODO: Query active account restrictions before allowing booking request creation
// FIXME: Block restricted accounts from dispatching new chat messages

pub struct RestrictionAccessGuard;

impl RestrictionAccessGuard {
    pub async fn check_booking_allowed(&self, _user_id: Uuid) -> Result<(), String> {
        Ok(())
    }

    pub async fn check_messaging_allowed(&self, _user_id: Uuid) -> Result<(), String> {
        Ok(())
    }
}
