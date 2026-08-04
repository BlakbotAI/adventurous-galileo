import React, { useState, useEffect } from 'react';
import { Star, FolderPlus, Trash2, Edit2, Check, Library, X, FileText } from 'lucide-react';
import { db } from '../services/db';
import type { DBCollection, DBCollectionItem } from '../services/db';

interface CollectionItem {
  id: string; // bookmark ID
  itemId: string; // target artifact/civ ID
  name: string;
  type: 'Artifact' | 'Civilization';
  imageUrl?: string;
  dateOrPeriod: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  items: CollectionItem[];
}

export const SavedCollections: React.FC = () => {
  const [dbColls, setDbColls] = useState<DBCollection[]>([]);
  const [dbItems, setDbItems] = useState<DBCollectionItem[]>([]);

  const [newCollName, setNewCollName] = useState('');
  const [newCollDesc, setNewCollDesc] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescVal, setEditDescVal] = useState('');
  const [selectedWorksheetColl, setSelectedWorksheetColl] = useState<Collection | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setDbColls(db.getCollections());
    setDbItems(db.getCollectionItems());
  };

  const handleAddCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollName.trim()) return;
    
    db.saveCollection({
      id: `coll_${Date.now()}`,
      userId: 'guest_user_id',
      name: newCollName,
      description: newCollDesc
    });

    setNewCollName('');
    setNewCollDesc('');
    setShowAddForm(false);
    refreshData();
  };

  const handleDeleteCollection = (id: string) => {
    if (!window.confirm('Delete this collection folder and all its contents?')) return;
    db.deleteCollection(id);
    refreshData();
  };

  const handleStartEditing = (coll: DBCollection) => {
    setEditingId(coll.id);
    setEditDescVal(coll.description);
  };

  const handleSaveDescription = (id: string) => {
    const coll = dbColls.find(c => c.id === id);
    if (coll) {
      db.saveCollection({ ...coll, description: editDescVal });
    }
    setEditingId(null);
    refreshData();
  };

  const handleDeleteItem = (itemId: string) => {
    db.deleteCollectionItem(itemId);
    refreshData();
  };

  // Compile final views
  const artifacts = db.getArtifacts();
  const civilizations = db.getCivilizations();

  const collections: Collection[] = dbColls.map(c => {
    const matchingItems = dbItems.filter(i => i.collectionId === c.id);
    const mappedItems: CollectionItem[] = matchingItems.map(item => {
      if (item.itemType === 'Artifact') {
        const art = artifacts.find(a => a.id === item.itemId);
        return {
          id: item.id,
          itemId: item.itemId,
          name: art ? art.name : 'Unknown Artifact',
          type: 'Artifact',
          imageUrl: art?.imageUrl,
          dateOrPeriod: art ? art.date : 'N/A'
        };
      } else {
        const civ = civilizations.find(cv => cv.id === item.itemId);
        return {
          id: item.id,
          itemId: item.itemId,
          name: civ ? civ.name : 'Unknown Civilization',
          type: 'Civilization',
          imageUrl: civ?.imageUrl,
          dateOrPeriod: civ ? civ.period : 'N/A'
        };
      }
    });

    return {
      id: c.id,
      name: c.name,
      description: c.description,
      items: mappedItems
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gold-500/10 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl text-gold-500 font-serif font-bold tracking-wider">Saved Collections</h2>
          <p className="text-xs text-gray-500 font-light mt-0.5">Your personal curations, notes, and bookmarked objects.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gradient-to-r from-gold-600 to-bronze-600 hover:from-gold-500 hover:to-bronze-500 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-gold-500/10"
        >
          <FolderPlus size={14} /> New Collection
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddCollection} className="p-5 rounded-xl glass-panel border border-gold-500/20 max-w-xl space-y-4 animate-fade-in">
          <h3 className="text-xs font-serif text-white font-bold uppercase tracking-wider">Create Curation Folder</h3>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-gray-400">Folder Name</label>
              <input
                type="text"
                placeholder="e.g. Saharan Architecture"
                value={newCollName}
                onChange={(e) => setNewCollName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg glass-input text-gray-200"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-gray-400">Description / Curation Intent</label>
              <textarea
                placeholder="Describe the research goals of this folder..."
                value={newCollDesc}
                onChange={(e) => setNewCollDesc(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg glass-input text-gray-200 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg bg-matte-900 border border-gold-500/10 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gold-600 hover:bg-gold-500 text-black font-bold"
            >
              Create Folder
            </button>
          </div>
        </form>
      )}

      {/* Collections list */}
      <div className="space-y-8">
        {collections.map(coll => (
          <div key={coll.id} className="p-6 rounded-xl glass-panel border border-gold-500/10 space-y-4">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-gold-500/5 pb-3">
              <div className="space-y-1.5 flex-1 mr-4">
                <h3 className="text-base md:text-lg font-serif text-gold-500 font-bold tracking-wide flex items-center gap-2">
                  <Star size={16} className="text-gold-500 fill-gold-500" /> {coll.name}
                </h3>
                {editingId === coll.id ? (
                  <div className="flex gap-2 w-full max-w-2xl">
                    <input
                      type="text"
                      value={editDescVal}
                      onChange={(e) => setEditDescVal(e.target.value)}
                      className="flex-1 px-3 py-1 rounded glass-input text-xs"
                    />
                    <button
                      onClick={() => handleSaveDescription(coll.id)}
                      className="p-1.5 rounded bg-gold-600 text-black hover:bg-gold-500"
                    >
                      <Check size={12} />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 font-light leading-relaxed flex items-center gap-2">
                    {coll.description}
                    <button
                      onClick={() => handleStartEditing({ id: coll.id, userId: 'guest_user_id', name: coll.name, description: coll.description })}
                      className="text-gray-500 hover:text-gold-500"
                    >
                      <Edit2 size={12} />
                    </button>
                  </p>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setSelectedWorksheetColl(coll)}
                  className="px-3 py-1.5 bg-matte-900 border border-gold-500/20 hover:border-gold-500 text-gold-400 hover:text-white text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all"
                  title="Generate Study Sheet"
                >
                  <FileText size={12} /> Exporter Study Sheet
                </button>
                <button
                  onClick={() => handleDeleteCollection(coll.id)}
                  className="p-2 rounded hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors"
                  title="Delete Collection"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Collection items */}
            {coll.items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {coll.items.map(item => (
                  <div
                    key={item.id}
                    className="group rounded-lg overflow-hidden bg-matte-900 border border-gold-500/5 hover:border-gold-500/15 transition-all text-xs relative"
                  >
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded bg-black/60 hover:bg-red-950/80 border border-red-500/10 text-gray-400 hover:text-red-400 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove from Collection"
                    >
                      <X size={10} />
                    </button>
                    <div className="h-28 overflow-hidden relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="flex justify-between items-center text-[8px] font-mono text-bronze-400">
                        <span>{item.type}</span>
                        <span>{item.dateOrPeriod}</span>
                      </div>
                      <h4 className="font-serif text-white font-semibold group-hover:text-gold-400 truncate transition-colors">
                        {item.name}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 rounded bg-matte-900/30 border border-dashed border-gold-500/10 text-center text-xs text-gray-500">
                <Library size={20} className="mb-1 text-gold-500/40" />
                <span>No saved artifacts. Add objects from the Artifact Curation gallery.</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Printable Styles Override */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:bg-white {
            background-color: #fff !important;
          }
          .print\\:text-black {
            color: #000 !important;
          }
          /* Only show the print modal contents */
          .fixed, .fixed * {
            visibility: visible;
          }
          .fixed {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background: white !important;
            border: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Hide non-print elements in the modal */
          .print\\:hidden, .print\\:hidden * {
            display: none !important;
          }
        }
      `}</style>

      {selectedWorksheetColl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:relative print:z-auto">
          <div className="bg-matte-950 border border-gold-500/20 rounded-2xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto flex flex-col justify-between print:border-0 print:bg-white print:p-0 print:max-h-none print:w-full print:rounded-none">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gold-500/10 pb-4 mb-4 print:hidden">
              <h3 className="text-xs font-serif text-gold-500 uppercase tracking-widest font-bold">Study Sheet & Worksheet Exporter</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()} 
                  className="px-4 py-1.5 bg-gold-600 hover:bg-gold-500 text-black text-[11px] font-bold rounded flex items-center gap-1"
                >
                  <FileText size={12} /> Print Study Sheet
                </button>
                <button 
                  onClick={() => setSelectedWorksheetColl(null)}
                  className="p-1 text-gray-500 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Printable Content Block */}
            <div className="space-y-6 text-gray-300 print:text-black print:bg-white">
              
              {/* Document Header */}
              <div className="text-center border-b border-double border-gold-500/30 pb-4">
                <h1 className="text-2xl font-serif text-white print:text-black font-extrabold tracking-wide uppercase">Historical Curation Study Sheet</h1>
                <p className="text-xs text-gold-500 font-serif tracking-widest mt-1">CURATED COLLECTION SUMMARY & DISCOVERY LOG</p>
                <div className="flex justify-center gap-4 text-[10px] text-gray-500 mt-2">
                  <span>CURATION FOLDER: <strong>{selectedWorksheetColl.name}</strong></span>
                  <span>DATE GENERATED: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Research Intent Description */}
              <div className="p-4 bg-matte-900/50 print:bg-gray-100 border border-gold-500/10 rounded-lg text-xs leading-relaxed">
                <h4 className="font-serif text-white print:text-black font-semibold uppercase tracking-wider mb-1">Curation Objective</h4>
                <p className="font-light text-gray-400 print:text-gray-700">{selectedWorksheetColl.description || 'No objective outlined. Study folder contains bookmarked archaeological and documented assets.'}</p>
              </div>

              {/* Curated Artifact Entries */}
              <div className="space-y-4">
                <h3 className="text-xs font-serif text-gold-500 uppercase tracking-widest border-b border-gold-500/10 pb-1.5 font-bold">Curated Dossier Entries ({selectedWorksheetColl.items.length})</h3>
                {selectedWorksheetColl.items.map((item, idx) => {
                  const fullArt = item.type === 'Artifact' ? artifacts.find(a => a.id === item.itemId) : null;
                  const fullCiv = item.type === 'Civilization' ? civilizations.find(c => c.id === item.itemId) : null;

                  return (
                    <div key={item.id} className="p-4 rounded-lg bg-matte-900 border border-gold-500/5 space-y-2 text-xs print:bg-white print:border-gray-300">
                      <div className="flex justify-between items-start border-b border-gold-500/10 pb-1">
                        <span className="font-serif font-bold text-white print:text-black uppercase tracking-wide">
                          {idx + 1}. {item.name}
                        </span>
                        <span className="text-[10px] text-gold-400 font-mono">
                          {item.type} • {item.dateOrPeriod}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-gray-400 print:text-gray-700">
                        {fullArt && (
                          <>
                            <div>
                              <p><strong className="text-gray-300 print:text-black">Holding Museum:</strong> {fullArt.museum}</p>
                              <p><strong className="text-gray-300 print:text-black">Current Location:</strong> {fullArt.currentLocation}</p>
                              <p><strong className="text-gray-300 print:text-black">Scientific Dating:</strong> {fullArt.datingMethod}</p>
                            </div>
                            <div>
                              <p><strong className="text-gray-300 print:text-black">Repatriation / Colonial Controversy:</strong> {fullArt.scholarlyDebates || 'No current active disputes logged.'}</p>
                            </div>
                          </>
                        )}
                        {fullCiv && (
                          <>
                            <div>
                              <p><strong className="text-gray-300 print:text-black">Region:</strong> {fullCiv.region}</p>
                              <p><strong className="text-gray-300 print:text-black">Evidence Level:</strong> {fullCiv.evidenceTier}</p>
                            </div>
                            <div>
                              <p><strong className="text-gray-300 print:text-black">Evidence Note:</strong> {fullCiv.evidenceNote || fullCiv.receivedNarrative}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Classroom Exercises */}
              <div className="space-y-4 pt-4 border-t border-gold-500/10">
                <h3 className="text-xs font-serif text-gold-500 uppercase tracking-widest border-b border-gold-500/10 pb-1.5 font-bold">Scholarly Worksheet Exercises</h3>
                <div className="space-y-6 text-xs text-gray-400 print:text-gray-700 leading-relaxed font-light">
                  <div className="space-y-2">
                    <p className="font-semibold text-white print:text-black">Exercise 1: Comparative Narratives</p>
                    <p>Contrast the repatriation status and scholarly views of the items in this folder. For objects held in global museums (e.g. the British Museum), outline the scientific and moral arguments for and against returning them to their source communities.</p>
                    <div className="h-20 border border-dashed border-gold-500/20 rounded print:border-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-white print:text-black">Exercise 2: Chronological Verification</p>
                    <p>Evaluate the scientific dating methods (e.g. Carbon-14, stratigraphy, style analysis) described in the items above. Which objects have the highest tier of evidence? How do these verify pre-colonial mathematical or architectural records?</p>
                    <div className="h-20 border border-dashed border-gold-500/20 rounded print:border-gray-400" />
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="border-t border-gold-500/10 pt-4 mt-6 flex justify-between items-center text-[10px] text-gray-500 print:hidden">
              <span>Print layout is configured for portrait standard A4/Letter size.</span>
              <button 
                onClick={() => setSelectedWorksheetColl(null)}
                className="px-4 py-1 rounded bg-matte-900 border border-gold-500/10 hover:text-white text-gray-400"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
export default SavedCollections;
