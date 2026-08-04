import React, { useState } from 'react';
import { Search, Compass, AlertCircle, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { db } from '../services/db';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onSearchQuery: (query: string) => void;
  userRole: 'Student' | 'Scholar';
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSearchQuery, userRole }) => {
  const [searchVal, setSearchVal] = useState('');
  
  const civilizations = db.getCivilizations();
  const artifacts = db.getArtifacts();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSearchQuery(searchVal);
    }
  };

  const handleExampleClick = (question: string) => {
    setSearchVal(question);
    onSearchQuery(question);
  };

  // Select a few featured items
  const featuredCivs = civilizations.filter(c => c.africaCentered).slice(0, 3);
  const featuredArts = artifacts.slice(0, 3);

  const stats = [
    { label: 'Documented States', value: civilizations.length, desc: 'Independently verified empires' },
    { label: 'Curation Artifacts', value: artifacts.length, desc: 'Carbon-dated physical objects' },
    { label: 'Trade & Migrations', value: '4 Major', desc: 'Pre-colonial global routes' },
    { label: 'Scholarly Integrity', value: '100%', desc: 'Traceable citation mapping' },
  ];

  const examples = [
    'Compare Ancient Egypt and Kush',
    'Show artifacts from Mali Empire',
    'Explain human migration into the Americas',
    'Compare iron-working traditions',
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-2xl p-6 md:p-12 overflow-hidden glass-panel border border-gold-500/20 bg-gradient-to-br from-earth-950/40 via-matte-950 to-matte-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-gold-500/5 via-transparent to-transparent opacity-70" />
        
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-950/40 border border-gold-500/30 text-xs text-gold-400">
            <ShieldCheck size={13} className="text-gold-500" />
            <span>African-Centered Decolonial Database Active</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white font-black leading-tight tracking-wider">
            HISTORICAL <span className="bg-gradient-to-r from-gold-400 to-bronze-400 bg-clip-text text-transparent glow-gold-text">INTELLIGENCE</span> OPERATING SYSTEM
          </h1>
          
          <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl font-light">
            Explore humanity\'s deep histories through absolute evidence, carbon dating, primary historical records, genetic studies, oral memories, and semantic AI queries. Designed to dismantle historical erasure and present a true connected world.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ask anything about history, pyramids, migrations..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-sm glass-input text-gray-200"
              />
              <Search className="absolute left-3.5 top-3.5 text-gold-500" size={16} />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-gold-600 to-bronze-600 hover:from-gold-500 hover:to-bronze-500 text-black font-semibold rounded-lg text-sm shadow-lg shadow-gold-500/10 hover:shadow-gold-500/20 active:scale-95 transition-all"
            >
              Query Engine
            </button>
          </form>

          {/* Examples */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-bronze-400 font-semibold flex items-center gap-1.5">
              <HelpCircle size={12} />
              Suggested Archival Queries
            </p>
            <div className="flex flex-wrap gap-2">
              {examples.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExampleClick(item)}
                  className="text-xs bg-matte-900/60 hover:bg-gold-950/20 text-gray-400 hover:text-gold-400 border border-gold-500/10 hover:border-gold-500/30 px-3 py-1.5 rounded transition-all"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 rounded-xl glass-card border border-bronze-500/10 flex flex-col justify-between h-28 relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 text-gold-500/5 translate-y-1/4 translate-x-1/4 scale-150 transition-transform group-hover:scale-[1.7]">
              <Compass size={64} />
            </div>
            <span className="text-2xl md:text-3xl font-serif text-gold-500 font-bold glow-gold-text">{stat.value}</span>
            <div>
              <h3 className="text-xs font-semibold text-gray-200 tracking-wider uppercase">{stat.label}</h3>
              <p className="text-[10px] text-gray-500 font-light mt-0.5">{stat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Civilizations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gold-500/10 pb-2">
          <h2 className="text-xl md:text-2xl text-gold-500 font-serif font-bold tracking-wider">Civilization Dossiers</h2>
          <button 
            onClick={() => onNavigate('civilizations')}
            className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors"
          >
            All Civilizations <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCivs.map((civ) => (
            <div 
              key={civ.id}
              onClick={() => onNavigate(`civilizations`)}
              className="group cursor-pointer rounded-xl overflow-hidden glass-card border border-bronze-500/10 flex flex-col h-96"
            >
              <div className="h-44 overflow-hidden relative">
                <img 
                  src={civ.imageUrl} 
                  alt={civ.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-[10px] text-gold-400 border border-gold-500/20">
                  {civ.region}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] tracking-widest text-bronze-400 font-mono uppercase">{civ.period}</span>
                  <h3 className="text-lg font-serif text-white font-bold group-hover:text-gold-400 transition-colors">{civ.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed font-light">
                    {civ.evidenceNote}
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-gold-500/5 text-[10px]">
                  <span className="text-gray-500">Evidence Tier: <strong className="text-gold-500">{civ.evidenceTier}</strong></span>
                  <span className="text-gold-400/70 group-hover:text-gold-400 font-semibold flex items-center gap-0.5">Explore Dossier <ArrowRight size={10} /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Artifacts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gold-500/10 pb-2">
          <h2 className="text-xl md:text-2xl text-gold-500 font-serif font-bold tracking-wider">Curation Artifacts</h2>
          <button 
            onClick={() => onNavigate('artifacts')}
            className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors"
          >
            All Artifacts <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArts.map((art) => (
            <div 
              key={art.id}
              onClick={() => onNavigate('artifacts')}
              className="group cursor-pointer rounded-xl overflow-hidden glass-card border border-bronze-500/10 flex flex-col h-96"
            >
              <div className="h-44 overflow-hidden relative">
                <img 
                  src={art.imageUrl} 
                  alt={art.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-[10px] text-gold-400 border border-gold-500/20">
                  {art.date}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] tracking-widest text-bronze-400 font-mono uppercase">{art.civilizationName}</span>
                  <h3 className="text-lg font-serif text-white font-bold group-hover:text-gold-400 transition-colors">{art.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed font-light">
                    {art.historicalContext}
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-gold-500/5 text-[10px]">
                  <span className="text-gray-500">Dating Method: <strong className="text-gold-500">{art.datingMethod}</strong></span>
                  <span className="text-gold-400/70 group-hover:text-gold-400 font-semibold flex items-center gap-0.5">Inspect Object <ArrowRight size={10} /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Information Alert regarding Scholar Mode */}
      {userRole === 'Student' && (
        <section className="p-4 rounded-xl bg-gold-950/20 border border-gold-500/20 flex gap-4 items-start">
          <AlertCircle className="text-gold-500 shrink-0 mt-0.5" size={18} />
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-gold-400">Did you know?</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed font-light">
              You are currently browsing in <strong className="text-gold-500">Student Mode</strong>. Switch to <strong className="text-gold-500">Scholar Mode</strong> at the bottom of the sidebar to view full scientific bibliographies, excavation reports, carbon dating confidence tiers, and unresolved archaeological debates.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
export default Dashboard;
