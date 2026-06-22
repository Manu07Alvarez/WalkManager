use async_trait::async_trait;
use std::collections::HashSet;
use std::sync::Arc;
use tokio::sync::RwLock;
use std::time::Duration;

use super::{Cache, CacheError};

pub struct PresenceRegistry {
    online_users: Arc<RwLock<HashSet<String>>>,
}

impl PresenceRegistry {
    pub fn new() -> Self {
        Self {
            online_users: Arc::new(RwLock::new(HashSet::new())),
        }
    }

    pub async fn mark_online(&self, user_id: String) {
        let mut online = self.online_users.write().await;
        online.insert(user_id);
    }

    pub async fn mark_offline(&self, user_id: &str) {
        let mut online = self.online_users.write().await;
        online.remove(user_id);
    }

    pub async fn is_online(&self, user_id: &str) -> bool {
        let online = self.online_users.read().await;
        online.contains(user_id)
    }
}

impl Default for PresenceRegistry {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Cache for PresenceRegistry {
    async fn get(&self, key: &str) -> Result<Option<String>, CacheError> {
        let online = self.online_users.read().await;
        Ok(if online.contains(key) {
            Some("online".to_string())
        } else {
            None
        })
    }

    async fn set(&self, key: &str, value: &str, _ttl: Duration) -> Result<(), CacheError> {
        let mut online = self.online_users.write().await;
        if value == "online" {
            online.insert(key.to_string());
        }
        Ok(())
    }

    async fn del(&self, key: &str) -> Result<(), CacheError> {
        let mut online = self.online_users.write().await;
        online.remove(key);
        Ok(())
    }

    async fn exists(&self, key: &str) -> Result<bool, CacheError> {
        Ok(self.is_online(key).await)
    }
}