import { Play, RotateCw, CheckCircle, Clock, Users } from 'lucide-react';

export default function FlRounds({ rounds, onSimulate, isSimulating }) {
  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <RotateCw className="w-5 h-5 text-purple-400" />
          Federated Learning Rounds
        </h2>
        <button
          onClick={onSimulate}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-slate-600 disabled:to-slate-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-green-500/20"
        >
          {isSimulating ? (
            <RotateCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isSimulating ? 'Running...' : 'Simulate Round'}
        </button>
      </div>

      {rounds.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          No rounds completed yet. Click "Simulate Round" to start federated training.
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {[...rounds].reverse().map((round) => (
            <div
              key={round.id}
              className="glass rounded-lg p-3 border border-white/5 hover:border-purple-500/20 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">
                    Round #{round.round_number}
                  </span>
                  <span className="text-[10px] mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    {round.aggregation_method}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mono">v{round.model_version}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Accuracy</span>
                  <div className="mono text-green-400 font-medium">{(round.global_accuracy * 100).toFixed(2)}%</div>
                </div>
                <div>
                  <span className="text-slate-500">Precision</span>
                  <div className="mono text-blue-400 font-medium">{(round.global_precision * 100).toFixed(2)}%</div>
                </div>
                <div>
                  <span className="text-slate-500">Recall</span>
                  <div className="mono text-amber-400 font-medium">{(round.global_recall * 100).toFixed(2)}%</div>
                </div>
                <div>
                  <span className="text-slate-500">F1</span>
                  <div className="mono text-purple-400 font-medium">{(round.global_f1 * 100).toFixed(2)}%</div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
                <Users className="w-3 h-3" />
                {round.participating_clients.length} clients participated
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
