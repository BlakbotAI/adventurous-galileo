import React, { useState } from 'react';
import { Cpu, Search, Star, HelpCircle, X, Pin, ArrowRight } from 'lucide-react';
import { db } from '../services/db';

interface GraphNode {
  id: string;
  label: string;
  type: 'Civilization' | 'Person' | 'Artifact' | 'Route' | 'Document';
  x: number;
  y: number;
  description: string;
  evidenceTier: 'Established' | 'Scholarly Consensus' | 'Contested' | 'Speculative';
  startYear?: number;
  endYear?: number;
}

interface GraphEdge {
  source: string;
  target: string;
}

interface KnowledgeGraphProps {
  activeYear?: number | null;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ activeYear = null }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [pinnedNodeIds, setPinnedNodeIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Custom node states
  const [customNodes, setCustomNodes] = useState<GraphNode[]>(() => {
    const raw = localStorage.getItem('hios_custom_graph_nodes');
    return raw ? JSON.parse(raw) : [];
  });
  const [customEdges, setCustomEdges] = useState<GraphEdge[]>(() => {
    const raw = localStorage.getItem('hios_custom_graph_edges');
    return raw ? JSON.parse(raw) : [];
  });

  // Form states
  const [formLabel, setFormLabel] = useState('');
  const [formType, setFormType] = useState<GraphNode['type']>('Civilization');
  const [formDesc, setFormDesc] = useState('');
  const [formTier, setFormTier] = useState<GraphNode['evidenceTier']>('Established');
  const [formStart, setFormStart] = useState('-1000');
  const [formEnd, setFormEnd] = useState('500');
  const [formConnectId, setFormConnectId] = useState('');

  const handleAddCustomNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLabel.trim() || !formConnectId) return;

    const newId = `custom_${Date.now()}`;
    const angle = Math.random() * Math.PI * 2;
    const newNode: GraphNode = {
      id: newId,
      label: formLabel,
      type: formType,
      x: 400 + Math.cos(angle) * 150,
      y: 250 + Math.sin(angle) * 120,
      description: formDesc || 'Custom historical node added by scholar.',
      evidenceTier: formTier,
      startYear: parseInt(formStart) || undefined,
      endYear: parseInt(formEnd) || undefined
    };

    const newEdge: GraphEdge = {
      source: formConnectId,
      target: newId
    };

    const updatedNodes = [...customNodes, newNode];
    const updatedEdges = [...customEdges, newEdge];

    setCustomNodes(updatedNodes);
    setCustomEdges(updatedEdges);

    localStorage.setItem('hios_custom_graph_nodes', JSON.stringify(updatedNodes));
    localStorage.setItem('hios_custom_graph_edges', JSON.stringify(updatedEdges));

    // Clear form
    setFormLabel('');
    setFormDesc('');
  };

  const handleClearCustomNodes = () => {
    setCustomNodes([]);
    setCustomEdges([]);
    localStorage.removeItem('hios_custom_graph_nodes');
    localStorage.removeItem('hios_custom_graph_edges');
  };

  const civilizations = db.getCivilizations();
  const artifacts = db.getArtifacts();
  const figures = db.getFigures();
  const tradeRoutes = db.getTradeRoutes();
  const migrationRoutes = db.getMigrationRoutes();
  const documents = db.getDocuments();

  const SEEDED_COORDS: Record<string, {x: number, y: number}> = {
    kemet: { x: 400, y: 150 },
    kush: { x: 410, y: 250 },
    aksum: { x: 550, y: 240 },
    mali: { x: 260, y: 230 },
    benin: { x: 300, y: 340 },
    great_zimbabwe: { x: 480, y: 390 },
    tiwanaku: { x: 140, y: 350 },
    Mansa_Musa: { x: 190, y: 160 },
    Amanirenas: { x: 500, y: 170 },
    Abu_Bakr_II: { x: 170, y: 300 },
    art_ishango: { x: 450, y: 320 },
    art_qustul: { x: 320, y: 190 },
    art_gold_rhino: { x: 580, y: 355 },
    art_benin_plaque: { x: 230, y: 390 },
    trans_saharan: { x: 300, y: 100 },
    swahili_maritime: { x: 620, y: 290 },
    bantu_migration: { x: 380, y: 380 },
    doc_kouroukan: { x: 110, y: 200 },
    doc_timbuktu_astronomy: { x: 120, y: 110 }
  };

  const nodes: GraphNode[] = [];
  let dynamicCount = 0;

  const addNodeWithCoords = (
    id: string, 
    label: string, 
    type: GraphNode['type'], 
    description: string, 
    evidenceTier: GraphNode['evidenceTier'],
    startYear?: number,
    endYear?: number
  ) => {
    let coords = SEEDED_COORDS[id];
    if (!coords) {
      const angle = (dynamicCount * 0.9) % (2 * Math.PI);
      coords = {
        x: 400 + Math.cos(angle) * 220,
        y: 250 + Math.sin(angle) * 160
      };
      dynamicCount++;
    }
    nodes.push({ id, label, type, ...coords, description, evidenceTier, startYear, endYear });
  };

  civilizations.forEach(c => addNodeWithCoords(c.id, c.name, 'Civilization', c.evidenceNote || c.name, c.evidenceTier, c.startYear, c.endYear));
  figures.forEach(f => addNodeWithCoords(f.id, f.name, 'Person', f.biography, 'Established', f.startYear, f.startYear + 60));
  artifacts.forEach(a => addNodeWithCoords(a.id, a.name, 'Artifact', a.historicalContext, a.evidenceTier, a.startYear, a.startYear));
  tradeRoutes.forEach(r => addNodeWithCoords(r.id, r.name, 'Route', r.description, 'Established', r.startYear, r.endYear));
  migrationRoutes.forEach(r => addNodeWithCoords(r.id, r.name, 'Route', r.description, 'Established', r.startYear, r.endYear));
  documents.forEach(d => addNodeWithCoords(d.id, d.title, 'Document', d.significance, d.evidenceTier, d.startYear, d.startYear));

  const edges: GraphEdge[] = [
    { source: 'kemet', target: 'kush' },
    { source: 'kush', target: 'aksum' },
    { source: 'doc_kouroukan', target: 'Mansa_Musa' },
    { source: 'doc_timbuktu_astronomy', target: 'trans_saharan' },
    { source: 'benin', target: 'bantu_migration' },
    { source: 'great_zimbabwe', target: 'bantu_migration' },
    { source: 'great_zimbabwe', target: 'swahili_maritime' },
  ];

  figures.forEach(f => {
    if (f.civilizationId) {
      edges.push({ source: f.civilizationId, target: f.id });
    }
  });

  artifacts.forEach(a => {
    if (a.civilizationId) {
      edges.push({ source: a.civilizationId, target: a.id });
    }
  });

  // Inject custom nodes and edges
  customNodes.forEach(n => nodes.push(n));
  customEdges.forEach(e => edges.push(e));

  // Helper: check if nodes are neighbors
  const areNeighbors = (id1: string, id2: string) => {
    return edges.some(edge => 
      (edge.source === id1 && edge.target === id2) || 
      (edge.source === id2 && edge.target === id1)
    );
  };

  const isNodeInTemporalWindow = (node: GraphNode) => {
    if (activeYear === null) return true;
    const start = node.startYear ?? -Infinity;
    const end = node.endYear ?? node.startYear ?? Infinity;
    return activeYear >= start && activeYear <= end;
  };

  // Helper: check if a node is currently highlighted/active
  const isNodeHighlighted = (nodeId: string) => {
    // If nothing selected or pinned, default highlight all
    if (!selectedNodeId && pinnedNodeIds.length === 0) return true;
    
    // If selected, check if it's the selected node or neighbor
    if (selectedNodeId === nodeId) return true;
    if (selectedNodeId && areNeighbors(selectedNodeId, nodeId)) return true;

    // Check if pinned or neighbor of a pinned node
    if (pinnedNodeIds.includes(nodeId)) return true;
    if (pinnedNodeIds.some(pinnedId => areNeighbors(pinnedId, nodeId))) return true;

    return false;
  };

  // Handle clicking a node
  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  // Toggle pinning
  const togglePinNode = (nodeId: string) => {
    if (pinnedNodeIds.includes(nodeId)) {
      setPinnedNodeIds(pinnedNodeIds.filter(id => id !== nodeId));
    } else {
      setPinnedNodeIds([...pinnedNodeIds, nodeId]);
    }
  };

  const clearAllPins = () => {
    setPinnedNodeIds([]);
    setSelectedNodeId(null);
  };

  // Handle Search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = nodes.find(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
    if (found) {
      setSelectedNodeId(found.id);
      setPan({ x: 400 - found.x, y: 250 - found.y });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'Civilization': return '#d4af37'; // Gold
      case 'Person': return '#a855f7';        // Purple
      case 'Artifact': return '#22c55e';      // Green
      case 'Route': return '#cd7f32';         // Bronze
      case 'Document': return '#3b82f6';      // Blue
      default: return '#9ca3af';
    }
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 relative select-none">
      
      {/* Search and Node Controls */}
      <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">
        <div className="p-4 rounded-xl glass-panel border border-gold-500/10 space-y-4">
          <h3 className="text-sm font-serif text-gold-500 font-bold uppercase tracking-wider flex items-center gap-2">
            <Cpu size={16} /> Knowledge Network
          </h3>
          
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search node..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg text-xs glass-input text-gray-200"
              />
              <Search className="absolute left-2.5 top-2.5 text-gold-500/60" size={13} />
            </div>
            <button type="submit" className="px-3 bg-gold-600 hover:bg-gold-500 text-black text-xs font-semibold rounded-lg">
              Find
            </button>
          </form>

          {/* Node Legends */}
          <div className="space-y-1.5 text-[10px] text-gray-400">
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#d4af37' }} /> Civilization</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#a855f7' }} /> Figure</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#22c55e' }} /> Artifact</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#cd7f32' }} /> Route</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#3b82f6' }} /> Document / Book</div>
          </div>
        </div>

        {/* Pinned Nodes Manager */}
        {pinnedNodeIds.length > 0 && (
          <div className="p-4 rounded-xl glass-panel border border-gold-500/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-bronze-400 font-bold flex items-center gap-1">
                <Star size={12} /> Pinned Nodes ({pinnedNodeIds.length})
              </span>
              <button onClick={clearAllPins} className="text-[9px] text-gray-500 hover:text-white uppercase tracking-wider">
                Unpin All
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pinnedNodeIds.map(id => {
                const node = nodes.find(n => n.id === id);
                return (
                  <div key={id} className="flex items-center gap-1 px-2 py-0.5 rounded bg-matte-900 border border-gold-500/15 text-[10px] text-gray-300">
                    <span>{node?.label}</span>
                    <button onClick={() => togglePinNode(id)} className="text-gold-500 hover:text-white ml-1">
                      <X size={10} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Curation Instructions */}
        <div className="p-4 rounded-xl glass-panel border border-gold-500/10 text-xs leading-relaxed text-gray-400 space-y-2 hidden md:block">
          <h4 className="font-serif text-white font-semibold flex items-center gap-1.5"><HelpCircle size={13} className="text-gold-500" /> Graph Curation</h4>
          <p>This graph models relationships between physical objects, state formations, and trade networks.</p>
          <p>Click nodes to reveal connections. Pin multiple nodes (◆) to map complex inter-state pathways. Drag canvas to navigate.</p>
        </div>
      </div>

      {/* Network Canvas */}
      <div className="flex-1 relative rounded-2xl border border-gold-500/10 bg-matte-950 overflow-hidden select-none">
        
        {/* SVG Drawing Canvas */}
        <svg
          className="w-full h-full cursor-grab active:cursor-grabbing bg-matte-950"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Draw Edges */}
            <g>
              {edges.map((edge, idx) => {
                const sNode = nodes.find(n => n.id === edge.source);
                const tNode = nodes.find(n => n.id === edge.target);
                if (!sNode || !tNode) return null;

                const isSourceActive = isNodeHighlighted(edge.source);
                const isTargetActive = isNodeHighlighted(edge.target);
                const isEdgeHighlighted = (selectedNodeId === edge.source || selectedNodeId === edge.target) ||
                                           (pinnedNodeIds.includes(edge.source) || pinnedNodeIds.includes(edge.target));
                const isSourceTemporal = isNodeInTemporalWindow(sNode);
                const isTargetTemporal = isNodeInTemporalWindow(tNode);

                return (
                  <line
                    key={idx}
                    x1={sNode.x}
                    y1={sNode.y}
                    x2={tNode.x}
                    y2={tNode.y}
                    className="transition-all duration-300"
                    stroke={isEdgeHighlighted ? '#d4af37' : '#222'}
                    strokeWidth={isEdgeHighlighted ? 1.5 : 1}
                    opacity={isSourceActive && isTargetActive && isSourceTemporal && isTargetTemporal ? 0.75 : 0.08}
                  />
                );
              })}
            </g>

            {/* Draw Nodes */}
            <g>
              {nodes.map(node => {
                const isHighlighted = isNodeHighlighted(node.id);
                const isSelected = selectedNodeId === node.id;
                const isPinned = pinnedNodeIds.includes(node.id);
                const nodeColor = getNodeColor(node.type);
                const isTemporal = isNodeInTemporalWindow(node);
                const opacityVal = isHighlighted ? (isTemporal ? 1 : 0.15) : 0.08;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => handleNodeClick(node.id)}
                    opacity={opacityVal}
                  >
                    {/* Ring for selected node */}
                    {isSelected && (
                      <circle
                        r="18"
                        fill="transparent"
                        stroke="#d4af37"
                        strokeWidth="1.5"
                        className="animate-pulse"
                      />
                    )}

                    {/* Outer frame for Pinned Nodes */}
                    {isPinned && (
                      <rect
                        x="-14"
                        y="-14"
                        width="28"
                        height="28"
                        rx="4"
                        fill="transparent"
                        stroke="#d4af37"
                        strokeWidth="1"
                        transform="rotate(45)"
                      />
                    )}

                    {/* Node Core */}
                    <circle
                      r="8"
                      fill={nodeColor}
                      stroke="#080808"
                      strokeWidth="2"
                      className="hover:scale-125 transition-transform"
                    />

                    {/* Pin badge trigger */}
                    {isHighlighted && (
                      <g
                        transform="translate(10, -10)"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinNode(node.id);
                        }}
                      >
                        <circle r="5" fill="#1c1c1c" stroke={isPinned ? '#d4af37' : '#555'} strokeWidth="1" />
                        <text y="2" textAnchor="middle" fill={isPinned ? '#d4af37' : '#999'} fontSize="6" fontWeight="bold">◆</text>
                      </g>
                    )}

                    {/* Node Label */}
                    <text
                      y="20"
                      textAnchor="middle"
                      fill={isSelected ? '#d4af37' : isPinned ? '#fff' : '#b0b0b0'}
                      fontSize="9"
                      fontWeight={isSelected || isPinned ? 'bold' : 'normal'}
                      fontFamily="Cinzel, sans-serif"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        {/* Float Control Panel */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <button onClick={() => setZoom(prev => Math.min(2.5, prev + 0.1))} className="p-2 rounded bg-matte-900/90 border border-gold-500/20 text-gold-500 hover:bg-matte-800 transition-colors">+</button>
          <button onClick={() => setZoom(prev => Math.max(0.6, prev - 0.1))} className="p-2 rounded bg-matte-900/90 border border-gold-500/20 text-gold-500 hover:bg-matte-800 transition-colors">-</button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="px-3 py-2 text-xs rounded bg-matte-900/90 border border-gold-500/20 text-gold-500 hover:bg-matte-800 transition-colors">Reset Camera</button>
        </div>

        {/* Custom Node Injector Panel Overlay (Floating Right) */}
        <div className="absolute top-4 right-4 w-72 max-h-[calc(100%-32px)] overflow-y-auto p-4 rounded-xl glass-panel border border-gold-500/10 shadow-2xl backdrop-blur-md z-20 flex flex-col gap-3 text-[10px] bg-matte-950/80 scrollbar-thin">
          <div className="flex justify-between items-center border-b border-gold-500/10 pb-1.5">
            <h4 className="text-xs font-serif text-gold-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={12} /> Inject Node
            </h4>
            {customNodes.length > 0 && (
              <button
                onClick={handleClearCustomNodes}
                className="text-[9px] text-red-500 hover:text-red-400 font-mono"
              >
                Clear All
              </button>
            )}
          </div>
          
          <form onSubmit={handleAddCustomNode} className="space-y-2">
            <div>
              <label className="text-gray-400 block mb-1">Node Label / Title</label>
              <input
                type="text"
                placeholder="e.g. Timbuktu Astrolabe"
                required
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                className="w-full p-1.5 rounded bg-matte-900 border border-gold-500/10 text-gray-200"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Category Type</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as GraphNode['type'])}
                className="w-full p-1.5 rounded bg-matte-900 border border-gold-500/10 text-gray-200"
              >
                <option value="Civilization">Civilization</option>
                <option value="Person">Person</option>
                <option value="Artifact">Artifact</option>
                <option value="Route">Route</option>
                <option value="Document">Document</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Dossier Summary</label>
              <textarea
                placeholder="Details of custom historical artifact or figure..."
                rows={2}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="w-full p-1.5 rounded bg-matte-900 border border-gold-500/10 text-gray-200 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-gray-400 block mb-1">Start Year</label>
                <input
                  type="number"
                  value={formStart}
                  onChange={(e) => setFormStart(e.target.value)}
                  className="w-full p-1.5 rounded bg-matte-900 border border-gold-500/10 text-gray-200"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">End Year</label>
                <input
                  type="number"
                  value={formEnd}
                  onChange={(e) => setFormEnd(e.target.value)}
                  className="w-full p-1.5 rounded bg-matte-900 border border-gold-500/10 text-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Authenticity Rating</label>
              <select
                value={formTier}
                onChange={(e) => setFormTier(e.target.value as GraphNode['evidenceTier'])}
                className="w-full p-1.5 rounded bg-matte-900 border border-gold-500/10 text-gray-200"
              >
                <option value="Established">Established</option>
                <option value="Scholarly Consensus">Scholarly Consensus</option>
                <option value="Contested">Contested</option>
                <option value="Speculative">Speculative</option>
              </select>
            </div>

            <div>
              <label className="text-gold-500 block mb-1 font-bold">Connect To Existing Node</label>
              <select
                required
                value={formConnectId}
                onChange={(e) => setFormConnectId(e.target.value)}
                className="w-full p-1.5 rounded bg-matte-900 border border-gold-500/20 text-gray-200 font-semibold"
              >
                <option value="">-- Select target node --</option>
                {nodes.filter(n => !n.id.startsWith('custom_')).map(n => (
                  <option key={n.id} value={n.id}>
                    {n.label} ({n.type})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-2 rounded bg-gold-600 hover:bg-gold-500 text-black font-bold font-mono transition-colors"
            >
              Inject To Graph
            </button>
          </form>
        </div>

        {/* Selected Node Panel Overlay */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[450px] p-5 rounded-xl glass-panel border border-gold-500/20 shadow-2xl backdrop-blur-md animate-fade-in z-20">
            <div className="flex items-start justify-between border-b border-gold-500/10 pb-3">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-bronze-400 font-mono font-bold">
                  {selectedNode.type} dossier
                </span>
                <h4 className="text-base font-serif text-white font-bold">{selectedNode.label}</h4>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => togglePinNode(selectedNode.id)}
                  className={`p-1.5 rounded hover:bg-gold-500/10 border ${pinnedNodeIds.includes(selectedNode.id) ? 'border-gold-500 text-gold-400' : 'border-gold-500/10 text-gray-500'}`}
                  title="Pin Node Connections"
                >
                  <Pin size={12} />
                </button>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="p-1.5 rounded hover:bg-gold-500/10 border border-gold-500/10 text-gray-500 hover:text-white"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs leading-relaxed text-gray-300">
              <p>{selectedNode.description}</p>
              
              <div className="flex gap-2">
                <span className="text-gray-500">Historical Authenticity:</span>
                <span className="text-gold-400 font-semibold">{selectedNode.evidenceTier}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gold-500/5 flex items-center justify-between">
              <span className="text-[9px] text-gray-500">Node ID: {selectedNode.id}</span>
              <button className="text-[10px] text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-0.5">
                Explore Full Dossier <ArrowRight size={11} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default KnowledgeGraph;
