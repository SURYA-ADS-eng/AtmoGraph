# AtmoGraph — Supply Chain Ripple Effect Predictor

A dashboard that visualizes how a single supply-chain disruption (a port
strike, a factory outage, an export ban) ripples outward through a network
of raw materials, components, manufacturers, ports, warehouses, retailers,
and consumer markets.

> **Note on origin:** This is an independent rebuild, created from a screen
> recording of a similar-looking app. It is **not** a copy of any original
> source code — it's a fresh implementation (React + Vite + Tailwind) that
> reproduces the same layout, data model, and interactions: a live news
> feed, an interactive force-style network graph, and an impact-analysis
> side panel.

## Features

- **Live News Feed** — a scrollable list of supply-chain-relevant news
  events (port strikes, factory outages, export restrictions), each
  taggable and simulate-able.
- **Interactive network graph** (SVG) — nodes colored by category (raw
  material, component, manufacturer, port/hub, warehouse, retailer,
  consumer market), sized and numbered by computed impact once a
  simulation runs. Click any node to re-run the simulation treating it as
  the disruption source.
- **Ripple simulation engine** (`src/data/simulate.js`) — a deterministic
  breadth-first search over the supply graph that decays impact with each
  hop, then derives headline stats (nodes affected, max ripple hops,
  estimated delay, estimated cost impact, confidence).
- **Impact Analysis panel** — suppliers, downstream distribution targets,
  a per-category impact breakdown, and the top 3 most-affected nodes.
- **Node category filter** and a decorative **AI pipeline** panel, matching
  the reference UI.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
atmograph/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/
    │   ├── graph.js       # nodes, edges, category colors
    │   ├── news.js        # seed news events
    │   └── simulate.js    # ripple/BFS simulation engine
    └── components/
        ├── Header.jsx
        ├── StatsBar.jsx
        ├── NewsFeed.jsx
        ├── GraphView.jsx
        ├── CategoryLegend.jsx
        ├── AIPipeline.jsx
        └── ImpactPanel.jsx
```

## Extending it

- Add more nodes/edges in `src/data/graph.js` — coordinates are on a fixed
  1000×600 canvas, so new nodes just need an `x`/`y` and a `category`.
- Add more news events in `src/data/news.js` — each just needs a
  `nodeId` (which graph node it disrupts) and a `severity`.
- Swap the simulation in `src/data/simulate.js` for a real backend/model
  call if you want live predictions instead of the deterministic mock.
