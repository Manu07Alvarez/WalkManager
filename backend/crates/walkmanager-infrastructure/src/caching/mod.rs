use async_trait::async_trait;
use std::time::Duration;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum CacheError {
    #[error("Cache connection failed: {0}")]
    ConnectionFailed(String),
    #[error("Cache key not found: {0}")]
    NotFound(String),
}

#[async_trait]
pub trait Cache: Send + Sync {
    async fn get(&self, key: &str) -> Result<Option<String>, CacheError>;
    async fn set(&self, key: &str, value: &str, ttl: Duration) -> Result<(), CacheError>;
    async fn del(&self, key: &str) -> Result<(), CacheError>;
    async fn exists(&self, key: &str) -> Result<bool, CacheError>;
}

pub mod rate_limit;
pub mod presence;
pub mod notifications;
pub mod realtime_cache;