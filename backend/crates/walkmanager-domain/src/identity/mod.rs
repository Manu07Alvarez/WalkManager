use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum Role {
    DogWalker,
    Customer,
    Moderator,
}

impl Role {
    pub fn as_str(&self) -> &'static str {
        match self {
            Role::DogWalker => "DogWalker",
            Role::Customer => "Customer",
            Role::Moderator => "Moderator",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Cuil(String);

impl Cuil {
    pub fn new(value: String) -> Result<Self, &'static str> {
        if value.len() != 13 || !value.chars().nth(2) == Some('-') || !value.chars().nth(11) == Some('-') {
            return Err("CUIL must be in format XX-XXXXXXXX-X");
        }
        Ok(Self(value))
    }

    pub fn value(&self) -> &str {
        &self.0
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Email(String);

impl Email {
    pub fn new(value: String) -> Result<Self, &'static str> {
        if !value.contains('@') {
            return Err("Invalid email format");
        }
        Ok(Self(value))
    }

    pub fn value(&self) -> &str {
        &self.0
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PhoneNumber(String);

impl PhoneNumber {
    pub fn new(value: String) -> Result<Self, &'static str> {
        if value.len() < 10 {
            return Err("Phone number too short");
        }
        Ok(Self(value))
    }

    pub fn value(&self) -> &str {
        &self.0
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum AccountStatus {
    Active,
    Suspended,
    Restricted,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserAccount {
    pub id: Uuid,
    pub role: Role,
    pub email: Email,
    pub phone_number: PhoneNumber,
    pub full_name: String,
    pub cuil: Cuil,
    pub status: AccountStatus,
}

impl UserAccount {
    pub fn new(email: Email, phone: PhoneNumber, name: String, cuil: Cuil, role: Role) -> Self {
        Self {
            id: Uuid::new_v4(),
            role,
            email,
            phone_number: phone,
            full_name: name,
            cuil,
            status: AccountStatus::Active,
        }
    }
}