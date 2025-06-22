# HydroHub

Minimal full‑stack demo for connected water‑control systems.

## Stack

* **Server**: Node.js + Express + Postgres + MQTT
* **Client**: Plain HTML/JS + WebSocket (keep demo lightweight)
* **Simulator**: Python publisher over MQTT
* **Infrastructure**: Docker Compose (Postgres & Mosquitto)

## Quick start

```bash
git clone <repo>
cd hydrohub
docker compose up -d
# in another shell, publish fake data
docker compose exec server npm run dev   # if not auto‑started
python simulator/simulator.py --broker localhost --valve 1
```

Then browse to <http://localhost:3000/client/index.html>
