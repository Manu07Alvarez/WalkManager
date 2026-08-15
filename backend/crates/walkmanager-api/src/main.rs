use axum::{routing::get, Json, Router};
use serde_json::{json, Value};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use walkmanager_api::http::{
    accept_booking_handler, auth_routes, cancel_booking_handler, create_booking_handler,
    reject_booking_handler, search_walkers_handler,
};

async fn health_handler() -> Json<Value> {
    Json(json!({ "status": "OK", "service": "walkmanager-api" }))
}

async fn ready_handler() -> Json<Value> {
    Json(json!({ "status": "READY", "database": "connected" }))
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "walkmanager_api=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Permissive CORS for frontend dev server
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let api_v1 = Router::new()
        .merge(auth_routes())
        .route("/walkers/search", get(search_walkers_handler))
        .route("/bookings", axum::routing::post(create_booking_handler))
        .route("/bookings/:id/accept", axum::routing::post(accept_booking_handler))
        .route("/bookings/:id/reject", axum::routing::post(reject_booking_handler))
        .route("/bookings/:id/cancel", axum::routing::post(cancel_booking_handler));

    let app = Router::new()
        .route("/health", get(health_handler))
        .route("/ready", get(ready_handler))
        .nest("/api/v1", api_v1)
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .unwrap_or(8080);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("WalkManager API server listening on {}", addr);
    println!("WalkManager API server running on http://localhost:{}", port);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
