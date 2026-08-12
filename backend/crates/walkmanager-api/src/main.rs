use axum::{routing::get, Router};
use std::net::SocketAddr;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

// TODO: Read PORT and HOST from environment variables or config file
// REVIEW: Support graceful shutdown signal handling for SIGINT and SIGTERM

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "walkmanager_api=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let app = Router::new()
        .route("/health", get(|| async { "OK" }))
        .route("/ready", get(|| async { "READY" }));

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::info!("WalkManager API server listening on {}", addr);
    println!("WalkManager API server running on http://localhost:8080");

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
