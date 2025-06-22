import mqtt from 'mqtt';
import pool from './db.js';
import WebSocket, { WebSocketServer } from 'ws';

const client = mqtt.connect(process.env.MQTT_URL);
const wss = new WebSocketServer({ noServer: true });

export function attach(server) {
  server.on('upgrade', (req, sock, head) => {
    if (req.url === '/ws') {
      wss.handleUpgrade(req, sock, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    }
  });
}

client.on('connect', () => {
  client.subscribe('valve/+/telemetry');
  client.subscribe('valve/+/state');
});

client.on('message', async (topic, msg) => {
  try {
    const parts = topic.split('/');
    const valveId = parseInt(parts[1]);
    const payload = JSON.parse(msg.toString());

    if (parts[2] === 'telemetry') {
      const { flow, pressure } = payload;
      await pool.query(
        'INSERT INTO telemetry(valve_id, flow, pressure) VALUES ($1,$2,$3)',
        [valveId, flow, pressure]
      );
      broadcast({ type: 'telemetry', valveId, flow, pressure });
    } else if (parts[2] === 'state') {
      const { state } = payload;
      await pool.query('UPDATE valves SET state=$1 WHERE id=$2', [
        state,
        valveId
      ]);
      broadcast({ type: 'state', valveId, state });
    }
  } catch (e) {
    console.error(e);
  }
});

function broadcast(data) {
  wss.clients.forEach((c) => {
    if (c.readyState === WebSocket.OPEN) c.send(JSON.stringify(data));
  });
}
