// Category metadata: colors + labels, matching the AtmoGraph legend
export const CATEGORIES = {
  raw_material: { label: 'Raw Material', color: '#3b82f6' },
  component: { label: 'Component', color: '#22d3ee' },
  manufacturer: { label: 'Manufacturer', color: '#f59e0b' },
  port_hub: { label: 'Port / Hub', color: '#ec4899' },
  warehouse: { label: 'Warehouse', color: '#22c55e' },
  retailer: { label: 'Retailer', color: '#a855f7' },
  consumer_market: { label: 'Consumer Market', color: '#fb923c' },
}

// Fixed layout coordinates on a 0-1000 x 0-600 canvas
export const NODES = [
  // Raw materials
  { id: 'rare_earth_china', name: 'Rare Earth Metals (China)', category: 'raw_material', region: 'Asia', x: 210, y: 470, baseImpact: 20 },
  { id: 'cobalt_congo', name: 'Cobalt (Congo)', category: 'raw_material', region: 'Africa', x: 620, y: 560, baseImpact: 18 },
  { id: 'copper_chile', name: 'Copper (Chile)', category: 'raw_material', region: 'S. America', x: 470, y: 555, baseImpact: 16 },
  { id: 'lithium_australia', name: 'Lithium (Australia)', category: 'raw_material', region: 'Oceania', x: 780, y: 500, baseImpact: 14 },
  { id: 'silicon_taiwan', name: 'Silicon Wafers (Taiwan)', category: 'raw_material', region: 'Asia', x: 130, y: 380, baseImpact: 22 },

  // Components
  { id: 'semiconductor_taiwan', name: 'Semiconductor Fab (Taiwan)', category: 'component', region: 'Asia', x: 660, y: 400, baseImpact: 30 },
  { id: 'battery_skorea', name: 'Battery Cells (S. Korea)', category: 'component', region: 'Asia', x: 700, y: 470, baseImpact: 24 },
  { id: 'display_japan', name: 'Display Panels (Japan)', category: 'component', region: 'Asia', x: 900, y: 430, baseImpact: 18 },

  // Manufacturers
  { id: 'auto_stuttgart', name: 'Auto Assembly (Stuttgart)', category: 'manufacturer', region: 'Europe', x: 300, y: 300, baseImpact: 26 },
  { id: 'device_texas', name: 'Device Assembly (Texas)', category: 'manufacturer', region: 'N. America', x: 350, y: 380, baseImpact: 20 },
  { id: 'electronics_shenzhen', name: 'Electronics Assembly (Shenzhen)', category: 'manufacturer', region: 'Asia', x: 460, y: 440, baseImpact: 28 },
  { id: 'appliance_mexico', name: 'Appliance Mfg (Mexico)', category: 'manufacturer', region: 'N. America', x: 340, y: 490, baseImpact: 15 },

  // Ports / hubs
  { id: 'port_rotterdam', name: 'Port of Rotterdam', category: 'port_hub', region: 'Europe', x: 400, y: 220, baseImpact: 20 },
  { id: 'port_la', name: 'Port of Los Angeles', category: 'port_hub', region: 'N. America', x: 260, y: 260, baseImpact: 18 },
  { id: 'port_shanghai', name: 'Port of Shanghai', category: 'port_hub', region: 'Asia', x: 570, y: 250, baseImpact: 22 },
  { id: 'suez_canal', name: 'Suez Canal', category: 'port_hub', region: 'M. East', x: 500, y: 300, baseImpact: 16 },
  { id: 'panama_canal', name: 'Panama Canal', category: 'port_hub', region: 'Multi', x: 300, y: 350, baseImpact: 14 },

  // Warehouses
  { id: 'us_dc', name: 'US Distribution Center', category: 'warehouse', region: 'N. America', x: 180, y: 240, baseImpact: 12 },
  { id: 'eu_dc', name: 'EU Distribution Center', category: 'warehouse', region: 'Europe', x: 380, y: 150, baseImpact: 12 },

  // Retailers
  { id: 'global_retail', name: 'Global Retail Network', category: 'retailer', region: 'Multi', x: 260, y: 130, baseImpact: 10 },

  // Consumer markets
  { id: 'na_consumers', name: 'N. American Consumers', category: 'consumer_market', region: 'N. America', x: 120, y: 210, baseImpact: 8 },
  { id: 'eu_consumers', name: 'European Consumers', category: 'consumer_market', region: 'Europe', x: 320, y: 80, baseImpact: 8 },
]

// Directed supply-chain edges: raw material -> component -> manufacturer -> hub -> warehouse -> retailer -> consumer
export const EDGES = [
  // raw material -> component
  ['silicon_taiwan', 'semiconductor_taiwan'],
  ['rare_earth_china', 'semiconductor_taiwan'],
  ['cobalt_congo', 'battery_skorea'],
  ['lithium_australia', 'battery_skorea'],
  ['copper_chile', 'electronics_shenzhen'],
  ['rare_earth_china', 'display_japan'],

  // component -> manufacturer
  ['semiconductor_taiwan', 'electronics_shenzhen'],
  ['semiconductor_taiwan', 'device_texas'],
  ['battery_skorea', 'device_texas'],
  ['battery_skorea', 'electronics_shenzhen'],
  ['display_japan', 'electronics_shenzhen'],
  ['electronics_shenzhen', 'auto_stuttgart'],
  ['electronics_shenzhen', 'appliance_mexico'],

  // manufacturer -> port/hub
  ['electronics_shenzhen', 'port_shanghai'],
  ['auto_stuttgart', 'port_rotterdam'],
  ['device_texas', 'port_la'],
  ['appliance_mexico', 'panama_canal'],
  ['port_shanghai', 'suez_canal'],
  ['port_shanghai', 'panama_canal'],
  ['suez_canal', 'port_rotterdam'],
  ['panama_canal', 'port_la'],

  // port/hub -> warehouse
  ['port_rotterdam', 'eu_dc'],
  ['port_la', 'us_dc'],

  // warehouse -> retailer
  ['eu_dc', 'global_retail'],
  ['us_dc', 'global_retail'],

  // retailer -> consumer market
  ['global_retail', 'na_consumers'],
  ['global_retail', 'eu_consumers'],
]

export const NODE_MAP = Object.fromEntries(NODES.map((n) => [n.id, n]))

// Build adjacency (undirected, for ripple propagation) with directionality kept for "supplies to / distributes to"
export const FORWARD_ADJ = {}
export const BACKWARD_ADJ = {}
NODES.forEach((n) => {
  FORWARD_ADJ[n.id] = []
  BACKWARD_ADJ[n.id] = []
})
EDGES.forEach(([a, b]) => {
  FORWARD_ADJ[a].push(b)
  BACKWARD_ADJ[b].push(a)
})

export function neighbors(id) {
  return [...FORWARD_ADJ[id], ...BACKWARD_ADJ[id]]
}
