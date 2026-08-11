pub mod contracts;
pub mod use_cases;
pub mod repositories;

pub use contracts::*;
pub use use_cases::{ContactUpdateCommand, IdentityError, IdentityUseCase, LoginQuery};

#[async_trait::async_trait]
pub trait UserAccountRepository: Send + Sync {
    async fn find_by_email(&self, email: &str) -> Result<Option<UserAccountData>, RepositoryError>;
    async fn find_by_cuil(&self, cuil: &str) -> Result<Option<UserAccountData>, RepositoryError>;
    async fn save(&self, data: &UserAccountData) -> Result<(), RepositoryError>;
    async fn update_contact(&self, user_id: uuid::Uuid, email: Option<String>, phone: Option<String>) -> Result<UserAccountData, RepositoryError>;
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct UserAccountData {
    pub id: uuid::Uuid,
    pub role: String,
    pub email: String,
    pub phone_number: String,
    pub full_name: String,
    pub cuil: String,
    pub status: String,
    pub password_hash: Option<String>,
}

#[derive(Debug, thiserror::Error)]
pub enum RepositoryError {
    #[error("User not found")]
    NotFound,
    #[error("CUIL already exists")]
    CuilExists,
    #[error("Email already exists")]
    EmailExists,
    #[error("Database error: {0}")]
    Database(String),
}

#[async_trait::async_trait]
pub trait PasswordHasher: Send + Sync {
    fn hash(&self, password: &str) -> Result<String, PasswordError>;
    fn verify(&self, password: &str, hash: &str) -> Result<bool, PasswordError>;
}

#[derive(Debug, thiserror::Error)]
pub enum PasswordError {
    #[error("Hashing failed")]
    HashingFailed,
    #[error("Verification failed")]
    VerificationFailed,
}
