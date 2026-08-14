use async_trait::async_trait;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use std::time::Duration;

use super::{Cache, CacheError};

pub struct NotificationQueue {
    pending: Arc<RwLock<HashMap<String, Vec<NotificationMessage>>>>,
}

impl NotificationQueue {
    pub fn new() -> Self {
        Self {
            pending: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    pub async fn enqueue(&self, user_id: String, message: NotificationMessage) {
        let mut pending = self.pending.write().await;
        pending
            .entry(user_id)
            .or_insert_with(Vec::new)
            .push(message);
    }

    pub async fn dequeue(&self, user_id: &str) -> Option<Vec<NotificationMessage>> {
        let mut pending = self.pending.write().await;
        pending.remove(user_id)
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct NotificationMessage {
    pub id: String,
    pub r#type: String,
    pub payload: serde_json::Value,
    pub timestamp: i64,
}

impl Default for NotificationQueue {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Cache for NotificationQueue {
    async fn get(&self, key: &str) -> Result<Option<String>, CacheError> {
        let pending = self.pending.read().await;
        Ok(pending.get(key).map(|_| "pending".to_string()))
    }

    async fn set(&self, _key: &str, _value: &str, _ttl: Duration) -> Result<(), CacheError> {
        Ok(())
    }

    async fn del(&self, key: &str) -> Result<(), CacheError> {
        let mut pending = self.pending.write().await;
        pending.remove(key);
        Ok(())
    }

    async fn exists(&self, key: &str) -> Result<bool, CacheError> {
        let pending = self.pending.read().await;
        Ok(pending.contains_key(key))
    }
}