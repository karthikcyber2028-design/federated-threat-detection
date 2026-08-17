import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import ClientGrid from './components/ClientGrid';
import MetricsChart from './components/MetricsChart';
import FlRounds from './components/FlRounds';
import ThreatPanel from './components/ThreatPanel';
import ThreatTimeline from './components/ThreatTimeline';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [threatSummary, setThreatSummary] = useState(null);
  const [detectionResults, setDetectionResults] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const [s, c, r, ts, tl] = await Promise.all([
      api.getStats(),
      api.getClients(),
      api.getRounds(),
      api.getThreatSummary(),
      api.getThreatTimeline(24),
    ]);
    setStats(s);
    setClients(c);
    setRounds(r);
    setThreatSummary(ts);
    setTimeline(tl);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const handleSimulateRound = async () => {
    setIsSimulating(true);
    await new Promise((r) => setTimeout(r, 800));
    const result = await api.simulateRound('fedavg');
    setRounds((prev) => [...prev, result.round]);
    await fetchAll();
    setIsSimulating(false);
  };

  const handleDetect = async () => {
    const result = await api.simulateDetection();
    setDetectionResults(result);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center animate-pulse glow-green">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-slate-400 text-sm">Initializing Federated Learning Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Header stats={stats} />
      <main className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
        <StatsGrid stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MetricsChart rounds={rounds} />
            <ThreatTimeline timeline={timeline} />
            <ClientGrid clients={clients} />
          </div>
          <div className="space-y-6">
            <FlRounds rounds={rounds} onSimulate={handleSimulateRound} isSimulating={isSimulating} />
            <ThreatPanel
              threatSummary={threatSummary}
              detectionResults={detectionResults}
              timeline={timeline}
            />
            <div className="glass-card">
              <button
                onClick={handleDetect}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-red-500/20"
              >
                Run Threat Detection Scan
              </button>
            </div>
          </div>
        </div>
        <footer className="text-center text-xs text-slate-600 py-6 border-t border-white/5">
          FedShield — Federated Learning for Privacy-Preserving Network Threat Detection
        </footer>
      </main>
    </div>
  );
}
