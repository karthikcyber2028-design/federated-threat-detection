import { Shield, Server, Activity, Target, Database, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

const statCards = [
  { key: 'total_clients', label: 'Total Nodes', icon: Server, color: 'blue' },
  { key: 'active_clients', label: 'Active Nodes', icon: Activity, color: 'green' },
  { key: 'total_rounds', label: 'FL Rounds', icon: Target, color: 'purple' },
  { key: 'total_data_samples', label: 'Data Samples', icon: Database, color: 'cyan' },
  { key: 'current_global_accuracy', label: 'Global Accuracy', icon: CheckCircle, color: 'green', format: 'pct' },
  { key: 'threats_detected', label: 'Threats Detected', icon: AlertTriangle, color: 'red' },
  { key: 'threats_blocked', label: 'Threats Blocked', icon: Shield, color: 'emerald' },
  { key: 'model_versions', label: 'Model Versions', icon: Zap, color: 'amber' },
];

const colorMap = {
  blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
  green: 'from-green-500/20 to-green-600/5 border-green-500/20',
  purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
  cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
  red: 'from-red-500/20 to-red-600/5 border-red-500/20',
  emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
  amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
};

const iconBg = {
  blue: 'bg-blue-500/20 text-blue-400',
  green: 'bg-green-500/20 text-green-400',
  purple: 'bg-purple-500/20 text-purple-400',
  cyan: 'bg-cyan-500/20 text-cyan-400',
  red: 'bg-red-500/20 text-red-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  amber: 'bg-amber-500/20 text-amber-400',
};

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {statCards.map(({ key, label, icon: Icon, color, format }) => {
        let value = stats?.[key] ?? 0;
        if (format === 'pct') value = `${(value * 100).toFixed(1)}%`;
        return (
          <div
            key={key}
            className={`glass-card bg-gradient-to-br ${colorMap[color]} border rounded-xl p-4 hover:scale-[1.02] transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">{label}</span>
              <div className={`w-8 h-8 rounded-lg ${iconBg[color]} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mono text-2xl font-bold text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
