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
  const [isDetecting, setIsDetecting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
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
      setError(null);
    } catch (err) {
      setError('Failed to connect to backend. Make sure the API server is running on port 8000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const handleSimulateRound = async () => {
    setIsSimulating(true);
    try {
      const result = await api.simulateRound('fedavg');
      setRounds((prev) => [...prev, result.round]);
      await fetchAll();
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleDetect = async () => {
    setIsDetecting(true);
    try {
      const result = await api.simulateDetection();
      setDetectionResults(result);
    } catch (err) {
      console.error('Detection failed:', err);
    } finally {
      setIsDetecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center animate-pulse glow-green">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-slate-400 text-sm">Connecting to Federated Learning Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Header stats={stats} />

      <main className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="glass-card border border-red-500/30 bg-red-500/10 text-red-300 text-sm p-4 rounded-xl">
            {error}
          </div>
        )}

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
                disabled={isDetecting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-red-500/20"
              >
                {isDetecting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Run Threat Detection Scan</span>
                )}
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
