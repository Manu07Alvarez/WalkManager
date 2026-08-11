use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,
    pub role: String,
    pub exp: usize,
    pub iat: usize,
}

pub fn create_token(user_id: Uuid, role: &str, secret: &str, expires_in: i64) -> Result<String, String> {
    let now = chrono::Utc::now();
    let claims = Claims {
        sub: user_id,
        role: role.to_string(),
        exp: (now + chrono::Duration::seconds(expires_in)).timestamp() as usize,
        iat: now.timestamp() as usize,
    };
    encode(&Header::new(Algorithm::HS256), &claims, &EncodingKey::from_secret(secret.as_bytes()))
        .map_err(|e| e.to_string())
}

pub fn verify_token(token: &str, secret: &str) -> Result<Claims, String> {
    decode::<Claims>(token, &DecodingKey::from_secret(secret.as_bytes()), &Validation::new(Algorithm::HS256))
        .map(|data| data.claims)
        .map_err(|e| e.to_string())
}