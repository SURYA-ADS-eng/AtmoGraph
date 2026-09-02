import { CATEGORIES } from '../data/graph'

export default function CategoryLegend({ hidden, onToggle }) {
  return (
    <div className="absolute left-3 bottom-3 w-[190px] rounded-lg border border-edge bg-panel/95 backdrop-blur px-3 py-3 text-xs">
      <div className="flex items-center gap-1.5 font-medium text-slate-200 mb-2">
        <span>🏷</span> Node Categories
      </div>
      <div className="flex flex-col gap-1.5">
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className={`flex items-center gap-2 px-1.5 py-1 rounded hover:bg-white/5 transition-colors ${
              hidden.has(key) ? 'opacity-40' : ''
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
            <span className="text-slate-300">{cat.label}</span>
            <span className="ml-auto text-slate-500">›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
