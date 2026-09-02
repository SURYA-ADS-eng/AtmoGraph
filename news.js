export const SEVERITY_META = {
  critical: { label: 'CRITICAL', color: '#ef4444', weight: 95 },
  high: { label: 'HIGH', color: '#f97316', weight: 78 },
  medium: { label: 'MEDIUM', color: '#eab308', weight: 55 },
}

export const NEWS_EVENTS = [
  {
    id: 'ev1',
    severity: 'critical',
    source: 'Reuters',
    time: '2 min ago',
    headline: 'Major port strike halts operations at Port of Rotterdam',
    description:
      "Dock workers at Europe's largest port have walked out indefinitely, halting all container traffic.",
    tags: ['Europe', 'Electronics', 'Automotive'],
    nodeId: 'port_rotterdam',
  },
  {
    id: 'ev2',
    severity: 'high',
    source: 'Bloomberg',
    time: '1 hr ago',
    headline: 'Taiwan semiconductor fab reports production disruption',
    description:
      'A major TSMC facility experienced a power outage affecting wafer production for the third time this quarter.',
    tags: ['Asia', 'Electronics'],
    nodeId: 'semiconductor_taiwan',
  },
  {
    id: 'ev3',
    severity: 'high',
    source: 'AP News',
    time: '10 hr ago',
    headline: 'Suez Canal traffic restricted due to vessel grounding',
    description:
      'A large container vessel has grounded in the Suez Canal, restricting passage for eastbound and westbound freight.',
    tags: ['M. East', 'Multi'],
    nodeId: 'suez_canal',
  },
  {
    id: 'ev4',
    severity: 'medium',
    source: 'Financial Times',
    time: '18 hr ago',
    headline: 'Cobalt prices surge amid Congo export restrictions',
    description:
      'New government regulations in DRC restrict cobalt exports, sending prices up sharply across the battery supply chain.',
    tags: ['Africa', 'Electronics'],
    nodeId: 'cobalt_congo',
  },
  {
    id: 'ev5',
    severity: 'medium',
    source: 'Nikkei Asia',
    time: '2 days ago',
    headline: 'Port of Shanghai congestion reaches record levels',
    description:
      'Container wait times at Shanghai hit 14 days, a new record. Ripple effects spreading across Pacific trade lanes.',
    tags: ['Asia', 'Multi'],
    nodeId: 'port_shanghai',
  },
  {
    id: 'ev6',
    severity: 'high',
    source: 'Reuters',
    time: '3 days ago',
    headline: 'Lithium mine in Australia suspends output after flooding',
    description:
      'Seasonal flooding has forced a temporary shutdown at one of the largest lithium extraction sites in Western Australia.',
    tags: ['Oceania', 'Electronics'],
    nodeId: 'lithium_australia',
  },
]
