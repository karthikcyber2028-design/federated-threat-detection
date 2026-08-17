import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg p-2 border border-white/10 text-xs">
      <p className="text-slate-400 mb-1">{`Hour: ${label}`}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="mono text-[11px]">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export default function ThreatTimeline({ timeline }) {
  if (!timeline?.length) return null;

  const data = timeline.map((t) => ({
    hour: `${String(t.hour).padStart(2, '0')}:00`,
    threats: t.threats_detected,
    blocked: t.threats_blocked,
    traffic: t.benign_traffic,
  }));

  return (
    <div className="glass-card">
      <h2 className="text-lg font-semibold text-white mb-4">24-Hour Threat Timeline</h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="blockGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
            <YAxis stroke="#64748b" fontSize={10} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="threats" stroke="#ef4444" fill="url(#threatGrad)" strokeWidth={2} name="Detected" />
            <Area type="monotone" dataKey="blocked" stroke="#22c55e" fill="url(#blockGrad)" strokeWidth={2} name="Blocked" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
