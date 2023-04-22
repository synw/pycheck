import WebSocket, { Server, WebSocket as WebSocketInstance } from 'ws';

// Create a WebSocket server
const wss: Server = new WebSocket.Server({ port: 5142 });

// Handle WebSocket connections
wss.on('connection', (ws: WebSocketInstance) => {
  // Redirect stdout output to WebSocket
  const stdoutWrite = process.stdout.write;
  // @ts-ignore
  process.stdout.write = (chunk) => {
    stdoutWrite.apply(process.stdout, [chunk]);
    ws.send(chunk);
  };

  // Restore stdout when WebSocket is closed
  ws.on('close', () => {
    process.stdout.write = stdoutWrite;
  });
});

function wsMsg(message: any): void {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export { wsMsg }
