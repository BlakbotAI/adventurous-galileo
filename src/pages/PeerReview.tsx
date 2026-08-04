import React, { useState } from 'react';
import { CheckSquare, ShieldAlert, ThumbsUp, Clock } from 'lucide-react';

interface Submission {
  id: string;
  title: string;
  submitter: string;
  dating: string;
  currentTier: 'Speculative' | 'Contested' | 'Scholarly Consensus' | 'Established';
  description: string;
  evidenceNotes: string;
  votes: number;
  votedBy: string[];
}

export const PeerReview: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 'sub_1',
      title: 'Ancient Nok Terracotta Smelting Kiln at Taruga',
      submitter: 'Dr. Tariq Al-Mansoor (Ibadan University)',
      dating: 'c. 950 BCE +/- 50 (C-14 logged)',
      currentTier: 'Contested',
      description: 'Excavation of a refractory clay blast furnace showing charcoal deposits and vitrified tuyere slags, proving early iron refining.',
      evidenceNotes: 'Radiocarbon carbon logging traces to early Iron Age. Critics claim charcoal could be intrusive from later agricultural burns.',
      votes: 1,
      votedBy: ['user_2']
    },
    {
      id: 'sub_2',
      title: 'Pre-Columbian West African Hull Timbers',
      submitter: 'Prof. Yusef Diop (Dakar Archival Centre)',
      dating: 'c. 1315 CE +/- 30 (Luminescence)',
      currentTier: 'Speculative',
      description: 'Excavated wooden planks from Cape Verde displaying structural similarities to Mande shipbuilding techniques recorded by Al-Umari.',
      evidenceNotes: 'Luminescence dating places timbers in the early 14th century, matching Mansa Abu Bakr II voyages timeline. Requires further structural tests.',
      votes: 0,
      votedBy: []
    },
    {
      id: 'sub_3',
      title: 'Aksumite Gold Coin Corpus in Southern India',
      submitter: 'Dr. Ananya Nair (Madras Archaeological Society)',
      dating: 'c. 350 CE (Epigraphic Cross-Match)',
      currentTier: 'Scholarly Consensus',
      description: 'Gold trade coinage bearing King Ezana\'s profile discovered in Roman-era trade ports near Arikamedu, India.',
      evidenceNotes: 'Confirms Red Sea - Indian Ocean maritime trade routes. Cross-referenced with Roman coins and local Tamil Sangam epigraphs.',
      votes: 2,
      votedBy: ['user_3', 'user_4']
    }
  ]);

  const [activeSubId, setActiveSubId] = useState<string>('sub_1');
  const [moderationLogs, setModerationLogs] = useState<string[]>([
    '[02:14 UTC] System: Initialized Peer-Review Moderation Board.',
    '[02:40 UTC] Scholar BlakbotAI voted to verify "Aksumite Gold Coin Corpus in Southern India".'
  ]);

  const activeSub = submissions.find(s => s.id === activeSubId) || submissions[0];

  const handleVote = (id: string) => {
    setSubmissions(prev => 
      prev.map(s => {
        if (s.id !== id) return s;
        if (s.votedBy.includes('current_user')) return s; // prevent double vote

        const updatedVotes = s.votes + 1;
        const updatedVotedBy = [...s.votedBy, 'current_user'];
        let updatedTier = s.currentTier;

        // If votes reach 3, graduate tier!
        if (updatedVotes >= 3) {
          if (s.currentTier === 'Speculative') updatedTier = 'Contested';
          else if (s.currentTier === 'Contested') updatedTier = 'Scholarly Consensus';
          else if (s.currentTier === 'Scholarly Consensus') updatedTier = 'Established';

          setModerationLogs(log => [
            `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] Submissions: "${s.title}" has been promoted to [${updatedTier}] tier status.`,
            ...log
          ]);
        } else {
          setModerationLogs(log => [
            `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] User: Voted to verify "${s.title}". (Total: ${updatedVotes}/3)`,
            ...log
          ]);
        }

        return {
          ...s,
          votes: updatedVotes,
          votedBy: updatedVotedBy,
          currentTier: updatedTier
        };
      })
    );
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-gold-500/10 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl text-gold-500 font-serif font-bold tracking-wider flex items-center gap-2">
            <CheckSquare className="text-gold-500" size={22} /> Peer-Review Board
          </h2>
          <p className="text-xs text-gray-500 font-light mt-0.5">Moderate new historical evidence, vote on authenticity logs, and audit revisions.</p>
        </div>
      </div>

      {/* Main Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Submissions queue (Col Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          
          <h4 className="text-xs font-serif text-gold-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={12} /> Pending Evidence Submissions
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submissions.map(s => {
              const hasVoted = s.votedBy.includes('current_user');
              return (
                <div
                  key={s.id}
                  onClick={() => setActiveSubId(s.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    activeSub.id === s.id
                      ? 'bg-matte-950/80 border-gold-500/30 shadow-lg'
                      : 'bg-matte-900/60 border-gold-500/5 hover:border-gold-500/20'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono border font-bold uppercase ${
                        s.currentTier === 'Speculative'
                          ? 'bg-purple-950/20 border-purple-500/30 text-purple-400'
                          : s.currentTier === 'Contested'
                          ? 'bg-red-950/20 border-red-500/30 text-red-400'
                          : 'bg-amber-950/20 border-amber-500/30 text-amber-400'
                      }`}>
                        {s.currentTier}
                      </span>
                      <span className="text-[9px] font-mono text-gray-500">{s.votes}/3 Votes</span>
                    </div>

                    <h3 className="text-xs font-bold text-white leading-normal">{s.title}</h3>
                    <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed font-light">{s.description}</p>
                  </div>

                  <div className="flex justify-between items-center border-t border-gold-500/5 pt-3 mt-3">
                    <span className="text-[8px] text-gray-500 truncate max-w-[120px]">{s.submitter}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(s.id);
                      }}
                      disabled={hasVoted}
                      className={`px-2.5 py-1 rounded text-[9px] font-mono flex items-center gap-1 transition-all ${
                        hasVoted
                          ? 'bg-matte-950 text-gray-600 border border-transparent cursor-not-allowed'
                          : 'bg-gold-600 hover:bg-gold-500 text-black font-bold'
                      }`}
                    >
                      <ThumbsUp size={10} /> {hasVoted ? 'Voted' : 'Verify'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Audit Details Panel */}
        <div className="space-y-6">
          
          {/* Active dossier details */}
          <div className="p-5 rounded-2xl glass-panel border border-gold-500/10 space-y-4">
            <div className="border-b border-gold-500/10 pb-3">
              <span className="text-[9px] uppercase tracking-widest text-bronze-400 font-mono font-bold block mb-0.5">Verification details</span>
              <h3 className="text-sm font-serif font-bold text-white leading-normal">{activeSub.title}</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded bg-matte-900 border border-gold-500/5">
                <span className="text-[9px] text-gray-500 block mb-0.5">ESTIMATED DATING</span>
                <span className="text-gray-200 font-mono">{activeSub.dating}</span>
              </div>

              <div className="p-3 rounded bg-matte-900 border border-gold-500/5">
                <span className="text-[9px] text-gold-500 font-bold uppercase tracking-wider block mb-0.5">Archaeological Summary</span>
                <p className="text-gray-300 font-light leading-normal">{activeSub.description}</p>
              </div>

              <div className="p-3 rounded bg-matte-900 border border-gold-500/5">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Scholarly Evidence & Notes</span>
                <p className="text-gray-300 font-light leading-normal">{activeSub.evidenceNotes}</p>
              </div>
            </div>
          </div>

          {/* Peer Moderation logs */}
          <div className="p-4 rounded-xl glass-panel border border-gold-500/10 space-y-3">
            <h4 className="text-xs font-serif text-gold-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert size={12} className="text-gold-500" /> Audit Board Activity Logs
            </h4>
            
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {moderationLogs.map((log, idx) => (
                <div key={idx} className="p-2 rounded bg-matte-900 border border-gold-500/5 text-[9px] font-mono text-gray-400 leading-normal">
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default PeerReview;
