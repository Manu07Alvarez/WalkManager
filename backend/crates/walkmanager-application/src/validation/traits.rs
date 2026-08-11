pub trait Validator<T> {
    type Error;

    fn validate(&self, input: &T) -> Result<(), Self::Error>;
}

pub trait DomainValidator<T>: Validator<T> {}

#[derive(Debug, Clone, thiserror::Error)]
pub enum ValidationError {
    #[error("Field '{0}' is required")]
    Required(String),
    #[error("Field '{0}' is invalid: {1}")]
    Invalid(String, String),
    #[error("Value '{0}' is out of range")]
    OutOfRange(String),
}