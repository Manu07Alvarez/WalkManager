use axum::{http::StatusCode, routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Mutex;
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

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub error: String,
}

#[derive(Clone)]
struct StoredUser {
    password: String,
    user: UserDto,
}

static REGISTERED_USERS: Mutex<Option<HashMap<String, StoredUser>>> = Mutex::new(None);

fn get_or_init_users() -> HashMap<String, StoredUser> {
    let mut guard = REGISTERED_USERS.lock().unwrap();
    if guard.is_none() {
        let mut map = HashMap::new();
        map.insert(
            "walker_1@walkmanager.dev".to_string(),
            StoredUser {
                password: "Password123!".to_string(),
                user: UserDto {
                    id: "31d83b9c-a6f1-4fc0-92c6-4cfc5b18c654".to_string(),
                    full_name: "Lucas González (Paseador)".to_string(),
                    email: "walker_1@walkmanager.dev".to_string(),
                    role: "DogWalker".to_string(),
                    status: "Active".to_string(),
                },
            },
        );
        map.insert(
            "customer_1@walkmanager.dev".to_string(),
            StoredUser {
                password: "Password123!".to_string(),
                user: UserDto {
                    id: "41d83b9c-a6f1-4fc0-92c6-4cfc5b18c655".to_string(),
                    full_name: "Carlos Pérez (Cliente)".to_string(),
                    email: "customer_1@walkmanager.dev".to_string(),
                    role: "Customer".to_string(),
                    status: "Active".to_string(),
                },
            },
        );
        map.insert(
            "mod_1@walkmanager.dev".to_string(),
            StoredUser {
                password: "Password123!".to_string(),
                user: UserDto {
                    id: "51d83b9c-a6f1-4fc0-92c6-4cfc5b18c656".to_string(),
                    full_name: "Moderador WalkManager".to_string(),
                    email: "mod_1@walkmanager.dev".to_string(),
                    role: "Moderator".to_string(),
                    status: "Active".to_string(),
                },
            },
        );
        *guard = Some(map);
    }
    guard.as_ref().unwrap().clone()
}

fn save_user(email: String, password: String, user: UserDto) {
    let mut guard = REGISTERED_USERS.lock().unwrap();
    if guard.is_none() {
        drop(guard);
        get_or_init_users();
        guard = REGISTERED_USERS.lock().unwrap();
    }
    if let Some(map) = guard.as_mut() {
        map.insert(email, StoredUser { password, user });
    }
}

async fn register_walker(
    Json(payload): Json<RegisterWalkerRequest>,
) -> Result<Json<AuthResponse>, (StatusCode, Json<ErrorResponse>)> {
    if payload.password.trim().len() < 8 {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: "La contraseña debe tener al menos 8 caracteres".to_string(),
            }),
        ));
    }

    let user_id = Uuid::new_v4().to_string();
    let name = if payload.full_name.trim().is_empty() {
        "Paseador Verificado".to_string()
    } else {
        payload.full_name
    };

    let user = UserDto {
        id: user_id.clone(),
        full_name: name,
        email: payload.email.clone(),
        role: "DogWalker".to_string(),
        status: "Active".to_string(),
    };

    save_user(payload.email.to_lowercase(), payload.password, user.clone());

    Ok(Json(AuthResponse {
        access_token: format!("jwt-token-{}", user_id),
        token_type: "Bearer".to_string(),
        user,
    }))
}

async fn register_customer(
    Json(payload): Json<RegisterCustomerRequest>,
) -> Result<Json<AuthResponse>, (StatusCode, Json<ErrorResponse>)> {
    if payload.password.trim().len() < 8 {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse {
                error: "La contraseña debe tener al menos 8 caracteres".to_string(),
            }),
        ));
    }

    let user_id = Uuid::new_v4().to_string();
    let name = if payload.full_name.trim().is_empty() {
        "Cliente".to_string()
    } else {
        payload.full_name
    };

    let user = UserDto {
        id: user_id.clone(),
        full_name: name,
        email: payload.email.clone(),
        role: "Customer".to_string(),
        status: "Active".to_string(),
    };

    save_user(payload.email.to_lowercase(), payload.password, user.clone());

    Ok(Json(AuthResponse {
        access_token: format!("jwt-token-{}", user_id),
        token_type: "Bearer".to_string(),
        user,
    }))
}

async fn login(
    Json(payload): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, (StatusCode, Json<ErrorResponse>)> {
    if payload.password.trim().len() < 8 {
        return Err((
            StatusCode::UNAUTHORIZED,
            Json(ErrorResponse {
                error: "Credenciales inválidas. La contraseña debe tener al menos 8 caracteres.".to_string(),
            }),
        ));
    }

    let email_lower = payload.email.trim().to_lowercase();
    let users_map = get_or_init_users();

    if let Some(stored) = users_map.get(&email_lower) {
        // 🔒 STRICT Password Verification
        if stored.password != payload.password {
            return Err((
                StatusCode::UNAUTHORIZED,
                Json(ErrorResponse {
                    error: "Credenciales inválidas. La contraseña ingresada es incorrecta.".to_string(),
                }),
            ));
        }

        return Ok(Json(AuthResponse {
            access_token: format!("jwt-token-{}", stored.user.id),
            token_type: "Bearer".to_string(),
            user: stored.user.clone(),
        }));
    }

    // 🔒 If user is dynamically signing in, require password == "Password123!"
    if payload.password != "Password123!" {
        return Err((
            StatusCode::UNAUTHORIZED,
            Json(ErrorResponse {
                error: "Credenciales inválidas. Email o contraseña incorrectos.".to_string(),
            }),
        ));
    }

    let user_id = Uuid::new_v4().to_string();
    let (role, full_name) = if email_lower.contains("walker") {
        ("DogWalker".to_string(), "Lucas González (Paseador)".to_string())
    } else if email_lower.contains("mod") || email_lower.contains("admin") {
        ("Moderator".to_string(), "Moderador WalkManager".to_string())
    } else {
        ("Customer".to_string(), "Carlos Pérez (Cliente)".to_string())
    };

    let user = UserDto {
        id: user_id.clone(),
        full_name,
        email: payload.email.clone(),
        role,
        status: "Active".to_string(),
    };

    save_user(email_lower, payload.password, user.clone());

    Ok(Json(AuthResponse {
        access_token: format!("jwt-token-{}", user_id),
        token_type: "Bearer".to_string(),
        user,
    }))
}

pub fn auth_routes() -> Router {
    Router::new()
        .route("/auth/register/walker", post(register_walker))
        .route("/auth/register/customer", post(register_customer))
        .route("/auth/login", post(login))
}
