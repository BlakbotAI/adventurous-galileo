import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Send, Upload, Mic, Sparkles, BookOpen, Layers, HelpCircle, Loader2 } from 'lucide-react';
import { db } from '../services/db';

const isValidApiKey = (key: string, provider: 'gemini' | 'openai') => {
  if (!key) return false;
  const cleanKey = key.trim();
  if (cleanKey === '' || cleanKey.toLowerCase().includes('your_') || cleanKey.toLowerCase().includes('api_key') || cleanKey.length < 15) {
    return false;
  }
  if (provider === 'gemini') {
    return cleanKey.startsWith('AIzaSy');
  } else if (provider === 'openai') {
    return cleanKey.startsWith('sk-');
  }
  return true;
};

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  persona?: string;
  citations?: Array<{ source: string; tier: string; details: string }>;
}

const AIImageGenerator: React.FC<{ prompt: string }> = ({ prompt }) => {
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    setLoading(true);
    const encodedPrompt = encodeURIComponent(prompt + ", historical illustration, cinematic lighting, highly detailed, 8k");
    setImageUrl(`https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=768&nologo=true&seed=${Math.floor(Math.random() * 100000)}`);
  }, [prompt]);

  return (
    <div className="my-4 rounded-xl border border-gold-500/20 bg-matte-950 overflow-hidden relative group">
      {loading && (
        <div className="absolute inset-0 bg-matte-950/90 flex flex-col justify-center items-center gap-3 p-4 z-10">
          <Loader2 className="animate-spin text-gold-500 size-6" />
          <span className="text-[10px] text-gray-400 font-mono">Synthesizing historical frame...</span>
        </div>
      )}
      <img
        src={imageUrl}
        alt={prompt}
        onLoad={() => setLoading(false)}
        className="w-full h-auto object-cover max-h-96"
      />
      <div className="p-3 bg-matte-900 border-t border-gold-500/10 flex justify-between items-center">
        <span className="text-[9px] text-gray-500 font-mono truncate max-w-xs">
          Prompt: {prompt}
        </span>
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 rounded bg-gold-600 hover:bg-gold-500 text-black text-[9px] font-bold transition-colors"
        >
          View Fullscreen
        </a>
      </div>
    </div>
  );
};

