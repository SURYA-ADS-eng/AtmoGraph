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

Define the atmospheric graph schema: node types (weather station, monitoring hub, urban center, ocean buoy, mountain/altitude station, agricultural region, protected/wilderness zone), edge direction (upstream weather system → downstream affected region, i.e. prevailing wind/current flow), and per-node metadata (region, category, base sensitivity weight, elevation/coordinates).
Map out an initial reference network — 15–20 nodes and ~25 directed edges spanning N. America, S. America, Europe, Asia, Africa, and Oceania — modeled on realistic global wind/ocean-current and regional weather-dependency patterns.
Stand up the project scaffold: Vite + React + Tailwind, folder structure (src/data, src/components), routing-free single-page shell.
Design the news/event data shape: severity (critical/high/medium), source, headline, description, tags, event type (storm, heatwave, wildfire, pollution spike, flood, drought), and the graph node each event originates from.
Draft the color system and category legend (weather station = blue, monitoring hub = cyan, urban center = amber, ocean buoy = pink, mountain station = green, agricultural region = purple, protected zone = orange) to keep node meaning legible at a glance.

Deliverables:

src/data/graph.js — nodes, edges, categories, adjacency helpers
src/data/events.js — seed atmospheric events wired to graph nodes
Empty-shell app that renders the header and a static (non-interactive) node layout

Exit criteria: Data model is stable enough that Week 2+ work doesn't require schema changes.

Week 2 — Core Graph Visualization & Layout

Goal: A readable, responsive network graph and the surrounding dashboard chrome — no simulation logic yet.

Key activities:

Build the SVG-based GraphView: fixed-coordinate node layout, category-colored nodes sized by a base sensitivity value, directed edges drawn as lines between nodes (representing wind/current flow).
Build the three-pane dashboard shell: Header (branding, model badges, Live Feed toggle), StatsBar (5 metric cards), EventFeed (left panel), GraphView (center canvas), ImpactPanel (right panel, empty state).
Add floating overlays on the graph canvas: CategoryLegend (click to show/hide a category) and AIPipeline (decorative pipeline stages: Sensor Ingest → NLP/Event Tagging → GNN → Propagation Forecast).
Implement node click handling (selection state) and hover affordances, still without live data behind them.
Responsive pass: three-pane layout collapses sensibly, SVG canvas scales via viewBox.

Deliverables:

Fully laid-out, static dashboard UI matching the target design
CategoryLegend, AIPipeline, StatsBar, Header, EventFeed (list-only) components complete

Exit criteria: The dashboard looks and feels correct; nothing computes yet.

Week 3 — Simulation Engine & Event-to-Impact Pipeline

Goal: Make the graph react. Atmospheric events should propagate simulated impact through the network — this is the analytical core of the app.

Key activities:

Build the ripple-propagation engine: given a source node and a severity-weighted impact score, traverse outward along directed edges (BFS/DFS with decay per hop, reflecting how weather systems weaken with distance), producing a per-node "impact score" and an "affected path" list.
Define decay and compounding rules: severity multipliers (critical/high/medium), distance decay function, and handling for nodes reachable via multiple paths (impact aggregation, not just max/overwrite) — e.g. a region downwind of two converging storm systems.
Wire the EventFeed to the engine: selecting/injecting an event triggers propagation and updates node impact state; support multiple concurrent active events.
Animate the GraphView to reflect impact: pulse/glow on affected nodes, edge highlighting along traversed paths, intensity scaled by impact score, decay-out animation when an event ages out or is dismissed.
Build out the ImpactPanel: when a node or event is selected, show affected downstream/upstream nodes, cumulative impact score, and a plain-language summary of the propagation path (e.g. "Pacific storm system → coastal buoy → agricultural region: 3-day rainfall spike expected").
Wire up the StatsBar metrics to real state: active events count, nodes affected, average severity, highest-impact node, simulated "time to dissipation."
Add a basic event queue/timeline so multiple events can be injected sequentially (manually triggered for now, not yet on a timer).

Deliverables:

src/engine/propagation.js — pure functions for impact calculation and path traversal
src/state/ (or context/hook) — centralized simulation state (active events, node impact map, history)
GraphView animates in response to real propagation data
ImpactPanel and StatsBar fully data-driven

Exit criteria: Injecting any seed event produces a correct, visually legible ripple through the graph, and all panels reflect consistent state.

Week 4 — Realism Polish, "AI" Narrative Layer & Demo Hardening

Goal: Sell the illusion of a live AI-driven monitoring system, smooth every rough edge, and make the app demo-proof.

Key activities:

Animate the AIPipeline overlay to sync with real activity: stages light up in sequence (Sensor Ingest → NLP/Event Tagging → GNN Scoring → Propagation Forecast) whenever an event is processed, instead of idling decoratively.
Add a live/auto mode: timer-driven injection of queued or randomized atmospheric events so the dashboard feels like a running system rather than a manual demo (respecting the Header's Live Feed toggle).
Write a richer, larger event seed set (25–40 events) with varied severity/geography/type mix so auto mode doesn't repeat obviously; add a couple of multi-hop "cascading system" scenarios (e.g. a heatwave triggering drought triggering wildfire triggering downwind air-quality events) to showcase compounding impact.
Add micro-interactions: node tooltips with metadata, edge tooltips (flow direction/category), smooth transitions between selections, empty/loading states for ImpactPanel and EventFeed.
Performance pass: memoize propagation recalculation, throttle animation frames, verify no jank with several concurrent active events.
Accessibility & resilience pass: keyboard navigation for node selection, color-contrast check against the category legend, graceful handling of malformed/edge-case events (no matching node, zero-weight node, isolated node with no edges).
Cross-browser/responsive QA and a final visual polish pass (spacing, typography scale, legend/pipeline overlay positioning at smaller viewports).
Write a short internal README covering data shape, how to add nodes/edges/events, and how the propagation engine works.

Deliverables:

Auto-play live mode with expanded event dataset
Fully animated AIPipeline synced to real pipeline state
Polished, accessible, jank-free dashboard ready to demo end-to-end
README.md documenting data model and engine internals

Exit criteria: The app can run unattended in auto mode for several minutes, looks and feels like a live AI-driven atmospheric monitoring tool, and a new contributor can add a node/edge/event from the README alone without touching engine code.

Fully laid-out, static dashboard UI matching the target design
CategoryLegend, AIPipeline, StatsBar, Header, NewsFeed (list-only) components complete

Exit criteria: The dashboard looks and feels correct; nothing computes yet.
