import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Send, Upload, Mic, Sparkles, BookOpen, Layers, HelpCircle } from 'lucide-react';
import { db } from '../services/db';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  persona?: string;
  citations?: Array<{ source: string; tier: string; details: string }>;
}

interface AIHistorianProps {
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

export const AIHistorian: React.FC<AIHistorianProps> = ({ initialQuery, onClearInitialQuery }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Greetings. I am the AI Historian Archival Engine. Select a cognitive persona below to guide our exploration of humanity\'s deep histories.',
      persona: 'AI Curator'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [activePersona, setActivePersona] = useState<'AI Curator' | 'AI Archaeologist' | 'AI Debate Assistant'>('AI Curator');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const personas = {
    'AI Curator': 'Explains collections, display details, cultural importance, and public narratives.',
    'AI Archaeologist': 'Focuses on stratigraphy, dating methods, material properties, and excavation notes.',
    'AI Debate Assistant': 'Distinguishes between oral memories, document translations, consensus, and controversial interpretations.'
  };

  const samplePrompts = [
    'Compare pyramids in Egypt and Kush',
    'What is the mathematical layout of the Ishango bone?',
    'Did West Africans cross the Atlantic before Columbus?',
    'Tell me about iron working in Nok culture'
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle initial query from global search
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      const query = initialQuery;
      // Clear the query in parent so it doesn't trigger again
      if (onClearInitialQuery) {
        onClearInitialQuery();
      }
      // Add message and trigger response
      setMessages(prev => [...prev, { sender: 'user', text: query }]);
      simulateResponse(query);
    }
  }, [initialQuery]);

  const simulateResponse = (query: string) => {
    setIsTyping(true);
    setTimeout(() => {
      let responseText = '';
      let citations: Array<{ source: string; tier: string; details: string }> = [];

      const cleanQuery = query.toLowerCase();

      // Query database records dynamically
      const civilizations = db.getCivilizations();
      const artifacts = db.getArtifacts();
      const figures = db.getFigures();

      const matchedArt = artifacts.find(a => cleanQuery.includes(a.name.toLowerCase()) || a.name.toLowerCase().includes(cleanQuery));
      const matchedCiv = civilizations.find(c => cleanQuery.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(cleanQuery));
      const matchedFig = figures.find(f => cleanQuery.includes(f.name.toLowerCase()) || f.name.toLowerCase().includes(cleanQuery));

      if (matchedArt) {
        responseText = `### Curation Log: ${matchedArt.name}
        
* **Culture**: ${matchedArt.civilizationName}
* **Material Composition**: ${matchedArt.material.join(', ')}
* **Estimated Dating**: ${matchedArt.date}
* **Scientific Dating Method**: ${matchedArt.datingMethod}
* **Current Location**: ${matchedArt.museum} (${matchedArt.currentLocation})

#### Decolonial Context
${matchedArt.historicalContext}

#### Excavation & Discovery Notes
${matchedArt.discoveryNotes}`;

        if (matchedArt.scholarlyDebates) {
          responseText += `\n\n#### Repatriation & Colonial Disputes\n${matchedArt.scholarlyDebates}`;
        }

        citations = matchedArt.sources.map(src => ({
          source: src.sourceId,
          tier: matchedArt.evidenceTier,
          details: src.pageOrDetail || 'Archival record'
        }));

        if (citations.length === 0) {
          citations = [{ source: 'HIOS Digital Registry', tier: 'Established', details: `Official entry for ${matchedArt.name}` }];
        }
      } else if (matchedCiv) {
        responseText = `### Civilization Dossier: ${matchedCiv.name}
        
* **Geographical Region**: ${matchedCiv.region}
* **Timeline Range**: ${matchedCiv.period}
* **Curation Verification Tier**: ${matchedCiv.evidenceTier}

#### Eurocentric / Colonial Misconceptions
${matchedCiv.receivedNarrative || 'No narratives loaded.'}

#### Decolonial Rectification & Evidence
${matchedCiv.evidenceNote || 'No evidence loaded.'}`;

        citations = [
          { source: `${matchedCiv.name} Epigraphic Corpus`, tier: matchedCiv.evidenceTier, details: 'Verified archaeological and structural site data.' }
        ];
      } else if (matchedFig) {
        responseText = `### Historical Figure Dossier: ${matchedFig.name} (${matchedFig.title})
        
* **Kingdom / Culture**: ${matchedFig.civilizationName}
* **Regnal Period**: ${matchedFig.period}

#### Biographical Records
${matchedFig.biography}

#### Key Historical Achievements
${matchedFig.achievements.map(a => `* ${a}`).join('\n')}`;

        citations = [
          { source: `${matchedFig.civilizationName} Oral & Royal Archives`, tier: 'Established', details: 'Palace records and primary source entries.' }
        ];
      } else if (cleanQuery.includes('pyramid') || cleanQuery.includes('egypt and kush')) {
        responseText = `### Comparative Analysis: Nile Valley Pyramids

Here is the structural and historical breakdown of pyramid construction in Egypt (Kemet) vs Nubia (Kush):

1. **Chronology**: Egypt built pyramids primarily during the Old and Middle Kingdoms (c. 2700 BCE - 1700 BCE). Kushite pyramids were built much later (c. 700 BCE - 300 CE) at Napata and Meroë.
2. **Architecture**: Egyptian pyramids are broad-based and large (e.g. Giza is 146m tall). Kushite pyramids are steep-angled (approx 70 degrees), narrow-based, and smaller (typically 10m to 30m tall), built with a chapel room at the eastern base.
3. **Burial Rites**: Egyptian pharaohs were buried inside the pyramid core. Kushite rulers were buried in subterranean chambers carved beneath the pyramid itself.

The 25th Dynasty (Kushite rule over Egypt) unified these traditions, showing a resurgence of monumental arch construction.`;

        citations = [
          { source: 'Welsby, D. A. (1996). The Kingdom of Kush', tier: 'Scholarly Consensus', details: 'Details the Meroitic steep-angled architectural metrics.' },
          { source: 'Reisner, G. A. (1918). Barkal Pyramids', tier: 'Established', details: 'Excavation reports on the subterranean burial chambers.' }
        ];
      } else if (cleanQuery.includes('ishango') || cleanQuery.includes('math')) {
        responseText = `### Mathematical Curation of the Ishango Bone

The **Ishango Bone** (dating to c. 20,000 BCE) represents one of the earliest mathematical tools. 

* **The Notches**: It consists of three columns of carved notches:
  * *Column 1*: Carvings grouped in primes (11, 13, 17, 19).
  * *Column 2*: Carvings showing duplication/doubling rules (3 and 6, 4 and 8, 5 and 10).
  * *Column 3*: Groupings that add up to 60 or 48.
* **Scientific Interpretations**:
  * *Lunar Calendar Hypothesis*: Standard San calendar metrics.
  * *Calculation Tool Hypothesis*: Used as a sliding base-10 counting grid.`;

        citations = [
          { source: 'Huylebrouck, D. (1999). The Ishango Bone', tier: 'Scholarly Consensus', details: 'Proves mathematical groupings over simple notches.' },
          { source: 'Heinzelin, J. (1957). Excavation Reports', tier: 'Established', details: 'Contextual stratigraphy in Semliki River Valley.' }
        ];
      } else if (cleanQuery.includes('atlantic') || cleanQuery.includes('columbus') || cleanQuery.includes('abu bakr')) {
        if (activePersona === 'AI Debate Assistant') {
          responseText = `### Multi-Perspective Review: Mansa Abu Bakr II Voyages

Historical analysis of pre-Columbian West African maritime exploration involves a division of evidence:

1. **Oral Tradition (Griot Accounts)**: Griots record that Mansa Abu Bakr II built a fleet of 2,000 ships to cross the Atlantic. (*Status: Contested/Oral Record*)
2. **Textual Evidence**: Ibn Battuta and Al-Umari recorded interviews with Mansa Musa in Cairo, where Musa explicitly details his predecessor abdicating to cross the Western Ocean. (*Status: Established Text*)
3. **Archaeological / Botanical Evidence**: Some alternative scholarly models cite African cotton strains, gold alloys (Guanin) found in Hispaniola, and linguistic similarities. (*Status: Speculative*)

**Consensus View**: The existence of the voyages is recorded textually, but there is no currently verified archaeological consensus of a permanent settlement in the Americas.`;
        } else {
          responseText = `Mansa Abu Bakr II of the Mali Empire abdicated the throne in 1311 CE to launch a massive fleet of 2,000 boats to explore the Western Ocean (Atlantic). While the texts of Arabic historians like Al-Umari document the launch of this expedition, definitive archaeological evidence of their landfall in the Americas remains a subject of ongoing debate.`;
        }

        citations = [
          { source: 'Al-Umari, Shihab al-Din (1340). Masalik al-Absar', tier: 'Established Document', details: 'Contains Mansa Musa\'s direct testimony of the voyages.' },
          { source: 'Van Sertima, I. (1976). They Came Before Columbus', tier: 'Contested / Speculative', details: 'Linguistic and chemical comparisons of gold alloys.' }
        ];
      } else if (cleanQuery.includes('iron') || cleanQuery.includes('nok')) {
        responseText = `### Iron Smelting in the Nok Culture

Excavations at **Taruga (Nigeria)** show that Nok culture smelted iron by at least **1000 BCE**.

* **Independent Development**: Unlike Europe and North Africa, Nok culture moved directly from the Stone Age into the Iron Age without a Bronze Age transition phase.
* **Furnace Design**: They utilized shaft-furnaces fed by local charcoal, achieving temperatures over 1200°C.
* **Refutation of Saharan Diffusion**: Stratigraphy dates prove Nok smelting occurred simultaneously with or earlier than Carthage, indicating local independent invention.`;

        citations = [
          { source: 'Tylecote, R. (1975). The Nok Iron Smelting', tier: 'Scholarly Consensus', details: 'Proves independent metallurgy without Mediterranean imports.' }
        ];
      } else {
        responseText = `Thank you for your inquiry regarding "${query}". Under the "${activePersona}" persona, I am scouring the carbon dating archives and primary sources. 

Could you specify if you are looking for:
1. Material property analysis (Archaeologist)
2. Historical debates and source biases (Debate Assistant)
3. General collection context (Curator)

Please try query suggestions: "Compare pyramids in Egypt and Kush" or "What is the mathematical layout of the Ishango bone?"`;
        
        citations = [
          { source: 'HIOS Archival Index Database v1.0', tier: 'Established', details: 'Global database records.' }
        ];
      }

      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: responseText, persona: activePersona, citations }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const queryGeminiLive = async (query: string, persona: string) => {
    setIsTyping(true);
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';

    // 1. Gather context from local database matching keywords
    const civilizations = db.getCivilizations();
    const artifacts = db.getArtifacts();
    const figures = db.getFigures();

    const cleanQuery = query.toLowerCase();
    const matchingCivs = civilizations.filter(c => cleanQuery.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(cleanQuery));
    const matchingArts = artifacts.filter(a => cleanQuery.includes(a.name.toLowerCase()) || a.name.toLowerCase().includes(cleanQuery));
    const matchingFigs = figures.filter(f => cleanQuery.includes(f.name.toLowerCase()) || f.name.toLowerCase().includes(cleanQuery));

    let contextText = '';
    const databaseCitations: Array<{ source: string; tier: string; details: string }> = [];

    matchingCivs.forEach(c => {
      contextText += `Civilization Dossier: Name: ${c.name}, Region: ${c.region}, Chronology: ${c.period}. Narrative Correction: ${c.evidenceNote || c.receivedNarrative}. Evidence Status: ${c.evidenceTier}.\n\n`;
      databaseCitations.push({ source: c.name, tier: c.evidenceTier, details: c.evidenceNote || 'Primary historical ledger.' });
    });

    matchingArts.forEach(a => {
      contextText += `Artifact Registry: Name: ${a.name}, Origin: ${a.civilizationName}, Dating Method: ${a.datingMethod}, Chronology: ${a.date}. Museum: ${a.museum}. Description: ${a.historicalContext}. Repatriation Debate: ${a.scholarlyDebates || 'None'}. Evidence Status: ${a.evidenceTier}.\n\n`;
      databaseCitations.push({ source: a.name, tier: a.evidenceTier, details: `${a.museum} repatriation logs: ${a.scholarlyDebates || 'Legitimate archaeological verification.'}` });
    });

    matchingFigs.forEach(f => {
      contextText += `Historical Figure: Name: ${f.name}, Title: ${f.title}, Civilization: ${f.civilizationName}, Chronology: ${f.period}. Bio: ${f.biography}. Achievements: ${f.achievements.join(', ')}.\n\n`;
      databaseCitations.push({ source: f.name, tier: 'Established', details: f.biography });
    });

    // If no exact matches, pick featured items as general context
    if (contextText === '') {
      civilizations.slice(0, 2).forEach(c => {
        contextText += `Civilization Dossier: Name: ${c.name}, Region: ${c.region}, Chronology: ${c.period}. Correction: ${c.evidenceNote}.\n\n`;
      });
      artifacts.slice(0, 2).forEach(a => {
        contextText += `Artifact: Name: ${a.name}, Origin: ${a.civilizationName}, Description: ${a.historicalContext}.\n\n`;
      });
    }

    const personaInstruction = personas[persona as keyof typeof personas] || '';
    const systemPrompt = `You are the AI Historian operating under the persona of "${persona}".
Your persona style: "${personaInstruction}".
Answer the user's historical query using the following verified decolonial database records as primary source evidence:
---
${contextText}
---
Instructions:
- Deconstruct colonial/eurocentric biases. Use active voice and write with rich historical authority.
- Provide a summary, citation nodes, and evidence confirmations.
- Keep output concise and formatted in clean markdown.
- Do NOT make up facts. Focus on the provided database context.
`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini request failed: ${response.statusText}`);
      }

      const resJson = await response.json();
      const answer = resJson.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated from Gemini API.';

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: answer,
        persona,
        citations: databaseCitations.length > 0 ? databaseCitations : undefined
      }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: `**Connection Error**: Failed to fetch live response from Gemini API. ${err?.message || ''}. Falling back to local offline search...`,
        persona
      }]);
      // Fallback
      simulateResponse(query);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setInputText('');

    const isLive = Boolean(import.meta.env.VITE_GEMINI_API_KEY);
    if (isLive) {
      queryGeminiLive(textToSend, activePersona);
    } else {
      simulateResponse(textToSend);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      
      {/* Left Chat Area */}
      <div className="flex-1 flex flex-col rounded-2xl border border-gold-500/10 bg-matte-950 overflow-hidden">
        
        {/* Persona Select Header */}
        <div className="p-3 border-b border-gold-500/10 bg-matte-950/60 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            {(Object.keys(personas) as Array<keyof typeof personas>).map(p => (
              <button
                key={p}
                onClick={() => setActivePersona(p)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wide border transition-all ${
                  activePersona === p
                    ? 'bg-gradient-to-r from-gold-600 to-bronze-600 text-black border-gold-500 font-bold'
                    : 'bg-matte-900 border-gold-500/10 hover:border-gold-500/30 text-gray-400 hover:text-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] text-gray-500 hidden xl:block italic font-light">
              Active: {personas[activePersona]}
            </span>
            <div className={`px-2.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-mono border ${
              import.meta.env.VITE_GEMINI_API_KEY 
                ? 'bg-green-950/30 border-green-500/40 text-green-400' 
                : 'bg-gold-950/20 border-gold-500/20 text-gold-500'
            }`}>
              {import.meta.env.VITE_GEMINI_API_KEY ? 'Live Gemini RAG' : 'Simulated RAG'}
            </div>
          </div>
        </div>

        {/* Chat Balloon Display */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col max-w-[85%] ${m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              {/* Persona Tag */}
              {m.persona && m.sender === 'ai' && (
                <span className="text-[9px] text-gold-500 font-mono font-bold mb-1 flex items-center gap-1">
                  <Cpu size={9} /> {m.persona}
                </span>
              )}
              
              {/* Message box */}
              <div
                className={`p-4 rounded-xl text-xs leading-relaxed font-light ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-gold-950/30 to-bronze-950/20 text-gold-200 border border-gold-500/20 rounded-tr-none'
                    : 'glass-panel text-gray-200 border border-gold-500/10 rounded-tl-none space-y-2'
                }`}
              >
                {/* Format basic markdown segments */}
                {m.text.split('\n\n').map((para, pIdx) => {
                  if (para.startsWith('### ')) {
                    return <h4 key={pIdx} className="font-serif text-gold-400 font-bold text-sm tracking-wide mt-2">{para.replace('### ', '')}</h4>;
                  }
                  if (para.startsWith('* ')) {
                    return (
                      <ul key={pIdx} className="list-disc pl-4 space-y-1 my-1.5">
                        {para.split('\n').map((li, lIdx) => (
                          <li key={lIdx}>{li.replace('* ', '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={pIdx}>{para}</p>;
                })}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-gold-500/60 font-mono italic p-2">
              <Sparkles size={12} className="animate-spin" /> Engine typing response...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="p-3 border-t border-gold-500/10 bg-matte-950/60 flex items-center gap-2">
          {/* File Upload Icon */}
          <button className="p-2 rounded bg-matte-900 border border-gold-500/10 text-gold-500 hover:text-white" title="Upload Document / Image">
            <Upload size={14} />
          </button>
          
          <input
            type="text"
            placeholder="Formulate query to AI Historian..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
            className="flex-1 py-2 px-3 rounded-lg text-xs glass-input text-gray-200"
          />

          {/* Voice button */}
          <button className="p-2 rounded bg-matte-900 border border-gold-500/10 text-gold-500 hover:text-white" title="Voice Input Mode">
            <Mic size={14} />
          </button>
          
          <button
            onClick={() => handleSend(inputText)}
            className="p-2 rounded bg-gold-600 hover:bg-gold-500 text-black font-bold"
          >
            <Send size={14} />
          </button>
        </div>
      </div>

      {/* Right Citations Panel */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
        {/* Suggestion Prompts */}
        <div className="p-4 rounded-xl glass-panel border border-gold-500/10 space-y-3">
          <h4 className="text-xs font-serif text-gold-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <HelpCircle size={14} /> Recommended Queries
          </h4>
          <div className="space-y-1.5 flex flex-col">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="text-left text-[11px] bg-matte-900/60 hover:bg-gold-950/20 text-gray-400 hover:text-gold-400 border border-gold-500/5 hover:border-gold-500/20 p-2 rounded transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Citations Panel */}
        <div className="p-4 rounded-xl glass-panel border border-gold-500/10 flex-1 space-y-4 overflow-y-auto">
          <h4 className="text-xs font-serif text-gold-500 font-bold uppercase tracking-wider border-b border-gold-500/10 pb-2 flex items-center gap-1.5">
            <BookOpen size={14} /> Response Provenance
          </h4>

          {messages[messages.length - 1]?.citations ? (
            <div className="space-y-4">
              <span className="text-[10px] text-gray-500 leading-normal block">
                The active AI response utilized the following verified peer-reviewed sources:
              </span>
              {messages[messages.length - 1].citations?.map((c, i) => (
                <div key={i} className="p-3 rounded bg-matte-900 border border-gold-500/5 space-y-2 text-[10px]">
                  <div className="flex justify-between items-center border-b border-gold-500/5 pb-1">
                    <span className="text-gold-400 font-semibold truncate max-w-[150px]">{c.source}</span>
                    <span className="px-1.5 py-0.5 rounded bg-gold-950/40 text-[9px] text-gold-500 border border-gold-500/20 font-bold">
                      {c.tier}
                    </span>
                  </div>
                  <p className="text-gray-400 leading-relaxed font-light">{c.details}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center text-gray-600 text-xs italic">
              <Layers size={24} className="mb-2 opacity-35 text-gold-500" />
              <span>Citations will render here as queries complete.</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
export default AIHistorian;
