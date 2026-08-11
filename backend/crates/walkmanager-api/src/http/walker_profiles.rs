use axum::{
    extract::Path,
    routing::{get, put},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct WalkerProfileResponse {
    pub id: Uuid,
    pub public_description: String,
    pub usual_dog_types: Vec<String>,
    pub max_simultaneous_dogs: u32,
    pub service_price: f64,
    pub service_zone_id: Uuid,
}

// TODO: Add JWT authentication middleware extraction to get current user ID
async fn update_my_profile(Json(payload): Json<WalkerProfileResponse>) -> Json<WalkerProfileResponse> {
    Json(payload)
}

async fn get_public_profile(Path(walker_id): Path<Uuid>) -> Json<WalkerProfileResponse> {
    Json(WalkerProfileResponse {
        id: walker_id,
        public_description: "Experienced dog walker in Palermo".to_string(),
        usual_dog_types: vec!["Medium".to_string(), "Large".to_string()],
        max_simultaneous_dogs: 3,
        service_price: 2500.0,
        service_zone_id: Uuid::new_v4(),
    })
}

pub fn walker_profiles_routes() -> Router {
    Router::new()
        .route("/walkers/me/profile", put(update_my_profile))
        .route("/walkers/:walker_id", get(get_public_profile))
}