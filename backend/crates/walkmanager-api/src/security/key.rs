#[derive(Debug, Clone)]
pub struct JwtConfig {
    pub secret: String,
    pub expires_in_seconds: i64,
}

impl JwtConfig {
    pub fn new(secret: &str, expires_in_seconds: i64) -> Self {
        Self {
            secret: secret.to_string(),
            expires_in_seconds,
        }
    }
}

impl Default for JwtConfig {
    fn default() -> Self {
        Self::new("dev-secret", 3600)
    }
}