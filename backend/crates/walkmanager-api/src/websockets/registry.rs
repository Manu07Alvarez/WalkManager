use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use uuid::Uuid;

#[derive(Debug, Clone)]
pub struct WebSocketSession {
    pub user_id: Uuid,
    pub role: String,
    pub connected_at: time::OffsetDateTime,
}

pub type Sessions = Arc<RwLock<HashMap<Uuid, WebSocketSession>>>;

#[derive(Clone)]
pub struct ConnectionRegistry {
    sessions: Sessions,
}

impl ConnectionRegistry {
    pub fn new() -> Self {
        Self {
            sessions: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    pub async fn register(&self, session: WebSocketSession) {
        let mut sessions = self.sessions.write().await;
        sessions.insert(session.user_id, session);
    }

    pub async fn unregister(&self, user_id: Uuid) {
        let mut sessions = self.sessions.write().await;
        sessions.remove(&user_id);
    }

    pub async fn get(&self, user_id: Uuid) -> Option<WebSocketSession> {
        let sessions = self.sessions.read().await;
        sessions.get(&user_id).cloned()
    }
}

impl Default for ConnectionRegistry {
    fn default() -> Self {
        Self::new()
    }
}