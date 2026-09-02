import { SEVERITY_META } from '../data/news'

export default function NewsFeed({ events, liveFeed, activeEventId, onSimulate }) {
  return (
    <aside className="w-[300px] shrink-0 border-r border-edge flex flex-col bg-panel">
      <div className="flex items-center justify-between px-4 py-3 border-b border-edge">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>📰</span> Live News Feed
        </div>
        {liveFeed && (
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Streaming
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-edge">
        {events.map((ev) => {
          const meta = SEVERITY_META[ev.severity]
          const active = ev.id === activeEventId
          return (
            <div
              key={ev.id}
              className={`px-4 py-3 transition-colors ${active ? 'bg-cyan-500/5' : 'hover:bg-white/[0.02]'}`}
            >
              <div className="flex items-center gap-2 text-[11px] mb-1.5">
                <span className="flex items-center gap-1 font-semibold" style={{ color: meta.color }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                  {meta.label}
                </span>
                <span className="text-slate-500">· {ev.source}</span>
                <span className="text-slate-500 ml-auto">🕐 {ev.time}</span>
              </div>
              <h3 className="text-[13px] font-medium text-slate-100 leading-snug mb-1">
                {ev.headline}
              </h3>
              <p className="text-[12px] text-slate-400 leading-snug mb-2 line-clamp-2">
                {ev.description}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {ev.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/40 text-slate-300"
                  >
                    {t}
                  </span>
                ))}
                <button
                  onClick={() => onSimulate(ev)}
                  className="ml-auto text-[11px] font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  ⚡ Simulate
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="px-4 py-2 border-t border-edge text-[11px] text-slate-500 flex items-center gap-1.5">
        ⚠️ NLP engine ingesting from 47 feeds
      </div>
    </aside>
  )
}
