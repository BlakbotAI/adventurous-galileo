import React, { useState } from 'react';
import { Library, Search, FileText, BookOpen, Copy, Check } from 'lucide-react';
import { db } from '../services/db';
import type { HistoricalDocument } from '../types/database';

export const ResearchLibrary: React.FC = () => {
  const HISTORICAL_DOCUMENTS = db.getDocuments();
  const [activeDoc, setActiveDoc] = useState<HistoricalDocument | null>(HISTORICAL_DOCUMENTS[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const filteredDocs = HISTORICAL_DOCUMENTS.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.civilizationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCitationText = (format: 'MLA' | 'Chicago' | 'Harvard') => {
    if (!activeDoc) return '';
    const author = activeDoc.author || 'Unknown Scribe';
    const title = activeDoc.title;
    const date = activeDoc.date;
    const civ = activeDoc.civilizationName;

    switch (format) {
      case 'MLA':
        return `${author}. "${title}." ${civ} Archive Registry, ${date}. Web.`;
      case 'Chicago':
        return `${author}. "${title}." ${civ} Archives. Accessed 2026. ${date}.`;
      case 'Harvard':
        return `${author}, ${date}. ${title}. [online] ${civ} Curation Bureau.`;
      default:
        return '';
    }
  };

  const handleCopyCitation = (format: 'MLA' | 'Chicago' | 'Harvard') => {
    const text = getCitationText(format);
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      {/* Left panel: List & Search */}
      <div className="w-full md:w-80 shrink-0 flex flex-col gap-4 bg-matte-950/40">
        <div className="p-4 rounded-xl glass-panel border border-gold-500/10 space-y-4 flex-1 flex flex-col overflow-hidden">
          <h3 className="text-sm font-serif text-gold-500 font-bold uppercase tracking-wider flex items-center gap-2">
            <Library size={16} /> Catalog Files
          </h3>

          <div className="relative">
            <input
              type="text"
              placeholder="Search literature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg text-xs glass-input text-gray-200"
            />
            <Search className="absolute left-3 top-2.5 text-gold-500/60" size={13} />
          </div>

          {/* Documents list */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  activeDoc?.id === doc.id
                    ? 'bg-gradient-to-r from-gold-950/20 to-bronze-950/10 border-gold-500/40 text-gold-400 font-semibold'
                    : 'bg-matte-900/50 border-gold-500/5 hover:border-gold-500/20 text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1 text-[8px] font-mono tracking-widest text-bronze-400 uppercase">
                  <span>{doc.civilizationName}</span>
                  <span>{doc.date}</span>
                </div>
                <h4 className="text-xs font-serif text-white truncate mb-1">{doc.title}</h4>
                <p className="text-[10px] text-gray-500 line-clamp-1 font-light">{doc.significance}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel: Excerpt & Citation Tools */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {activeDoc ? (
          <div className="flex-1 rounded-xl glass-panel border border-gold-500/15 p-6 flex flex-col bg-matte-950 overflow-y-auto">
            {/* Header info */}
            <div className="border-b border-gold-500/10 pb-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono tracking-widest text-gold-400 uppercase font-bold bg-gold-950/30 px-2 py-0.5 rounded border border-gold-500/10">
                  PRIMARY MANUSCRIPT
                </span>
                <span className="text-[9px] text-gray-500 font-mono">Dating verified: {activeDoc.evidenceTier}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-serif text-white font-black tracking-wider glow-gold-text">
                {activeDoc.title}
              </h2>
              <div className="flex justify-between text-xs text-gray-400 font-light">
                <span>Civilization: <strong className="text-gray-300 font-normal">{activeDoc.civilizationName}</strong></span>
                <span>Date: <strong className="text-gray-300 font-normal">{activeDoc.date}</strong></span>
              </div>
            </div>

            {/* Document Body */}
            <div className="flex-1 py-6 space-y-4">
              <div className="space-y-1.5">
                <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Manuscript Excerpt</h4>
                <div className="p-4 rounded-xl bg-matte-900/60 border border-bronze-500/10 font-serif italic text-sm text-gold-200/90 leading-relaxed relative">
                  <span className="absolute -top-3 left-4 text-3xl font-serif text-gold-500/20 font-black">“</span>
                  <p className="indent-4 font-light">{activeDoc.excerpt}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Historical Significance</h4>
                <p className="text-xs text-gray-300 leading-relaxed font-light">{activeDoc.significance}</p>
              </div>
            </div>

            {/* Citation copy tool */}
            <div className="border-t border-gold-500/10 pt-4 space-y-3">
              <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <BookOpen size={13} className="text-gold-500" /> Academic Citation Generator
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['MLA', 'Chicago', 'Harvard'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => handleCopyCitation(fmt)}
                    className="p-3 rounded-lg bg-matte-900 border border-gold-500/10 hover:border-gold-500/35 flex items-center justify-between text-xs transition-all text-gray-300 hover:text-white"
                  >
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-gold-500">{fmt} Standard</span>
                      <span className="text-[9px] text-gray-500 truncate max-w-[130px] font-mono mt-0.5">
                        {getCitationText(fmt)}
                      </span>
                    </div>
                    <span className="p-1 rounded bg-gold-950/20 text-gold-500">
                      {copiedFormat === fmt ? <Check size={12} /> : <Copy size={12} />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 rounded-xl glass-panel border border-gold-500/10 flex flex-col items-center justify-center text-center text-gray-600 text-xs italic">
            <FileText size={48} className="mb-2 opacity-35 text-gold-500" />
            <span>Select a dossier file from the catalog to load the transcript.</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default ResearchLibrary;
