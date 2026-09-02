const STAT_DEFS = [
  { key: 'nodesAffected', label: 'Nodes Affected', icon: '🔗', color: 'text-slate-100', suffix: '' },
  { key: 'maxHops', label: 'Max Ripple Hops', icon: '📈', color: 'text-cyan-400', suffix: '' },
  { key: 'estDelay', label: 'Est. Delay', icon: '⏱', color: 'text-amber-400', suffix: 'd' },
  { key: 'estCostImpactM', label: 'Est. Cost Impact', icon: '💲', color: 'text-rose-400', suffix: 'M', prefix: '$' },
  { key: 'confidence', label: 'Confidence', icon: '✅', color: 'text-emerald-400', suffix: '%' },
]

export default function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 px-5 py-3 bg-base">
      {STAT_DEFS.map((def) => {
        const value = stats ? stats[def.key] : null
        return (
          <div
            key={def.key}
            className="rounded-lg border border-edge bg-panel px-4 py-3 flex items-center gap-3"
          >
            <span className="text-lg opacity-80">{def.icon}</span>
            <div>
              <div className={`text-lg font-semibold ${def.color}`}>
                {value === null || value === undefined
                  ? '—'
                  : `${def.prefix || ''}${value}${def.suffix}`}
              </div>
              <div className="text-[11px] text-slate-400">{def.label}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
