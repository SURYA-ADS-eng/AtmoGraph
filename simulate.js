import { NODE_MAP, FORWARD_ADJ, BACKWARD_ADJ } from './graph'
import { SEVERITY_META } from './news'

const MAX_HOPS = 4

// Deterministic pseudo-random from a string seed, so the same event always
// simulates to the same numbers.
function seedRandom(seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i)
    h |= 0
  }
  return () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff
    return (h % 1000) / 1000
  }
}

/**
 * Runs a ripple-effect simulation outward from a source node using BFS
 * over both forward (distributes-to) and backward (supplied-by) edges,
 * decaying impact with each hop.
 */
export function simulateRipple(sourceId, severity) {
  const rand = seedRandom(sourceId + severity)
  const base = SEVERITY_META[severity]?.weight ?? 70

  const hops = { [sourceId]: 0 }
  const queue = [sourceId]
  const order = [sourceId]

  while (queue.length) {
    const cur = queue.shift()
    if (hops[cur] >= MAX_HOPS) continue
    const nexts = [...FORWARD_ADJ[cur], ...BACKWARD_ADJ[cur]]
    for (const n of nexts) {
      if (!(n in hops)) {
        hops[n] = hops[cur] + 1
        order.push(n)
        queue.push(n)
      }
    }
  }

  const impacts = {}
  order.forEach((id) => {
    const h = hops[id]
    const decay = Math.pow(0.62, h)
    const jitter = 0.85 + rand() * 0.3
    const score = Math.round(base * decay * jitter)
    impacts[id] = Math.max(1, Math.min(100, score))
  })
  impacts[sourceId] = Math.max(impacts[sourceId], Math.round(base * (0.7 + rand() * 0.2)))

  const affectedIds = order.filter((id) => id !== sourceId && impacts[id] >= 4)
  const maxHops = affectedIds.reduce((m, id) => Math.max(m, hops[id]), 0)

  const nodesAffected = affectedIds.length + 1
  const estDelay = Math.round(12 + maxHops * 14 + rand() * 20)
  const estCostImpactM = Math.round(
    (impacts[sourceId] + affectedIds.reduce((s, id) => s + impacts[id], 0)) * 1.35,
  )
  const confidence = Math.round(74 + rand() * 20)

  // Impact by category
  const byCategory = {}
  ;[sourceId, ...affectedIds].forEach((id) => {
    const cat = NODE_MAP[id].category
    byCategory[cat] = (byCategory[cat] || 0) + 1
  })

  const suppliers = BACKWARD_ADJ[sourceId].map((id) => ({
    id,
    name: NODE_MAP[id].name,
    category: NODE_MAP[id].category,
    region: NODE_MAP[id].region,
    impact: impacts[id] ?? Math.round(base * 0.5),
  }))

  const distributesTo = FORWARD_ADJ[sourceId].map((id) => ({
    id,
    name: NODE_MAP[id].name,
    category: NODE_MAP[id].category,
    region: NODE_MAP[id].region,
    impact: impacts[id] ?? Math.round(base * 0.5),
  }))

  const mostAffected = [...affectedIds]
    .sort((a, b) => impacts[b] - impacts[a])
    .slice(0, 3)
    .map((id) => ({
      id,
      name: NODE_MAP[id].name,
      category: NODE_MAP[id].category,
      region: NODE_MAP[id].region,
      hops: hops[id],
      impact: impacts[id],
    }))

  return {
    sourceId,
    hops,
    impacts,
    affectedIds,
    stats: {
      nodesAffected,
      maxHops,
      estDelay,
      estCostImpactM,
      confidence,
    },
    impactScore: impacts[sourceId],
    byCategory,
    suppliers,
    distributesTo,
    mostAffected,
  }
}
