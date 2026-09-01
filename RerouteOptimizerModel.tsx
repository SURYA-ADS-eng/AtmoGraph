import React, { useEffect, useState } from 'react';
import { RerouteOption } from '../types/graph';
import { fetchRerouteOptions } from '../services/api';
import { 
  X, 
  Navigation, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  ShieldCheck, 
  Plane, 
  Anchor, 
  Train,
  Check
} from 'lucide-react';

interface RerouteOptimizerModalProps {
  nodeId: string | null;
  onClose: () => void;
  onApplyMitigation: (strategyName: string) => void;
}

export const RerouteOptimizerModal: React.FC<RerouteOptimizerModalProps> = ({
  nodeId,
  onClose,
  onApplyMitigation
}) => {
  const [solutions, setSolutions] = useState<RerouteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [appliedStrategy, setAppliedStrategy] = useState<string | null>(null);

  useEffect(() => {
    if (!nodeId) return;

    setLoading(true);
    fetchRerouteOptions(nodeId)
      .then(res => setSolutions(res.solutions))
      .catch(err => console.error('Failed to load reroute options:', err))
      .finally(() => setLoading(false));
  }, [nodeId]);

  if (!nodeId) return null;

  const handleApply = (strategyName: string) => {
    setAppliedStrategy(strategyName);
    onApplyMitigation(strategyName);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel-glow w-full max-w-2xl rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Proactive Supply Chain Rerouting Optimizer
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Mitigation Solver for Bottleneck Node: <span className="text-cyan-300 font-bold">{nodeId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            AI Graph Path Solver evaluated <span className="font-bold text-cyan-300">3 alternative multimodal corridors</span> bypassing the active bottleneck. Select a proactive mitigation plan to reroute shipments immediately.
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-cyan-400">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Computing optimal Pareto front (Cost vs Delay)...</span>
            </div>
          ) : (
            solutions.map((sol, idx) => {
              const isApplied = appliedStrategy === sol.strategy_name;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    isApplied
                      ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/40'
                      : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                        {sol.mode.includes('Air') ? <Plane className="w-4 h-4" /> : sol.mode.includes('Rail') ? <Train className="w-4 h-4" /> : <Anchor className="w-4 h-4" />}
                      </span>
                      <div>
                        <span className="font-bold text-slate-100 text-xs">{sol.strategy_name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{sol.mode}</span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {sol.status}
                    </span>
                  </div>

                  {/* Operational Details */}
                  <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                    {sol.details}
                  </p>

                  {/* Alternative Path Chips */}
                  <div className="mt-2 flex items-center space-x-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500 font-mono">Routing Path:</span>
                    {sol.alternative_path.map((hop, hIdx) => (
                      <React.Fragment key={hIdx}>
                        <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-200 border border-slate-700">
                          {hop}
                        </span>
                        {hIdx < sol.alternative_path.length - 1 && (
                          <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Trade-off Metrics & Action */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-emerald-400 font-mono font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{sol.delay_delta_days} Days Delay</span>
                      </div>

                      <div className="flex items-center space-x-1 text-amber-300 font-mono font-bold">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>+${(sol.incremental_cost_usd / 1000).toFixed(0)}k Cost</span>
                      </div>

                      <div className="flex items-center space-x-1 text-purple-300 font-mono font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{(sol.feasibility_score * 100).toFixed(0)}% Feasibility</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApply(sol.strategy_name)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 ${
                        isApplied
                          ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                          : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Active Reroute</span>
                        </>
                      ) : (
                        <span>Activate Reroute</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
