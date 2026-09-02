import { CATEGORIES, NODE_MAP } from '../data/graph'

function Bar({ value, color }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
      />
    </div>
  )
}

function NodeRow({ item }) {
  const color = CATEGORIES[item.category].color
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <div className="min-w-0 flex-1">
        <div className="text-[12px] text-slate-200 truncate">{item.name}</div>
        <div className="text-[10px] text-slate-500">
          {CATEGORIES[item.category].label} · {item.region}
        </div>
      </div>
      <div className="w-16">
        <Bar value={item.impact} color={color} />
      </div>
      <span className="text-[11px] text-slate-400 w-7 text-right">{item.impact}%</span>
    </div>
  )
}

export default function ImpactPanel({ result, selectedNodeId, onClose }) {
  const node = selectedNodeId ? NODE_MAP[selectedNodeId] : null

  return (
    <aside className="w-[300px] shrink-0 border-l border-edge bg-panel flex flex-col overflow-y-auto">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-edge text-sm font-medium">
        <span>📊</span> Impact Analysis
      </div>

      {node ? (
        <div className="px-4 py-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-medium mb-1" style={{ color: CATEGORIES[node.category].color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORIES[node.category].color }} />
              {CATEGORIES[node.category].label.toUpperCase()}
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm">
              ✕
            </button>
          </div>
          <h2 className="text-base font-semibold text-slate-100 mb-1">{node.name}</h2>
          <div className="text-[11px] text-slate-400 mb-3">
            📍 {node.region} &nbsp; 🏷 {CATEGORIES[node.category].label}
          </div>

          {result && result.sourceId === node.id ? (
            <>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg border border-edge px-3 py-2">
                  <div className="text-[10px] text-slate-500 mb-0.5">📈 Impact Score</div>
                  <div className="text-xl font-semibold text-cyan-400">
                    {result.impactScore}
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                </div>
                <div className="rounded-lg border border-edge px-3 py-2">
                  <div className="text-[10px] text-slate-500 mb-0.5">🔀 Hops from Source</div>
                  <div className="text-xl font-semibold text-slate-100">0</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 mb-3 flex items-center gap-2">
                Status:
                <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-400 font-medium">
                  Disruption Source
                </span>
              </div>

              {result.suppliers.length > 0 && (
                <div className="mb-3">
                  <div className="text-[11px] font-medium text-slate-300 mb-1">
                    Suppliers ({result.suppliers.length})
                  </div>
                  {result.suppliers.map((s) => (
                    <NodeRow key={s.id} item={s} />
                  ))}
                </div>
              )}

              {result.distributesTo.length > 0 && (
                <div className="mb-3">
                  <div className="text-[11px] font-medium text-slate-300 mb-1">
                    Distributes To ({result.distributesTo.length})
                  </div>
                  {result.distributesTo.map((s) => (
                    <NodeRow key={s.id} item={s} />
                  ))}
                </div>
              )}

              <div className="mb-3">
                <div className="text-[11px] font-medium text-slate-300 mb-1.5">Impact by Category</div>
                {Object.entries(result.byCategory).map(([cat, count]) => (
                  <div key={cat} className="flex items-center gap-2 py-1">
                    <span className="text-[11px] text-slate-400 w-24 truncate">
                      {CATEGORIES[cat].label}
                    </span>
                    <div className="flex-1">
                      <Bar
                        value={(count / (result.affectedIds.length + 1)) * 100}
                        color={CATEGORIES[cat].color}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 w-4 text-right">{count}</span>
                  </div>
                ))}
              </div>

              {result.mostAffected.length > 0 && (
                <div>
                  <div className="text-[11px] font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    ⚠ Most Affected Nodes
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {result.mostAffected.map((m) => (
                      <div
                        key={m.id}
                        className="rounded-lg border border-edge px-3 py-2 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-[12px] text-slate-200">{m.name}</div>
                          <div className="text-[10px] text-slate-500">
                            {m.hops} hop{m.hops === 1 ? '' : 's'} · {m.region} ·{' '}
                            {CATEGORIES[m.category].label}
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <div className="text-sm font-semibold text-amber-400">{m.impact}</div>
                          <div className="text-[9px] text-slate-500">impact</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-[12px] text-slate-500">
              This node isn't currently part of an active disruption simulation. Simulate a news
              event that touches it, or click "Simulate" from the feed, to see its ripple impact.
            </p>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 text-slate-500">
          <span className="text-2xl mb-2">📉</span>
          <p className="text-[12px]">
            Select a news event to predict the ripple effect across the supply chain.
          </p>
        </div>
      )}
    </aside>
  )
}
