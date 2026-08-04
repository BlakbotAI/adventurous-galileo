import React, { useState } from 'react';
import { Crown, ArrowLeft, Sparkles, MessageSquare, BookOpen, GitCommit } from 'lucide-react';
import { db } from '../services/db';
import type { HistoricalFigure } from '../types/database';

interface FiguresProps {
  onNavigateToTab: (tab: string) => void;
  userRole: 'Student' | 'Scholar';
}

export const Figures: React.FC<FiguresProps> = ({ onNavigateToTab, userRole }) => {
  const FIGURES = db.getFigures();
  const [searchVal, setSearchVal] = useState('');
  const [selectedFig, setSelectedFig] = useState<HistoricalFigure | null>(null);

  const filteredFigs = FIGURES.filter(fig => 
    fig.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    fig.title.toLowerCase().includes(searchVal.toLowerCase()) ||
    fig.civilizationName.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {!selectedFig ? (
        <>
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-gold-500/10 pb-4">
            <div>
              <h2 className="text-xl md:text-2xl text-gold-500 font-serif font-bold tracking-wider">Historical Figures</h2>
              <p className="text-xs text-gray-500 font-light mt-0.5">Biographies of rulers, innovators, explorers, and military leaders.</p>
            </div>

            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search historical figures..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg text-xs glass-input text-gray-200"
              />
              <Crown className="absolute left-3 top-2.5 text-gold-500/60" size={13} />
            </div>
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFigs.map((fig) => (
              <div
                key={fig.id}
                onClick={() => setSelectedFig(fig)}
                className="group cursor-pointer rounded-xl overflow-hidden glass-card border border-bronze-500/10 flex flex-col h-[400px] justify-between"
              >
                <div className="relative h-56 bg-matte-900 overflow-hidden">
                  <img
                    src={fig.imageUrl}
                    alt={fig.name}
                    className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-matte-950 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[9px] font-mono tracking-widest text-gold-400 uppercase font-semibold block">
                      {fig.civilizationName}
                    </span>
                    <h3 className="text-lg font-serif text-white font-black group-hover:text-gold-400 transition-colors">
                      {fig.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold text-bronze-400 leading-tight mb-2 line-clamp-1">{fig.title}</p>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-light">
                      {fig.biography}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gold-500/5 flex items-center justify-between text-[10px]">
                    <span className="text-gray-500">Timeline: <strong className="text-gold-400">{fig.period}</strong></span>
                    <span className="text-gold-400 font-semibold flex items-center gap-0.5">View Dossier &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Detailed Portrait View */
        <div className="space-y-6 animate-fade-in">
          <button
            onClick={() => setSelectedFig(null)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-matte-900 border border-gold-500/10 hover:border-gold-500/30 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Leaders List
          </button>

          {/* Banner Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Portrait */}
            <div className="md:col-span-1 space-y-4">
              <div className="rounded-xl overflow-hidden aspect-[3/4] bg-matte-900 border border-gold-500/15 relative">
                <img
                  src={selectedFig.imageUrl}
                  alt={selectedFig.name}
                  className="w-full h-full object-cover filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gold-950/40 text-gold-400 border border-gold-500/20 font-bold font-mono">
                    {selectedFig.civilizationName}
                  </span>
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="p-4 rounded-xl bg-matte-900/60 border border-bronze-500/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Regnal Period:</span>
                  <span className="text-gold-500 font-serif font-semibold">{selectedFig.period}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Classification:</span>
                  <span className="text-gray-300 font-semibold">{selectedFig.title}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Biography & Achievements */}
            <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl md:text-5xl font-serif text-white font-black tracking-wider glow-gold-text">
                    {selectedFig.name}
                  </h1>
                  <p className="text-sm font-semibold text-bronze-400 mt-1">{selectedFig.title}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Biographical Record</h4>
                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-light">{selectedFig.biography}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Key Achievements</h4>
                  <div className="space-y-2">
                    {selectedFig.achievements.map((ach, idx) => (
                      <div key={idx} className="flex gap-3 items-start text-xs text-gray-300">
                        <span className="p-1 rounded bg-gold-950/30 border border-gold-500/20 text-gold-500 mt-0.5"><Sparkles size={11} /></span>
                        <p className="leading-relaxed font-light">{ach}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ancestry tree mockup */}
                <div className="p-4 rounded-xl glass-panel border border-gold-500/10 space-y-3">
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                    <GitCommit size={12} className="text-gold-500" /> Lineage & Kinship Mapping
                  </h4>
                  {/* Styled Lineage representation */}
                  <div className="flex justify-center items-center py-2 text-xs font-mono">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="px-3 py-1 rounded bg-matte-900 border border-gold-500/20 text-gray-400 text-[10px]">Royal Predecessors</div>
                      <div className="h-4 w-0.5 bg-gold-500/30"></div>
                      <div className="px-3 py-1.5 rounded bg-gold-950/40 border border-gold-500/40 text-gold-400 font-bold text-[11px] shadow-sm shadow-gold-500/10">{selectedFig.name}</div>
                      <div className="h-4 w-0.5 bg-gold-500/30"></div>
                      <div className="px-3 py-1 rounded bg-matte-900 border border-gold-500/20 text-gray-400 text-[10px]">Royal Descendants</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation actions & Scholarly sources */}
              <div className="pt-6 border-t border-gold-500/10 space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigateToTab('ai-historian')}
                    className="flex-1 py-2.5 bg-gradient-to-r from-gold-600 to-bronze-600 hover:from-gold-500 hover:to-bronze-500 text-black text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10"
                  >
                    <MessageSquare size={14} /> Discuss Legacy with AI
                  </button>
                </div>

                {userRole === 'Scholar' && (
                  <div className="p-3.5 rounded-lg bg-matte-900 border border-gold-500/5 text-[10px] text-gray-500 leading-relaxed space-y-1.5">
                    <h5 className="font-serif text-white font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <BookOpen size={11} className="text-gold-500" /> Source Citations
                    </h5>
                    {selectedFig.sources.map((src, i) => (
                      <p key={i}>
                        Source ID Reference: <strong className="text-gold-400">{src.sourceId}</strong>. Details: {src.pageOrDetail || 'General record'}. {src.note && <i>({src.note})</i>}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Figures;
