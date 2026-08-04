import React, { useState } from 'react';
import { Layers, ZoomIn, ZoomOut, Search, Info, X } from 'lucide-react';
import { db } from '../services/db';
import { Globe3D } from '../components/Globe3D';

interface SiteMarker {
  name: string;
  lat: number;
  lng: number;
  type: 'City' | 'Monument' | 'Excavation';
  civId: string;
  description: string;
  dating: string;
}

interface WorldExplorerProps {
  activeYear?: number | null;
}

export const WorldExplorer: React.FC<WorldExplorerProps> = ({ activeYear = null }) => {
  const CIVILIZATIONS = db.getCivilizations();
  const TRADE_ROUTES = db.getTradeRoutes();
  const MIGRATION_ROUTES = db.getMigrationRoutes();
  
  const [activeLayers, setActiveLayers] = useState<string[]>(['kingdoms', 'sites']);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [searchVal, setSearchVal] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [is3D, setIs3D] = useState(false);

  const toggleLayer = (layerId: string) => {
    if (activeLayers.includes(layerId)) {
      setActiveLayers(activeLayers.filter(l => l !== layerId));
    } else {
      setActiveLayers([...activeLayers, layerId]);
    }
  };

  const isCivActiveInYear = (civId: string) => {
    if (activeYear === null) return true;
    const civ = CIVILIZATIONS.find(c => c.id === civId);
    if (!civ) return true;
    return activeYear >= civ.startYear && activeYear <= civ.endYear;
  };

  const isRouteActiveInYear = (route: any) => {
    if (activeYear === null) return true;
    return activeYear >= route.startYear && activeYear <= route.endYear;
  };

  // Coordinates mapping (mercator projection approximation for SVG)
  const getCoordinates = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 250 - (500 * mercN) / (2 * Math.PI);
    return { x, y };
  };

  const markers: SiteMarker[] = [
    { name: 'Meroë Pyramids', lat: 16.9022, lng: 33.7497, type: 'Monument', civId: 'kush', description: 'Royal burial city of the Kushite kings featuring over 200 steep-angled pyramids.', dating: 'Radio-carbon and Merotic script logs' },
    { name: 'Kerma Deffufa', lat: 19.6000, lng: 30.4000, type: 'Monument', civId: 'kush', description: 'Massive mud-brick monument (Deffufa) representing early Nubian religious architecture.', dating: 'Stratigraphy (2500 BCE)' },
    { name: 'Giza Pyramids', lat: 29.9792, lng: 31.1342, type: 'Monument', civId: 'kemet', description: 'Monumental limestone funerary structures built during the Old Kingdom of Kemet.', dating: 'Carbon-14 (2560 BCE)' },
    { name: 'Timbuktu University', lat: 16.7666, lng: -3.0026, type: 'City', civId: 'mali', description: 'Global center of Islamic education housing hundreds of thousands of scientific manuscripts.', dating: 'Textual records (12th Century CE)' },
    { name: 'Lalibela Churches', lat: 12.0319, lng: 39.0412, type: 'Monument', civId: 'aksum', description: 'Monolithic rock-hewn churches carved directly into pink volcanic tuff.', dating: 'Architectural Style (12th Century CE)' },
    { name: 'Great Enclosure', lat: -20.2681, lng: 30.9333, type: 'Monument', civId: 'great_zimbabwe', description: 'The largest dry-stone structure in sub-Saharan Africa, built without mortar.', dating: 'Carbon dating (1300 CE)' },
    { name: 'Lopo River Port', lat: -6.1200, lng: 12.3800, type: 'City', civId: 'kongo', description: 'Trading hub on the Congo River connecting the capital M\'banza Kongo to trade loops.', dating: 'Oral histories and trade ledgers' },
    { name: 'Tiwanaku Sun Gate', lat: -16.5547, lng: -68.6736, type: 'Monument', civId: 'tiwanaku', description: 'Monolithic stone gateway carved from a single block of andesite, bearing detailed carvings.', dating: 'Obsidian hydration (500 CE)' },
    { name: 'Mapungubwe Hill', lat: -22.2472, lng: 29.3872, type: 'Excavation', civId: 'mapungubwe', description: 'Stone-walled palace site containing the famous golden rhinoceros burial.', dating: 'Carbon-14 (1200 CE)' }
  ];

  const continentPaths = {
    africa: "M 360,170 C 370,180 390,170 410,180 C 430,190 450,195 470,210 C 480,220 500,210 520,240 C 530,250 510,270 490,290 C 480,300 460,330 460,350 C 460,370 450,390 440,410 C 430,420 415,440 405,445 C 390,450 380,430 380,410 C 385,395 385,370 375,360 C 365,350 355,340 345,320 C 335,300 320,280 310,260 C 305,250 300,240 305,230 C 310,220 325,210 330,190 C 335,170 345,160 360,170 Z",
    southAmerica: "M 200,240 C 220,250 240,270 250,290 C 260,310 270,330 270,350 C 270,370 255,400 240,430 C 230,450 210,470 205,480 C 200,480 195,470 190,450 C 185,430 170,390 160,370 C 150,350 145,330 145,320 C 145,310 150,300 160,280 C 170,260 185,250 200,240 Z",
    northAmerica: "M 100,50 C 130,40 180,30 210,50 C 220,60 230,70 250,80 C 270,90 280,105 285,115 C 290,125 280,140 260,150 C 240,160 220,180 200,190 C 190,195 180,210 170,230 C 160,240 150,240 145,230 C 140,220 145,200 135,190 C 125,180 100,170 90,155 C 80,140 70,120 70,100 C 70,80 85,60 100,50 Z",
    eurasia: "M 320,100 C 340,90 380,85 410,90 C 440,95 480,80 520,70 C 560,60 620,50 670,60 C 720,70 750,90 770,110 C 790,130 780,150 750,170 C 720,190 700,210 690,230 C 680,250 690,260 710,270 C 730,280 740,290 745,300 C 740,310 710,320 680,300 C 650,285 620,270 590,260 C 560,250 540,255 520,265 C 500,275 480,260 470,245 C 460,230 450,200 420,190 C 390,180 370,190 350,175 C 330,160 320,130 320,100 Z",
    australia: "M 670,320 C 690,320 710,330 720,345 C 730,360 725,380 710,395 C 695,410 675,410 655,405 C 635,400 625,385 625,370 C 625,355 650,320 670,320 Z"
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = markers.find(m => m.name.toLowerCase().includes(searchVal.toLowerCase()));
    if (found) {
      setSelectedEntity({ ...found, entityType: 'Site' });
      const coords = getCoordinates(found.lat, found.lng);
      setPanOffset({ x: 400 - coords.x, y: 250 - coords.y });
      setZoomLevel(1.5);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (factor: number) => {
    setZoomLevel(prev => Math.max(0.8, Math.min(3, prev * factor)));
  };

  const handleEntityClick = (entity: any, type: string) => {
    setSelectedEntity({ ...entity, entityType: type });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 relative">
      {/* Map Control Sidebar */}
      <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">
        {/* Layer Panel */}
        <div className="p-4 rounded-xl glass-panel border border-gold-500/10 space-y-4">
          <h3 className="text-sm font-serif text-gold-500 font-bold uppercase tracking-wider flex items-center gap-2">
            <Layers size={16} /> Map Explorer Layers
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 px-3 py-2 rounded bg-matte-900/50 hover:bg-matte-900 border border-gold-500/5 cursor-pointer text-xs transition-colors">
              <input
                type="checkbox"
                checked={activeLayers.includes('kingdoms')}
                onChange={() => toggleLayer('kingdoms')}
                className="rounded border-gold-500 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-transparent w-4 h-4"
              />
              <span className="flex-1 text-gray-300">Ancient Civilizations</span>
              <span className="w-2.5 h-2.5 rounded-full bg-gold-500/60 shadow-[0_0_5px_rgba(212,175,55,0.4)]" />
            </label>

            <label className="flex items-center gap-3 px-3 py-2 rounded bg-matte-900/50 hover:bg-matte-900 border border-gold-500/5 cursor-pointer text-xs transition-colors">
              <input
                type="checkbox"
                checked={activeLayers.includes('routes')}
                onChange={() => toggleLayer('routes')}
                className="rounded border-gold-500 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-transparent w-4 h-4"
              />
              <span className="flex-1 text-gray-300">Pre-Colonial Trade Routes</span>
              <span className="w-2.5 h-2.5 rounded-full bg-bronze-500/60 shadow-[0_0_5px_rgba(205,127,50,0.4)]" />
            </label>

            <label className="flex items-center gap-3 px-3 py-2 rounded bg-matte-900/50 hover:bg-matte-900 border border-gold-500/5 cursor-pointer text-xs transition-colors">
              <input
                type="checkbox"
                checked={activeLayers.includes('migrations')}
                onChange={() => toggleLayer('migrations')}
                className="rounded border-gold-500 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-transparent w-4 h-4"
              />
              <span className="flex-1 text-gray-300">Migration Paths</span>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500/60 shadow-[0_0_5px_rgba(168,85,247,0.4)]" />
            </label>

            <label className="flex items-center gap-3 px-3 py-2 rounded bg-matte-900/50 hover:bg-matte-900 border border-gold-500/5 cursor-pointer text-xs transition-colors">
              <input
                type="checkbox"
                checked={activeLayers.includes('sites')}
                onChange={() => toggleLayer('sites')}
                className="rounded border-gold-500 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-transparent w-4 h-4"
              />
              <span className="flex-1 text-gray-300">Archaeological Monuments</span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60 shadow-[0_0_5px_rgba(34,197,94,0.4)]" />
            </label>
          </div>
        </div>

        {/* Location Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search site (e.g. Meroë, Giza)"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg text-xs glass-input text-gray-200"
            />
            <Search className="absolute left-2.5 top-2.5 text-gold-500/60" size={13} />
          </div>
          <button type="submit" className="px-3 bg-gold-600 hover:bg-gold-500 text-black text-xs font-semibold rounded-lg">
            Find
          </button>
        </form>

        {/* Informational Card */}
        <div className="p-4 rounded-xl glass-panel border border-gold-500/10 text-xs leading-relaxed text-gray-400 space-y-2 flex-1 hidden md:block">
          <h4 className="font-serif text-white font-semibold flex items-center gap-1.5"><Info size={13} className="text-gold-500" /> Navigation Manual</h4>
          {activeYear !== null && (
            <div className="p-2 rounded bg-gold-950/20 border border-gold-500/20 text-gold-400 font-bold mb-2">
              Time filter: {activeYear < 0 ? `${Math.abs(activeYear)} BCE` : `${activeYear} CE`}
            </div>
          )}
          <p>The map outlines represent indigenous continental plates in a dark museum layout, centered by default on Nilotic and Sahelian African states.</p>
          <p>Drag the map viewport to explore the globe. Hover and click dots to reveal details. Double click or scroll to modify coordinate resolutions.</p>
        </div>
      </div>

      {/* Dynamic Map Canvas */}
      <div className="flex-1 relative rounded-2xl border border-gold-500/10 bg-matte-950 overflow-hidden select-none">
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button onClick={() => handleZoom(1.2)} className="p-2 rounded bg-matte-900/90 border border-gold-500/20 text-gold-500 hover:bg-matte-800 transition-colors" title="Zoom In"><ZoomIn size={16} /></button>
          <button onClick={() => handleZoom(0.8)} className="p-2 rounded bg-matte-900/90 border border-gold-500/20 text-gold-500 hover:bg-matte-800 transition-colors" title="Zoom Out"><ZoomOut size={16} /></button>
          <button 
            onClick={() => setIs3D(!is3D)} 
            className={`p-2 rounded border transition-colors ${
              is3D 
                ? 'bg-gold-500 text-black border-gold-500 font-bold' 
                : 'bg-matte-900/90 border-gold-500/20 text-gold-500 hover:bg-matte-800'
            }`} 
            title="Toggle 3D Sphere Projection"
          >
            <Layers size={16} />
          </button>
        </div>

        {is3D ? (
          <Globe3D 
            activeYear={activeYear}
            onSelectEntity={handleEntityClick}
          />
        ) : (
          /* Canvas SVG */
          <svg
            className="w-full h-full cursor-grab active:cursor-grabbing bg-matte-950"
            viewBox="0 0 800 500"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Main projection group */}
            <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
              {/* Styled World Outlines */}
              <g className="fill-matte-900/80 stroke-matte-800/80 stroke-1">
                <path d={continentPaths.eurasia} />
                <path d={continentPaths.africa} />
                <path d={continentPaths.northAmerica} />
                <path d={continentPaths.southAmerica} />
                <path d={continentPaths.australia} />
              </g>

              {/* Kingdoms Overlay */}
              {activeLayers.includes('kingdoms') && (
                <g>
                  {/* Ancient Kemet (Egypt) */}
                  <ellipse cx="440" cy="180" rx="35" ry="20" fill="url(#gold-radial)" className="stroke-gold-400 stroke-1 stroke-dashed cursor-pointer transition-opacity duration-300" opacity={isCivActiveInYear('kemet') ? 0.4 : 0.05} onClick={() => handleEntityClick(CIVILIZATIONS.find(c => c.id === 'kemet'), 'Kingdom')} />
                  
                  {/* Kush */}
                  <ellipse cx="445" cy="225" rx="30" ry="25" fill="url(#gold-radial)" className="stroke-gold-400 stroke-1 cursor-pointer transition-opacity duration-300" opacity={isCivActiveInYear('kush') ? 0.4 : 0.05} onClick={() => handleEntityClick(CIVILIZATIONS.find(c => c.id === 'kush'), 'Kingdom')} />
                  
                  {/* Aksum */}
                  <ellipse cx="475" cy="245" rx="20" ry="20" fill="url(#bronze-radial)" className="stroke-bronze-400 stroke-1 cursor-pointer transition-opacity duration-300" opacity={isCivActiveInYear('aksum') ? 0.4 : 0.05} onClick={() => handleEntityClick(CIVILIZATIONS.find(c => c.id === 'aksum'), 'Kingdom')} />
                  
                  {/* Mali & Songhai */}
                  <ellipse cx="335" cy="245" rx="40" ry="30" fill="url(#gold-radial)" className="stroke-gold-400 stroke-1 cursor-pointer transition-opacity duration-300" opacity={isCivActiveInYear('mali') ? 0.4 : 0.05} onClick={() => handleEntityClick(CIVILIZATIONS.find(c => c.id === 'mali'), 'Kingdom')} />
                  
                  {/* Benin & Nok */}
                  <ellipse cx="370" cy="275" rx="25" ry="25" fill="url(#bronze-radial)" className="stroke-bronze-400 stroke-1 cursor-pointer transition-opacity duration-300" opacity={isCivActiveInYear('benin') ? 0.4 : 0.05} onClick={() => handleEntityClick(CIVILIZATIONS.find(c => c.id === 'benin'), 'Kingdom')} />

                  {/* Great Zimbabwe */}
                  <ellipse cx="445" cy="380" rx="25" ry="20" fill="url(#gold-radial)" className="stroke-gold-400 stroke-1 cursor-pointer transition-opacity duration-300" opacity={isCivActiveInYear('great_zimbabwe') ? 0.4 : 0.05} onClick={() => handleEntityClick(CIVILIZATIONS.find(c => c.id === 'great_zimbabwe'), 'Kingdom')} />

                  {/* Tiwanaku / Andean */}
                  <ellipse cx="205" cy="355" rx="25" ry="35" fill="url(#bronze-radial)" className="stroke-bronze-400 stroke-1 cursor-pointer transition-opacity duration-300" opacity={isCivActiveInYear('tiwanaku') ? 0.4 : 0.05} onClick={() => handleEntityClick(CIVILIZATIONS.find(c => c.id === 'tiwanaku'), 'Kingdom')} />
                </g>
              )}

              {/* Trade Routes Overlay */}
              {activeLayers.includes('routes') && (
                <g>
                  {TRADE_ROUTES.map(route => {
                    let pathD = `M ${getCoordinates(route.coordinates[0][0], route.coordinates[0][1]).x} ${getCoordinates(route.coordinates[0][0], route.coordinates[0][1]).y}`;
                    for (let i = 1; i < route.coordinates.length; i++) {
                      const nextPt = getCoordinates(route.coordinates[i][0], route.coordinates[i][1]);
                      pathD += ` L ${nextPt.x} ${nextPt.y}`;
                    }
                    return (
                      <path
                        key={route.id}
                        d={pathD}
                        fill="none"
                        className="stroke-bronze-500/70 stroke-1.5 stroke-dash-array hover:stroke-gold-400 transition-all cursor-pointer"
                        strokeDasharray="4 4"
                        opacity={isRouteActiveInYear(route) ? 1.0 : 0.08}
                        onClick={() => handleEntityClick(route, 'Route')}
                      />
                    );
                  })}
                </g>
              )}

              {/* Migration Routes Overlay */}
              {activeLayers.includes('migrations') && (
                <g>
                  {MIGRATION_ROUTES.map(route => {
                    let pathD = `M ${getCoordinates(route.coordinates[0][0], route.coordinates[0][1]).x} ${getCoordinates(route.coordinates[0][0], route.coordinates[0][1]).y}`;
                    for (let i = 1; i < route.coordinates.length; i++) {
                      const nextPt = getCoordinates(route.coordinates[i][0], route.coordinates[i][1]);
                      pathD += ` Q ${(getCoordinates(route.coordinates[i-1][0], route.coordinates[i-1][1]).x + nextPt.x)/2 + 20} ${(getCoordinates(route.coordinates[i-1][0], route.coordinates[i-1][1]).y + nextPt.y)/2 - 20} ${nextPt.x} ${nextPt.y}`;
                    }
                    return (
                      <path
                        key={route.id}
                        d={pathD}
                        fill="none"
                        className="stroke-purple-500/50 stroke-2 hover:stroke-purple-400 transition-all cursor-pointer"
                        opacity={isRouteActiveInYear(route) ? 1.0 : 0.08}
                        onClick={() => handleEntityClick(route, 'Migration')}
                      />
                    );
                  })}
                </g>
              )}

              {/* Archaeological Site Pins */}
              {activeLayers.includes('sites') && (
                <g>
                  {markers.map((marker, idx) => {
                    const pt = getCoordinates(marker.lat, marker.lng);
                    const isMarkerActive = activeYear === null || isCivActiveInYear(marker.civId);
                    return (
                      <g 
                        key={idx} 
                        className="cursor-pointer transition-opacity duration-300" 
                        opacity={isMarkerActive ? 1.0 : 0.15}
                        onClick={() => handleEntityClick(marker, 'Site')}
                      >
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="5"
                          className="fill-green-500 stroke-matte-950 stroke-1 hover:fill-gold-400 animate-pulse-glow"
                        />
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="12"
                          className="fill-transparent stroke-green-500/30 stroke-1 hover:stroke-gold-400/50"
                        />
                      </g>
                    );
                  })}
                </g>
              )}
            </g>

            {/* Gradients */}
            <defs>
              <radialGradient id="gold-radial">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="bronze-radial">
                <stop offset="0%" stopColor="#cd7f32" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#cd7f32" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        )}

        {/* Selected Entity Detail Drawer */}
        {selectedEntity && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[450px] p-5 rounded-xl glass-panel border border-gold-500/20 shadow-2xl backdrop-blur-md animate-fade-in z-20">
            <div className="flex items-start justify-between border-b border-gold-500/10 pb-3">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-bronze-400 font-mono font-bold">
                  {selectedEntity.entityType || 'Archaeological Entity'}
                </span>
                <h4 className="text-base font-serif text-white font-bold">{selectedEntity.name}</h4>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="p-1 rounded hover:bg-gold-500/10 text-gray-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs leading-relaxed text-gray-300">
              <p>{selectedEntity.description || selectedEntity.evidenceNote || selectedEntity.historicalContext}</p>
              
              {selectedEntity.dating && (
                <div className="flex gap-2">
                  <span className="text-gray-500">Chronology Verification:</span>
                  <span className="text-gold-400 font-medium">{selectedEntity.dating}</span>
                </div>
              )}

              {selectedEntity.lat && (
                <div className="flex gap-2 font-mono text-[10px] text-gray-500">
                  <span>Coordinates:</span>
                  <span>{selectedEntity.lat.toFixed(4)}° N, {selectedEntity.lng.toFixed(4)}° E</span>
                </div>
              )}

              {selectedEntity.goods && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {selectedEntity.goods.map((g: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-bronze-950/40 text-bronze-300 border border-bronze-500/20 text-[10px]">
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {selectedEntity.civId && (
              <div className="pt-3 border-t border-gold-500/5 flex items-center justify-between">
                <span className="text-[10px] text-gray-500">Evidence status: <strong className="text-gold-500">Established</strong></span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default WorldExplorer;
