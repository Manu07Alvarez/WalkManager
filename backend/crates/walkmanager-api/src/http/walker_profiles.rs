use axum::{
    extract::Path,
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UpdateProfilePayload {
    pub name: Option<String>,
    pub zone: Option<String>,
    pub description: Option<String>,
    pub max_dogs: Option<u32>,
    pub price_per_service: Option<f64>,
    pub dog_types: Option<String>,
    pub available_days: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct WalkerProfileResponse {
    pub id: String,
    pub name: String,
    pub zone: String,
    pub description: String,
    pub max_dogs: u32,
    pub price_per_service: f64,
    pub dog_types: String,
    pub available_days: Vec<String>,
}

async fn update_my_profile(
    Json(payload): Json<UpdateProfilePayload>,
) -> Json<WalkerProfileResponse> {
    let name = payload.name.unwrap_or_else(|| "Paseador Verificado".to_string());
    let zone = payload.zone.unwrap_or_else(|| "Palermo, CABA".to_string());
    let description = payload.description.unwrap_or_else(|| {
        "Paseador profesional en Palermo. Amante de los perros con experiencia.".to_string()
    });
    let max_dogs = payload.max_dogs.unwrap_or(3);
    let price_per_service = payload.price_per_service.unwrap_or(2500.0);
    let dog_types = payload.dog_types.unwrap_or_else(|| "Grandes, medianos, pequeños".to_string());
    let available_days = payload.available_days.unwrap_or_else(|| {
        vec![
            "Lunes".to_string(),
            "Miércoles".to_string(),
            "Viernes".to_string(),
            "Sábado".to_string(),
        ]
    });

    Json(WalkerProfileResponse {
        id: "me-profile".to_string(),
        name,
        zone,
        description,
        max_dogs,
        price_per_service,
        dog_types,
        available_days,
    })
}

async fn get_my_profile() -> Json<WalkerProfileResponse> {
    Json(WalkerProfileResponse {
        id: "me-profile".to_string(),
        name: "Santiago Martínez".to_string(),
        zone: "Palermo, CABA".to_string(),
        description: "Paseador certificado con 5 años de experiencia.".to_string(),
        max_dogs: 3,
        price_per_service: 2500.0,
        dog_types: "Grandes, medianos".to_string(),
        available_days: vec![
            "Lunes".to_string(),
            "Miércoles".to_string(),
            "Viernes".to_string(),
            "Sábado".to_string(),
        ],
    })
}

async fn get_public_profile(Path(walker_id): Path<String>) -> Json<WalkerProfileResponse> {
    Json(WalkerProfileResponse {
        id: walker_id,
        name: "Santiago Martínez".to_string(),
        zone: "Palermo, CABA".to_string(),
        description: "Paseador certificado con 5 años de experiencia.".to_string(),
        max_dogs: 3,
        price_per_service: 2500.0,
        dog_types: "Grandes, medianos".to_string(),
        available_days: vec![
            "Lunes".to_string(),
            "Miércoles".to_string(),
            "Viernes".to_string(),
            "Sábado".to_string(),
        ],
    })
}

pub fn walker_profiles_routes() -> Router {
    Router::new()
        .route("/walkers/me/profile", get(get_my_profile).put(update_my_profile))
        .route("/walkers/:walker_id", get(get_public_profile))
}