import numpy as np
import time
import uuid
from typing import Dict, List, Optional
from dataclasses import dataclass, field
from enum import Enum


class ClientStatus(str, Enum):
    IDLE = "idle"
    TRAINING = "training"
    UPDATING = "updating"
    OFFLINE = "offline"


class RoundStatus(str, Enum):
    PENDING = "pending"
    COLLECTING = "collecting"
    AGGREGATING = "aggregating"
    COMPLETED = "completed"


@dataclass
class FLClient:
    id: str
    name: str
    node_type: str  # firewall, ids, endpoint, cloud
    status: ClientStatus = ClientStatus.IDLE
    data_samples: int = 0
    local_accuracy: float = 0.0
    last_update: float = 0.0
    total_updates: int = 0
    location: str = ""
    ip_address: str = ""
    threat_level: str = "low"

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "name": self.name,
            "node_type": self.node_type,
            "status": self.status.value,
            "data_samples": self.data_samples,
            "local_accuracy": round(self.local_accuracy, 4),
            "last_update": self.last_update,
            "total_updates": self.total_updates,
            "location": self.location,
            "ip_address": self.ip_address,
            "threat_level": self.threat_level,
        }


@dataclass
class FLRound:
    id: str
    round_number: int
    status: RoundStatus = RoundStatus.PENDING
    participating_clients: List[str] = field(default_factory=list)
    global_accuracy: float = 0.0
    global_precision: float = 0.0
    global_recall: float = 0.0
    global_f1: float = 0.0
    started_at: float = 0.0
    completed_at: float = 0.0
    aggregation_method: str = "fedavg"
    model_version: int = 0

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "round_number": self.round_number,
            "status": self.status.value,
            "participating_clients": self.participating_clients,
            "global_accuracy": round(self.global_accuracy, 4),
            "global_precision": round(self.global_precision, 4),
            "global_recall": round(self.global_recall, 4),
            "global_f1": round(self.global_f1, 4),
            "started_at": self.started_at,
            "completed_at": self.completed_at,
            "aggregation_method": self.aggregation_method,
            "model_version": self.model_version,
        }


