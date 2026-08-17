import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import pickle
import time
from typing import Dict, List, Tuple, Optional


class ThreatDetectionModel:
    def __init__(self, model_type: str = "random_forest"):
        self.model_type = model_type
        self.model = self._create_model()
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = [
            "src_bytes", "dst_bytes", "count", "srv_count", "serror_rate",
            "srv_serror_rate", "rerror_rate", "srv_rerror_rate", "same_srv_rate",
            "diff_srv_rate", "srv_diff_host_rate", "dst_host_count",
            "dst_host_srv_count", "dst_host_same_srv_rate", "dst_host_diff_srv_rate",
            "dst_host_serror_rate", "dst_host_srv_serror_rate", "duration",
            "protocol_type_tcp", "protocol_type_udp", "service_http", "service_https",
            "flag_SF", "flag_REJ"
        ]

    def _create_model(self):
        if self.model_type == "random_forest":
            return RandomForestClassifier(
                n_estimators=100, max_depth=15, random_state=42, n_jobs=-1
            )
        elif self.model_type == "gradient_boosting":
            return GradientBoostingClassifier(
                n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42
            )
        elif self.model_type == "sgd":
            return SGDClassifier(loss="log_loss", max_iter=1000, random_state=42)
        return RandomForestClassifier(n_estimators=100, random_state=42)

    def generate_synthetic_data(self, n_samples: int = 1000, n_features: int = 24) -> Tuple[np.ndarray, np.ndarray]:
        np.random.seed(int(time.time()) % 10000)
        X = np.random.randn(n_samples, n_features)
        weights = np.random.randn(n_features) * 0.3
        logits = X @ weights + np.random.randn(n_samples) * 0.5
        probs = 1 / (1 + np.exp(-logits))
        y = (probs > 0.55).astype(int)
        attack_ratio = np.random.uniform(0.15, 0.35)
        attack_indices = np.random.choice(n_samples, int(n_samples * attack_ratio), replace=False)
        y[attack_indices] = 1
        return X.astype(np.float32), y.astype(np.int32)

    def get_parameters(self) -> Dict:
        if not self.is_trained:
            return {"coef": None, "intercept": None}
        if hasattr(self.model, "estimators_"):
            return {"model_data": pickle.dumps(self.model)}
        return {"coef": getattr(self.model, "coef_", None), "intercept": getattr(self.model, "intercept_", None)}

    def set_parameters(self, params: Dict):
        if "model_data" in params and params["model_data"]:
            self.model = pickle.loads(params["model_data"])
            self.is_trained = True
        elif "coef" in params and params["coef"] is not None:
            self.model.coef_ = params["coef"]
            if params.get("intercept") is not None:
                self.model.intercept_ = params["intercept"]
            self.is_trained = True

    def train(self, X: np.ndarray, y: np.ndarray) -> Dict:
        if not self.is_trained:
            X_scaled = self.scaler.fit_transform(X)
        else:
            X_scaled = self.scaler.transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True
        y_pred = self.model.predict(X_scaled)
        return {
            "accuracy": float(accuracy_score(y, y_pred)),
            "precision": float(precision_score(y, y_pred, zero_division=0)),
            "recall": float(recall_score(y, y_pred, zero_division=0)),
            "f1": float(f1_score(y, y_pred, zero_division=0)),
            "samples": len(y),
        }

    def predict(self, X: np.ndarray) -> Dict:
        X_scaled = self.scaler.transform(X)
        predictions = self.model.predict(X_scaled)
        probabilities = self.model.predict_proba(X_scaled) if hasattr(self.model, "predict_proba") else None
        return {
            "predictions": predictions.tolist(),
            "probabilities": probabilities.tolist() if probabilities is not None else None,
            "threat_count": int(np.sum(predictions == 1)),
            "benign_count": int(np.sum(predictions == 0)),
        }

    def partial_fit(self, X: np.ndarray, y: np.ndarray) -> Dict:
        X_scaled = self.scaler.fit_transform(X) if not self.is_trained else self.scaler.transform(X)
        if hasattr(self.model, "partial_fit"):
            self.model.partial_fit(X_scaled, y, classes=np.unique(y))
            self.is_trained = True
        else:
            self.model.fit(X_scaled, y)
            self.is_trained = True
        y_pred = self.model.predict(X_scaled)
        return {
            "accuracy": float(accuracy_score(y, y_pred)),
            "precision": float(precision_score(y, y_pred, zero_division=0)),
            "recall": float(recall_score(y, y_pred, zero_division=0)),
            "f1": float(f1_score(y, y_pred, zero_division=0)),
        }
