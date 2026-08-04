import React, { useState } from 'react';
import { Filter, ShieldCheck, BookOpen } from 'lucide-react';
import { db } from '../services/db';
import type { TimelineEvent } from '../types/database';

interface TimelineProps {
  userRole: 'Student' | 'Scholar';
  activeYear: number | null;
  onYearChange: (year: number | null) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ userRole, activeYear, onYearChange }) => {
  const TIMELINE_EVENTS = db.getTimelineEvents();
  const [themeFilter, setThemeFilter] = useState<string>('All');
  const [africaCentered, setAfricaCentered] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  // Filter events by category and optionally by activeYear window (+- 500 years)
  const filteredEvents = TIMELINE_EVENTS.filter(ev => {
    const matchesTheme = themeFilter === 'All' || ev.theme === themeFilter;
    const matchesAfrica = !africaCentered || ev.africaCentered;
    const matchesYear = activeYear === null || (ev.year >= activeYear - 500 && ev.year <= activeYear + 500);
    return matchesTheme && matchesAfrica && matchesYear;
  }).sort((a, b) => a.year - b.year);

  const themes = ['All', 'Science', 'Technology', 'Religion', 'Trade', 'Conflict', 'Migration', 'Agriculture', 'Architecture', 'Culture'];

  const sliderVal = activeYear !== null ? activeYear : 1000;

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Temporal Scrubber Slider */}
      <div className="p-4 rounded-xl glass-panel border border-gold-500/10 flex flex-col md:flex-row gap-4 justify-between items-center w-full bg-matte-950/80">
        <div className="flex items-center gap-4 w-full max-w-xl">
          <span className="text-xs font-serif text-gold-400 font-bold uppercase tracking-wider shrink-0">Temporal Era:</span>
          <input 
            type="range" 
            min="-5000" 
            max="2000" 
            value={sliderVal} 
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="w-full accent-gold-500 bg-matte-900 h-1 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono text-gold-500 font-bold tracking-wider shrink-0 w-20 text-right">
            {sliderVal < 0 ? `${Math.abs(sliderVal)} BCE` : `${sliderVal} CE`}
          </span>
        </div>
        <button 
          onClick={() => onYearChange(null)}
          className={`px-3 py-1.5 rounded text-[10px] font-sans border transition-all shrink-0 ${
            activeYear === null 
              ? 'bg-gold-500/20 border-gold-500 text-gold-400 font-semibold' 
              : 'bg-matte-900 border-gold-500/10 hover:border-gold-500/30 text-gray-400'
          }`}
        >
          {activeYear === null ? 'Displaying All Eras' : 'Reset to All Eras'}
        </button>
      </div>
      {/* Filters Toolbar */}
      <div className="p-4 rounded-xl glass-panel border border-gold-500/10 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-serif text-gold-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Filter size={14} /> Filters
          </span>
          <div className="flex flex-wrap gap-1.5">
            {themes.map(t => (
              <button
                key={t}
                onClick={() => setThemeFilter(t)}
                className={`px-3 py-1 rounded-full text-[10px] font-sans border transition-all ${
                  themeFilter === t
                    ? 'bg-gold-600 text-black border-gold-500 font-bold'
                    : 'bg-matte-900 border-gold-500/10 hover:border-gold-500/30 text-gray-400 hover:text-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* African Centered Toggle */}
        <label className="flex items-center gap-3 px-3.5 py-2 rounded bg-gold-950/20 hover:bg-gold-950/30 border border-gold-500/20 cursor-pointer text-xs transition-colors shrink-0">
          <input
            type="checkbox"
            checked={africaCentered}
            onChange={(e) => setAfricaCentered(e.target.checked)}
            className="rounded border-gold-500 text-gold-500 focus:ring-0 focus:ring-offset-0 bg-transparent w-4.5 h-4.5"
          />
          <div className="flex flex-col text-left">
            <span className="text-gold-400 font-bold flex items-center gap-1">
              African-Centered View <ShieldCheck size={12} className="text-gold-500" />
            </span>
            <span className="text-[9px] text-gray-500 font-light">Filters European narratives</span>
          </div>
        </label>
      </div>

      {/* Scrubber Area */}
      <div className="relative rounded-2xl border border-gold-500/10 bg-matte-950/40 p-6 overflow-hidden">
        {/* Scrubber Line background */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-bronze-900/10 via-gold-500/30 to-bronze-900/10" />

        {/* Scrollable Timeline */}
        <div className="relative flex gap-12 overflow-x-auto py-24 px-6 hide-scrollbar snap-x scroll-smooth">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((ev, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className="shrink-0 w-64 snap-center cursor-pointer group relative flex flex-col justify-center items-center"
                >
                  {/* Event Year Label */}
                  <span className="absolute text-sm font-serif font-black text-gold-500 group-hover:text-gold-400 transition-colors glow-gold-text mb-1 block" style={{ top: isEven ? '-35px' : 'auto', bottom: isEven ? 'auto' : '-35px' }}>
                    {ev.displayYear}
                  </span>

                  {/* Marker Pin */}
                  <div className="relative z-10 w-4 h-4 rounded-full bg-matte-950 border-2 border-gold-500 group-hover:border-white transition-all flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500 group-hover:bg-white animate-pulse-glow" />
                  </div>

                  {/* Connecting Line to Card */}
                  <div className="w-0.5 bg-gold-500/20 absolute" style={{ 
                    height: '40px', 
                    top: isEven ? '16px' : 'auto', 
                    bottom: isEven ? 'auto' : '16px' 
                  }} />

                  {/* Brief Event Preview Card */}
                  <div
                    className="absolute p-4 w-60 rounded-xl glass-card border border-gold-500/10 group-hover:border-gold-500/30 transition-all text-xs"
                    style={{ 
                      top: isEven ? '56px' : 'auto', 
                      bottom: isEven ? 'auto' : '56px' 
                    }}
                  >
                    <span className="text-[8px] font-mono tracking-widest text-bronze-400 uppercase font-semibold block mb-1">
                      {ev.theme} • {ev.region}
                    </span>
                    <h4 className="font-serif text-white font-bold tracking-wide line-clamp-1 mb-1 group-hover:text-gold-400 transition-colors">
                      {ev.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed font-light">
                      {ev.description}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full text-center py-6 text-gray-500 italic text-xs">
              No historical milestones found matching filters.
            </div>
          )}
        </div>
      </div>

      {/* Helper Banner */}
      <div className="flex justify-between text-[10px] text-gray-600 px-2">
        <span>&larr; Drag horizontally to travel back to 300,000 BCE</span>
        <span>Scroll forward to Modern Era &rarr;</span>
      </div>

      {/* Selected Event Context Overlay */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl glass-panel border border-gold-500/20 p-6 bg-matte-950 shadow-2xl relative space-y-5">
            <div className="flex items-start justify-between border-b border-gold-500/10 pb-3">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-bronze-400 uppercase font-bold block">
                  {selectedEvent.region} • {selectedEvent.theme}
                </span>
                <h3 className="text-lg md:text-xl font-serif text-white font-black">{selectedEvent.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded hover:bg-gold-500/10 text-gray-400 hover:text-white"
              >
                close
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-gray-300">
              <div className="flex justify-between items-center bg-gold-950/20 border border-gold-500/10 p-2.5 rounded-lg">
                <span className="text-gray-400">Archival Year:</span>
                <span className="text-gold-500 font-serif font-black text-sm glow-gold-text">{selectedEvent.displayYear}</span>
              </div>
              <p className="font-light">{selectedEvent.description}</p>
              
              <div className="flex gap-2">
                <span className="text-gray-500">Evidence status:</span>
                <span className="text-gold-400 font-semibold">{selectedEvent.evidenceTier}</span>
              </div>
            </div>

            {/* Citations (Scholar Mode) */}
            {userRole === 'Scholar' && (
              <div className="p-3.5 rounded-lg bg-matte-900 border border-gold-500/5 text-[10px] text-gray-500 leading-relaxed space-y-1.5">
                <h5 className="font-serif text-white font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <BookOpen size={11} className="text-gold-500" /> Evidence Provenance
                </h5>
                {selectedEvent.sources.length > 0 ? (
                  selectedEvent.sources.map((src, i) => (
                    <p key={i}>
                      Source ID Reference: <strong className="text-gold-400">{src.sourceId}</strong>. Details: {src.pageOrDetail || 'General record'}.
                    </p>
                  ))
                ) : (
                  <p className="italic">No direct academic papers linked. Information curated from consensus oral traditions and stratigraphy records.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Timeline;
