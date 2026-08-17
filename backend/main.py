from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Optional
import asyncio
import json
import time
import numpy as np

from fl_engine import FederatedLearningEngine

app = FastAPI(title="Federated Threat Detection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = FederatedLearningEngine()
ws_clients: List[WebSocket] = []


class TrafficPacket(BaseModel):
    src_ip: str = "0.0.0.0"
    dst_ip: str = "0.0.0.0"
    src_bytes: int = 0
    dst_bytes: int = 0
    duration: int = 0
    flag: str = "SF"


class RoundRequest(BaseModel):
    aggregation: str = "fedavg"


@app.get("/")
def root():
    return {"message": "Federated Learning Threat Detection API", "version": "1.0.0"}


@app.get("/api/stats")
def get_stats():
    return engine.get_stats()


@app.get("/api/clients")
def get_clients():
    return engine.get_all_clients()


@app.get("/api/clients/{client_id}")
def get_client(client_id: str):
    client = engine.get_client(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@app.get("/api/rounds")
def get_rounds():
    return engine.get_all_rounds()


@app.post("/api/rounds/simulate")
def simulate_round(req: RoundRequest):
    result = engine.simulate_round(aggregation=req.aggregation)
    return result


@app.post("/api/detect")
def detect_threats(packets: List[TrafficPacket]):
    data = [p.model_dump() for p in packets]
    return engine.detect_threats(data)


@app.post("/api/detect/simulate")
def detect_simulated():
    n = np.random.randint(10, 50)
    packets = []
    for _ in range(n):
        packets.append({
            "src_ip": f"{np.random.randint(1,255)}.{np.random.randint(0,255)}.{np.random.randint(0,255)}.{np.random.randint(1,255)}",
            "dst_ip": f"{np.random.randint(1,255)}.{np.random.randint(0,255)}.{np.random.randint(0,255)}.{np.random.randint(1,255)}",
            "src_bytes": int(np.random.exponential(50000)),
            "dst_bytes": int(np.random.exponential(100000)),
            "duration": int(np.random.exponential(100)),
            "flag": np.random.choice(["SF", "REJ", "S0", "RSTO", "SH"]),
        })
    return engine.detect_threats(packets)


@app.get("/api/threats/timeline")
def get_threat_timeline(points: int = 24):
    return engine.generate_threat_timeline(points)


@app.get("/api/threats/summary")
def get_threat_summary():
    return engine.get_threat_summary()


@app.get("/api/health")
def health():
    return {"status": "healthy", "uptime": time.time(), "engine": "active"}


@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    ws_clients.append(websocket)
    try:
        while True:
            data = {
                "type": "status_update",
                "stats": engine.get_stats(),
                "timestamp": time.time(),
            }
            await websocket.send_json(data)
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        ws_clients.remove(websocket)
    except Exception:
        if websocket in ws_clients:
            ws_clients.remove(websocket)
