const CLIENT_CONFIGS = [
  { name: "FW-Node-01", node_type: "firewall", location: "US-East", ip: "10.0.1.10" },
  { name: "FW-Node-02", node_type: "firewall", location: "US-West", ip: "10.0.2.10" },
  { name: "IDS-Sensor-01", node_type: "ids", location: "EU-Central", ip: "10.0.3.10" },
  { name: "IDS-Sensor-02", node_type: "ids", location: "AP-South", ip: "10.0.4.10" },
  { name: "EP-Agent-01", node_type: "endpoint", location: "US-East", ip: "10.0.1.20" },
  { name: "EP-Agent-02", node_type: "endpoint", location: "EU-West", ip: "10.0.5.10" },
  { name: "Cloud-Mon-01", node_type: "cloud", location: "Global", ip: "10.0.6.10" },
  { name: "Honeypot-01", node_type: "honeypot", location: "US-Central", ip: "10.0.7.10" },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

let clients = CLIENT_CONFIGS.map((cfg) => ({
  id: uid(),
  name: cfg.name,
  node_type: cfg.node_type,
  status: "idle",
  data_samples: randInt(500, 5000),
  local_accuracy: 0,
  last_update: Date.now() / 1000,
  total_updates: 0,
  location: cfg.location,
  ip_address: cfg.ip,
  threat_level: randChoice(["low", "medium", "high"]),
}));

let rounds = [];
let globalAccuracy = 0.78;
let currentRound = 0;

export function getStats() {
  const active = clients.filter((c) => c.status !== "offline").length;
  const training = clients.filter((c) => c.status === "training").length;
  const totalSamples = clients.reduce((s, c) => s + c.data_samples, 0);
  return {
    total_clients: clients.length,
    active_clients: active,
    training_clients: training,
    total_rounds: rounds.length,
    total_data_samples: totalSamples,
    current_global_accuracy: globalAccuracy,
    model_versions: rounds.length,
    threats_detected: randInt(100, 500),
    threats_blocked: randInt(80, 450),
  };
}

export function getClients() {
  return clients.map((c) => ({ ...c }));
}

export function getRounds() {
  return rounds.map((r) => ({ ...r }));
}

export function simulateRound() {
  currentRound++;
  const participating = [];
  const shuffled = [...clients].sort(() => Math.random() - 0.5);
  const count = randInt(4, clients.length);
  for (let i = 0; i < count; i++) participating.push(shuffled[i].id);

  const clientMetrics = [];
  let totalWeight = 0;

  for (const cid of participating) {
    const client = clients.find((c) => c.id === cid);
    if (!client) continue;
    client.status = "training";
    const samples = randInt(200, 2000);
    const acc = randFloat(0.78, 0.97);
    const prec = randFloat(0.72, 0.98);
    const rec = randFloat(0.68, 0.96);
    const f1 = (2 * prec * rec) / (prec + rec);
    client.data_samples += samples;
    client.local_accuracy = acc;
    client.total_updates++;
    client.last_update = Date.now() / 1000;
    client.status = "idle";
    totalWeight += samples;
    clientMetrics.push({
      client_id: cid,
      client_name: client.name,
      accuracy: acc,
      samples,
      precision: prec,
      recall: rec,
      f1,
    });
  }

  let gAcc = 0, gPrec = 0, gRec = 0, gF1 = 0;
  for (const m of clientMetrics) {
    const w = m.samples / totalWeight;
    gAcc += w * m.accuracy;
    gPrec += w * m.precision;
    gRec += w * m.recall;
    gF1 += w * m.f1;
  }

  if (rounds.length > 0) {
    gAcc = Math.min(0.99, gAcc + randFloat(0.005, 0.02));
  }
  globalAccuracy = gAcc;

  const roundData = {
    id: uid(),
    round_number: currentRound,
    status: "completed",
    participating_clients: participating,
    global_accuracy: gAcc,
    global_precision: gPrec,
    global_recall: gRec,
    global_f1: gF1,
    started_at: Date.now() / 1000,
    completed_at: Date.now() / 1000,
    aggregation_method: "fedavg",
    model_version: currentRound,
  };
  rounds.push(roundData);

  return {
    round: roundData,
    client_metrics: clientMetrics,
    global_metrics: {
      round: currentRound,
      accuracy: gAcc,
      precision: gPrec,
      recall: gRec,
      f1: gF1,
      clients_participated: participating.length,
      aggregation: "fedavg",
      timestamp: Date.now() / 1000,
    },
  };
}

export function simulateDetection() {
  const n = randInt(10, 50);
  const results = [];
  for (let i = 0; i < n; i++) {
    const srcBytes = Math.floor(Math.random() * 1e6);
    const dstBytes = Math.floor(Math.random() * 2e6);
    const duration = Math.floor(Math.random() * 600);
    const flag = randChoice(["SF", "REJ", "S0", "RSTO", "SH"]);
    let score = 0;
    if (srcBytes > 100000) score += 0.3;
    if (dstBytes > 500000) score += 0.3;
    if (duration > 300) score += 0.2;
    if (["REJ", "RSTO", "S0"].includes(flag)) score += 0.4;
    if (srcBytes > 500000 && dstBytes < 100) score += 0.5;
    score += randFloat(-0.1, 0.1);
    score = Math.max(0, Math.min(1, score));
    const isThreat = score > 0.4;
    results.push({
      src_ip: `${randInt(1,255)}.${randInt(0,255)}.${randInt(0,255)}.${randInt(1,255)}`,
      dst_ip: `${randInt(1,255)}.${randInt(0,255)}.${randInt(0,255)}.${randInt(1,255)}`,
      src_bytes: srcBytes,
      dst_bytes: dstBytes,
      duration,
      flag,
      threat_score: score,
      is_threat: isThreat,
      classification: isThreat ? "ATTACK" : "BENIGN",
      confidence: Math.abs(score - 0.5) * 2,
    });
  }
  const threats = results.filter((r) => r.is_threat);
  return {
    total_packets: results.length,
    threats_detected: threats.length,
    benign_count: results.length - threats.length,
    threat_rate: threats.length / Math.max(results.length, 1),
    results,
  };
}

export function getThreatTimeline(points = 24) {
  const timeline = [];
  const baseTime = Date.now() / 1000 - points * 3600;
  for (let i = 0; i < points; i++) {
    const hour = i % 24;
    const isPeak = hour >= 9 && hour <= 17;
    const baseThreats = isPeak ? randInt(5, 20) : randInt(1, 8);
    timeline.push({
      timestamp: baseTime + i * 3600,
      hour,
      threats_detected: baseThreats,
      threats_blocked: baseThreats - randInt(0, Math.max(1, Math.floor(baseThreats / 4))),
      benign_traffic: randInt(500, 2000),
      attack_types: {
        dos: randInt(0, baseThreats),
        probe: randInt(0, baseThreats),
        r2l: randInt(0, Math.max(1, Math.floor(baseThreats / 2))),
        u2r: randInt(0, Math.max(1, Math.floor(baseThreats / 3))),
      },
    });
  }
  return timeline;
}

export function getThreatSummary() {
  return {
    active_threats: randInt(2, 15),
    critical_alerts: randInt(0, 5),
    blocked_today: randInt(50, 200),
    total_threats_24h: randInt(100, 500),
    top_attack_types: [
      { type: "DoS/DDoS", count: randInt(20, 100), severity: "high" },
      { type: "Port Scanning", count: randInt(15, 80), severity: "medium" },
      { type: "Brute Force", count: randInt(10, 50), severity: "high" },
      { type: "SQL Injection", count: randInt(5, 30), severity: "critical" },
      { type: "XSS Attack", count: randInt(3, 20), severity: "medium" },
      { type: "Data Exfiltration", count: randInt(1, 10), severity: "critical" },
    ],
    geo_threats: [
      { country: "Unknown/VPN", threats: randInt(20, 100) },
      { country: "China", threats: randInt(10, 50) },
      { country: "Russia", threats: randInt(8, 40) },
      { country: "Brazil", threats: randInt(5, 25) },
      { country: "India", threats: randInt(3, 20) },
      { country: "US", threats: randInt(5, 30) },
    ],
  };
}
