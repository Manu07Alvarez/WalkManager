use async_trait::async_trait;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

use super::{NotificationDispatcher, NotificationMessage, NotificationError};

pub struct InMemoryDispatcher {
    queues: Arc<RwLock<HashMap<String, Vec<NotificationMessage>>>>,
}

impl InMemoryDispatcher {
    pub fn new() -> Self {
        Self {
            queues: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

#[async_trait]
impl NotificationDispatcher for InMemoryDispatcher {
    async fn send(&self, user_id: &str, message: NotificationMessage) -> Result<(), NotificationError> {
        let mut queues = self.queues.write().await;
        queues
            .entry(user_id.to_string())
            .or_insert_with(Vec::new)
            .push(message);
        Ok(())
    }
}

impl Default for InMemoryDispatcher {
    fn default() -> Self {
        Self::new()
    }
}