import React, { useState } from 'react';
import { Compass, Award, Grid } from 'lucide-react';
import { db } from '../services/db';

interface ExcavationSite {
  id: string;
  name: string;
  location: string;
  period: string;
  description: string;
  stratigraphy: string[];
  gridData: {
    [key: string]: {
      depthRequired: number;
      anomalyValue: number; // 0 to 10 for magnetometer scan
      artifactName: string;
      artifactInfo: string;
    };
  };
}

const SITES: ExcavationSite[] = [
  {
    id: 'taruga',
    name: 'Taruga (Nok Culture)',
    location: 'Nigeria / West Africa',
    period: 'c. 1000 BCE - 300 CE',
    description: 'An ancient Nok iron-smelting settlement. Known for terracotta figures and some of the earliest independent metallurgy sites.',
    stratigraphy: ['Humus Layer', 'Red Sandy Soil', 'Charcoal & Slag Deposit', 'Bedrock Clay'],
    gridData: {
      '1,2': { depthRequired: 1.5, anomalyValue: 8, artifactName: 'Nok Terracotta Head', artifactInfo: 'Finely detailed hollow-sculpted clay head depicting expressive facial features.' },
      '4,3': { depthRequired: 1.0, anomalyValue: 9, artifactName: 'Iron Tuyere Pipe', artifactInfo: 'Refractory clay blast-pipe used to channel oxygen into the smelting furnace.' },
      '2,5': { depthRequired: 2.0, anomalyValue: 6, artifactName: 'Tuyere Slag Fragment', artifactInfo: 'Vitrified residue proving high-temperature Nok iron refining.' }
    }
  },
  {
    id: 'meroe',
    name: 'Meroë Royal City',
    location: 'Sudan / Nile Valley',
    period: 'c. 591 BCE - 350 CE',
    description: 'Capital of the Kingdom of Kush. Famous for steep-angled pyramids, massive iron-works, and royal court complexes.',
    stratigraphy: ['Desert Sand Silt', 'Collapsed Mudbrick rubble', 'Ash & Charcoal layer', 'Silt Foundation'],
    gridData: {
      '3,3': { depthRequired: 1.0, anomalyValue: 9, artifactName: 'Meroitic Arrowhead', artifactInfo: 'Finely tempered iron tip proving extensive Kushite metallurgy.' },
      '0,4': { depthRequired: 2.0, anomalyValue: 7, artifactName: 'Candace Bronze Coin', artifactInfo: 'Minted trade currency featuring Queen Amanirenas or later monarchs.' },
      '5,1': { depthRequired: 1.5, anomalyValue: 5, artifactName: 'Meroitic Slab Hieroglyphs', artifactInfo: 'Engraved sandstone panel containing cursive Meroitic alphabet scripts.' }
    }
  },
  {
    id: 'mapungubwe',
    name: 'Mapungubwe Hill',
    location: 'Limpopo Valley / Southern Africa',
    period: 'c. 1075 CE - 1220 CE',
    description: 'Precursor to Great Zimbabwe. A class-stratified royal capital controlling Indian Ocean gold and ivory trades.',
    stratigraphy: ['Loose Topsoil', 'Royal Dwelling Ash', 'Gold Grave Layer', 'Rocky Hill Base'],
    gridData: {
      '2,2': { depthRequired: 1.5, anomalyValue: 9, artifactName: 'Gold Rhino Fragment', artifactInfo: 'Hammered gold foil sheeting stitched with gold tacks onto a wooden core.' },
      '5,4': { depthRequired: 1.0, anomalyValue: 8, artifactName: 'Glazed Glass Beads', artifactInfo: 'Indo-Pacific turquoise trade beads confirming active Indian Ocean maritime loops.' },
      '1,5': { depthRequired: 2.0, anomalyValue: 4, artifactName: 'Decorated Clay Bowl', artifactInfo: 'Spindle-impressed earthenware pot used in royal court assemblies.' }
    }
  }
];

