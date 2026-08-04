import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Download, Printer, Quote, Trash2 } from 'lucide-react';

interface HistoricalArchive {
  id: string;
  title: string;
  author: string;
  era: string;
  origin: string;
  excerpt: string;
  citation: string;
}

const ARCHIVES: HistoricalArchive[] = [
  {
    id: 'kouroukan',
    title: 'The Kouroukan Fouga (Mali Charter)',
    author: 'Gbara Assembly / Mansa Sundiata Keita',
    era: 'c. 1235 CE',
    origin: 'Mali Empire / West Africa',
    excerpt: 'Article 5: Food and property are sacred. No one shall take what belongs to another without their consent.\n\nArticle 14: Never offend women, who are our mothers. Educate the youth with rigor.\n\nArticle 20: Every individual has a right to respect, freedom, and protection of their person under the assembly. Conspiring against the empire is treason.',
    citation: 'Gbara Council of Mali (1235). Kouroukan Fouga (The Manden Charter). Kurukan Fuga Assembly.'
  },
  {
    id: 'timbuktu',
    title: 'Timbuktu Manuscript on Astronomy',
    author: 'Scholars of Sankoré University',
    era: 'c. 1500 CE',
    origin: 'Timbuktu / Songhai Empire',
    excerpt: 'Concerning the movement of the planets and the stars: The orbit of Venus is closer to the sun than that of Mars. In observing the lunar cycles, we calculate the calendar to guide transit times for Sahara trade caravans. The cycles of eclipse correspond to the intersecting shadows of planetary alignment.',
    citation: 'Sankore University Library (c. 1500). Manuscript on Astronomical Science. Timbuktu Archives.'
  },
  {
    id: 'al_bakri',
    title: 'Description of the Kingdom of Ghana',
    author: 'Abu Ubayd Al-Bakri',
    era: 'c. 1067 CE',
    origin: 'Cordoba / West African Travels',
    excerpt: 'The king of Ghana sits in audience in a domed pavilion, surrounded by ten horses covered with gold-embroidered trappings. Behind the king stand ten pages holding shields and swords decorated with gold. When the people approach him, they fall on their knees and sprinkle dust upon their heads.',
    citation: "Al-Bakri, A. U. (1067). Kitab al-Masalik wa'l-Mamalik (Book of Highways and Kingdoms)."
  },
  {
    id: 'tarikh',
    title: 'Tarikh al-Sudan Excerpt',
    author: 'Abd al-Rahman al-Sadi',
    era: 'c. 1655 CE',
    origin: 'Timbuktu Chronicle',
    excerpt: 'Timbuktu was an assembly of virtuous scholars, where libraries flourished and intellect was prized above gold. Scholars from Fez, Cairo, and Damascus came to sit at the feet of the masters of Sankore. Books were imported in larger quantities than salt or silk.',
    citation: 'Al-Sadi, A. (1655). Tarikh al-Sudan (History of the Sudan). Timbuktu Chronicles.'
  }
];

