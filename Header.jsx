export default function Header({ liveFeed, onToggleLive }) {
  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-edge bg-panel">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-lg">
          🌐
        </div>
        <div>
          <h1 className="text-[15px] font-semibold leading-tight">AtmoGraph</h1>
          <p className="text-xs text-slate-400 leading-tight">
            Supply Chain Ripple Effect Predictor
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="hidden md:inline">
          GNN Model: <span className="text-slate-200">PyG-GraphSAGE</span>
        </span>
        <span className="hidden md:inline">
          NLP: <span className="text-slate-200">spaCy + BERT</span>
        </span>
        <button
          onClick={onToggleLive}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            liveFeed
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${liveFeed ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}
          />
          Live Feed
        </button>
      </div>
    </header>
  )
}