export const ExcavationSimulator: React.FC = () => {
  const [activeSite, setActiveSite] = useState<ExcavationSite>(SITES[0]);
  const [activeTool, setActiveTool] = useState<'scan' | 'dig' | 'brush'>('scan');
  
  // Grid tracking states
  const [scannedCells, setScannedCells] = useState<{ [key: string]: boolean }>({});
  const [digDepths, setDigDepths] = useState<{ [key: string]: number }>({});
  const [brushedCells, setBrushedCells] = useState<{ [key: string]: boolean }>({});
  const [discoveredItems, setDiscoveredItems] = useState<Array<{ name: string; info: string; depth: number }>>([]);
  const [celebratedItem, setCelebratedItem] = useState<{ name: string; info: string; depth: number } | null>(null);

  const resetSite = (site: ExcavationSite) => {
    setActiveSite(site);
    setScannedCells({});
    setDigDepths({});
    setBrushedCells({});
    setDiscoveredItems([]);
    setCelebratedItem(null);
  };

  const handleCellClick = (r: number, c: number) => {
    const key = `${r},${c}`;
    
    if (activeTool === 'scan') {
      // Reveal anomaly intensity (magnetometer sweep)
      setScannedCells(prev => ({ ...prev, [key]: true }));
    } else if (activeTool === 'dig') {
      // Increase dig depth by 0.5m increments up to 2.5m
      const currentDepth = digDepths[key] || 0;
      if (currentDepth < 2.5) {
        setDigDepths(prev => ({ ...prev, [key]: currentDepth + 0.5 }));
      }
    } else if (activeTool === 'brush') {
      // Clear remaining dust if depth matches target
      const depth = digDepths[key] || 0;
      const target = activeSite.gridData[key];

      if (target && depth >= target.depthRequired) {
        if (!brushedCells[key]) {
          setBrushedCells(prev => ({ ...prev, [key]: true }));
          const newItem = { name: target.artifactName, info: target.artifactInfo, depth };
          setDiscoveredItems(prev => [...prev, newItem]);
          setCelebratedItem(newItem);
        }
      }
    }
  };

  // Add discovered items to user's local collections table
  const saveToCollections = () => {
    if (!celebratedItem) return;
    
    const existing = db.getCollections();
    let targetColl = existing.find(c => c.name.includes('Excavations'));
    
    if (!targetColl) {
      const newColl = {
        id: `excavation_coll_${Date.now()}`,
        name: 'Excavation Discoveries',
        description: 'Uncovered relics retrieved during interactive classroom excavations.',
        userId: 'student_1'
      };
      db.saveCollection(newColl);
      targetColl = newColl;
    }

    db.addCollectionItem({
      id: `item_excav_${Date.now()}`,
      collectionId: targetColl.id,
      itemId: `excav_${celebratedItem.name.replace(/\s+/g, '_').toLowerCase()}`,
      itemType: 'Artifact'
    });

    setCelebratedItem(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-gold-500/10 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl text-gold-500 font-serif font-bold tracking-wider flex items-center gap-2">
            <Compass className="animate-spin-slow text-gold-500" size={22} /> Virtual Excavations
          </h2>
          <p className="text-xs text-gray-500 font-light mt-0.5">Explore archaeological stratigraphy and discover verified historical artifacts.</p>
        </div>

        {/* Site Selector switches */}
        <div className="flex gap-2">
          {SITES.map(s => (
            <button
              key={s.id}
              onClick={() => resetSite(s)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wide border transition-all ${
                activeSite.id === s.id
                  ? 'bg-gradient-to-r from-gold-600 to-bronze-600 text-black border-gold-500 font-bold'
                  : 'bg-matte-900 border-gold-500/10 hover:border-gold-500/30 text-gray-400'
              }`}
            >
              {s.name.split(' ')[0]} Site
            </button>
          ))}
        </div>
      </div>

      {/* Main Sandbox Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Grid & Tools panel (Col Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Tool belt selection header */}
          <div className="p-3 rounded-xl bg-matte-950/60 border border-gold-500/10 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-mono">CHOOSE ARCHAEOLOGICAL TOOL:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTool('scan')}
                className={`px-3 py-1.5 rounded text-[10px] font-mono border transition-all ${
                  activeTool === 'scan'
                    ? 'bg-gold-500/20 text-gold-400 border-gold-500/40 font-semibold'
                    : 'bg-matte-900 border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                Scan (Magnetometer)
              </button>
              <button
                onClick={() => setActiveTool('dig')}
                className={`px-3 py-1.5 rounded text-[10px] font-mono border transition-all ${
                  activeTool === 'dig'
                    ? 'bg-gold-500/20 text-gold-400 border-gold-500/40 font-semibold'
                    : 'bg-matte-900 border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                Dig (Trowel)
              </button>
              <button
                onClick={() => setActiveTool('brush')}
                className={`px-3 py-1.5 rounded text-[10px] font-mono border transition-all ${
                  activeTool === 'brush'
                    ? 'bg-gold-500/20 text-gold-400 border-gold-500/40 font-semibold'
                    : 'bg-matte-900 border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                Clear (Brush)
              </button>
            </div>
          </div>

          {/* Interactive Grid Map */}
          <div className="p-4 rounded-2xl glass-panel border border-gold-500/10 flex items-center justify-center bg-matte-950/40">
            <div className="grid grid-cols-6 gap-2 w-full max-w-[480px] aspect-square">
              {Array.from({ length: 36 }).map((_, idx) => {
                const r = Math.floor(idx / 6);
                const c = idx % 6;
                const key = `${r},${c}`;
                
                const isScanned = scannedCells[key];
                const depth = digDepths[key] || 0;
                const isBrushed = brushedCells[key];
                
                // Determine display color/anomalies based on magnetometer data
                const siteData = activeSite.gridData[key];
                const heatIntensity = siteData && isScanned ? siteData.anomalyValue : 0;
                
                // Color codes cell based on scanning
                let cellBg = 'bg-matte-900 border-gold-500/5 hover:border-gold-500/30';
                if (isScanned) {
                  if (heatIntensity >= 8) {
                    cellBg = 'bg-red-950/20 border-red-500/40 text-red-400';
                  } else if (heatIntensity >= 4) {
                    cellBg = 'bg-amber-950/20 border-amber-500/30 text-amber-400';
                  } else {
                    cellBg = 'bg-blue-950/10 border-blue-500/10 text-blue-400';
                  }
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleCellClick(r, c)}
                    className={`rounded-lg flex flex-col items-center justify-center text-center cursor-pointer border transition-all duration-300 select-none relative overflow-hidden group ${cellBg}`}
                  >
                    {/* Depth indicators */}
                    {depth > 0 && !isBrushed && (
                      <div className="absolute inset-0 bg-bronze-950/30 flex flex-col justify-end p-1">
                        <span className="text-[8px] font-mono text-bronze-400 font-bold">{depth.toFixed(1)}m</span>
                      </div>
                    )}

                    {/* Uncovered Item Icons */}
                    {isBrushed ? (
                      <div className="w-full h-full bg-gold-950/30 border border-gold-500/40 flex items-center justify-center animate-bounce-slow">
                        <Award size={18} className="text-gold-400" />
                      </div>
                    ) : (
                      <>
                        <span className="text-[8px] opacity-20 font-mono tracking-widest">{key}</span>
                        {isScanned && (
                          <span className="text-[9px] font-mono mt-1 font-bold">
                            {heatIntensity > 0 ? `+${heatIntensity}μT` : 'Flat'}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Info and Stratigraphy Column */}
        <div className="space-y-6">
          
          {/* Site description */}
          <div className="p-4 rounded-xl glass-panel border border-gold-500/10 space-y-3">
            <h4 className="text-xs font-serif text-gold-500 font-bold uppercase tracking-wider">Active Excavation Site</h4>
            <div>
              <h3 className="text-sm font-bold text-white">{activeSite.name}</h3>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">{activeSite.location} | {activeSite.period}</p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-light">{activeSite.description}</p>
          </div>

          {/* Stratigraphic Soil Layers list */}
          <div className="p-4 rounded-xl glass-panel border border-gold-500/10 space-y-3">
            <h4 className="text-xs font-serif text-gold-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Grid size={12} /> Stratigraphy Layers
            </h4>
            <div className="space-y-2">
              {activeSite.stratigraphy.map((layer, idx) => (
                <div key={idx} className="flex gap-3 items-center text-[10px] font-mono p-2 rounded bg-matte-900 border border-gold-500/5">
                  <span className="text-gold-500 font-bold">L{idx + 1}</span>
                  <div className="flex-1">
                    <p className="text-gray-200">{layer}</p>
                    <p className="text-[8px] text-gray-500">Depth range: {((idx) * 0.5).toFixed(1)}m to {((idx + 1) * 0.5).toFixed(1)}m</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recovered Items Log */}
          <div className="p-4 rounded-xl glass-panel border border-gold-500/10 flex-1 space-y-3">
            <h4 className="text-xs font-serif text-gold-500 font-bold uppercase tracking-wider flex justify-between items-center">
              <span>Discovered Relics</span>
              <span className="px-1.5 py-0.5 rounded bg-gold-950/40 text-[9px] text-gold-400 border border-gold-500/20">{discoveredItems.length} Logged</span>
            </h4>
            {discoveredItems.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {discoveredItems.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-matte-900 border border-gold-500/5 text-[10px] space-y-1">
                    <p className="text-gold-400 font-semibold">{item.name}</p>
                    <p className="text-gray-400 leading-normal font-light">{item.info}</p>
                    <p className="text-[8px] text-gray-500 font-mono">Depth: {item.depth}m</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-28 text-center text-gray-600 text-xs italic">
                <span>Scan and dig tiles to discover artifacts.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Discovered item celebration pop-up overlay */}
      {celebratedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-2xl glass-panel border-2 border-gold-500/30 bg-matte-950/95 space-y-4 text-center relative">
            <div className="w-16 h-16 rounded-full bg-gold-950/40 border-2 border-gold-500 flex items-center justify-center mx-auto text-gold-400 shadow-lg shadow-gold-500/20">
              <Award size={32} className="animate-bounce" />
            </div>
            
            <div className="space-y-1">
              <span className="text-[9px] font-mono tracking-widest text-gold-500 uppercase font-bold">Uncovered Relic Logged</span>
              <h3 className="text-lg font-serif text-white font-bold">{celebratedItem.name}</h3>
              <span className="text-[10px] text-gray-500 font-mono block">Excavation Depth: {celebratedItem.depth}m</span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-light bg-matte-900 p-3 rounded-lg border border-gold-500/5">
              {celebratedItem.info}
            </p>

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setCelebratedItem(null)}
                className="px-4 py-2 rounded-lg text-xs bg-matte-900 border border-gold-500/10 text-gray-400 hover:text-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={saveToCollections}
                className="px-4 py-2 rounded-lg text-xs bg-gradient-to-r from-gold-600 to-bronze-600 text-black font-bold hover:brightness-110 transition-colors"
              >
                Catalog to Collections
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default ExcavationSimulator;
