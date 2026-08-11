use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterWalker {
    pub full_name: String,
    pub email: String,
    pub phone_number: String,
    pub cuil: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterCustomer {
    pub full_name: String,
    pub email: String,
    pub phone_number: String,
    pub cuil: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Login {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthToken {
    pub token: String,
    pub expires_in: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ContactUpdate {
    pub email: Option<String>,
    pub phone_number: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserId(pub Uuid);

impl UserId {
    pub fn new(id: Uuid) -> Self {
        Self(id)
    }

    pub fn value(&self) -> &Uuid {
        &self.0
    }
}