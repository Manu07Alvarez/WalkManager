use axum::{
    body::Body,
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
};

// TODO: Intercept incoming request and query active account restrictions from cache
// FIXME: Return 403 Forbidden with restriction notice payload if user is currently suspended

pub async fn restriction_guard_middleware(
    req: Request<Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    // Restriction guard middleware check stub
    Ok(next.run(req).await)
}
