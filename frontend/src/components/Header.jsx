import { Shield, Activity, Wifi, AlertTriangle } from 'lucide-react';

export default function Header({ stats }) {
  return (
    <header className="glass border-b border-white/5 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center glow-green">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Fed<span className="text-green-400">Shield</span>
            </h1>
            <p className="text-xs text-slate-400">Federated Learning Threat Detection</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>System Online</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-green-400" />
              <span className="text-slate-400">Nodes: <span className="text-white font-medium">{stats?.active_clients || 0}/{stats?.total_clients || 0}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">Rounds: <span className="text-white font-medium">{stats?.total_rounds || 0}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Threats: <span className="text-white font-medium">{stats?.threats_detected || 0}</span></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
