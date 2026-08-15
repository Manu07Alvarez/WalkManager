use axum::{
    extract::Path,
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

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

static PROFILE_STORE: Mutex<Option<WalkerProfileResponse>> = Mutex::new(None);

fn get_or_init_profile() -> WalkerProfileResponse {
    let mut guard = PROFILE_STORE.lock().unwrap();
    if guard.is_none() {
        *guard = Some(WalkerProfileResponse {
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
        });
    }
    guard.as_ref().unwrap().clone()
}

async fn update_my_profile(
    Json(payload): Json<UpdateProfilePayload>,
) -> Json<WalkerProfileResponse> {
    let mut guard = PROFILE_STORE.lock().unwrap();
    if guard.is_none() {
        drop(guard);
        get_or_init_profile();
        guard = PROFILE_STORE.lock().unwrap();
    }

    if let Some(prof) = guard.as_mut() {
        if let Some(n) = payload.name {
            if !n.trim().is_empty() {
                prof.name = n;
            }
        }
        if let Some(z) = payload.zone {
            if !z.trim().is_empty() {
                prof.zone = z;
            }
        }
        if let Some(d) = payload.description {
            prof.description = d;
        }
        if let Some(md) = payload.max_dogs {
            prof.max_dogs = md;
        }
        if let Some(p) = payload.price_per_service {
            prof.price_per_service = p;
        }
        if let Some(dt) = payload.dog_types {
            prof.dog_types = dt;
        }
        if let Some(ad) = payload.available_days {
            prof.available_days = ad;
        }
    }

    Json(guard.as_ref().unwrap().clone())
}

async fn get_my_profile() -> Json<WalkerProfileResponse> {
    Json(get_or_init_profile())
}

async fn get_public_profile(Path(walker_id): Path<String>) -> Json<WalkerProfileResponse> {
    let mut profile = get_or_init_profile();
    profile.id = walker_id;
    Json(profile)
}

pub fn walker_profiles_routes() -> Router {
    Router::new()
        .route("/walkers/me/profile", get(get_my_profile).put(update_my_profile))
        .route("/walkers/:walker_id", get(get_public_profile))
}