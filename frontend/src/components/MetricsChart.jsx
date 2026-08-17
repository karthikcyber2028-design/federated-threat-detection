import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg p-3 border border-white/10 text-xs">
      <p className="text-slate-400 mb-1">Round {label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="mono">
          {entry.name}: {(entry.value * 100).toFixed(2)}%
        </p>
      ))}
    </div>
  );
};

export default function MetricsChart({ rounds }) {
  const data = rounds.map((r) => ({
    round: r.round_number,
    accuracy: r.global_accuracy,
    precision: r.global_precision,
    recall: r.global_recall,
    f1: r.global_f1,
  }));

  if (data.length === 0) {
    return (
      <div className="glass-card">
        <h2 className="text-lg font-semibold text-white mb-4">Model Metrics</h2>
        <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
          Run FL rounds to see metrics
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h2 className="text-lg font-semibold text-white mb-4">Model Metrics Over Rounds</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="f1Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="round" stroke="#64748b" fontSize={11} tick={{ fill: '#64748b' }} />
            <YAxis domain={[0.5, 1]} stroke="#64748b" fontSize={11} tick={{ fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="accuracy" stroke="#22c55e" fill="url(#accGrad)" strokeWidth={2} name="Accuracy" />
            <Area type="monotone" dataKey="f1" stroke="#3b82f6" fill="url(#f1Grad)" strokeWidth={2} name="F1 Score" />
            <Line type="monotone" dataKey="precision" stroke="#a855f7" strokeWidth={1.5} dot={false} name="Precision" />
            <Line type="monotone" dataKey="recall" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Recall" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
