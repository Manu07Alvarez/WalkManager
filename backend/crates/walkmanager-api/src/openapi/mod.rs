use utoipa::{
    openapi::{security, Components, OpenApi},
    Modify,
};

#[derive(Debug, Clone, Copy)]
pub struct BearerAuth;

impl Modify for BearerAuth {
    fn modify(&self, openapi: &mut OpenApi) {
        let components = Components::new()
            .security_scheme(
                "bearerAuth",
                security::SecurityScheme::Http(security::Http::new(security::HttpAuthScheme::Bearer)
                    .description("JWT Authorization header using the Bearer scheme")),
            );
        openapi.components = Some(components);
    }
}