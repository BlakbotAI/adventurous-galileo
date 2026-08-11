import React, { useState } from 'react';
import { GitMerge, Sparkles, AlertCircle, Landmark, Calendar } from 'lucide-react';
import { db } from '../services/db';

export const ComparativeAnalysis: React.FC = () => {
  const civilizations = db.getCivilizations();
  
  const [entityAId, setEntityAId] = useState<string>('kemet');
  const [entityBId, setEntityBId] = useState<string>('kush');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comparisonReport, setComparisonReport] = useState<string>('');

  const civA = civilizations.find(c => c.id === entityAId) || civilizations[0];
  const civB = civilizations.find(c => c.id === entityBId) || civilizations[1];
  const handleGenerateAIReport = async () => {
    setIsLoading(true);
    setComparisonReport('');
    
    const apiKey = localStorage.getItem('hios_api_key') || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
    
    const isValidApiKey = (key: string) => {
      if (!key) return false;
      const cleanKey = key.trim();
      return cleanKey.startsWith('AIzaSy') || cleanKey.startsWith('sk-');
    };

    const systemPrompt = `You are a professional decolonial AI Historian.
Generate a comparative analysis report comparing the following two African civilizations using these verified database records:

---
Civilization A: ${civA.name}
Region: ${civA.region}
Period: ${civA.period}
Languages: ${civA.languages.join(', ')}
Technology: ${civA.technology || 'Not specified'}
Narrative Correction: ${civA.evidenceNote}
---
Civilization B: ${civB.name}
Region: ${civB.region}
Period: ${civB.period}
Languages: ${civB.languages.join(', ')}
Technology: ${civB.technology || 'Not specified'}
Narrative Correction: ${civB.evidenceNote}
---

Your response should:
- Compare their architectural, political, and trade achievements.
- Deconstruct colonial/eurocentric misconceptions.
- Write with authority, in clean markdown format, highlighting overlapping chronologies.`;

    if (!isValidApiKey(apiKey)) {
      // Fallback to Pollinations AI to generate the report live!
      try {
        const response = await fetch('https://text.pollinations.ai/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: 'You are a professional decolonial AI Historian.' },
              { role: 'user', content: systemPrompt }
            ]
          })
        });

        if (!response.ok) throw new Error(`Pollinations report failed: ${response.statusText}`);
        const text = await response.text();
        setComparisonReport(text);
      } catch (pollinationsErr: any) {
        console.error('Comparative analysis generation failed:', pollinationsErr);
        setComparisonReport(`**Error**: Failed to generate comparative report live. ${pollinationsErr?.message || ''}`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }]
            }
          ],
          tools: [{ google_search: {} }]
        })
      });

      if (!response.ok) throw new Error(`Request failed: ${response.statusText}`);
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No report generated.';
      setComparisonReport(text);
    } catch (err: any) {
      console.warn('Direct Gemini API call failed or blocked by CORS. Retrying via CORS Proxy...', err);
      try {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`)}`;
        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: systemPrompt }]
              }
            ],
            tools: [{ google_search: {} }]
          })
        });

        if (!response.ok) throw new Error(`Proxy retry failed: ${response.statusText}`);
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No report generated.';
        setComparisonReport(text);
      } catch (proxyErr: any) {
        console.warn('CORS Proxy fallback failed or search tool restricted. Retrying WITHOUT search tools...', proxyErr);
        try {
          const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`)}`;
          const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: systemPrompt }]
                }
              ]
            })
          });

          if (!response.ok) throw new Error(`Fallback retry failed: ${response.statusText}`);
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No report generated.';
          setComparisonReport(text);
        } catch (fallbackErr: any) {
          console.error('All Gemini API attempts failed for ComparativeAnalysis:', fallbackErr);
          setComparisonReport(`**Error**: Failed to connect to Gemini API. ${fallbackErr?.message || ''}`);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-gold-500/10 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl text-gold-500 font-serif font-bold tracking-wider flex items-center gap-2">
            <GitMerge className="text-gold-500" size={22} /> Comparative Analysis
          </h2>
          <p className="text-xs text-gray-500 font-light mt-0.5">Perform side-by-side decolonial comparisons and compile cross-cultural reports.</p>
        </div>

        {/* Status Badge */}
        <div className={`px-2.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-mono border ${
          import.meta.env.VITE_GEMINI_API_KEY 
            ? 'bg-green-950/30 border-green-500/40 text-green-400' 
            : 'bg-gold-950/20 border-gold-500/20 text-gold-500'
        }`}>
          {import.meta.env.VITE_GEMINI_API_KEY ? 'Gemini Live synthesis active' : 'Offline synthesis mode'}
        </div>
      </div>

      {/* Selectors card */}
      <div className="p-5 rounded-2xl glass-panel border border-gold-500/10 bg-matte-950/40 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <label className="text-[10px] font-mono text-gray-400 block mb-1">SELECT PRIMARY CIVILIZATION</label>
          <select
            value={entityAId}
            onChange={(e) => { setEntityAId(e.target.value); setComparisonReport(''); }}
            className="w-full p-2.5 rounded-lg bg-matte-900 border border-gold-500/10 text-gray-200 text-xs focus:ring-0 focus:outline-none"
          >
            {civilizations.map(c => (
              <option key={c.id} value={c.id} disabled={c.id === entityBId}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono text-gray-400 block mb-1">SELECT COMPARISON CIVILIZATION</label>
          <select
            value={entityBId}
            onChange={(e) => { setEntityBId(e.target.value); setComparisonReport(''); }}
            className="w-full p-2.5 rounded-lg bg-matte-900 border border-gold-500/10 text-gray-200 text-xs focus:ring-0 focus:outline-none"
          >
            {civilizations.map(c => (
              <option key={c.id} value={c.id} disabled={c.id === entityAId}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Side by side comparison dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Civilization A Stats */}
        <div className="p-6 rounded-2xl glass-panel border border-gold-500/10 space-y-4">
          <div className="border-b border-gold-500/10 pb-3 flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Landmark className="text-gold-500" size={16} /> {civA.name}
            </h3>
            <span className="px-2 py-0.5 rounded bg-gold-950/40 text-[9px] text-gold-400 border border-gold-500/25 font-bold uppercase tracking-wider">{civA.evidenceTier}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded bg-matte-900 border border-gold-500/5">
              <span className="text-[9px] text-gray-500 block mb-0.5">CHRONOLOGY</span>
              <span className="text-gray-200 font-mono flex items-center gap-1"><Calendar size={12} className="text-gold-500" /> {civA.period}</span>
            </div>
            <div className="p-3 rounded bg-matte-900 border border-gold-500/5">
              <span className="text-[9px] text-gray-500 block mb-0.5">GEOGRAPHY</span>
              <span className="text-gray-200">{civA.region}</span>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3 rounded bg-matte-900/60 border border-gold-500/5 space-y-1">
              <span className="text-[9px] text-gold-500 font-bold uppercase tracking-wider block">Decolonial Revision</span>
              <p className="text-gray-300 font-light">{civA.evidenceNote || 'Primary archaeological verification pending.'}</p>
            </div>
            <div className="p-3 rounded bg-matte-900/60 border border-gold-500/5 space-y-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Languages spoken</span>
              <p className="text-gray-300 font-mono text-[10px]">{civA.languages.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Civilization B Stats */}
        <div className="p-6 rounded-2xl glass-panel border border-gold-500/10 space-y-4">
          <div className="border-b border-gold-500/10 pb-3 flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Landmark className="text-gold-500" size={16} /> {civB.name}
            </h3>
            <span className="px-2 py-0.5 rounded bg-gold-950/40 text-[9px] text-gold-400 border border-gold-500/25 font-bold uppercase tracking-wider">{civB.evidenceTier}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded bg-matte-900 border border-gold-500/5">
              <span className="text-[9px] text-gray-500 block mb-0.5">CHRONOLOGY</span>
              <span className="text-gray-200 font-mono flex items-center gap-1"><Calendar size={12} className="text-gold-500" /> {civB.period}</span>
            </div>
            <div className="p-3 rounded bg-matte-900 border border-gold-500/5">
              <span className="text-[9px] text-gray-500 block mb-0.5">GEOGRAPHY</span>
              <span className="text-gray-200">{civB.region}</span>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3 rounded bg-matte-900/60 border border-gold-500/5 space-y-1">
              <span className="text-[9px] text-gold-500 font-bold uppercase tracking-wider block">Decolonial Revision</span>
              <p className="text-gray-300 font-light">{civB.evidenceNote || 'Primary archaeological verification pending.'}</p>
            </div>
            <div className="p-3 rounded bg-matte-900/60 border border-gold-500/5 space-y-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Languages spoken</span>
              <p className="text-gray-300 font-mono text-[10px]">{civB.languages.join(', ')}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Synthesis report compiler panel */}
      <div className="p-6 rounded-2xl glass-panel border border-gold-500/10 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-gold-500/10 pb-3">
          <h4 className="text-xs font-serif text-gold-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-gold-500" /> Cross-Cultural Synthesis Report
          </h4>
          
          <button
            onClick={handleGenerateAIReport}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-xs bg-gradient-to-r from-gold-600 to-bronze-600 text-black font-bold flex items-center gap-1.5 hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {isLoading ? 'Compiling Report...' : 'Compile Synthesis Report'}
          </button>
        </div>

        {comparisonReport ? (
          <div className="p-5 rounded-xl border border-gold-500/5 bg-matte-950/60 text-xs leading-relaxed text-gray-300 space-y-3 font-light">
            {comparisonReport.split('\n\n').map((para, idx) => {
              if (para.startsWith('### ')) {
                return <h4 key={idx} className="font-serif text-gold-400 font-bold text-sm tracking-wide mt-2">{para.replace('### ', '')}</h4>;
              }
              if (para.startsWith('* ') || para.startsWith('- ')) {
                return (
                  <ul key={idx} className="list-disc pl-4 space-y-1 my-1.5">
                    {para.split('\n').map((li, lIdx) => (
                      <li key={lIdx}>{li.replace(/^[*\-]\s+/, '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx}>{para}</p>;
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-600 text-xs italic">
            <AlertCircle size={24} className="mb-2 opacity-35 text-gold-500" />
            <span>Click the button above to generate a decolonial cross-cultural analysis.</span>
          </div>
        )}
      </div>

    </div>
  );
};
export default ComparativeAnalysis;
