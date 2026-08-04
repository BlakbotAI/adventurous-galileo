import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, ShieldCheck, X, AlertTriangle, Search, Loader2, Globe, Crown, Scroll } from 'lucide-react';
import type { Civilization, Artifact, HistoricalFigure, EvidenceTier, DBQuizQuestion } from '../types/database';
import { searchWikipedia, getWikipediaPageDetails } from '../services/wikipedia';

export const CuratorPanel: React.FC = () => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<'civs' | 'arts' | 'figs' | 'quizzes' | 'wiki'>('civs');

  const [civilizations, setCivilizations] = useState<Civilization[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [figures, setFigures] = useState<HistoricalFigure[]>([]);
  const [quizzes, setQuizzes] = useState<DBQuizQuestion[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingEntityId, setEditingEntityId] = useState<string | null>(null);

  // Forms states - Civilization
  const [civName, setCivName] = useState('');
  const [civRegion, setCivRegion] = useState('');
  const [civPeriod, setCivPeriod] = useState('');
  const [civStartYear, setCivStartYear] = useState(0);
  const [civEndYear, setCivEndYear] = useState(0);
  const [civNarrative, setCivNarrative] = useState('');
  const [civEvidence, setCivEvidence] = useState('');
  const [civTier, setCivTier] = useState<EvidenceTier>('Established');
  const [civAfrica, setCivAfrica] = useState(true);
  const [civImg, setCivImg] = useState('');

  // Forms states - Artifact
  const [artName, setArtName] = useState('');
  const [artCivId, setArtCivId] = useState('');
  const [artDate, setArtDate] = useState('');
  const [artStartYear, setArtStartYear] = useState(0);
  const [artMaterial, setArtMaterial] = useState('');
  const [artMuseum, setArtMuseum] = useState('');
  const [artLoc, setArtLoc] = useState('');
  const [artScore, setArtScore] = useState(5);
  const [artContext, setArtContext] = useState('');
  const [artDiscovery, setArtDiscovery] = useState('');
  const [artDating, setArtDating] = useState('');
  const [artDebate, setArtDebate] = useState('');
  const [artImg, setArtImg] = useState('');

  // Form states - Figure
  const [figName, setFigName] = useState('');
  const [figTitle, setFigTitle] = useState('');
  const [figCivId, setFigCivId] = useState('');
  const [figPeriod, setFigPeriod] = useState('');
  const [figStartYear, setFigStartYear] = useState(0);
  const [figBio, setFigBio] = useState('');
  const [figAchievements, setFigAchievements] = useState('');
  const [figImg, setFigImg] = useState('');

  // Form states - Quiz
  const [quizQuestionText, setQuizQuestionText] = useState('');
  const [quizOpt0, setQuizOpt0] = useState('');
  const [quizOpt1, setQuizOpt1] = useState('');
  const [quizOpt2, setQuizOpt2] = useState('');
  const [quizOpt3, setQuizOpt3] = useState('');
  const [quizAnswerIndex, setQuizAnswerIndex] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState('');
  const [quizCategory, setQuizCategory] = useState('');

  // Wikipedia Search & Coordinates States
  const [wikiQuery, setWikiQuery] = useState('');
  const [wikiType, setWikiType] = useState<'civ' | 'art' | 'fig'>('civ');
  const [wikiResults, setWikiResults] = useState<any[]>([]);
  const [wikiSearchLoading, setWikiSearchLoading] = useState(false);
  const [wikiDetailLoading, setWikiDetailLoading] = useState(false);
  const [wikiError, setWikiError] = useState<string | null>(null);

  const [civLatitude, setCivLatitude] = useState<number | ''>('');
  const [civLongitude, setCivLongitude] = useState<number | ''>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setCivilizations(db.getCivilizations());
    setArtifacts(db.getArtifacts());
    setFigures(db.getFigures());
    setQuizzes(db.getQuizQuestions());
  };

  const handleOpenCreate = () => {
    setIsEditing(true);
    setEditingEntityId(null);
    clearForms();
  };

  const handleOpenEdit = (entity: any, type: 'civ' | 'art' | 'fig' | 'quiz') => {
    setIsEditing(true);
    setEditingEntityId(entity.id);
    if (type === 'civ') {
      const civ = entity as Civilization;
      setCivName(civ.name);
      setCivRegion(civ.region);
      setCivPeriod(civ.period);
      setCivStartYear(civ.startYear);
      setCivEndYear(civ.endYear);
      setCivNarrative(civ.receivedNarrative || '');
      setCivEvidence(civ.evidenceNote || '');
      setCivTier(civ.evidenceTier);
      setCivAfrica(civ.africaCentered);
      setCivImg(civ.imageUrl || '');
      setCivLatitude(civ.latitude !== undefined ? civ.latitude : '');
      setCivLongitude(civ.longitude !== undefined ? civ.longitude : '');
    } else if (type === 'art') {
      const art = entity as Artifact;
      setArtName(art.name);
      setArtCivId(art.civilizationId);
      setArtDate(art.date);
      setArtStartYear(art.startYear);
      setArtMaterial(art.material.join(', '));
      setArtMuseum(art.museum);
      setArtLoc(art.currentLocation);
      setArtScore(art.importanceScore);
      setArtContext(art.historicalContext);
      setArtDiscovery(art.discoveryNotes);
      setArtDating(art.datingMethod);
      setArtDebate(art.scholarlyDebates || '');
      setArtImg(art.imageUrl || '');
    } else if (type === 'fig') {
      const fig = entity as HistoricalFigure;
      setFigName(fig.name);
      setFigTitle(fig.title);
      setFigCivId(fig.civilizationId);
      setFigPeriod(fig.period);
      setFigStartYear(fig.startYear);
      setFigBio(fig.biography);
      setFigAchievements(fig.achievements.join('\n'));
      setFigImg(fig.imageUrl || '');
    } else if (type === 'quiz') {
      const q = entity as DBQuizQuestion;
      setQuizQuestionText(q.question);
      setQuizOpt0(q.options[0] || '');
      setQuizOpt1(q.options[1] || '');
      setQuizOpt2(q.options[2] || '');
      setQuizOpt3(q.options[3] || '');
      setQuizAnswerIndex(q.answerIndex);
      setQuizExplanation(q.explanation);
      setQuizCategory(q.category);
    }
  };

  const clearForms = () => {
    setCivName('');
    setCivRegion('');
    setCivPeriod('');
    setCivStartYear(0);
    setCivEndYear(0);
    setCivNarrative('');
    setCivEvidence('');
    setCivTier('Established');
    setCivAfrica(true);
    setCivImg('');
    setCivLatitude('');
    setCivLongitude('');

    setArtName('');
    setArtCivId('');
    setArtDate('');
    setArtStartYear(0);
    setArtMaterial('');
    setArtMuseum('');
    setArtLoc('');
    setArtScore(5);
    setArtContext('');
    setArtDiscovery('');
    setArtDating('');
    setArtDebate('');
    setArtImg('');

    setFigName('');
    setFigTitle('');
    setFigCivId('');
    setFigPeriod('');
    setFigStartYear(0);
    setFigBio('');
    setFigAchievements('');
    setFigImg('');

    setQuizQuestionText('');
    setQuizOpt0('');
    setQuizOpt1('');
    setQuizOpt2('');
    setQuizOpt3('');
    setQuizAnswerIndex(0);
    setQuizExplanation('');
    setQuizCategory('');
  };

  const handleDelete = (id: string, type: 'civ' | 'art' | 'fig' | 'quiz') => {
    if (!window.confirm('Confirm delete entity from archive records?')) return;
    if (type === 'civ') {
      db.deleteCivilization(id);
    } else if (type === 'art') {
      db.deleteArtifact(id);
    } else if (type === 'fig') {
      db.deleteFigure(id);
    } else if (type === 'quiz') {
      db.deleteQuizQuestion(id);
    }
    fetchData();
  };

  const handleSaveCiv = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingEntityId || `civ_${Date.now()}`;
    const newCiv: Civilization = {
      id,
      name: civName,
      region: civRegion,
      period: civPeriod,
      startYear: Number(civStartYear),
      endYear: Number(civEndYear),
      languages: ['Niger-Congo'],
      majorCities: [],
      leaders: [],
      artifacts: [],
      receivedNarrative: civNarrative,
      evidenceNote: civEvidence,
      evidenceTier: civTier,
      africaCentered: civAfrica,
      imageUrl: civImg || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&auto=format&fit=crop&q=80',
      latitude: civLatitude !== '' ? Number(civLatitude) : undefined,
      longitude: civLongitude !== '' ? Number(civLongitude) : undefined
    };
    db.saveCivilization(newCiv);
    setIsEditing(false);
    clearForms();
    fetchData();
  };

  const handleSaveArt = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingEntityId || `art_${Date.now()}`;
    const matchedCiv = civilizations.find(c => c.id === artCivId);
    const newArt: Artifact = {
      id,
      name: artName,
      civilizationId: artCivId,
      civilizationName: matchedCiv ? matchedCiv.name : 'Unknown Culture',
      date: artDate,
      startYear: Number(artStartYear),
      material: artMaterial.split(',').map(m => m.trim()).filter(Boolean),
      museum: artMuseum,
      currentLocation: artLoc,
      importanceScore: Number(artScore),
      imageUrl: artImg || 'https://images.unsplash.com/photo-1590189182193-1fd44f2b4048?w=600&auto=format&fit=crop&q=80',
      historicalContext: artContext,
      discoveryNotes: artDiscovery,
      datingMethod: artDating,
      scholarlyDebates: artDebate,
      evidenceTier: 'Established',
      sources: []
    };
    db.saveArtifact(newArt);
    setIsEditing(false);
    clearForms();
    fetchData();
  };

  const handleSaveFig = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingEntityId || `fig_${Date.now()}`;
    const matchedCiv = civilizations.find(c => c.id === figCivId);
    const newFig: HistoricalFigure = {
      id,
      name: figName,
      title: figTitle,
      civilizationId: figCivId,
      civilizationName: matchedCiv ? matchedCiv.name : 'Unknown Kingdom',
      period: figPeriod,
      startYear: Number(figStartYear),
      imageUrl: figImg || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&auto=format&fit=crop&q=80',
      biography: figBio,
      achievements: figAchievements.split('\n').map(a => a.trim()).filter(Boolean),
      sources: []
    };
    db.saveFigure(newFig);
    setIsEditing(false);
    clearForms();
    fetchData();
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingEntityId || `quiz_${Date.now()}`;
    const newQuiz: DBQuizQuestion = {
      id,
      question: quizQuestionText,
      options: [quizOpt0, quizOpt1, quizOpt2, quizOpt3].filter(Boolean),
      answerIndex: Number(quizAnswerIndex),
      explanation: quizExplanation,
      category: quizCategory || 'History'
    };
    db.saveQuizQuestion(newQuiz);
    setIsEditing(false);
    clearForms();
    fetchData();
  };

  const handleWikiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wikiQuery.trim()) return;
    setWikiSearchLoading(true);
    setWikiError(null);
    setWikiResults([]);
    try {
      const results = await searchWikipedia(wikiQuery);
      setWikiResults(results);
      if (results.length === 0) {
        setWikiError('No Wikipedia pages matched your query. Try a different search term.');
      }
    } catch (err) {
      setWikiError('Failed to search Wikipedia. Please check your network connection.');
    } finally {
      setWikiSearchLoading(false);
    }
  };

  const handleWikiSelect = async (title: string) => {
    setWikiDetailLoading(true);
    setWikiError(null);
    try {
      const details = await getWikipediaPageDetails(title);
      setIsEditing(true);
      setEditingEntityId(null);
      clearForms();
      
      if (wikiType === 'civ') {
        setCivName(details.title);
        setCivRegion('Global');
        setCivPeriod('Pre-colonial');
        setCivStartYear(1000);
        setCivEndYear(1500);
        setCivNarrative('Unverified representation. Rectification needed.');
        setCivEvidence(details.extract.substring(0, 500) + '...');
        setCivTier('Scholarly Consensus');
        setCivAfrica(true);
        setCivImg(details.imageUrl || '');
        if (details.coordinates) {
          setCivLatitude(details.coordinates.lat);
          setCivLongitude(details.coordinates.lon);
        }
      } else if (wikiType === 'art') {
        setArtName(details.title);
        const civList = db.getCivilizations();
        setArtCivId(civList[0]?.id || 'kemet');
        setArtDate('Pre-colonial');
        setArtStartYear(1000);
        setArtMaterial('Clay, Bronze, Stone');
        setArtMuseum('Referenced in Wikipedia');
        setArtLoc('In Situ / Global Museum');
        setArtScore(7);
        setArtContext(details.extract.substring(0, 500) + '...');
        setArtDiscovery('Documented on Wikipedia.');
        setArtDating('Typological Context');
        setArtDebate('Repatriation and ownership records are currently under scholarly review.');
        setArtImg(details.imageUrl || '');
      } else if (wikiType === 'fig') {
        setFigName(details.title);
        setFigTitle('Historical Leader / Scholarly Figure');
        const civList = db.getCivilizations();
        setFigCivId(civList[0]?.id || 'kemet');
        setFigPeriod('Pre-colonial');
        setFigStartYear(1000);
        setFigBio(details.extract.substring(0, 500) + '...');
        setFigAchievements('Documented biography achievements in cultural governance.');
        setFigImg(details.imageUrl || '');
      }
      
      setActiveTab(wikiType === 'civ' ? 'civs' : wikiType === 'art' ? 'arts' : 'figs');
    } catch (err) {
      setWikiError('Failed to fetch details for this page.');
    } finally {
      setWikiDetailLoading(false);
    }
  };

  if (role !== 'Curator' && role !== 'Admin') {
    return (
      <div className="p-8 rounded-xl bg-red-950/20 border border-red-500/20 text-center max-w-md mx-auto space-y-4">
        <AlertTriangle className="text-red-500 size-12 mx-auto animate-pulse" />
        <h3 className="text-base font-serif text-white font-bold">Access Denied</h3>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          Your current cognitive session does not carry Curation authority. To edit records, establish a Curator profile in the System Settings or Sign In page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gold-500/10 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl text-gold-500 font-serif font-bold tracking-wider flex items-center gap-2">
            <ShieldCheck size={20} className="text-gold-500 animate-pulse-glow" /> Curator Curation Workspace
          </h2>
          <p className="text-xs text-gray-500 font-light mt-0.5">Edit, rectify, and construct decolonial historical intelligence records.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-gradient-to-r from-gold-600 to-bronze-600 hover:from-gold-500 hover:to-bronze-500 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-gold-500/10"
          >
            <Plus size={14} /> Add Archive Record
          </button>
        )}
      </div>

      {!isEditing ? (
        <>
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['civs', 'arts', 'figs', 'quizzes', 'wiki'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-sans tracking-wide border transition-all ${
                  activeTab === tab
                    ? 'bg-gold-500/20 border-gold-500 text-gold-400 font-bold'
                    : 'bg-matte-900 border-gold-500/10 hover:border-gold-500/20 text-gray-400'
                }`}
              >
                {tab === 'civs' ? 'Civilization Dossiers' : tab === 'arts' ? 'Artifact Registry' : tab === 'figs' ? 'Historical Leaders' : tab === 'quizzes' ? 'Quiz Question Pool' : 'Wikipedia Discovery'}
              </button>
            ))}
          </div>

          {/* List display */}
          <div className="rounded-xl glass-panel border border-gold-500/10 p-5 space-y-3 bg-matte-950 overflow-hidden">
            {activeTab === 'civs' && (
              <div className="divide-y divide-gold-500/5">
                {civilizations.map(civ => (
                  <div key={civ.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-serif text-white font-semibold">{civ.name}</h4>
                      <span className="text-[10px] text-gray-500">{civ.period} • {civ.region}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEdit(civ, 'civ')} className="p-1.5 rounded bg-matte-900 border border-gold-500/10 text-gold-400 hover:text-white"><Edit2 size={12} /></button>
                      <button onClick={() => handleDelete(civ.id, 'civ')} className="p-1.5 rounded bg-matte-900 border border-red-500/10 text-red-500 hover:text-white"><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'arts' && (
              <div className="divide-y divide-gold-500/5">
                {artifacts.map(art => (
                  <div key={art.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-serif text-white font-semibold">{art.name}</h4>
                      <span className="text-[10px] text-gray-500">{art.civilizationName} • {art.date}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEdit(art, 'art')} className="p-1.5 rounded bg-matte-900 border border-gold-500/10 text-gold-400 hover:text-white"><Edit2 size={12} /></button>
                      <button onClick={() => handleDelete(art.id, 'art')} className="p-1.5 rounded bg-matte-900 border border-red-500/10 text-red-500 hover:text-white"><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'figs' && (
              <div className="divide-y divide-gold-500/5">
                {figures.map(fig => (
                  <div key={fig.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-serif text-white font-semibold">{fig.name}</h4>
                      <span className="text-[10px] text-gray-500">{fig.title}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEdit(fig, 'fig')} className="p-1.5 rounded bg-matte-900 border border-gold-500/10 text-gold-400 hover:text-white"><Edit2 size={12} /></button>
                      <button onClick={() => handleDelete(fig.id, 'fig')} className="p-1.5 rounded bg-matte-900 border border-red-500/10 text-red-500 hover:text-white"><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'quizzes' && (
              <div className="divide-y divide-gold-500/5">
                {quizzes.map(q => (
                  <div key={q.id} className="py-3 flex justify-between items-start text-xs gap-4">
                    <div className="space-y-1">
                      <h4 className="font-sans text-white font-semibold">{q.question}</h4>
                      <div className="flex flex-wrap gap-1 text-[10px] pt-1">
                        {q.options.map((o, i) => (
                          <span key={i} className={`px-2 py-0.5 rounded ${i === q.answerIndex ? 'bg-green-950/40 text-green-400 border border-green-500/20' : 'bg-matte-900 text-gray-400'}`}>
                            {o}
                          </span>
                        ))}
                      </div>
                      <span className="block text-[9px] text-gray-500 uppercase tracking-wider font-mono pt-1">Category: {q.category}</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleOpenEdit(q, 'quiz')} className="p-1.5 rounded bg-matte-900 border border-gold-500/10 text-gold-400 hover:text-white"><Edit2 size={12} /></button>
                      <button onClick={() => handleDelete(q.id, 'quiz')} className="p-1.5 rounded bg-matte-900 border border-red-500/10 text-red-500 hover:text-white"><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'wiki' && (
              <div className="space-y-4">
                <form onSubmit={handleWikiSearch} className="flex gap-2">
                  <select
                    value={wikiType}
                    onChange={(e) => setWikiType(e.target.value as any)}
                    className="px-3 py-2 rounded-lg bg-matte-900 border border-gold-500/20 text-gray-200 focus:outline-none text-xs"
                  >
                    <option value="civ">Civilization</option>
                    <option value="art">Artifact</option>
                    <option value="fig">Historical Figure</option>
                  </select>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={`Search Wikipedia for ${wikiType === 'civ' ? 'civilizations...' : wikiType === 'art' ? 'artifacts...' : 'figures...'}`}
                      value={wikiQuery}
                      onChange={(e) => setWikiQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg glass-input text-gray-200 text-xs"
                    />
                    <Search className="absolute left-3 top-2.5 size-3.5 text-gray-500" />
                  </div>
                  <button
                    type="submit"
                    disabled={wikiSearchLoading}
                    className="px-5 py-2 bg-gold-600 hover:bg-gold-500 text-black font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all"
                  >
                    {wikiSearchLoading ? <Loader2 className="animate-spin size-3.5" /> : <Search size={14} />}
                    Search
                  </button>
                </form>

                {wikiError && (
                  <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-xs rounded-lg">
                    {wikiError}
                  </div>
                )}

                {wikiDetailLoading && (
                  <div className="py-12 text-center text-gray-400 text-xs flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin size-4 text-gold-500" />
                    Fetching page details, images, and coordinates...
                  </div>
                )}

                {!wikiDetailLoading && wikiResults.length > 0 && (
                  <div className="divide-y divide-gold-500/5">
                    {wikiResults.map(result => (
                      <div key={result.pageid} className="py-3 flex justify-between items-center gap-4 text-xs">
                        <div className="flex-1">
                          <h4 className="font-serif text-white font-semibold flex items-center gap-1.5">
                            {wikiType === 'civ' ? <Globe size={12} className="text-gold-500" /> : wikiType === 'art' ? <Scroll size={12} className="text-bronze-400" /> : <Crown size={12} className="text-yellow-500" />}
                            {result.title}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-1 font-light leading-relaxed">
                            {result.snippet}...
                          </p>
                        </div>
                        <button
                          onClick={() => handleWikiSelect(result.title)}
                          className="px-3 py-1.5 rounded bg-matte-900 border border-gold-500/25 hover:bg-gold-500/10 text-gold-400 font-semibold"
                        >
                          Select & Import
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Edit/Create Form View */
        <div className="rounded-xl glass-panel border border-gold-500/15 p-6 bg-matte-950">
          <div className="flex justify-between items-center border-b border-gold-500/10 pb-3 mb-6">
            <h3 className="text-sm font-serif text-white font-bold uppercase tracking-wider">
              {editingEntityId ? 'Edit Archive Entry' : 'Create New Archive Entry'}
            </h3>
            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
          </div>

          {activeTab === 'civs' && (
            <form onSubmit={handleSaveCiv} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400">Civilization Name</label>
                  <input type="text" value={civName} onChange={(e) => setCivName(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Region Location</label>
                  <input type="text" value={civRegion} onChange={(e) => setCivRegion(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Period String (e.g. 1200 BCE - 1500 CE)</label>
                  <input type="text" value={civPeriod} onChange={(e) => setCivPeriod(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Evidence Verification Level</label>
                  <select value={civTier} onChange={(e) => setCivTier(e.target.value as EvidenceTier)} className="w-full px-3 py-2 rounded-lg bg-matte-900 border border-gold-500/20 text-gray-200 focus:outline-none">
                    <option value="Established">Established</option>
                    <option value="Scholarly Consensus">Scholarly Consensus</option>
                    <option value="Contested">Contested</option>
                    <option value="Speculative">Speculative</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Timeline Start Year (BCE negative)</label>
                  <input type="number" value={civStartYear} onChange={(e) => setCivStartYear(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Timeline End Year</label>
                  <input type="number" value={civEndYear} onChange={(e) => setCivEndYear(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 flex items-center gap-1.5 text-amber-500 font-semibold"><AlertTriangle size={12} /> Received eurocentric/biased Narrative (to Rectify)</label>
                <textarea value={civNarrative} onChange={(e) => setCivNarrative(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200 resize-none" required />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-semibold text-gold-400 flex items-center gap-1.5"><ShieldCheck size={12} /> Archaeological & Documented Corrective Evidence</label>
                <textarea value={civEvidence} onChange={(e) => setCivEvidence(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200 resize-none" required />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Illustration Image URL</label>
                <input type="text" value={civImg} onChange={(e) => setCivImg(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400">Latitude (optional)</label>
                  <input type="number" step="any" value={civLatitude} onChange={(e) => setCivLatitude(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" placeholder="e.g. 13.4" />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Longitude (optional)</label>
                  <input type="number" step="any" value={civLongitude} onChange={(e) => setCivLongitude(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" placeholder="e.g. -72.5" />
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded bg-matte-900 border border-gold-500/10 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded bg-gold-600 hover:bg-gold-500 text-black font-bold">Commit Archive Record</button>
              </div>
            </form>
          )}

          {activeTab === 'arts' && (
            <form onSubmit={handleSaveArt} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400">Artifact Name</label>
                  <input type="text" value={artName} onChange={(e) => setArtName(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Associated Civilization</label>
                  <select value={artCivId} onChange={(e) => setArtCivId(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-matte-900 border border-gold-500/20 text-gray-200 focus:outline-none" required>
                    <option value="">-- Select Dossier --</option>
                    {civilizations.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Estimated Dating Period</label>
                  <input type="text" value={artDate} onChange={(e) => setArtDate(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Material Composition (comma separated)</label>
                  <input type="text" value={artMaterial} onChange={(e) => setArtMaterial(e.target.value)} placeholder="Gold, Wood, Bronze" className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Scientific Dating Method</label>
                  <input type="text" value={artDating} onChange={(e) => setArtDating(e.target.value)} placeholder="Carbon-14, Stratigraphy" className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Holding Museum</label>
                  <input type="text" value={artMuseum} onChange={(e) => setArtMuseum(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Historical Context Description</label>
                <textarea value={artContext} onChange={(e) => setArtContext(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200 resize-none" required />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Discovery History & Notes</label>
                <textarea value={artDiscovery} onChange={(e) => setArtDiscovery(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200 resize-none" required />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 text-bronze-400 font-semibold"><AlertTriangle size={12} className="inline mr-1" /> Repatriation Controversy / Colonial Disputes</label>
                <textarea value={artDebate} onChange={(e) => setArtDebate(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200 resize-none" />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Image URL</label>
                <input type="text" value={artImg} onChange={(e) => setArtImg(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" />
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded bg-matte-900 border border-gold-500/10 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded bg-gold-600 hover:bg-gold-500 text-black font-bold">Commit Registry Record</button>
              </div>
            </form>
          )}

          {activeTab === 'figs' && (
            <form onSubmit={handleSaveFig} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400">Leader Name</label>
                  <input type="text" value={figName} onChange={(e) => setFigName(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Regnal Title</label>
                  <input type="text" value={figTitle} onChange={(e) => setFigTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Associated Civilization</label>
                  <select value={figCivId} onChange={(e) => setFigCivId(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-matte-900 border border-gold-500/20 text-gray-200 focus:outline-none" required>
                    <option value="">-- Select Dossier --</option>
                    {civilizations.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Regnal Period Range</label>
                  <input type="text" value={figPeriod} onChange={(e) => setFigPeriod(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Biographical Log</label>
                <textarea value={figBio} onChange={(e) => setFigBio(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200 resize-none" required />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Key Accomplishments (one per line)</label>
                <textarea value={figAchievements} onChange={(e) => setFigAchievements(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200 resize-none" placeholder="Expanded boundaries to include Gao.&#10;Funded universities." required />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Portrait Image URL</label>
                <input type="text" value={figImg} onChange={(e) => setFigImg(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" />
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded bg-matte-900 border border-gold-500/10 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded bg-gold-600 hover:bg-gold-500 text-black font-bold">Commit Leader Record</button>
              </div>
            </form>
          )}

          {activeTab === 'quizzes' && (
            <form onSubmit={handleSaveQuiz} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-400">Question Text</label>
                <textarea value={quizQuestionText} onChange={(e) => setQuizQuestionText(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200 resize-none" placeholder="Under which empire was..." required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400">Option A</label>
                  <input type="text" value={quizOpt0} onChange={(e) => setQuizOpt0(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Option B</label>
                  <input type="text" value={quizOpt1} onChange={(e) => setQuizOpt1(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Option C</label>
                  <input type="text" value={quizOpt2} onChange={(e) => setQuizOpt2(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Option D</label>
                  <input type="text" value={quizOpt3} onChange={(e) => setQuizOpt3(e.target.value)} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400">Correct Option Index</label>
                  <select value={quizAnswerIndex} onChange={(e) => setQuizAnswerIndex(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-matte-900 border border-gold-500/20 text-gray-200 focus:outline-none">
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Subject Category</label>
                  <input type="text" value={quizCategory} onChange={(e) => setQuizCategory(e.target.value)} placeholder="History, Mathematics, Technology" className="w-full px-3 py-2 rounded-lg glass-input text-gray-200" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-semibold text-gold-400 flex items-center gap-1.5"><ShieldCheck size={12} /> Decolonial Archival Explanation</label>
                <textarea value={quizExplanation} onChange={(e) => setQuizExplanation(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg glass-input text-gray-200 resize-none" placeholder="Provide corrective context based on verified scientific discoveries..." required />
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded bg-matte-900 border border-gold-500/10 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded bg-gold-600 hover:bg-gold-500 text-black font-bold">Commit Quiz Question</button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
export default CuratorPanel;
