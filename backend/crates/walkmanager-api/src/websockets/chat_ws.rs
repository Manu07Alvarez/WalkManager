use axum::{extract::ws::WebSocketUpgrade, response::Response};

// TODO: Validate JWT token from WebSocket connection handshake query parameter
// FIXME: Remove active socket channel on connection disconnect event

pub async fn ws_chat_handler(ws: WebSocketUpgrade) -> Response {
    ws.on_upgrade(|_socket| async {
        // WebSocket event loop stub for chat & presence updates
    })
}
