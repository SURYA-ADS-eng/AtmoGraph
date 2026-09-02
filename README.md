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

Week 1 — Discovery, Data Modeling & Project Setup

Goal: Nail down the domain model and get a running skeleton before any visual polish.

Key activities:

Define the supply-chain graph schema: node types (raw material, component, manufacturer, port/hub, warehouse, retailer, consumer market), edge direction (supplier → consumer), and per-node metadata (region, category, base impact weight).
Map out an initial reference network — 15–20 nodes and ~25 directed edges spanning Asia, Europe, N. America, S. America, Africa, and Oceania — modeled on a realistic global electronics/automotive supply chain.
Stand up the project scaffold: Vite + React + Tailwind, folder structure (src/data, src/components), routing-free single-page shell.
Design the news-event data shape: severity (critical/high/medium), source, headline, description, tags, and the graph node each event originates from.
Draft the color system and category legend (raw material = blue, component = cyan, manufacturer = amber, port/hub = pink, warehouse = green, retailer = purple, consumer market = orange) to keep node meaning legible at a glance.

Deliverables:

src/data/graph.js — nodes, edges, categories, adjacency helpers
src/data/news.js — seed news events wired to graph nodes
Empty-shell app that renders the header and a static (non-interactive) node layout

Exit criteria: Data model is stable enough that Week 2+ work doesn't require schema changes.

Week 2 — Core Graph Visualization & Layout

Goal: A readable, responsive network graph and the surrounding dashboard chrome — no simulation logic yet.

Key activities:

Build the SVG-based GraphView: fixed-coordinate node layout, category-colored nodes sized by a base impact value, directed edges drawn as lines between nodes.
Build the three-pane dashboard shell: Header (branding, model badges, Live Feed toggle), StatsBar (5 metric cards), NewsFeed (left panel), GraphView (center canvas), ImpactPanel (right panel, empty state).
Add the floating overlays on the graph canvas: CategoryLegend (click to show/hide a category) and AIPipeline (decorative pipeline stages: Graph DB → NLP → GNN → Ripple Prediction).
Implement node click handling (selection state) and hover affordances, still without live data behind them.
Responsive pass: make sure the three-pane layout collapses sensibly and the SVG canvas scales via viewBox.

Deliverables:

Fully laid-out, static dashboard UI matching the target design
CategoryLegend, AIPipeline, StatsBar, Header, NewsFeed (list-only) components complete

Exit criteria: The dashboard looks and feels correct; nothing computes yet.
