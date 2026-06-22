use crate::identity::{contracts::*, UserAccountData, UserRepositoryError};
use async_trait::async_trait;
use uuid::Uuid;

pub struct RegisterWalker {
    pub full_name: String,
    pub email: String,
    pub phone_number: String,
    pub cuil: String,
    pub password: String,
}

pub struct RegisterCustomer {
    pub full_name: String,
    pub email: String,
    pub phone_number: String,
    pub cuil: String,
    pub password: String,
}

pub struct LoginQuery {
    pub email: String,
    pub password: String,
}

pub struct ContactUpdateCommand {
    pub user_id: Uuid,
    pub email: Option<String>,
    pub phone_number: Option<String>,
}

#[async_trait]
pub trait IdentityUseCase: Send + Sync {
    async fn register_walker(&self, cmd: RegisterWalker) -> Result<AuthToken, IdentityError>;
    async fn register_customer(&self, cmd: RegisterCustomer) -> Result<AuthToken, IdentityError>;
    async fn login(&self, query: LoginQuery) -> Result<AuthToken, IdentityError>;
    async fn update_contact(&self, cmd: ContactUpdateCommand) -> Result<UserAccountData, IdentityError>;
}

#[derive(Debug, thiserror::Error)]
pub enum IdentityError {
    #[error("Validation failed: {0}")]
    Validation(String),
    #[error("CUIL already registered")]
    CuilExists,
    #[error("Invalid credentials")]
    InvalidCredentials,
    #[error("User not found")]
    UserNotFound,
    #[error("Internal error: {0}")]
    Internal(String),
}