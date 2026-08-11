use utoipa::{
    openapi::{security, Components, OpenApi},
    Modify,
};

#[derive(Debug, Clone, Copy)]
pub struct BearerAuth;

impl Modify for BearerAuth {
    fn modify(&self, openapi: &mut OpenApi) {
        let mut components = Components::new();
        components.add_security_scheme(
            "bearerAuth",
            security::SecurityScheme::Http(security::Http::new(security::HttpAuthScheme::Bearer)),
        );
        openapi.components = Some(components);
    }
}
