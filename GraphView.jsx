import { NODES, EDGES, CATEGORIES } from '../data/graph'

const VIEW_W = 1000
const VIEW_H = 600

function sizeForImpact(impact) {
  if (impact === undefined) return 9
  return 9 + Math.min(impact, 100) * 0.22
}

export default function GraphView({ result, selectedNodeId, onSelectNode, hiddenCategories }) {
  const impacts = result?.impacts || {}
  const hops = result?.hops || {}
  const sourceId = result?.sourceId

  const visibleNodes = NODES.filter((n) => !hiddenCategories.has(n.category))
  const visibleIds = new Set(visibleNodes.map((n) => n.id))

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#111a33" />
          <stop offset="100%" stopColor="#0a0e1a" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#bgGlow)" />

      {/* Edges */}
      <g>
        {EDGES.map(([a, b], i) => {
          if (!visibleIds.has(a) || !visibleIds.has(b)) return null
          const na = NODES.find((n) => n.id === a)
          const nb = NODES.find((n) => n.id === b)
          const activeEdge =
            result && a in hops && b in hops && Math.abs(hops[a] - hops[b]) === 1
          return (
            <line
              key={i}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={activeEdge ? '#f59e0b' : '#26314f'}
              strokeWidth={activeEdge ? 1.6 : 1}
              className={activeEdge ? 'animate-dash' : ''}
              opacity={activeEdge ? 0.85 : 0.6}
            />
          )
        })}
      </g>

      {/* Ripple pulse ring on source node */}
      {sourceId && visibleIds.has(sourceId) && (
        (() => {
          const n = NODES.find((x) => x.id === sourceId)
          return (
            <circle
              cx={n.x}
              cy={n.y}
              r={14}
              fill="none"
              stroke="#ef4444"
              strokeWidth={2}
              className="pulse-ring"
            />
          )
        })()
      )}

      {/* Nodes */}
      <g>
        {visibleNodes.map((n) => {
          const impact = impacts[n.id]
          const inResult = result ? n.id in hops : false
          const r = result ? sizeForImpact(impact) : sizeForImpact(n.baseImpact)
          const dimmed = result && !inResult
          const isSource = n.id === sourceId
          const isSelected = n.id === selectedNodeId
          const color = CATEGORIES[n.category].color

          return (
            <g
              key={n.id}
              transform={`translate(${n.x}, ${n.y})`}
              className="cursor-pointer"
              onClick={() => onSelectNode(n.id)}
              opacity={dimmed ? 0.25 : 1}
            >
              <circle
                r={r}
                fill={color}
                stroke={isSelected ? '#ffffff' : isSource ? '#ef4444' : 'transparent'}
                strokeWidth={isSelected ? 2.5 : isSource ? 2.5 : 0}
              />
              {impact !== undefined && impact >= 4 && (
                <>
                  <circle r={9} cx={r - 2} cy={-r + 2} fill="#0a0e1a" stroke={color} strokeWidth={1} />
                  <text
                    x={r - 2}
                    y={-r + 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="9"
                    fill="#fff"
                    fontWeight="600"
                  >
                    {impact}
                  </text>
                </>
              )}
              {/* label backdrop for legibility */}
              <rect
                x={-(n.name.length * 3.1)}
                y={r + 4}
                width={n.name.length * 6.2}
                height={14}
                fill="#0a0e1acc"
                rx="3"
                style={{ pointerEvents: 'none' }}
              />
              <text
                x={0}
                y={r + 13}
                textAnchor="middle"
                fontSize="11"
                fill="#cbd5e1"
                style={{ pointerEvents: 'none' }}
              >
                {n.name}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
