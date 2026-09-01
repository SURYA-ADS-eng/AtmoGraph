import React from 'react';
import { Clock, AlertCircle, ChevronRight } from 'lucide-react';

interface TimelineSliderProps {
  selectedHorizon: '0D' | '30D' | '60D' | '90D';
  onSelectHorizon: (h: '0D' | '30D' | '60D' | '90D') => void;
  timelineData?: Record<string, any>;
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  selectedHorizon,
  onSelectHorizon,
  timelineData,
}) => {
  const horizons: Array<{ key: '0D' | '30D' | '60D' | '90D'; label: string; desc: string }> = [
    {
      key: '0D',
      label: 'NOW (Ground Zero)',
      desc: 'Immediate port shutdown & direct transit blockages',
    },
    {
      key: '30D',
      label: '30 DAYS',
      desc: 'Tier-1 component backlogs & factory buffer depletion',
    },
    {
      key: '60D',
      label: '60 DAYS',
      desc: 'Manufacturing assembly slowdowns & cross-sector stockouts',
    },
    {
      key: '90D',
      label: '90 DAYS',
      desc: 'Global retail shelf shortages & macroeconomic bottlenecks',
    },
  ];

  return (
    <div className="p-4 rounded-2xl bg-[#111726]/80 backdrop-blur-md border border-slate-800/80 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Predictive Cascade Timeline
          </span>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <span>Simulation Horizon:</span>
          <span className="font-mono font-bold text-sky-400">{selectedHorizon}</span>
        </div>
      </div>

      {/* Slider Buttons Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {horizons.map((h) => {
          const isSelected = selectedHorizon === h.key;
          const horizonStats = timelineData?.[h.key];

          return (
            <button
              key={h.key}
              onClick={() => onSelectHorizon(h.key)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-gradient-to-br from-sky-500/20 to-indigo-600/20 border-sky-500/50 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-black tracking-wide ${isSelected ? 'text-sky-300' : 'text-slate-300'}`}>
                  {h.label}
                </span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />}
              </div>

              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                {h.desc}
              </p>

              {horizonStats && (
                <div className="mt-auto pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-amber-400">
                    {horizonStats.high_risk_count ?? 0} high-risk
                  </span>
                  <span className="text-purple-400">
                    +{horizonStats.avg_delay_days ?? 0}d avg delay
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
