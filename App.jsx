import { useState, useMemo } from 'react'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import NewsFeed from './components/NewsFeed'
import GraphView from './components/GraphView'
import CategoryLegend from './components/CategoryLegend'
import AIPipeline from './components/AIPipeline'
import ImpactPanel from './components/ImpactPanel'
import { NEWS_EVENTS } from './data/news'
import { simulateRipple } from './data/simulate'

export default function App() {
  const [liveFeed, setLiveFeed] = useState(true)
  const [activeEventId, setActiveEventId] = useState(null)
  const [simSourceId, setSimSourceId] = useState(null)
  const [simSeverity, setSimSeverity] = useState('high')
  const [hiddenCategories, setHiddenCategories] = useState(() => new Set())

  const result = useMemo(() => {
    if (!simSourceId) return null
    return simulateRipple(simSourceId, simSeverity)
  }, [simSourceId, simSeverity])

  function handleSimulate(event) {
    setActiveEventId(event.id)
    setSimSourceId(event.nodeId)
    setSimSeverity(event.severity)
  }

  // Clicking any node in the graph re-runs the ripple simulation treating
  // that node as the disruption source (matches the reference app's
  // "explore what-if" interaction).
  function handleSelectNode(nodeId) {
    setSimSourceId(nodeId)
    const matchingEvent = NEWS_EVENTS.find((e) => e.nodeId === nodeId)
    setSimSeverity(matchingEvent ? matchingEvent.severity : 'high')
    setActiveEventId(matchingEvent ? matchingEvent.id : null)
  }

  function handleClosePanel() {
    setSimSourceId(null)
    setActiveEventId(null)
  }

  function toggleCategory(key) {
    setHiddenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Header liveFeed={liveFeed} onToggleLive={() => setLiveFeed((v) => !v)} />
      <StatsBar stats={result?.stats} />

      <div className="flex flex-1 min-h-0">
        <NewsFeed
          events={NEWS_EVENTS}
          liveFeed={liveFeed}
          activeEventId={activeEventId}
          onSimulate={handleSimulate}
        />

        <main className="relative flex-1 min-w-0 bg-base">
          <GraphView
            result={result}
            selectedNodeId={simSourceId}
            onSelectNode={handleSelectNode}
            hiddenCategories={hiddenCategories}
          />
          <CategoryLegend hidden={hiddenCategories} onToggle={toggleCategory} />
          <AIPipeline />

          {!result && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-panel/90 border border-edge rounded-lg px-4 py-2 text-[12px] text-slate-400">
              Click a news event on the left to simulate a supply chain disruption
            </div>
          )}
        </main>

        <ImpactPanel result={result} selectedNodeId={simSourceId} onClose={handleClosePanel} />
      </div>
    </div>
  )
}
