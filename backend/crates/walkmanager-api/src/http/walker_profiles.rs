use axum::{
    extract::Path,
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
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

static USER_PROFILES: Mutex<Option<HashMap<String, WalkerProfileResponse>>> = Mutex::new(None);

fn get_profile_store() -> HashMap<String, WalkerProfileResponse> {
    let mut guard = USER_PROFILES.lock().unwrap();
    if guard.is_none() {
        *guard = Some(HashMap::new());
    }
    guard.as_ref().unwrap().clone()
}

fn set_user_profile(key: String, profile: WalkerProfileResponse) {
    let mut guard = USER_PROFILES.lock().unwrap();
    if guard.is_none() {
        *guard = Some(HashMap::new());
    }
    if let Some(map) = guard.as_mut() {
        map.insert(key, profile);
    }
}

async fn update_my_profile(
    Json(payload): Json<UpdateProfilePayload>,
) -> Json<WalkerProfileResponse> {
    let store = get_profile_store();
    let current_key = "me".to_string();

    let mut profile = store.get(&current_key).cloned().unwrap_or_else(|| WalkerProfileResponse {
        id: "me".to_string(),
        name: payload.name.clone().unwrap_or_else(|| "Usuario WalkManager".to_string()),
        zone: "Palermo, CABA".to_string(),
        description: "Paseador profesional verificado en la plataforma.".to_string(),
        max_dogs: 3,
        price_per_service: 2500.0,
        dog_types: "Grandes, medianos, pequeños".to_string(),
        available_days: vec![
            "Lunes".to_string(),
            "Miércoles".to_string(),
            "Viernes".to_string(),
            "Sábado".to_string(),
        ],
    });

    if let Some(n) = payload.name {
        if !n.trim().is_empty() {
            profile.name = n;
        }
    }
    if let Some(z) = payload.zone {
        if !z.trim().is_empty() {
            profile.zone = z;
        }
    }
    if let Some(d) = payload.description {
        profile.description = d;
    }
    if let Some(md) = payload.max_dogs {
        profile.max_dogs = md;
    }
    if let Some(p) = payload.price_per_service {
        profile.price_per_service = p;
    }
    if let Some(dt) = payload.dog_types {
        profile.dog_types = dt;
    }
    if let Some(ad) = payload.available_days {
        profile.available_days = ad;
    }

    set_user_profile(current_key, profile.clone());
    Json(profile)
}

async fn get_my_profile() -> Json<Option<WalkerProfileResponse>> {
    let store = get_profile_store();
    Json(store.get("me").cloned())
}

async fn get_public_profile(Path(walker_id): Path<String>) -> Json<WalkerProfileResponse> {
    let store = get_profile_store();
    if let Some(p) = store.get(&walker_id) {
        return Json(p.clone());
    }

    Json(WalkerProfileResponse {
        id: walker_id,
        name: "Paseador Verificado".to_string(),
        zone: "Palermo, CABA".to_string(),
        description: "Paseador certificado con amplia experiencia.".to_string(),
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