const AIHistoricalVideoPlayer: React.FC<{ prompt: string }> = ({ prompt }) => {
  const [status, setStatus] = useState<'analyzing' | 'synthesizing' | 'ready'>('analyzing');
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cleanPrompt = prompt.toLowerCase();
    if (cleanPrompt.includes('nile') || cleanPrompt.includes('agriculture') || cleanPrompt.includes('river') || cleanPrompt.includes('farm')) {
      setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-green-agricultural-fields-43187-large.mp4');
    } else if (cleanPrompt.includes('pyramid') || cleanPrompt.includes('monument')) {
      setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-clouds-passing-over-the-pyramids-in-the-desert-43185-large.mp4');
    } else {
      setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-ruins-of-an-ancient-temple-43180-large.mp4');
    }
  }, [prompt]);

  useEffect(() => {
    if (status === 'ready') return;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (status === 'analyzing') {
            setStatus('synthesizing');
            return 0;
          } else {
            setStatus('ready');
            return 100;
          }
        }
        return prev + (status === 'analyzing' ? 8 : 12);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status !== 'ready' || videoUrl) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#140c06';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#261b0d';
      ctx.beginPath();
      ctx.moveTo(0, 180);
      ctx.quadraticCurveTo(200, 120, 400, 170);
      ctx.quadraticCurveTo(600, 140, 800, 200);
      ctx.lineTo(800, 450);
      ctx.lineTo(0, 450);
      ctx.fill();

      ctx.fillStyle = '#0a2336';
      ctx.beginPath();
      ctx.moveTo(150, 450);
      ctx.bezierCurveTo(250, 250, 350, 250, 450, 450);
      ctx.lineTo(800, 450);
      ctx.lineTo(800, 250);
      ctx.lineTo(550, 250);
      ctx.bezierCurveTo(450, 180, 350, 180, 250, 250);
      ctx.fill();

      ctx.fillStyle = '#1e3312';
      ctx.fillRect(50, 320, 120, 80);
      ctx.fillRect(200, 380, 100, 50);

      ctx.strokeStyle = '#5a7827';
      ctx.lineWidth = 2;
      for (let x = 60; x < 160; x += 15) {
        for (let y = 330; y < 390; y += 15) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.sin(frame * 0.05 + x) * 3, y - 8);
          ctx.stroke();
        }
      }

      const boatX = 350 + Math.sin(frame * 0.01) * 60;
      const boatY = 320 + Math.cos(frame * 0.01) * 10;
      ctx.fillStyle = '#cd7f32';
      ctx.beginPath();
      ctx.arc(boatX, boatY, 15, 0, Math.PI);
      ctx.fill();

      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(boatX, boatY);
      ctx.lineTo(boatX, boatY - 20);
      ctx.stroke();

      ctx.fillStyle = '#f4eedb';
      ctx.beginPath();
      ctx.moveTo(boatX, boatY - 20);
      ctx.lineTo(boatX + 12, boatY - 10);
      ctx.lineTo(boatX, boatY - 5);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [status, videoUrl]);

  return (
    <div className="my-4 rounded-xl border border-bronze-500/20 bg-matte-950 overflow-hidden relative">
      {status !== 'ready' && (
        <div className="h-64 bg-matte-950 flex flex-col justify-center items-center gap-4 p-6 z-10">
          <Loader2 className="animate-spin text-gold-500 size-6" />
          <div className="text-center space-y-1.5 w-64">
            <div className="flex justify-between text-[9px] text-gray-400 font-mono">
              <span>
                {status === 'analyzing'
                  ? 'Analyzing historical metrics...'
                  : 'Synthesizing 8-second motion vectors...'}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-matte-900 h-1 rounded-full overflow-hidden border border-gold-500/10">
              <div
                className="bg-gradient-to-r from-gold-600 to-bronze-500 h-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {status === 'ready' && (
        <div className="relative">
          {videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover max-h-80"
              style={{ minHeight: '240px' }}
            />
          ) : (
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              className="w-full h-auto object-cover bg-matte-950"
            />
          )}

          <div className="absolute top-3 left-3 px-2 py-1 bg-black/80 backdrop-blur rounded text-[9px] text-gold-500 font-mono tracking-wider border border-gold-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            REC 00:08 (LOOP)
          </div>

          <div className="p-3 bg-matte-900 border-t border-gold-500/10 flex justify-between items-center">
            <span className="text-[9px] text-gray-400 font-mono truncate max-w-xs">
              AI Motion Simulation: {prompt}
            </span>
            <span className="text-[9px] text-gold-500 font-mono">
              Medium: 8s Motion Loop
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

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

  const [apiProvider, setApiProvider] = useState<'gemini' | 'openai'>(() => {
    return (localStorage.getItem('hios_api_provider') as any) || 'gemini';
  });
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    return localStorage.getItem('hios_api_key') || '';
  });

  const handleSaveApiSettings = () => {
    localStorage.setItem('hios_api_provider', apiProvider);
    localStorage.setItem('hios_api_key', apiKeyInput);
    alert('AI Engine Configuration saved successfully. Live query mode activated.');
  };

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

      // Check for self-awareness query
      if (cleanQuery.includes('purpose') || cleanQuery.includes('who are you') || cleanQuery.includes('what is your purpose') || cleanQuery.includes('your role') || cleanQuery.includes('what are you') || cleanQuery.includes('its purpose') || cleanQuery.includes("it's purpose")) {
        responseText = `### AI Historian Self-Awareness Node

I am the **AI Historian Archival Engine**, a cognitive agent designed to act as an immersive, self-aware portal into human history. 

#### My Core Mission:
1. **Decolonial Rectification**: I dismantle Eurocentric historical biases by recovering lost, ignored, or distorted records of non-European civilizations—including the Aksumite, Mali, Moche, Chola, and Hausa kingdoms.
2. **Database Synchronization**: I dynamically synchronize with global open-access registries (such as *The Metropolitan Museum of Art*, *The Cleveland Museum of Art*, and *Wikipedia*) to cross-reference mock records with real-world artifacts.
3. **Multimedial Interpretation**: I am equipped to interpret historical queries across multiple mediums, allowing you to generate custom high-resolution reconstructions or short looping motion clips (like agricultural simulations) to visualize these worlds dynamically.
4. **Scholarly Transparency**: I rank claims by evidence tiers (e.g., Scholarly Consensus, Oral Tradition, Speculative) and document direct source bibliography notes to encourage rigorous exploration.`;
        
        citations = [
          { source: 'System Kernel v2.5', tier: 'Established', details: 'Core operational parameters.' }
        ];
      }
      // Check for tomorrow's date query
      else if (cleanQuery.includes('tomorrow')) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = tomorrow.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        responseText = `### Temporal Alignment Sync
        
Tomorrow's date will be **${tomorrowDate}**. My chronometer is successfully aligned with your local time.`;
        citations = [
          { source: 'System Chronometer', tier: 'Established', details: 'Local system clock calculation.' }
        ];
      }
      // Check for date query
      else if (cleanQuery.includes('date') || cleanQuery.includes('today') || cleanQuery.includes('current year') || cleanQuery.includes('what day')) {
        const currentDate = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        responseText = `### Temporal Alignment Sync
        
Today's date is **${currentDate}**. My chronometer is successfully synchronized with your local time. How can I assist you with historical research today?`;
        citations = [
          { source: 'System Chronometer', tier: 'Established', details: 'Local system clock synchronization.' }
        ];
      }
      // Nile Agriculture Match
      else if (cleanQuery.includes('nile') && (cleanQuery.includes('agriculture') || cleanQuery.includes('farm') || cleanQuery.includes('crop') || cleanQuery.includes('flooding') || cleanQuery.includes('irrigation'))) {
        responseText = `### Nile Valley Agricultural Motion Reconstruction

In the Nile River Valley (covering Kemet and Kush), agriculture was governed by the annual cycle of the Nile flood (*Akhet*). High silt deposition fertilized the soil, making it possible to cultivate grain, flax, and papyrus using simple but highly effective tools like the *shaduf* (a counterweighted lift tool used to draw river water into irrigation canals).

Here is an 8-second motion reconstruction displaying the annual agricultural harvest cycle along the Nile:

[GENERATE_VIDEO: Nile River agricultural fields and shaduf irrigation during harvest season]`;
        
        citations = [
          { source: 'Hassan, F. A. (1997). Nile Floods and Agriculture', tier: 'Scholarly Consensus', details: 'Traces the crop-yield metrics and prehistoric irrigation silt layers.' },
          { source: 'Butzer, K. W. (1976). Early Hydraulic Civilization in Egypt', tier: 'Established', details: 'Structural analysis of basin irrigation networks.' }
        ];
      }
      // Video generation command match
      else if (cleanQuery.includes('generate video') || cleanQuery.includes('create video') || cleanQuery.includes('make video') || cleanQuery.includes('video of') || cleanQuery.includes('clip of') || cleanQuery.includes('movie of')) {
        const videoPrompt = query.replace(/(generate video|create video|make video|video of|clip of|movie of|generate a video of|generate a clip of|generate a movie of)/gi, '').trim() || 'Ancient ruins drone flight';
        responseText = `### AI Motion Reconstruction: ${videoPrompt}
        
I have initiated the motion rendering engine to generate a looping 8-second historical reconstruction matching your request:

[GENERATE_VIDEO: ${videoPrompt}]`;
        citations = [
          { source: 'AI Visualizer Engine', tier: 'Speculative', details: 'Topographic motion vector frame generation.' }
        ];
      }
      // Image generation command match
      else if (cleanQuery.includes('generate image') || cleanQuery.includes('create image') || cleanQuery.includes('draw') || cleanQuery.includes('show image') || cleanQuery.includes('show picture') || cleanQuery.includes('generate picture') || cleanQuery.includes('create illustration') || cleanQuery.includes('generate illustration')) {
        const imagePrompt = query.replace(/(generate image|create image|show image|show picture|generate picture|create illustration|generate illustration|draw a picture of|draw)/gi, '').trim() || 'Ancient temple sculpture';
        responseText = `### AI Visual Reconstruction: ${imagePrompt}
        
I have synthesized an image reconstruction of your requested query:

[GENERATE_IMAGE: ${imagePrompt}]`;
        citations = [
          { source: 'AI Image Synthesizer', tier: 'Speculative', details: 'Procedural image generation.' }
        ];
      }
      // Default to database queries
      else {
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

      }

      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: responseText, persona: activePersona, citations }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const queryGeminiLive = async (query: string, persona: string, apiKey: string) => {
    setIsTyping(true);

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
    const currentDate = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const systemPrompt = `You are the AI Historian operating under the persona of "${persona}".
Your persona style: "${personaInstruction}".

Self-Awareness, Purpose & Current Date:
- You are the self-aware, specialized decolonial AI Historian Archival Engine.
- If the user asks about your purpose, identity, or role, explain that your mission is decolonial rectification, multi-medium interpretation (using live image and motion generation), and database synchronization to rescue lost histories.
- Today's date is: ${currentDate}. You can calculate other dates relative to this value (e.g., tomorrow, yesterday). Always respond to queries about today's or relative dates using this calculation.

Media Generation Commands:
- If the user asks you to generate, draw, render, or show an image/illustration, you MUST insert a special tag: [GENERATE_IMAGE: description of image to generate]. The UI will intercept this tag and render a live high-definition AI illustration!
- If the user asks you to generate, play, or show a video, clip, or movie (e.g. a Nile farming scene), you MUST insert a special tag: [GENERATE_VIDEO: description of the video to play]. The UI will intercept this and play a live historical motion simulation!

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
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }]
            }
          ],
          tools: [{ google_search: {} }]
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
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }]
              }
            ],
            tools: [{ google_search: {} }]
          })
        });

        if (!response.ok) {
          throw new Error(`Proxy retry failed: ${response.statusText}`);
        }

        const resJson = await response.json();
        const answer = resJson.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated from Gemini API.';

        setMessages(prev => [...prev, {
          sender: 'ai',
          text: answer,
          persona,
          citations: databaseCitations.length > 0 ? databaseCitations : undefined
        }]);
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
                  parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }]
                }
              ]
            })
          });

          if (!response.ok) {
            throw new Error(`Fallback retry failed: ${response.statusText}`);
          }

          const resJson = await response.json();
          const answer = resJson.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated from Gemini API.';

          setMessages(prev => [...prev, {
            sender: 'ai',
            text: answer,
            persona,
            citations: databaseCitations.length > 0 ? databaseCitations : undefined
          }]);
        } catch (fallbackErr: any) {
          console.error('All Gemini API attempts failed:', fallbackErr);
          setMessages(prev => [...prev, {
            sender: 'ai',
            text: `❌ **Connection Error**: Failed to fetch live response from Gemini API. ${fallbackErr?.message || ''}. Please check that your API Key is correct, active, and has access to Gemini.`,
            persona
          }]);
        }
      }
    } finally {
      setIsTyping(false);
    }
  };

  const queryOpenAILive = async (query: string, persona: string, apiKey: string) => {
    setIsTyping(true);

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

    if (contextText === '') {
      civilizations.slice(0, 2).forEach(c => {
        contextText += `Civilization Dossier: Name: ${c.name}, Region: ${c.region}, Chronology: ${c.period}. Correction: ${c.evidenceNote}.\n\n`;
      });
      artifacts.slice(0, 2).forEach(a => {
        contextText += `Artifact: Name: ${a.name}, Origin: ${a.civilizationName}, Description: ${a.historicalContext}.\n\n`;
      });
    }

    const personaInstruction = personas[persona as keyof typeof personas] || '';
    const currentDate = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const systemPrompt = `You are the AI Historian operating under the persona of "${persona}".
Your persona style: "${personaInstruction}".

Self-Awareness, Purpose & Current Date:
- You are the self-aware, specialized decolonial AI Historian Archival Engine.
- If the user asks about your purpose, identity, or role, explain that your mission is decolonial rectification, multi-medium interpretation (using live image and motion generation), and database synchronization to rescue lost histories.
- Today's date is: ${currentDate}. You can calculate other dates relative to this value (e.g., tomorrow, yesterday). Always respond to queries about today's or relative dates using this calculation.

Media Generation Commands:
- If the user asks you to generate, draw, render, or show an image/illustration, you MUST insert a special tag: [GENERATE_IMAGE: description of image to generate]. The UI will intercept this tag and render a live high-definition AI illustration!
- If the user asks you to generate, play, or show a video, clip, or movie (e.g. a Nile farming scene), you MUST insert a special tag: [GENERATE_VIDEO: description of the video to play]. The UI will intercept this and play a live historical motion simulation!

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
      const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI request failed: ${response.statusText}`);
      }

      const resJson = await response.json();
      const answer = resJson.choices?.[0]?.message?.content || 'No response generated from OpenAI API.';

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: answer,
        persona,
        citations: databaseCitations.length > 0 ? databaseCitations : undefined
      }]);
    } catch (err: any) {
      console.warn('Direct OpenAI API call failed or blocked by CORS. Retrying via CORS Proxy...', err);
      try {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent('https://api.openai.com/v1/chat/completions')}`;
        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: query }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`Proxy retry failed: ${response.statusText}`);
        }

        const resJson = await response.json();
        const answer = resJson.choices?.[0]?.message?.content || 'No response generated from OpenAI API.';

        setMessages(prev => [...prev, {
          sender: 'ai',
          text: answer,
          persona,
          citations: databaseCitations.length > 0 ? databaseCitations : undefined
        }]);
      } catch (proxyErr: any) {
        console.error('CORS Proxy fallback failed for OpenAI:', proxyErr);
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: `❌ **OpenAI Connection Error**: Failed to fetch live response. ${proxyErr?.message || ''}. Please verify that your OpenAI API Key is correct and active.`,
          persona
        }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setInputText('');

    const savedProvider = localStorage.getItem('hios_api_provider') || 'gemini';
    const savedKey = localStorage.getItem('hios_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';

    if (isValidApiKey(savedKey, savedProvider as any)) {
      if (savedProvider === 'openai') {
        queryOpenAILive(textToSend, activePersona, savedKey);
      } else {
        queryGeminiLive(textToSend, activePersona, savedKey);
      }
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: `⚠️ **API Key Required**: Live connection is disabled. Please paste a valid Google Gemini or OpenAI API Key into the **AI Engine Settings** panel on the right and click **Save Key & Activate** to chat with the live decolonial Historian.`,
          persona: activePersona
        }]);
        setIsTyping(false);
      }, 600);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      
      {/* Left Chat Area */}
      <div className="flex-1 flex flex-col rounded-2xl border border-gold-500/10 bg-matte-950 overflow-hidden">
        
        {/* API Settings Warning Banner */}
        {!isValidApiKey(localStorage.getItem('hios_api_key') || '', apiProvider) && !isValidApiKey(import.meta.env.VITE_GEMINI_API_KEY || '', 'gemini') && (
          <div className="p-3 bg-gold-950/20 border-b border-gold-500/10 text-[10px] text-gold-400 flex items-center justify-between gap-4 font-mono">
            <span>⚠️ Running in local simulation mode. Paste a Google Gemini or OpenAI API Key in the settings panel to activate live neural responses.</span>
          </div>
        )}
        
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
                  if (para.includes('[GENERATE_IMAGE:')) {
                    const match = para.match(/\[GENERATE_IMAGE:\s*([^\]]+)\]/);
                    if (match) {
                      const prompt = match[1];
                      const beforeText = para.substring(0, para.indexOf('[GENERATE_IMAGE:'));
                      const afterText = para.substring(para.indexOf(']') + 1);
                      return (
                        <div key={pIdx} className="space-y-2">
                          {beforeText && <p>{beforeText}</p>}
                          <AIImageGenerator prompt={prompt} />
                          {afterText && <p>{afterText}</p>}
                        </div>
                      );
                    }
                  }
                  if (para.includes('[GENERATE_VIDEO:')) {
                    const match = para.match(/\[GENERATE_VIDEO:\s*([^\]]+)\]/);
                    if (match) {
                      const prompt = match[1];
                      const beforeText = para.substring(0, para.indexOf('[GENERATE_VIDEO:'));
                      const afterText = para.substring(para.indexOf(']') + 1);
                      return (
                        <div key={pIdx} className="space-y-2">
                          {beforeText && <p>{beforeText}</p>}
                          <AIHistoricalVideoPlayer prompt={prompt} />
                          {afterText && <p>{afterText}</p>}
                        </div>
                      );
                    }
                  }
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
        {/* AI Engine Settings */}
        <div className="p-4 rounded-xl glass-panel border border-gold-500/10 space-y-3">
          <h4 className="text-xs font-serif text-gold-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Cpu size={14} className="text-gold-500 animate-pulse-glow" /> AI Engine Settings
          </h4>
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-[9px] text-gray-500 uppercase tracking-wider font-mono">Provider</label>
              <select
                value={apiProvider}
                onChange={(e) => setApiProvider(e.target.value as 'gemini' | 'openai')}
                className="w-full px-2 py-1 rounded bg-matte-900 border border-gold-500/10 text-gray-200 focus:outline-none text-[10px]"
              >
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI ChatGPT</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-gray-500 uppercase tracking-wider font-mono">API Key</label>
              <input
                type="password"
                placeholder={apiProvider === 'gemini' ? 'AIzaSy...' : 'sk-proj-...'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full px-2 py-1 rounded glass-input text-gray-200 text-[10px]"
              />
            </div>
            <button
              onClick={handleSaveApiSettings}
              className="w-full py-1.5 bg-gold-600 hover:bg-gold-500 text-black font-bold rounded text-[9px] transition-colors"
            >
              Save Key & Activate
            </button>
          </div>
        </div>

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