class FederatedLearningEngine:
    def __init__(self):
        self.clients: Dict[str, FLClient] = {}
        self.rounds: List[FLRound] = []
        self.global_model_params: Optional[Dict] = None
        self.current_round: int = 0
        self.total_rounds_completed: int = 0
        self.global_metrics_history: List[Dict] = []
        self._init_clients()

    def _init_clients(self):
        client_configs = [
            {"name": "FW-Node-01", "node_type": "firewall", "location": "US-East", "ip": "10.0.1.10"},
            {"name": "FW-Node-02", "node_type": "firewall", "location": "US-West", "ip": "10.0.2.10"},
            {"name": "IDS-Sensor-01", "node_type": "ids", "location": "EU-Central", "ip": "10.0.3.10"},
            {"name": "IDS-Sensor-02", "node_type": "ids", "location": "AP-South", "ip": "10.0.4.10"},
            {"name": "EP-Agent-01", "node_type": "endpoint", "location": "US-East", "ip": "10.0.1.20"},
            {"name": "EP-Agent-02", "node_type": "endpoint", "location": "EU-West", "ip": "10.0.5.10"},
            {"name": "Cloud-Mon-01", "node_type": "cloud", "location": "Global", "ip": "10.0.6.10"},
            {"name": "Honeypot-01", "node_type": "honeypot", "location": "US-Central", "ip": "10.0.7.10"},
        ]
        for cfg in client_configs:
            client_id = str(uuid.uuid4())[:8]
            client = FLClient(
                id=client_id,
                name=cfg["name"],
                node_type=cfg["node_type"],
                data_samples=np.random.randint(500, 5000),
                location=cfg["location"],
                ip_address=cfg["ip"],
                threat_level=np.random.choice(["low", "medium", "high"]),
            )
            self.clients[client_id] = client

    def get_all_clients(self) -> List[Dict]:
        return [c.to_dict() for c in self.clients.values()]

    def get_client(self, client_id: str) -> Optional[Dict]:
        client = self.clients.get(client_id)
        return client.to_dict() if client else None

    def get_all_rounds(self) -> List[Dict]:
        return [r.to_dict() for r in self.rounds]

    def get_stats(self) -> Dict:
        active = sum(1 for c in self.clients.values() if c.status != ClientStatus.OFFLINE)
        training = sum(1 for c in self.clients.values() if c.status == ClientStatus.TRAINING)
        total_samples = sum(c.data_samples for c in self.clients.values())
        avg_accuracy = 0.0
        if self.global_metrics_history:
            avg_accuracy = self.global_metrics_history[-1].get("accuracy", 0)
        return {
            "total_clients": len(self.clients),
            "active_clients": active,
            "training_clients": training,
            "total_rounds": self.total_rounds_completed,
            "total_data_samples": total_samples,
            "current_global_accuracy": round(avg_accuracy, 4),
            "model_versions": self.total_rounds_completed,
            "threats_detected": np.random.randint(100, 500),
            "threats_blocked": np.random.randint(80, 450),
        }

    def simulate_round(self, aggregation: str = "fedavg") -> Dict:
        self.current_round += 1
        fl_round = FLRound(
            id=str(uuid.uuid4())[:8],
            round_number=self.current_round,
            started_at=time.time(),
            aggregation_method=aggregation,
            model_version=self.current_round,
        )
        participating = list(self.clients.keys())[:np.random.randint(4, len(self.clients) + 1)]
        fl_round.participating_clients = participating
        fl_round.status = RoundStatus.COLLECTING

        client_metrics = []
        for cid in participating:
            client = self.clients[cid]
            client.status = ClientStatus.TRAINING
            samples = np.random.randint(200, 2000)
            acc = np.random.uniform(0.75, 0.98)
            client.data_samples += samples
            client.local_accuracy = acc
            client.total_updates += 1
            client.last_update = time.time()
            client.status = ClientStatus.IDLE
            client_metrics.append({
                "client_id": cid,
                "client_name": client.name,
                "accuracy": round(acc, 4),
                "samples": samples,
                "precision": round(np.random.uniform(0.7, 0.99), 4),
                "recall": round(np.random.uniform(0.65, 0.98), 4),
                "f1": round(np.random.uniform(0.7, 0.98), 4),
            })

        fl_round.status = RoundStatus.AGGREGATING
        weights = np.array([m["samples"] for m in client_metrics], dtype=float)
        weights /= weights.sum()
        global_acc = sum(w * m["accuracy"] for w, m in zip(weights, client_metrics))
        global_prec = sum(w * m["precision"] for w, m in zip(weights, client_metrics))
        global_rec = sum(w * m["recall"] for w, m in zip(weights, client_metrics))
        global_f1 = sum(w * m["f1"] for w, m in zip(weights, client_metrics))

        improvement = np.random.uniform(0.001, 0.015) if self.total_rounds_completed > 0 else 0
        global_acc = min(0.99, global_acc + improvement)

        fl_round.global_accuracy = global_acc
        fl_round.global_precision = global_prec
        fl_round.global_recall = global_rec
        fl_round.global_f1 = global_f1
        fl_round.completed_at = time.time()
        fl_round.status = RoundStatus.COMPLETED
        self.total_rounds_completed += 1

        metrics = {
            "round": self.current_round,
            "accuracy": round(global_acc, 4),
            "precision": round(global_prec, 4),
            "recall": round(global_rec, 4),
            "f1": round(global_f1, 4),
            "clients_participated": len(participating),
            "aggregation": aggregation,
            "timestamp": time.time(),
        }
        self.global_metrics_history.append(metrics)
        self.rounds.append(fl_round)

        return {
            "round": fl_round.to_dict(),
            "client_metrics": client_metrics,
            "global_metrics": metrics,
        }

    def detect_threats(self, traffic_data: List[Dict]) -> Dict:
        results = []
        for packet in traffic_data:
            src_bytes = packet.get("src_bytes", 0)
            dst_bytes = packet.get("dst_bytes", 0)
            duration = packet.get("duration", 0)
            flag = packet.get("flag", "SF")
            score = 0.0
            if src_bytes > 100000:
                score += 0.3
            if dst_bytes > 500000:
                score += 0.3
            if duration > 300:
                score += 0.2
            if flag in ["REJ", "RSTO", "S0"]:
                score += 0.4
            if src_bytes > 500000 and dst_bytes < 100:
                score += 0.5
            score += np.random.uniform(-0.1, 0.1)
            score = max(0, min(1, score))
            is_threat = score > 0.4
            results.append({
                "src_ip": packet.get("src_ip", "0.0.0.0"),
                "dst_ip": packet.get("dst_ip", "0.0.0.0"),
                "src_bytes": src_bytes,
                "dst_bytes": dst_bytes,
                "duration": duration,
                "flag": flag,
                "threat_score": round(score, 4),
                "is_threat": is_threat,
                "classification": "ATTACK" if is_threat else "BENIGN",
                "confidence": round(abs(score - 0.5) * 2, 4),
            })

        threats = [r for r in results if r["is_threat"]]
        return {
            "total_packets": len(results),
            "threats_detected": len(threats),
            "benign_count": len(results) - len(threats),
            "threat_rate": round(len(threats) / max(len(results), 1), 4),
            "results": results,
        }

    def generate_threat_timeline(self, points: int = 24) -> List[Dict]:
        timeline = []
        base_time = time.time() - (points * 3600)
        for i in range(points):
            hour = (i % 24)
            is_peak = 9 <= hour <= 17
            base_threats = np.random.randint(5, 20) if is_peak else np.random.randint(1, 8)
            timeline.append({
                "timestamp": base_time + (i * 3600),
                "hour": hour,
                "threats_detected": base_threats,
                "threats_blocked": base_threats - np.random.randint(0, max(1, base_threats // 4)),
                "benign_traffic": np.random.randint(500, 2000),
                "attack_types": {
                    "dos": np.random.randint(0, base_threats),
                    "probe": np.random.randint(0, base_threats),
                    "r2l": np.random.randint(0, max(1, base_threats // 2)),
                    "u2r": np.random.randint(0, max(1, base_threats // 3)),
                },
            })
        return timeline

    def get_threat_summary(self) -> Dict:
        return {
            "active_threats": np.random.randint(2, 15),
            "critical_alerts": np.random.randint(0, 5),
            "blocked_today": np.random.randint(50, 200),
            "total_threats_24h": np.random.randint(100, 500),
            "top_attack_types": [
                {"type": "DoS/DDoS", "count": np.random.randint(20, 100), "severity": "high"},
                {"type": "Port Scanning", "count": np.random.randint(15, 80), "severity": "medium"},
                {"type": "Brute Force", "count": np.random.randint(10, 50), "severity": "high"},
                {"type": "SQL Injection", "count": np.random.randint(5, 30), "severity": "critical"},
                {"type": "XSS Attack", "count": np.random.randint(3, 20), "severity": "medium"},
                {"type": "Data Exfiltration", "count": np.random.randint(1, 10), "severity": "critical"},
            ],
            "geo_threats": [
                {"country": "Unknown/VPN", "threats": np.random.randint(20, 100)},
                {"country": "China", "threats": np.random.randint(10, 50)},
                {"country": "Russia", "threats": np.random.randint(8, 40)},
                {"country": "Brazil", "threats": np.random.randint(5, 25)},
                {"country": "India", "threats": np.random.randint(3, 20)},
                {"country": "US", "threats": np.random.randint(5, 30)},
            ],
        }
