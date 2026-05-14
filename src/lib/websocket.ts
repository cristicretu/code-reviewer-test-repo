import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const rooms: Record<string, Set<any>> = {};

wss.on("connection", (ws, req) => {
  const url = new URL(req.url!, "http://x");
  const room = url.searchParams.get("room") || "lobby";
  rooms[room] = rooms[room] || new Set();
  rooms[room].add(ws);

  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    for (const peer of rooms[room]) {
      peer.send(JSON.stringify({ from: msg.from, text: msg.text }));
    }
  });
});

export function broadcast(room: string, payload: any) {
  for (const peer of rooms[room] || []) {
    peer.send(JSON.stringify(payload));
  }
}
