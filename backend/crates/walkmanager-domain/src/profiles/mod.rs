use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CustomerProfile {
    pub user_id: Uuid,
    pub payment_methods: Vec<PaymentMethod>,
}

impl CustomerProfile {
    pub fn new(user_id: Uuid) -> Self {
        Self {
            user_id,
            payment_methods: Vec::new(),
        }
    }

    pub fn add_payment_method(&mut self, method: PaymentMethod) -> Result<(), ProfileError> {
        if self.payment_methods.len() >= 4 {
            return Err(ProfileError::MaxPaymentMethodsExceeded);
        }
        self.payment_methods.push(method);
        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaymentMethod {
    pub id: Uuid,
    pub r#type: PaymentMethodType,
    pub details: serde_json::Value,
    pub is_default: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum PaymentMethodType {
    CreditCard,
    DebitCard,
    BankTransfer,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DogWalkerProfile {
    pub user_id: Uuid,
    pub public_description: String,
    pub usual_dog_types: Vec<String>,
    pub max_simultaneous_dogs: u32,
    pub service_price: f64,
    pub service_zone_id: Uuid,
    pub identity_photo_url: Option<String>,
}

impl DogWalkerProfile {
    pub fn new(user_id: Uuid, service_zone_id: Uuid) -> Self {
        Self {
            user_id,
            public_description: String::new(),
            usual_dog_types: Vec::new(),
            max_simultaneous_dogs: 1,
            service_price: 0.0,
            service_zone_id,
            identity_photo_url: None,
        }
    }

    pub fn update_description(&mut self, description: String) {
        self.public_description = description;
    }

    pub fn update_dog_types(&mut self, types: Vec<String>) {
        self.usual_dog_types = types;
    }

    pub fn set_capacity(&mut self, capacity: u32) -> Result<(), ProfileError> {
        if capacity < 1 {
            return Err(ProfileError::InvalidCapacity);
        }
        self.max_simultaneous_dogs = capacity;
        Ok(())
    }

    pub fn update_price(&mut self, price: f64) -> Result<(), ProfileError> {
        if price < 0.0 {
            return Err(ProfileError::InvalidPrice);
        }
        self.service_price = price;
        Ok(())
    }
}

#[derive(Debug, Clone, thiserror::Error)]
pub enum ProfileError {
    #[error("Maximum payment methods exceeded (4)")]
    MaxPaymentMethodsExceeded,
    #[error("Invalid capacity: must be at least 1")]
    InvalidCapacity,
    #[error("Invalid price: must be non-negative")]
    InvalidPrice,
}
