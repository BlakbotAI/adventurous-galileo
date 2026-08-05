import React, { useState } from 'react';
import { Scroll, X, ShieldAlert, Award, RefreshCw, MessageSquare, BookOpen } from 'lucide-react';
import { db } from '../services/db';
import type { Artifact } from '../types/database';
import { ArtifactViewer3D } from '../components/ArtifactViewer3D';
import { MuseumSyncRegistry } from '../components/MuseumSyncRegistry';

interface ArtifactsProps {
  onNavigateToTab: (tab: string) => void;
  userRole: 'Student' | 'Scholar';
}

export const Artifacts: React.FC<ArtifactsProps> = ({ onNavigateToTab, userRole }) => {
  const ARTIFACTS = db.getArtifacts();
  const [searchVal, setSearchVal] = useState('');
  const [selectedArt, setSelectedArt] = useState<Artifact | null>(null);
  const [rotate3D, setRotate3D] = useState(false);

  const filteredArts = ARTIFACTS.filter(art => 
    art.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    art.material.some(m => m.toLowerCase().includes(searchVal.toLowerCase())) ||
    art.civilizationName.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-gold-500/10 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl text-gold-500 font-serif font-bold tracking-wider">Curation Gallery</h2>
          <p className="text-xs text-gray-500 font-light mt-0.5">Physical items cataloged with provenances and scientific classifications.</p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search items by material or culture..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-xs glass-input text-gray-200"
          />
          <Scroll className="absolute left-3 top-2.5 text-gold-500/60" size={13} />
        </div>
      </div>

      {/* Masonry Columns (Pinterest Style) */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredArts.map((art) => (
          <div
            key={art.id}
            onClick={() => {
              setSelectedArt(art);
              setRotate3D(false);
            }}
            className="break-inside-avoid rounded-xl overflow-hidden glass-card border border-bronze-500/10 flex flex-col cursor-pointer group mb-6"
          >
            <div className="relative overflow-hidden">
              <img
                src={art.imageUrl}
                alt={art.name}
                className="w-full h-auto object-cover filter brightness-90 group-hover:brightness-100 transition-all duration-300"
              />
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/75 backdrop-blur text-[9px] text-gold-400 border border-gold-500/20">
                {art.date}
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-bronze-400 uppercase">
                <span>{art.civilizationName}</span>
                <span className="text-gold-400 font-bold bg-gold-950/30 px-1 rounded">Score: {art.importanceScore}/10</span>
              </div>
              <h3 className="text-sm md:text-base font-serif font-bold text-white group-hover:text-gold-400 transition-colors">
                {art.name}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-light">
                {art.historicalContext}
              </p>
              <div className="pt-2 border-t border-gold-500/5 flex flex-wrap gap-1.5">
                {art.material.map((mat, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-matte-900 border border-gold-500/5 text-gray-500">
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Curation Inspection Drawer / Modal */}
      {selectedArt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-4xl rounded-2xl glass-panel border border-gold-500/20 max-h-[90vh] overflow-y-auto flex flex-col bg-matte-950 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gold-500/10">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-bronze-400 uppercase font-bold block">
                  {selectedArt.civilizationName}
                </span>
                <h3 className="text-lg md:text-2xl font-serif text-white font-black">{selectedArt.name}</h3>
              </div>
              <button
                onClick={() => setSelectedArt(null)}
                className="p-1.5 rounded hover:bg-gold-500/10 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              
              {/* Left Column: Visuals */}
              <div className="space-y-4">
                {/* 3D Hologram Viewer / Image Toggle */}
                <div className={`relative rounded-xl overflow-hidden bg-matte-900 border border-gold-500/10 ${!rotate3D ? 'aspect-video flex items-center justify-center' : ''} group`}>
                  {!rotate3D ? (
                    <>
                      <img
                        src={selectedArt.imageUrl}
                        alt={selectedArt.name}
                        className="w-full h-full object-cover filter brightness-90"
                      />
                      {/* Toggle 3D Button */}
                      <button
                        onClick={() => setRotate3D(!rotate3D)}
                        className="absolute bottom-3 right-3 px-3 py-1 bg-black/85 backdrop-blur text-[10px] text-gold-500 hover:text-white font-mono rounded border border-gold-500/20 flex items-center gap-1.5 transition-colors z-10"
                      >
                        <RefreshCw size={12} className={rotate3D ? 'animate-spin' : ''} />
                        {rotate3D ? 'View Standard Image' : 'Activate 3D Hologram'}
                      </button>
                    </>
                  ) : (
                    <div className="relative">
                      <ArtifactViewer3D artifactId={selectedArt.id} />
                      {/* Toggle 3D Button */}
                      <button
                        onClick={() => setRotate3D(!rotate3D)}
                        className="absolute bottom-[60px] left-[16px] px-3 py-1.5 bg-black/85 backdrop-blur text-[10px] text-gold-500 hover:text-white font-mono rounded border border-gold-500/20 flex items-center gap-1.5 transition-colors z-20"
                      >
                        <RefreshCw size={12} className={rotate3D ? 'animate-spin' : ''} />
                        {rotate3D ? 'View Standard Image' : 'Activate 3D Hologram'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Key Provenance Stats */}
                <div className="p-4 rounded-xl bg-matte-900/60 border border-bronze-500/10 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Material Composition:</span>
                    <span className="text-gray-300 font-medium">{selectedArt.material.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Scientific Dating Method:</span>
                    <span className="text-gold-500 font-medium">{selectedArt.datingMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Documented Origin:</span>
                    <span className="text-gray-300 font-medium">{selectedArt.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Curation Museum:</span>
                    <span className="text-gray-300 font-medium">{selectedArt.museum}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Context & Repatriation Details */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Historical Context</h4>
                    <p className="text-xs text-gray-300 leading-relaxed font-light">{selectedArt.historicalContext}</p>
                  </div>

                  <div>
                    <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">Discovery Notes</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">{selectedArt.discoveryNotes}</p>
                  </div>

                  {selectedArt.scholarlyDebates && (
                    <div className="p-3.5 rounded-lg border border-bronze-500/20 bg-bronze-950/20 flex gap-3">
                      <ShieldAlert className="text-bronze-500 shrink-0 mt-0.5" size={16} />
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-semibold text-bronze-400">Repatriation / Colonial Contestation</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-light">{selectedArt.scholarlyDebates}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions & Bibliographies */}
                <div className="pt-4 border-t border-gold-500/10 space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onNavigateToTab('ai-historian')}
                      className="flex-1 py-2.5 bg-gradient-to-r from-gold-600 to-bronze-600 hover:from-gold-500 hover:to-bronze-500 text-black text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10"
                    >
                      <MessageSquare size={14} /> Talk to this Artifact
                    </button>
                    <button
                      onClick={() => {
                        const colls = db.getCollections();
                        const targetCollId = colls.length > 0 ? colls[0].id : 'coll_math';
                        db.addCollectionItem({
                          id: `item_${Date.now()}`,
                          collectionId: targetCollId,
                          itemId: selectedArt.id,
                          itemType: 'Artifact'
                        });
                        alert('Object successfully bookmarked into your Saved Collections folder.');
                      }}
                      className="px-4 py-2.5 rounded-lg bg-matte-900 hover:bg-matte-850 border border-gold-500/15 text-gold-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Award size={14} /> Bookmark Item
                    </button>
                  </div>

                  {userRole === 'Scholar' && (
                    <div className="p-3.5 rounded-lg bg-matte-900 border border-gold-500/5 text-[10px] text-gray-500 leading-relaxed space-y-1.5">
                      <h5 className="font-serif text-white font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <BookOpen size={11} className="text-gold-500" /> Archival Bibliography
                      </h5>
                      {selectedArt.sources.map((src, i) => (
                        <p key={i}>
                          Source Reference ID: <strong className="text-gold-400">{src.sourceId}</strong>. Details: {src.pageOrDetail || 'General record'}. {src.note && <i>({src.note})</i>}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              <MuseumSyncRegistry query={selectedArt.name} type="artifact" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Artifacts;
