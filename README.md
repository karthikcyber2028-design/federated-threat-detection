# FedShield — Federated Learning for Threat Detection

A full-stack application that uses **Federated Learning** to collaboratively train threat detection models across distributed network nodes without sharing raw data.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.3-f7931e?logo=scikit-learn)

---

## Features

### Federated Learning Engine
- **FedAvg Aggregation** — Federated Averaging across distributed clients
- **Real-time Round Simulation** — Run FL training rounds with live metrics
- **Multi-Node Architecture** — Firewalls, IDS sensors, endpoint agents, cloud monitors, honeypots
- **Privacy-Preserving** — Raw data never leaves the node; only model updates are shared

### Threat Detection
- **Real-time Network Scanning** — Analyze network packets for malicious patterns
- **Multi-class Classification** — DoS, probe, R2L, U2R attack types
- **Confidence Scoring** — Each detection includes confidence levels
- **Geographic Threat Mapping** — Visualize threat origins

### Dashboard
- **Live Stats Grid** — Total nodes, active clients, FL rounds, accuracy, threats
- **Model Metrics Chart** — Accuracy, Precision, Recall, F1 over training rounds
- **Client Node Management** — View all federated nodes with status, accuracy, data samples
- **Threat Overview Panel** — Active threats, critical alerts, attack type breakdown
- **24-Hour Threat Timeline** — Hourly detected vs blocked threats
- **Live Detection Results** — Packet-level threat analysis

---

## Architecture

```
federated-threat-detection/
├── backend/
│   ├── main.py              # FastAPI server with REST + WebSocket
│   ├── fl_engine.py         # Federated Learning engine & threat detection
│   ├── ml_model.py          # ML model wrappers (RF, GBM, SGD)
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React application
│   │   ├── api.js           # API client
│   │   └── components/      # React components
│   │       ├── Header.jsx
│   │       ├── StatsGrid.jsx
│   │       ├── ClientGrid.jsx
│   │       ├── MetricsChart.jsx
│   │       ├── FlRounds.jsx
│   │       ├── ThreatPanel.jsx
│   │       └── ThreatTimeline.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### API Documentation

Visit `http://localhost:8000/docs` for the auto-generated Swagger documentation.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | System statistics |
| GET | `/api/clients` | List all federated nodes |
| GET | `/api/clients/{id}` | Get specific node details |
| GET | `/api/rounds` | List all FL rounds |
| POST | `/api/rounds/simulate` | Run a new FL training round |
| POST | `/api/detect` | Analyze custom traffic data |
| POST | `/api/detect/simulate` | Run simulated threat detection |
| GET | `/api/threats/timeline` | 24-hour threat timeline |
| GET | `/api/threats/summary` | Threat summary with attack types |
| WS | `/ws/live` | Real-time status updates |

---

## How Federated Learning Works Here

1. **Data Distribution** — Each network node (firewall, IDS, endpoint) has its own local dataset
2. **Local Training** — Nodes train models on their local data
3. **Model Aggregation** — The central server aggregates model updates using FedAvg
4. **Global Model Update** — The improved global model is distributed back to nodes
5. **Iteration** — Steps 2-4 repeat, improving detection accuracy over rounds

This approach ensures **data privacy** since raw network logs never leave their source node.

---

## Deployment

### Docker Compose

```bash
docker-compose up --build
```

### Deploy to Render / Railway / Fly.io

1. Push this repo to GitHub
2. Connect your GitHub account to [Render](https://render.com) or [Railway](https://railway.app)
3. Create a new Web Service for the backend (Python)
4. Create a new Static Site for the frontend (build command: `cd frontend && npm install && npm run build`, publish directory: `frontend/dist`)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, Recharts, Lucide Icons |
| Backend | Python, FastAPI, Uvicorn |
| ML/AI | Scikit-learn, NumPy, Pandas |
| Communication | REST API, WebSocket |
| Protocols | Federated Averaging (FedAvg) |

---

## License

MIT
