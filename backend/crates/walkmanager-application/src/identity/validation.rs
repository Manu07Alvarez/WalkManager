use crate::identity::use_cases::{IdentityError, RegisterCustomer, RegisterWalker};

pub fn validate_register_walker(cmd: &RegisterWalker) -> Result<(), IdentityError> {
    if cmd.full_name.trim().is_empty() {
        return Err(IdentityError::Validation("Full name cannot be empty".to_string()));
    }
    if !cmd.email.contains('@') {
        return Err(IdentityError::Validation("Invalid email address".to_string()));
    }
    if cmd.password.len() < 8 {
        return Err(IdentityError::Validation("Password must be at least 8 characters".to_string()));
    }
    Ok(())
}

pub fn validate_register_customer(cmd: &RegisterCustomer) -> Result<(), IdentityError> {
    if cmd.full_name.trim().is_empty() {
        return Err(IdentityError::Validation("Full name cannot be empty".to_string()));
    }
    if !cmd.email.contains('@') {
        return Err(IdentityError::Validation("Invalid email address".to_string()));
    }
    if cmd.password.len() < 8 {
        return Err(IdentityError::Validation("Password must be at least 8 characters".to_string()));
    }
    Ok(())
}
