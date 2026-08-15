use axum::{http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct ApplyRestrictionRequest {
    #[serde(alias = "userId")]
    pub user_id: Option<String>,
    #[serde(alias = "restrictionType")]
    pub restriction_type: Option<String>,
    pub reason: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ApplyRestrictionResponse {
    pub restriction_id: String,
    pub status: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct IncidentItemResponse {
    pub id: String,
    pub user_name: String,
    pub incident_type: String,
    pub severity: String,
    pub description: String,
    pub created_at: String,
    pub status: String,
}

pub async fn list_incidents_handler() -> Json<Vec<IncidentItemResponse>> {
    Json(vec![
        IncidentItemResponse {
            id: "inc-1".to_string(),
            user_name: "Esteban Ortíz".to_string(),
            incident_type: "LateCancellation".to_string(),
            severity: "Low".to_string(),
            description: "Cancelación de paseo a 15 minutos de la hora acordada.".to_string(),
            created_at: "15 de Agosto, 2026".to_string(),
            status: "Open".to_string(),
        },
        IncidentItemResponse {
            id: "inc-2".to_string(),
            user_name: "Gonzalo Molina".to_string(),
            incident_type: "UnprofessionalBehavior".to_string(),
            severity: "Medium".to_string(),
            description: "Reporte de falta de respuesta a los mensajes durante el paseo.".to_string(),
            created_at: "14 de Agosto, 2026".to_string(),
            status: "UnderReview".to_string(),
        },
    ])
}

pub async fn apply_restriction_handler(
    Json(_payload): Json<ApplyRestrictionRequest>,
) -> (StatusCode, Json<ApplyRestrictionResponse>) {
    (
        StatusCode::CREATED,
        Json(ApplyRestrictionResponse {
            restriction_id: Uuid::new_v4().to_string(),
            status: "Applied".to_string(),
        }),
    )
}
