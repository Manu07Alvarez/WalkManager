use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct RegisterWalkerRequest {
    pub full_name: String,
    pub email: String,
    pub phone_number: String,
    pub cuil: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct RegisterCustomerRequest {
    pub full_name: String,
    pub email: String,
    pub phone_number: String,
    pub cuil: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct UserDto {
    pub id: String,
    pub full_name: String,
    pub email: String,
    pub role: String,
    pub status: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub access_token: String,
    pub token_type: String,
    pub user: UserDto,
}

async fn register_walker(Json(payload): Json<RegisterWalkerRequest>) -> Json<AuthResponse> {
    let user_id = Uuid::new_v4().to_string();
    let name = if payload.full_name.trim().is_empty() {
        "Paseador Verificado".to_string()
    } else {
        payload.full_name
    };

    Json(AuthResponse {
        access_token: format!("jwt-token-{}", user_id),
        token_type: "Bearer".to_string(),
        user: UserDto {
            id: user_id,
            full_name: name,
            email: payload.email,
            role: "DogWalker".to_string(),
            status: "Active".to_string(),
        },
    })
}

async fn register_customer(Json(payload): Json<RegisterCustomerRequest>) -> Json<AuthResponse> {
    let user_id = Uuid::new_v4().to_string();
    let name = if payload.full_name.trim().is_empty() {
        "Cliente".to_string()
    } else {
        payload.full_name
    };

    Json(AuthResponse {
        access_token: format!("jwt-token-{}", user_id),
        token_type: "Bearer".to_string(),
        user: UserDto {
            id: user_id,
            full_name: name,
            email: payload.email,
            role: "Customer".to_string(),
            status: "Active".to_string(),
        },
    })
}

async fn login(Json(payload): Json<LoginRequest>) -> Json<AuthResponse> {
    let user_id = Uuid::new_v4().to_string();
    let email_lower = payload.email.to_lowercase();

    let (role, full_name) = if email_lower.contains("walker") {
        ("DogWalker".to_string(), "Lucas González (Paseador)".to_string())
    } else if email_lower.contains("mod") || email_lower.contains("admin") {
        ("Moderator".to_string(), "Moderador WalkManager".to_string())
    } else {
        ("Customer".to_string(), "Carlos Pérez (Cliente)".to_string())
    };

    Json(AuthResponse {
        access_token: format!("jwt-token-{}", user_id),
        token_type: "Bearer".to_string(),
        user: UserDto {
            id: user_id,
            full_name,
            email: payload.email,
            role,
            status: "Active".to_string(),
        },
    })
}

pub fn auth_routes() -> Router {
    Router::new()
        .route("/auth/register/walker", post(register_walker))
        .route("/auth/register/customer", post(register_customer))
        .route("/auth/login", post(login))
}
