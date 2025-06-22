import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import pool from './db.js';
import valvesRouter from './routes/valves.js';
import authRouter from './routes/auth.js';
import { attach as attachWs } from './mqtt_listener.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/valves', valvesRouter);
app.use('/api/auth', authRouter);

app.get('/', (_req, res) => res.send('HydroHub API running'));

const server = http.createServer(app);
attachWs(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  await initDb();
  console.log(`API listening on ${PORT}`);
});

// quick table bootstrap
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS valves(
      id SERIAL PRIMARY KEY,
      name TEXT,
      state BOOLEAN
    );
    CREATE TABLE IF NOT EXISTS telemetry(
      id SERIAL PRIMARY KEY,
      valve_id INT REFERENCES valves(id),
      flow REAL,
      pressure REAL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}