export const ResearchWorkspace: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<HistoricalArchive>(ARCHIVES[0]);
  const [editorText, setEditorText] = useState<string>(() => {
    return localStorage.getItem('hios_workspace_notes') || '';
  });

  // Auto-save notebook text to local storage
  useEffect(() => {
    localStorage.setItem('hios_workspace_notes', editorText);
  }, [editorText]);

  // Insert the active document's citation into the editor at cursor or end
  const insertCitation = () => {
    setEditorText(prev => {
      const citeBlock = `\n\n> **Citation:** ${activeDoc.citation}\n`;
      return prev + citeBlock;
    });
  };

  // Download notepad contents as a markdown file
  const downloadNotes = () => {
    const blob = new Blob([editorText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hios_study_report_${activeDoc.id}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print notebook notes
  const printNotes = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>HIOS Scholarly Research Report</title>
          <style>
            body { font-family: Georgia, serif; line-height: 1.6; padding: 40px; color: #111; }
            h1 { border-bottom: 2px solid #d4af37; padding-bottom: 10px; font-size: 24px; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; }
            footer { margin-top: 40px; font-size: 10px; color: #666; border-t: 1px solid #ddd; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>HIOS Scholarly Research Dossier</h1>
          <pre>${editorText || 'No research logs recorded.'}</pre>
          <footer>Generated via Historical Intelligence Operating System (HIOS)</footer>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-gold-500/10 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl text-gold-500 font-serif font-bold tracking-wider flex items-center gap-2">
            <BookOpen className="text-gold-500" size={22} /> Research Workspace
          </h2>
          <p className="text-xs text-gray-500 font-light mt-0.5">Explore primary text logs alongside an auto-saving scholarly notebook editor.</p>
        </div>

        {/* Action Belt */}
        <div className="flex gap-2">
          <button
            onClick={insertCitation}
            className="px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wide border bg-matte-900 border-gold-500/15 hover:border-gold-500/35 text-gold-400 flex items-center gap-1.5 transition-all"
            title="Insert citation into editor"
          >
            <Quote size={12} /> Insert Citation
          </button>
          
          <button
            onClick={downloadNotes}
            className="px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wide border bg-matte-900 border-gold-500/15 hover:border-gold-500/35 text-gray-300 flex items-center gap-1.5 transition-all"
            title="Download Notes (.md)"
          >
            <Download size={12} /> Export Log
          </button>

          <button
            onClick={printNotes}
            className="px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wide border bg-matte-900 border-gold-500/15 hover:border-gold-500/35 text-gray-300 flex items-center gap-1.5 transition-all"
            title="Print Dossier report"
          >
            <Printer size={12} /> Print Dossier
          </button>
        </div>
      </div>

      {/* Split Screen Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-220px)] min-h-[480px]">
        
        {/* Left Panel: Historical Archives catalog */}
        <div className="flex flex-col rounded-2xl border border-gold-500/10 bg-matte-950/40 overflow-hidden">
          
          {/* Tabs header */}
          <div className="p-3 border-b border-gold-500/10 bg-matte-950/60 flex gap-2 overflow-x-auto">
            {ARCHIVES.map(doc => (
              <button
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono whitespace-nowrap border transition-all ${
                  activeDoc.id === doc.id
                    ? 'bg-gradient-to-r from-gold-600 to-bronze-600 text-black border-gold-500 font-bold'
                    : 'bg-matte-900 border-gold-500/5 text-gray-400 hover:text-gray-200'
                }`}
              >
                {doc.title.split(' ')[0]} Excerpt
              </button>
            ))}
          </div>

          {/* Doc View Content */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            
            {/* Header info */}
            <div>
              <span className="text-[9px] font-mono tracking-widest text-gold-500 uppercase font-bold">{activeDoc.era} | {activeDoc.origin}</span>
              <h3 className="text-lg font-serif text-white font-bold">{activeDoc.title}</h3>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">Author/Source: {activeDoc.author}</p>
            </div>

            {/* Main scrollable text block */}
            <div className="p-5 rounded-xl border border-gold-500/5 bg-matte-950/70 text-xs leading-relaxed text-gray-300 font-serif whitespace-pre-wrap shadow-inner min-h-[180px]">
              {activeDoc.excerpt}
            </div>

            {/* Citation footer */}
            <div className="p-3 rounded-lg border border-bronze-500/10 bg-bronze-950/10 text-[10px] space-y-1.5">
              <span className="text-[9px] font-mono text-bronze-400 font-bold uppercase tracking-wider block">Recommended Reference Citation:</span>
              <p className="text-gray-400 italic font-mono leading-relaxed">{activeDoc.citation}</p>
            </div>

          </div>
        </div>

        {/* Right Panel: Notes Workspace Editor */}
        <div className="flex flex-col rounded-2xl border border-gold-500/10 bg-matte-950/40 overflow-hidden">
          
          {/* Notebook Header tools */}
          <div className="p-3 border-b border-gold-500/10 bg-matte-950/60 flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
              <FileText size={12} className="text-gold-500" /> STUDY NOTEBOOK (AUTO-SAVING)
            </span>
            <button
              onClick={() => {
                if (window.confirm('Clear all logs in the notepad?')) setEditorText('');
              }}
              className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-red-950/20 transition-all"
              title="Reset notebook"
            >
              <Trash2 size={12} />
            </button>
          </div>

          {/* Notebook Textarea Input */}
          <textarea
            value={editorText}
            onChange={(e) => setEditorText(e.target.value)}
            placeholder="Type your study notes, essay draft, or copy document citations here..."
            className="flex-1 p-6 text-xs font-mono leading-relaxed bg-matte-950/30 text-gray-200 border-none outline-none resize-none focus:ring-0 focus:outline-none placeholder-gray-600"
          />

        </div>

      </div>

    </div>
  );
};
export default ResearchWorkspace;
