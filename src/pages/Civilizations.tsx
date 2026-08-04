import React, { useState } from 'react';
import { Landmark, ArrowLeft, Globe, Shield, MessageSquare, ExternalLink, AlertTriangle } from 'lucide-react';
import { db } from '../services/db';
import type { Civilization } from '../types/database';

interface CivilizationsProps {
  onNavigateToTab: (tab: string) => void;
  userRole: 'Student' | 'Scholar';
}

export const Civilizations: React.FC<CivilizationsProps> = ({ onNavigateToTab, userRole }) => {
  const CIVILIZATIONS = db.getCivilizations();
  const FIGURES = db.getFigures();
  const ARTIFACTS = db.getArtifacts();

  const [filterRegion, setFilterRegion] = useState<'All' | 'Africa' | 'Global'>('All');
  const [searchVal, setSearchVal] = useState('');
  const [selectedCiv, setSelectedCiv] = useState<Civilization | null>(null);

  const filteredCivs = CIVILIZATIONS.filter(civ => {
    const matchesRegion = 
      filterRegion === 'All' || 
      (filterRegion === 'Africa' && civ.africaCentered) || 
      (filterRegion === 'Global' && !civ.africaCentered);
    const matchesSearch = civ.name.toLowerCase().includes(searchVal.toLowerCase()) || 
                          civ.region.toLowerCase().includes(searchVal.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const getFiguresForCiv = (civId: string) => {
    return FIGURES.filter(f => f.civilizationId === civId);
  };

  const getArtifactsForCiv = (civId: string) => {
    return ARTIFACTS.filter(a => a.civilizationId === civId);
  };

  return (
    <div className="space-y-6 pb-12">
      {!selectedCiv ? (
        <>
          {/* List View Header & Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-gold-500/10 pb-4">
            <div className="flex gap-2">
              {(['All', 'Africa', 'Global'] as const).map((region) => (
                <button
                  key={region}
                  onClick={() => setFilterRegion(region)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-sans tracking-wide border transition-all ${
                    filterRegion === region
                      ? 'bg-gradient-to-r from-gold-600 to-bronze-600 text-black border-gold-500 font-bold shadow-md shadow-gold-500/10'
                      : 'bg-matte-900 border-gold-500/10 hover:border-gold-500/30 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {region === 'All' ? 'All Civilizations' : region === 'Africa' ? 'African World View' : 'Global Context'}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search dossiers..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg text-xs glass-input text-gray-200"
              />
              <Landmark className="absolute left-3 top-2.5 text-gold-500/60" size={13} />
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCivs.map((civ) => (
              <div
                key={civ.id}
                onClick={() => setSelectedCiv(civ)}
                className="group cursor-pointer rounded-xl overflow-hidden glass-card border border-bronze-500/10 flex flex-col h-[400px] justify-between"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={civ.imageUrl}
                    alt={civ.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-matte-950 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[9px] font-mono tracking-widest text-gold-400 uppercase font-semibold block">
                      {civ.period}
                    </span>
                    <h3 className="text-lg font-serif text-white font-black tracking-wide group-hover:text-gold-400 transition-colors">
                      {civ.name}
                    </h3>
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-[9px] text-gray-400 border border-gold-500/10">
                    {civ.region}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed font-light">
                      {civ.evidenceNote}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gold-500/5 flex items-center justify-between text-[10px]">
                    <span className="text-gray-500">
                      Evidence Status: <strong className="text-gold-400 font-semibold">{civ.evidenceTier}</strong>
                    </span>
                    <span className="text-gold-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open Dossier &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Detailed View */
        <div className="space-y-6 animate-fade-in">
          {/* Back Button */}
          <button
            onClick={() => setSelectedCiv(null)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-matte-900 border border-gold-500/10 hover:border-gold-500/30 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dossiers
          </button>

          {/* Banner Hero */}
          <div className="relative rounded-2xl overflow-hidden h-72 border border-gold-500/15">
            <img
              src={selectedCiv.imageUrl}
              alt={selectedCiv.name}
              className="w-full h-full object-cover filter brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-matte-950 via-matte-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono tracking-widest text-gold-400 uppercase font-semibold">
                  {selectedCiv.period}
                </span>
                <h1 className="text-3xl md:text-5xl font-serif text-white font-black tracking-wider glow-gold-text">
                  {selectedCiv.name}
                </h1>
                <p className="text-xs text-gray-400">{selectedCiv.region}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onNavigateToTab('ai-historian')}
                  className="px-4 py-2 bg-gradient-to-r from-gold-600 to-bronze-600 hover:from-gold-500 hover:to-bronze-500 text-black text-xs font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-gold-500/10 transition-colors"
                >
                  <MessageSquare size={14} /> Consult AI Historian
                </button>
                {selectedCiv.wikipediaUrl && (
                  <a
                    href={selectedCiv.wikipediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-matte-900 hover:bg-matte-800 border border-gold-500/15 text-gold-400 hover:text-gold-300 flex items-center justify-center transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Corrective Panel: Received Narrative vs Evidence */}
          <div className="p-5 rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-950/25 to-matte-900/60 flex flex-col sm:flex-row gap-4">
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0 self-start">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-serif text-amber-500 font-bold tracking-wider text-sm">ARCHIVAL RECTIFICATION</span>
                <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                  Tier: {selectedCiv.evidenceTier}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Eurocentric Biased Narrative</h4>
                  <p className="text-gray-400 italic leading-relaxed font-light">"{selectedCiv.receivedNarrative}"</p>
                </div>
                <div className="space-y-1 border-l-0 md:border-l border-gold-500/10 md:pl-4">
                  <h4 className="text-[10px] text-gold-400 uppercase tracking-wider font-semibold">Archaeological & Historical Evidence</h4>
                  <p className="text-gray-200 leading-relaxed font-light">{selectedCiv.evidenceNote}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Database Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Info Columns */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-xl glass-panel border border-gold-500/10 space-y-4">
                <h3 className="text-base font-serif text-gold-500 font-bold border-b border-gold-500/10 pb-2 flex items-center gap-2">
                  <Shield size={16} /> Key Characteristics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-gray-500 font-semibold uppercase text-[9px] tracking-wider block">Government</span>
                    <span className="text-gray-300">{selectedCiv.government || 'De-centralized Guild Federations'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-500 font-semibold uppercase text-[9px] tracking-wider block">Religion & State Philosophy</span>
                    <span className="text-gray-300">{selectedCiv.religion || 'Ancestral Veneration'}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-500 font-semibold uppercase text-[9px] tracking-wider block">Primary Languages</span>
                    <span className="text-gray-300">{selectedCiv.languages.join(', ')}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-500 font-semibold uppercase text-[9px] tracking-wider block">Population Estimate</span>
                    <span className="text-gray-300">{selectedCiv.populationEstimate || 'Unquantified'}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl glass-panel border border-gold-500/10 space-y-4">
                <h3 className="text-base font-serif text-gold-500 font-bold border-b border-gold-500/10 pb-2">
                  Socio-Economic & Architectural Systems
                </h3>
                <div className="space-y-3 text-xs leading-relaxed text-gray-300 font-light">
                  <p><strong>Economy:</strong> {selectedCiv.economy}</p>
                  <p><strong>Trade Networks:</strong> {selectedCiv.trade}</p>
                  <p><strong>Science & Technology:</strong> {selectedCiv.technology}</p>
                </div>
              </div>
            </div>

            {/* Right Side: Associated Elements */}
            <div className="space-y-6">
              {/* Leaders / Rulers */}
              <div className="p-5 rounded-xl glass-panel border border-gold-500/10 space-y-4">
                <h3 className="text-sm font-serif text-gold-500 font-bold border-b border-gold-500/10 pb-2">
                  Documented Leaders
                </h3>
                <div className="space-y-3">
                  {getFiguresForCiv(selectedCiv.id).length > 0 ? (
                    getFiguresForCiv(selectedCiv.id).map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center gap-3 p-2 rounded bg-matte-900 border border-gold-500/5 hover:border-gold-500/20 cursor-pointer transition-colors"
                        onClick={() => onNavigateToTab('figures')}
                      >
                        {f.imageUrl && (
                          <img
                            src={f.imageUrl}
                            alt={f.name}
                            className="w-10 h-10 rounded-full object-cover border border-gold-500/20"
                          />
                        )}
                        <div>
                          <h4 className="text-xs font-serif text-white font-semibold">{f.name}</h4>
                          <span className="text-[9px] text-gray-500 font-light">{f.title}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic">No direct figures indexed in database.</p>
                  )}
                </div>
              </div>

              {/* Artifacts */}
              <div className="p-5 rounded-xl glass-panel border border-gold-500/10 space-y-4">
                <h3 className="text-sm font-serif text-gold-500 font-bold border-b border-gold-500/10 pb-2">
                  Curated Artifacts
                </h3>
                <div className="space-y-3">
                  {getArtifactsForCiv(selectedCiv.id).length > 0 ? (
                    getArtifactsForCiv(selectedCiv.id).map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center gap-3 p-2 rounded bg-matte-900 border border-gold-500/5 hover:border-gold-500/20 cursor-pointer transition-colors"
                        onClick={() => onNavigateToTab('artifacts')}
                      >
                        {a.imageUrl && (
                          <img
                            src={a.imageUrl}
                            alt={a.name}
                            className="w-10 h-10 rounded object-cover border border-gold-500/20"
                          />
                        )}
                        <div>
                          <h4 className="text-xs font-serif text-white font-semibold">{a.name}</h4>
                          <span className="text-[9px] text-gray-500 font-light">{a.date} ({a.material.join(', ')})</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 italic">No artifacts curated in database.</p>
                  )}
                </div>
              </div>

              {/* Bibliographic References (Scholar Mode) */}
              {userRole === 'Scholar' && (
                <div className="p-5 rounded-xl glass-panel border border-gold-500/10 space-y-3 text-[10px] text-gray-400">
                  <h4 className="font-serif text-white font-semibold uppercase tracking-wider text-[11px] border-b border-gold-500/10 pb-1.5 flex items-center gap-1.5">
                    <Globe size={12} className="text-gold-500" /> Academic Sources
                  </h4>
                  <p>All data curated above maps to the following citations:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Williams, B. B. (1986). <i>Qustul Incense Burner and early states</i>.</li>
                    <li>UNESCO General History of Africa Project (Vols I-VIII).</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Civilizations;
