export default class WebSocketManager {
  private url: string;

  private websocket: WebSocket;

  constructor(url: string) {
    this.url = url;
    this.websocket = new WebSocket(url);
  }

  onOpen(callback: () => void): void {
    this.websocket.onopen = callback;
  }

  onMessage(callback: (event: MessageEvent) => void): void {
    this.websocket.onmessage = callback;
  }

  send(data: string): void {
    this.websocket.send(data); // json.stringify(data)
  }
}
