use async_trait::async_trait;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use std::time::{Duration, Instant};

use super::{Cache, CacheError};

pub type RateLimitResult = Result<RateLimitInfo, RateLimitError>;

#[derive(Debug, Clone)]
pub struct RateLimitInfo {
    pub limit: u32,
    pub remaining: u32,
    pub reset_at: Instant,
}

#[derive(Debug, Clone, thiserror::Error)]
pub enum RateLimitError {
    #[error("Rate limit exceeded")]
    Exceeded,
}

pub struct InMemoryRateLimiter {
    limits: Arc<RwLock<HashMap<String, (u32, Instant)>>>,
}

impl InMemoryRateLimiter {
    pub fn new() -> Self {
        Self {
            limits: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

#[async_trait]
impl Cache for InMemoryRateLimiter {
    async fn get(&self, key: &str) -> Result<Option<String>, CacheError> {
        let limits = self.limits.read().await;
        Ok(limits.get(key).map(|(count, _)| count.to_string()))
    }

    async fn set(&self, key: &str, value: &str, ttl: Duration) -> Result<(), CacheError> {
        let mut limits = self.limits.write().await;
        if let Ok(count) = value.parse::<u32>() {
            limits.insert(key.to_string(), (count, Instant::now() + ttl));
        }
        Ok(())
    }

    async fn del(&self, key: &str) -> Result<(), CacheError> {
        let mut limits = self.limits.write().await;
        limits.remove(key);
        Ok(())
    }

    async fn exists(&self, key: &str) -> Result<bool, CacheError> {
        let limits = self.limits.read().await;
        Ok(limits.contains_key(key))
    }
}

impl Default for InMemoryRateLimiter {
    fn default() -> Self {
        Self::new()
    }
}