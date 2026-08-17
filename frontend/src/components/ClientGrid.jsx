import { Shield, Radio, Server, Cloud, Bug, Eye } from 'lucide-react';

const nodeIcons = {
  firewall: Shield,
  ids: Radio,
  endpoint: Server,
  cloud: Cloud,
  honeypot: Bug,
};

const statusColors = {
  idle: 'bg-green-500',
  training: 'bg-blue-500 animate-pulse',
  updating: 'bg-amber-500 animate-pulse',
  offline: 'bg-slate-500',
};

const threatColors = {
  low: 'text-green-400',
  medium: 'text-amber-400',
  high: 'text-red-400',
};

export default function ClientGrid({ clients }) {
  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-green-400" />
          Federated Nodes
        </h2>
        <span className="text-xs text-slate-400 mono">{clients?.length || 0} nodes</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {clients?.map((client) => {
          const Icon = nodeIcons[client.node_type] || Server;
          return (
            <div
              key={client.id}
              className="glass rounded-lg p-3 border border-white/5 hover:border-green-500/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white mono">{client.name}</div>
                    <div className="text-xs text-slate-500">{client.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${statusColors[client.status]}`} />
                  <span className="text-xs text-slate-400 capitalize">{client.status}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Samples: <span className="text-white mono">{client.data_samples.toLocaleString()}</span>
                </span>
                <span className="text-slate-400">
                  Acc: <span className="text-green-400 mono">{(client.local_accuracy * 100).toFixed(1)}%</span>
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500 mono">{client.ip_address}</span>
                <span className={`font-medium uppercase ${threatColors[client.threat_level]}`}>
                  {client.threat_level}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Updates: <span className="mono text-slate-400">{client.total_updates}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
