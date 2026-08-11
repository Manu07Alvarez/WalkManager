use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};

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

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub access_token: String,
    pub token_type: String,
}

async fn register_walker(Json(_payload): Json<RegisterWalkerRequest>) -> Json<AuthResponse> {
    Json(AuthResponse {
        access_token: "jwt-token-placeholder".to_string(),
        token_type: "Bearer".to_string(),
    })
}

async fn register_customer(Json(_payload): Json<RegisterCustomerRequest>) -> Json<AuthResponse> {
    Json(AuthResponse {
        access_token: "jwt-token-placeholder".to_string(),
        token_type: "Bearer".to_string(),
    })
}

async fn login(Json(_payload): Json<LoginRequest>) -> Json<AuthResponse> {
    Json(AuthResponse {
        access_token: "jwt-token-placeholder".to_string(),
        token_type: "Bearer".to_string(),
    })
}

pub fn auth_routes() -> Router {
    Router::new()
        .route("/auth/register/walker", post(register_walker))
        .route("/auth/register/customer", post(register_customer))
        .route("/auth/login", post(login))
}

