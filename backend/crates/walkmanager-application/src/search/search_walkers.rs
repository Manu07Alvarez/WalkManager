use crate::search::contracts::{WalkerSearchQuery, WalkerSearchResultItem};

// TODO: Integrate PostGIS ST_DistanceSphere repository search logic
// REVIEW: Exclude suspended walkers automatically via active restriction hook

pub struct SearchWalkersUseCase;

impl SearchWalkersUseCase {
    pub async fn execute(
        &self,
        query: WalkerSearchQuery,
    ) -> Result<Vec<WalkerSearchResultItem>, String> {
        let radius = query.radius_km.unwrap_or(5.0);
        if radius <= 0.0 {
            return Err("Radius km must be positive".to_string());
        }

        // Return empty result vector or mock list for search testing
        Ok(vec![])
    }
}
