import React, { useState, useEffect, useRef } from 'react';
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
  const [is3D, setIs3D] = useState(false);
  const [mapTheme, setMapTheme] = useState<'satellite' | 'terrain' | 'dark'>('satellite');

  // Leaflet map hooks
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

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

  // Load Leaflet CDN script and stylesheet dynamically
  useEffect(() => {
    if ((window as any).L) {
      setMapLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // clean up link and script if needed
    };
  }, []);

  // Set up and manage Leaflet map instance
  useEffect(() => {
    if (!mapLoaded || is3D) return;

    const L = (window as any).L;
    if (!L) return;

    // 1. Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('leaflet-map-explorer', {
        zoomControl: false,
        attributionControl: false
      }).setView([12, 18], 3.2); // Center on African continent

      layerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }

    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;

    // 2. Set Tile Layer based on theme selection
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = '';
    if (mapTheme === 'satellite') {
      // Google Satellite Hybrid (lyrs=y)
      tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    } else if (mapTheme === 'terrain') {
      // Google Physical Terrain (lyrs=p)
      tileUrl = 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
    } else {
      // Dark styled tiles (CartoDB Dark Matter)
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 18
    }).addTo(map);

    // 3. Clear and draw current active data overlays
    layerGroup.clearLayers();

    // Draw active Kingdoms
    if (activeLayers.includes('kingdoms')) {
      const kingdoms = [
        { id: 'kemet', center: [26.8, 30.8], radius: 450000, color: '#d4af37' },
        { id: 'kush', center: [19.6, 30.4], radius: 400000, color: '#d4af37' },
        { id: 'aksum', center: [14.0, 39.0], radius: 350000, color: '#cd7f32' },
        { id: 'mali', center: [16.7, -3.0], radius: 600000, color: '#d4af37' },
        { id: 'benin', center: [6.3, 5.6], radius: 300000, color: '#cd7f32' },
        { id: 'great_zimbabwe', center: [-20.2, 30.9], radius: 350000, color: '#d4af37' },
        { id: 'tiwanaku', center: [-16.5, -68.6], radius: 350000, color: '#cd7f32' },
        { id: 'mapungubwe', center: [-22.2, 29.3], radius: 250000, color: '#d4af37' },
        { id: 'nok', center: [9.5, 8.0], radius: 300000, color: '#cd7f32' },
        { id: 'caral', center: [-10.9, -77.6], radius: 250000, color: '#cd7f32' },
        { id: 'inca', center: [-13.5, -71.9], radius: 650000, color: '#d4af37' },
        { id: 'mexica', center: [19.4, -99.1], radius: 550000, color: '#d4af37' },
        { id: 'moche', center: [-8.1, -79.0], radius: 300000, color: '#cd7f32' },
        { id: 'igbo_ukwu', center: [6.0, 7.0], radius: 200000, color: '#cd7f32' },
        { id: 'asante', center: [6.7, -1.6], radius: 350000, color: '#d4af37' },
        { id: 'oyo', center: [8.0, 4.3], radius: 300000, color: '#cd7f32' },
        { id: 'jolof', center: [15.3, -15.4], radius: 350000, color: '#d4af37' },
        { id: 'hausa', center: [12.0, 8.5], radius: 400000, color: '#d4af37' },
        { id: 'sao', center: [12.8, 14.5], radius: 250000, color: '#cd7f32' },
        { id: 'taino', center: [19.0, -72.0], radius: 400000, color: '#cd7f32' },
        { id: 'achaemenid', center: [29.9, 52.9], radius: 850000, color: '#d4af37' },
        { id: 'srivijaya', center: [-2.9, 104.7], radius: 750000, color: '#cd7f32' },
        { id: 'chola', center: [10.8, 79.1], radius: 650000, color: '#d4af37' },
        { id: 'kongo', center: [-6.1, 14.2], radius: 450000, color: '#cd7f32' }
      ];

      kingdoms.forEach(k => {
        if (isCivActiveInYear(k.id)) {
          const civData = CIVILIZATIONS.find(c => c.id === k.id);
          const circle = L.circle(k.center as any, {
            radius: k.radius,
            color: k.color,
            fillColor: k.color,
            fillOpacity: 0.22,
            weight: 1.5,
            dashArray: '4, 4'
          });
          circle.on('click', () => {
            setSelectedEntity({ ...civData, entityType: 'Kingdom' });
          });
          circle.addTo(layerGroup);
        }
      });
    }

    // Draw Trade Routes
    if (activeLayers.includes('routes')) {
      TRADE_ROUTES.forEach(route => {
        if (isRouteActiveInYear(route)) {
          const polyline = L.polyline(route.coordinates as any, {
            color: '#cd7f32',
            weight: 2.5,
            dashArray: '6, 6',
            opacity: 0.85
          });
          polyline.on('click', () => {
            setSelectedEntity({ ...route, entityType: 'Route' });
          });
          polyline.addTo(layerGroup);
        }
      });
    }

    // Draw Migration Routes
    if (activeLayers.includes('migrations')) {
      MIGRATION_ROUTES.forEach(route => {
        if (isRouteActiveInYear(route)) {
          const polyline = L.polyline(route.coordinates as any, {
            color: '#a855f7',
            weight: 2.5,
            dashArray: '6, 6',
            opacity: 0.85
          });
          polyline.on('click', () => {
            setSelectedEntity({ ...route, entityType: 'Route' });
          });
          polyline.addTo(layerGroup);
        }
      });
    }

    // Draw Archaeological Monuments
    if (activeLayers.includes('sites')) {
      markers.forEach(m => {
        if (isCivActiveInYear(m.civId)) {
          const marker = L.circleMarker([m.lat, m.lng], {
            radius: 8,
            color: '#080808',
            fillColor: '#22c55e',
            fillOpacity: 0.95,
            weight: 1.5
          });
          marker.on('click', () => {
            setSelectedEntity({ ...m, entityType: 'Site' });
          });
          marker.addTo(layerGroup);
        }
      });
    }

  }, [mapLoaded, is3D, activeLayers, activeYear, mapTheme]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = markers.find(m => m.name.toLowerCase().includes(searchVal.toLowerCase()));
    if (found && mapRef.current) {
      setSelectedEntity({ ...found, entityType: 'Site' });
      mapRef.current.setView([found.lat, found.lng], 6);
    }
  };

  const handleZoom = (factor: number) => {
    if (mapRef.current) {
      const zoom = mapRef.current.getZoom();
      mapRef.current.setZoom(factor > 1 ? zoom + 1 : zoom - 1);
    }
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

        {/* Map Theme Panel */}
        {!is3D && (
          <div className="p-4 rounded-xl glass-panel border border-gold-500/10 space-y-3">
            <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Cartographic Depiction Style</h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setMapTheme('satellite')}
                className={`py-1.5 rounded text-[10px] font-bold border transition-colors ${
                  mapTheme === 'satellite' ? 'bg-gold-500 text-black border-gold-500' : 'bg-matte-900 border-gold-500/10 text-gray-400'
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setMapTheme('terrain')}
                className={`py-1.5 rounded text-[10px] font-bold border transition-colors ${
                  mapTheme === 'terrain' ? 'bg-gold-500 text-black border-gold-500' : 'bg-matte-900 border-gold-500/10 text-gray-400'
                }`}
              >
                Terrain
              </button>
              <button
                onClick={() => setMapTheme('dark')}
                className={`py-1.5 rounded text-[10px] font-bold border transition-colors ${
                  mapTheme === 'dark' ? 'bg-gold-500 text-black border-gold-500' : 'bg-matte-900 border-gold-500/10 text-gray-400'
                }`}
              >
                Dark Map
              </button>
            </div>
          </div>
        )}

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
          <p>This map interface utilizes live Google Satellite and Physical Terrain layers to portray accurate geological continent boundaries.</p>
          <p>Drag the viewport to scan regions. Click circular hot-spots and trade networks to inspect historical files in the decolonial dossier drawer.</p>
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
        ) : !mapLoaded ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-xs italic">
            <span>Loading accurate Google Map grids...</span>
          </div>
        ) : (
          <div id="leaflet-map-explorer" className="w-full h-full min-h-[480px]" style={{ background: '#080808' }} />
        )}

        {/* Selected Entity Dossier Panel Overlay */}
        {selectedEntity && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[400px] p-5 rounded-xl glass-panel border border-gold-500/20 shadow-2xl backdrop-blur-md z-20">
            <div className="flex items-start justify-between border-b border-gold-500/10 pb-3">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-bronze-400 font-mono font-bold">
                  {selectedEntity.entityType || 'Archaeological Record'}
                </span>
                <h4 className="text-base font-serif text-white font-bold">{selectedEntity.name || selectedEntity.title}</h4>
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
