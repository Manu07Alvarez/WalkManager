// TODO: Implement exponential backoff reconnect policy (up to 5 attempts)
// REVIEW: Handle bearer token authentication in WebSocket connection subprotocol

export class RealtimeWsClient {
  private socket: WebSocket | null = null;

  connect(url: string, token: string) {
    this.socket = new WebSocket(url, ['bearer', token]);
    this.socket.onopen = () => {
      console.log('Realtime WebSocket connected');
    };
    this.socket.onmessage = (event) => {
      console.log('Realtime message received:', event.data);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
