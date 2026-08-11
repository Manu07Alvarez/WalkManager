use serde::{Deserialize, Serialize};
use std::fmt::Debug;

pub trait DomainError: Debug + std::error::Error {}

pub trait ValueObject: Debug + Clone + PartialEq + Eq + Serialize + for<'de> Deserialize<'de> {}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct TypedId(pub uuid::Uuid);

impl TypedId {
    pub fn new() -> Self {
        Self(uuid::Uuid::new_v4())
    }

    pub fn value(&self) -> &uuid::Uuid {
        &self.0
    }
}

impl Default for TypedId {
    fn default() -> Self {
        Self::new()
    }
}

pub type Result<T> = std::result::Result<T, Box<dyn DomainError + Send + Sync>>;

pub mod error_codes {
    pub const INVALID_CUIL: &str = "INVALID_CUIL";
    pub const CUIL_EXISTS: &str = "CUIL_EXISTS";
    pub const INVALID_ROLE: &str = "INVALID_ROLE";
    pub const UNAUTHORIZED: &str = "UNAUTHORIZED";
    pub const VALIDATION_ERROR: &str = "VALIDATION_ERROR";
}
