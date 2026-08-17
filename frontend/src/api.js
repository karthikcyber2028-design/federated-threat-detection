const API_BASE = '/api';

export const api = {
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },

  async getClients() {
    const res = await fetch(`${API_BASE}/clients`);
    return res.json();
  },

  async getRounds() {
    const res = await fetch(`${API_BASE}/rounds`);
    return res.json();
  },

  async simulateRound(aggregation = 'fedavg') {
    const res = await fetch(`${API_BASE}/rounds/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aggregation }),
    });
    return res.json();
  },

  async simulateDetection() {
    const res = await fetch(`${API_BASE}/detect/simulate`, {
      method: 'POST',
    });
    return res.json();
  },

  async getThreatTimeline(points = 24) {
    const res = await fetch(`${API_BASE}/threats/timeline?points=${points}`);
    return res.json();
  },

  async getThreatSummary() {
    const res = await fetch(`${API_BASE}/threats/summary`);
    return res.json();
  },

  async health() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  createWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return new WebSocket(`${protocol}//${host}/ws/live`);
  },
};
