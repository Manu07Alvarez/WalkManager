use axum::{http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct SubmitReviewRequest {
    #[serde(alias = "bookingId")]
    pub booking_id: Option<String>,
    pub rating: Option<u8>,
    pub comment: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct SubmitReviewResponse {
    pub review_id: String,
    pub status: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct ReviewItemResponse {
    pub id: String,
    pub author_name: String,
    pub walker_name: String,
    pub rating: u8,
    pub comment: String,
    pub date: String,
    pub status: String,
}

pub async fn list_reviews_handler() -> Json<Vec<ReviewItemResponse>> {
    Json(vec![
        ReviewItemResponse {
            id: "rev-1".to_string(),
            author_name: "Carlos Pérez".to_string(),
            walker_name: "Santiago Martínez".to_string(),
            rating: 5,
            comment: "¡Excelente paseo! Santiago fue súper puntual y cuidó a mis dos perros con mucho cariño.".to_string(),
            date: "Hace 2 días".to_string(),
            status: "Approved".to_string(),
        },
        ReviewItemResponse {
            id: "rev-2".to_string(),
            author_name: "Ana María Silva".to_string(),
            walker_name: "Valeria Rossi".to_string(),
            rating: 4,
            comment: "Muy buena atención y comunicación constante por fotos durante el recorrido.".to_string(),
            date: "Hace 5 días".to_string(),
            status: "Approved".to_string(),
        },
        ReviewItemResponse {
            id: "rev-3".to_string(),
            author_name: "Esteban Ortíz".to_string(),
            walker_name: "Lucas Fernández".to_string(),
            rating: 5,
            comment: "Recomendado 100%. Puntualidad, respeto y excelente trato a las mascotas.".to_string(),
            date: "Hace 1 semana".to_string(),
            status: "Approved".to_string(),
        },
    ])
}

pub async fn submit_review_handler(
    Json(_payload): Json<SubmitReviewRequest>,
) -> (StatusCode, Json<SubmitReviewResponse>) {
    (
        StatusCode::CREATED,
        Json(SubmitReviewResponse {
            review_id: Uuid::new_v4().to_string(),
            status: "Pending".to_string(),
        }),
    )
}
