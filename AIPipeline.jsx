const STAGES = [
  { icon: '🗄', label: 'Neo4j Graph DB' },
  { icon: '📝', label: 'NLP Engine (spaCy)' },
  { icon: '🕸', label: 'GNN (GraphSAGE)' },
  { icon: '⚡', label: 'Ripple Prediction' },
]

export default function AIPipeline() {
  return (
    <div className="absolute right-3 bottom-3 w-[190px] rounded-lg border border-edge bg-panel/95 backdrop-blur px-3 py-3 text-xs">
      <div className="flex items-center gap-1.5 font-medium text-slate-200 mb-2">
        <span>⚙</span> AI Pipeline
      </div>
      <div className="flex flex-col gap-1.5">
        {STAGES.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-2 px-1.5 py-1 rounded text-slate-300"
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
            <span className="ml-auto text-slate-500">›</span>
          </div>
        ))}
      </div>
    </div>
  )
}
