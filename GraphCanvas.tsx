import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { SupplyNode, SupplyEdge, DisruptionShock } from '../types/graph';
import { Search, ZoomIn, ZoomOut, Maximize2, Filter, AlertOctagon } from 'lucide-react';

interface GraphCanvasProps {
  nodes: SupplyNode[];
  edges: SupplyEdge[];
  activeDisruptions: Record<string, DisruptionShock>;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  timelineDays: number;
  layoutMode: 'force' | 'hierarchical';
}

const TIER_COLORS = [
  '#10b981', // 0: Raw Materials (Emerald)
  '#06b6d4', // 1: Tier-2 Components (Cyan)
  '#3b82f6', // 2: Tier-1 Manufacturers (Blue)
  '#a855f7', // 3: Finished Assembly (Purple)
  '#f59e0b', // 4: Logistics & Ports (Amber)
  '#f43f5e', // 5: Regional Markets (Rose)
];

const TIER_NAMES = [
  'Raw Materials',
  'Tier-2 Components',
  'Tier-1 Manufacturers',
  'Finished Assembly',
  'Logistics & Ports',
  'Consumer Markets'
];

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  edges,
  activeDisruptions,
  selectedNodeId,
  onSelectNode,
  timelineDays,
  layoutMode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const animFrameRef = useRef<number | null>(null);

  const [hoveredNode, setHoveredNode] = useState<SupplyNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<number | 'all'>('all');

  // Pulse animation phase
  const pulsePhaseRef = useRef(0);

  // Filtered nodes
  const displayNodes = useMemo(() => {
    return nodes.filter(n => {
      const matchSearch = searchQuery === '' || 
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTier = selectedTierFilter === 'all' || n.tier === selectedTierFilter;
      return matchSearch && matchTier;
    });
  }, [nodes, searchQuery, selectedTierFilter]);

  const activeNodeIds = useMemo(() => new Set(displayNodes.map(n => n.id)), [displayNodes]);

  const displayEdges = useMemo(() => {
    return edges.filter(e => {
      const sId = typeof e.source === 'object' ? (e.source as SupplyNode).id : e.source;
      const tId = typeof e.target === 'object' ? (e.target as SupplyNode).id : e.target;
      return activeNodeIds.has(sId) && activeNodeIds.has(tId);
    });
  }, [edges, activeNodeIds]);

  // Initialize and update D3 Force Simulation & Canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Retina support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Deep copy node and edge objects for simulation to attach x,y
    const simNodes: any[] = displayNodes.map(d => ({ ...d }));
    const simEdges: any[] = displayEdges.map(d => ({ ...d }));

    // Setup Force Simulation
    const simulation = d3.forceSimulation(simNodes)
      .force('link', d3.forceLink(simEdges).id((d: any) => d.id).distance(80).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-180).distanceMax(450))
      .force('collision', d3.forceCollide().radius(22).strength(0.8))
      .alphaDecay(0.02);

    if (layoutMode === 'hierarchical') {
      // Position nodes in tier columns left-to-right
      const colWidth = (width - 160) / 6;
      simulation
        .force('x', d3.forceX((d: any) => 80 + d.tier * colWidth).strength(0.85))
        .force('y', d3.forceY(height / 2).strength(0.15));
    } else {
      simulation.force('center', d3.forceCenter(width / 2, height / 2));
    }

    simulationRef.current = simulation;

    // Render loop
    const render = () => {
      pulsePhaseRef.current = (pulsePhaseRef.current + 0.04) % (Math.PI * 2);
      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // Apply zoom/pan transformation
      const transform = transformRef.current;
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // 1. Draw Hierarchical Column Backgrounds if in hierarchical mode
      if (layoutMode === 'hierarchical') {
        const colWidth = (width - 160) / 6;
        for (let i = 0; i < 6; i++) {
          const colX = 80 + i * colWidth;
          ctx.fillStyle = i % 2 === 0 ? 'rgba(15, 23, 42, 0.4)' : 'rgba(30, 41, 59, 0.2)';
          ctx.fillRect(colX - colWidth / 2 + 10, -500, colWidth - 20, height + 1000);

          ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`TIER ${i}: ${TIER_NAMES[i].toUpperCase()}`, colX, 30);
        }
      }

      // 2. Draw Edges
      simEdges.forEach(e => {
        const source = e.source;
        const target = e.target;
        if (!source || !target || source.x === undefined || target.x === undefined) return;

        const isSourceDisrupted = activeDisruptions[source.id] !== undefined;
        const isTargetDisrupted = activeDisruptions[target.id] !== undefined;
        const isImpactedPath = isSourceDisrupted || (source.risk_score > 0.3 && target.risk_score > 0.3);

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (isImpactedPath) {
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)';
          ctx.lineWidth = 2.5;
        } else {
          ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
          ctx.lineWidth = 1.0;
        }
        ctx.stroke();

        // Animated pulse particle along disrupted edge
        if (isImpactedPath) {
          const t = (Math.sin(pulsePhaseRef.current + (source.tier * 0.8)) + 1) / 2;
          const px = source.x + (target.x - source.x) * t;
          const py = source.y + (target.y - source.y) * t;

          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, 2 * Math.PI);
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      // 3. Draw Nodes
      simNodes.forEach(n => {
        if (n.x === undefined || n.y === undefined) return;

        const isDisrupted = activeDisruptions[n.id] !== undefined;
        const isSelected = selectedNodeId === n.id;
        const isHovered = hoveredNode?.id === n.id;

        // Dynamic delay calculation based on timeline slider
        const timelineDelay = timelineDays === 0 ? 0.0 :
          timelineDays === 30 ? n.predicted_delay_30d :
          timelineDays === 60 ? n.predicted_delay_60d : n.predicted_delay_90d;

        const hasSevereDelay = timelineDelay > 20 || n.risk_score > 0.45;

        // Base node radius (scaled by tier importance)
        let radius = n.tier === 4 || n.tier === 3 ? 12 : n.tier === 0 || n.tier === 5 ? 10 : 8;
        if (isSelected) radius += 4;
        if (isHovered) radius += 2;

        // Disruption / High Risk Outer Glow
        if (isDisrupted || hasSevereDelay) {
          const glowRadius = radius + 6 + Math.sin(pulsePhaseRef.current * 2) * 3;
          ctx.beginPath();
          ctx.arc(n.x, n.y, glowRadius, 0, 2 * Math.PI);
          ctx.fillStyle = isDisrupted ? 'rgba(244, 63, 94, 0.25)' : 'rgba(245, 158, 11, 0.2)';
          ctx.fill();
        }

        // Selected halo
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius + 4, 0, 2 * Math.PI);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Node Circle Body
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, 2 * Math.PI);

        // Fill Color: Disrupted (Red), High Delay (Amber/Rose), or Tier Color
        if (isDisrupted) {
          ctx.fillStyle = '#f43f5e';
        } else if (timelineDelay > 30) {
          ctx.fillStyle = '#fb7185';
        } else if (timelineDelay > 10) {
          ctx.fillStyle = '#f59e0b';
        } else {
          ctx.fillStyle = TIER_COLORS[n.tier] || '#06b6d4';
        }
        ctx.fill();

        // Node Border
        ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();

        // Node Label
        ctx.fillStyle = isSelected || isHovered ? '#ffffff' : 'rgba(226, 232, 240, 0.8)';
        ctx.font = isSelected || isHovered ? 'bold 11px sans-serif' : '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + radius + 13);
      });

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // D3 Zoom & Pan Setup
    const zoomBehavior = d3.zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        transformRef.current = event.transform;
      });

    d3.select(canvas).call(zoomBehavior as any);

    // Mouse Interaction (Hover & Click)
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const transform = transformRef.current;
      const graphX = (mouseX - transform.x) / transform.k;
      const graphY = (mouseY - transform.y) / transform.k;

      // Find closest node within detection distance
      const found = simNodes.find(n => {
        if (n.x === undefined || n.y === undefined) return false;
        const dx = n.x - graphX;
        const dy = n.y - graphY;
        return Math.sqrt(dx * dx + dy * dy) < 18;
      });

      if (found) {
        setHoveredNode(found);
        setTooltipPos({ x: event.clientX, y: event.clientY });
        canvas.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        setTooltipPos(null);
        canvas.style.cursor = 'default';
      }
    };

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const transform = transformRef.current;
      const graphX = (mouseX - transform.x) / transform.k;
      const graphY = (mouseY - transform.y) / transform.k;

      const found = simNodes.find(n => {
        if (n.x === undefined || n.y === undefined) return false;
        const dx = n.x - graphX;
        const dy = n.y - graphY;
        return Math.sqrt(dx * dx + dy * dy) < 20;
      });

      if (found) {
        onSelectNode(found.id);
      } else {
        onSelectNode(null);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      simulation.stop();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [displayNodes, displayEdges, activeDisruptions, selectedNodeId, timelineDays, layoutMode]);

  // Zoom control handlers
  const handleZoom = (scaleFactor: number) => {
    if (!canvasRef.current) return;
    const canvas = d3.select(canvasRef.current);
    canvas.transition().duration(250).call(
      d3.zoom().scaleBy as any, scaleFactor
    );
  };

  const handleResetZoom = () => {
    if (!canvasRef.current) return;
    const canvas = d3.select(canvasRef.current);
    canvas.transition().duration(350).call(
      d3.zoom().transform as any, d3.zoomIdentity
    );
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#070a12]">
      {/* Top Floating Graph Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search facility, port, or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 w-64 text-xs rounded-xl glass-panel text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 border border-slate-700/80 shadow-lg"
          />
        </div>

        {/* Tier Filter Dropdown */}
        <div className="relative flex items-center glass-panel px-2.5 py-1.5 rounded-xl border border-slate-700/80 text-xs text-slate-300">
          <Filter className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
          <select
            value={selectedTierFilter}
            onChange={(e) => setSelectedTierFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-transparent text-xs focus:outline-none text-slate-200 cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-slate-200">All Tiers (0-5)</option>
            <option value="0" className="bg-slate-900 text-slate-200">Tier 0: Raw Materials</option>
            <option value="1" className="bg-slate-900 text-slate-200">Tier 1: Components</option>
            <option value="2" className="bg-slate-900 text-slate-200">Tier 2: Manufacturers</option>
            <option value="3" className="bg-slate-900 text-slate-200">Tier 3: Assembly</option>
            <option value="4" className="bg-slate-900 text-slate-200">Tier 4: Ports & Logistics</option>
            <option value="5" className="bg-slate-900 text-slate-200">Tier 5: Consumer Markets</option>
          </select>
        </div>
      </div>

      {/* Floating Canvas Controls (Zoom In, Zoom Out, Reset) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-1.5 glass-panel p-1.5 rounded-xl border border-slate-800 shadow-xl">
        <button
          onClick={() => handleZoom(1.3)}
          title="Zoom In"
          className="p-2 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(0.7)}
          title="Zoom Out"
          className="p-2 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset View"
          className="p-2 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-all"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Legend */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel p-2.5 rounded-xl border border-slate-800/80 flex items-center space-x-4 text-[11px] text-slate-300">
        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Graph Tiers:</span>
        <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /><span>Raw (T0)</span></div>
        <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" /><span>Parts (T1)</span></div>
        <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /><span>Fabs (T2)</span></div>
        <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" /><span>Assembly (T3)</span></div>
        <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /><span>Ports (T4)</span></div>
        <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" /><span>Markets (T5)</span></div>
      </div>

      {/* Main Canvas Element */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Hover Tooltip Popup */}
      {hoveredNode && tooltipPos && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-3 glass-panel p-3 rounded-xl border border-slate-700 shadow-2xl min-w-[200px]"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="flex items-center justify-between space-x-2 border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="font-bold text-xs text-white">{hoveredNode.label}</span>
            <span className="px-1.5 py-0.5 text-[9px] rounded uppercase font-semibold bg-slate-800 text-slate-300">
              {hoveredNode.tier_name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            <span className="text-slate-400">Region:</span>
            <span className="text-slate-200 text-right font-medium">{hoveredNode.region}</span>

            <span className="text-slate-400">Inventory Buffer:</span>
            <span className="text-slate-200 text-right font-mono">{hoveredNode.inventory_buffer_days} Days</span>

            <span className="text-slate-400">Predicted Delay ({timelineDays}d):</span>
            <span className={`text-right font-bold font-mono ${
              (timelineDays === 0 ? 0 : timelineDays === 30 ? hoveredNode.predicted_delay_30d : timelineDays === 60 ? hoveredNode.predicted_delay_60d : hoveredNode.predicted_delay_90d) > 20
                ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {timelineDays === 0 ? '0.0' : timelineDays === 30 ? hoveredNode.predicted_delay_30d : timelineDays === 60 ? hoveredNode.predicted_delay_60d : hoveredNode.predicted_delay_90d} d
            </span>

            <span className="text-slate-400">Risk Score:</span>
            <span className={`text-right font-mono font-bold ${
              hoveredNode.risk_score > 0.4 ? 'text-rose-400' : hoveredNode.risk_score > 0.15 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {(hoveredNode.risk_score * 100).toFixed(0)}%
            </span>
          </div>

          {activeDisruptions[hoveredNode.id] && (
            <div className="mt-2 pt-1.5 border-t border-rose-500/30 flex items-center space-x-1.5 text-rose-400 text-[10px] font-semibold animate-pulse">
              <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
              <span>Ground Zero Shock: {activeDisruptions[hoveredNode.id].shock_type}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
