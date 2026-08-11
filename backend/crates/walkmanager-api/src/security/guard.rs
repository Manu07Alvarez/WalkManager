use axum::{
    async_trait,
    extract::FromRequestParts,
    http::request::Parts,
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::auth::verify_token;
use crate::middleware::error_handling::{ErrorDetail, ErrorResponse};

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthContext {
    pub user_id: Uuid,
    pub role: String,
}

#[async_trait]
impl<S> FromRequestParts<S> for AuthContext
where
    S: Send + Sync,
{
    type Rejection = Response;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get("Authorization")
            .and_then(|v| v.to_str().ok())
            .ok_or_else(|| {
                (
                    StatusCode::UNAUTHORIZED,
                    Json(ErrorResponse {
                        error: ErrorDetail {
                            code: "UNAUTHORIZED".to_string(),
                            message: "Missing authorization header".to_string(),
                            details: None,
                        },
                    }),
                )
                    .into_response()
            })?;

        let token = auth_header
            .strip_prefix("Bearer ")
            .ok_or_else(|| {
                (
                    StatusCode::UNAUTHORIZED,
                    Json(ErrorResponse {
                        error: ErrorDetail {
                            code: "UNAUTHORIZED".to_string(),
                            message: "Invalid authorization format".to_string(),
                            details: None,
                        },
                    }),
                )
                    .into_response()
            })?;

        let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "dev-secret".to_string());
        let claims = verify_token(token, &secret).map_err(|_| {
            (
                StatusCode::UNAUTHORIZED,
                Json(ErrorResponse {
                    error: ErrorDetail {
                        code: "UNAUTHORIZED".to_string(),
                        message: "Invalid token".to_string(),
                        details: None,
                    },
                }),
            )
                .into_response()
        })?;

        Ok(AuthContext {
            user_id: claims.sub,
            role: claims.role,
        })
    }
}

pub fn require_role(expected: &str) -> impl Fn(AuthContext) -> Result<AuthContext, Response> {
    let expected = expected.to_string();
    move |ctx| {
        if ctx.role == expected || ctx.role == "Moderator" {
            Ok(ctx)
        } else {
            Err((
                StatusCode::FORBIDDEN,
                Json(ErrorResponse {
                    error: ErrorDetail {
                        code: "FORBIDDEN".to_string(),
                        message: "Insufficient permissions".to_string(),
                        details: None,
                    },
                }),
            )
                .into_response())
        }
    }
}
