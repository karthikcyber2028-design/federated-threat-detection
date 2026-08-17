import { AlertTriangle, Shield, Globe, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const severityColors = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

const PIE_COLORS = ['#ef4444', '#f97316', '#3b82f6', '#a855f7', '#22c55e', '#06b6d4'];

export default function ThreatPanel({ threatSummary, detectionResults, timeline }) {
  return (
    <div className="space-y-4">
      {/* Threat Summary Cards */}
      <div className="glass-card">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          Threat Overview
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-lg p-3 border border-red-500/20">
            <div className="text-xs text-slate-400 mb-1">Active Threats</div>
            <div className="text-2xl font-bold text-red-400 mono">{threatSummary?.active_threats || 0}</div>
          </div>
          <div className="glass rounded-lg p-3 border border-orange-500/20">
            <div className="text-xs text-slate-400 mb-1">Critical Alerts</div>
            <div className="text-2xl font-bold text-orange-400 mono">{threatSummary?.critical_alerts || 0}</div>
          </div>
          <div className="glass rounded-lg p-3 border border-green-500/20">
            <div className="text-xs text-slate-400 mb-1">Blocked Today</div>
            <div className="text-2xl font-bold text-green-400 mono">{threatSummary?.blocked_today || 0}</div>
          </div>
          <div className="glass rounded-lg p-3 border border-blue-500/20">
            <div className="text-xs text-slate-400 mb-1">Total 24h</div>
            <div className="text-2xl font-bold text-blue-400 mono">{threatSummary?.total_threats_24h || 0}</div>
          </div>
        </div>
      </div>

      {/* Top Attack Types */}
      <div className="glass-card">
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          Top Attack Types
        </h2>
        <div className="space-y-2">
          {threatSummary?.top_attack_types?.map((attack, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: severityColors[attack.severity] }} />
                <span className="text-slate-300">{attack.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="mono text-white">{attack.count}</span>
                <span className="text-[10px] uppercase font-medium px-1.5 py-0.5 rounded"
                  style={{
                    background: `${severityColors[attack.severity]}20`,
                    color: severityColors[attack.severity],
                  }}>
                  {attack.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geo Distribution */}
      <div className="glass-card">
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          Geographic Distribution
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={threatSummary?.geo_threats || []} layout="vertical" margin={{ left: 0, right: 10 }}>
              <XAxis type="number" stroke="#64748b" fontSize={10} />
              <YAxis type="category" dataKey="country" stroke="#64748b" fontSize={10} width={80} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="threats" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detection Results */}
      {detectionResults && (
        <div className="glass-card">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            Live Detection ({detectionResults.total_packets} packets)
          </h2>
          <div className="flex gap-4 mb-3">
            <div className="text-xs">
              <span className="text-slate-400">Threats: </span>
              <span className="text-red-400 mono font-bold">{detectionResults.threats_detected}</span>
            </div>
            <div className="text-xs">
              <span className="text-slate-400">Benign: </span>
              <span className="text-green-400 mono font-bold">{detectionResults.benign_count}</span>
            </div>
            <div className="text-xs">
              <span className="text-slate-400">Rate: </span>
              <span className="text-amber-400 mono font-bold">{(detectionResults.threat_rate * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {detectionResults.results?.slice(0, 15).map((r, i) => (
              <div key={i} className={`text-[11px] mono flex items-center justify-between px-2 py-1 rounded ${r.is_threat ? 'bg-red-500/10 text-red-300' : 'bg-green-500/5 text-slate-400'}`}>
                <span>{r.src_ip} → {r.dst_ip}</span>
                <span className={r.is_threat ? 'text-red-400' : 'text-green-400'}>
                  {r.classification} ({(r.confidence * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
