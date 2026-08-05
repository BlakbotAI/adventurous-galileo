import React, { useState, useEffect } from 'react';
import { ExternalLink, Database, Loader2, BookOpen, Layers } from 'lucide-react';

interface RegistryItem {
  id: string;
  title: string;
  culture: string;
  date: string;
  imageUrl: string;
  museum: string;
  objectUrl: string;
}

interface MuseumSyncRegistryProps {
  query: string;
  type: 'civilization' | 'artifact' | 'figure';
}

export const MuseumSyncRegistry: React.FC<MuseumSyncRegistryProps> = ({ query }) => {
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [wikiSummary, setWikiSummary] = useState<string | null>(null);
  const [wikiUrl, setWikiUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setItems([]);
      setWikiSummary(null);
      setWikiUrl(null);

      // Clean search term
      let cleanQuery = query;
      // Strip helper tags or standard prefix/suffixes if any
      cleanQuery = cleanQuery.replace(/(Culture|Empire|Kingdom|Dynasty|Civilization|People)/gi, '').trim();

      try {
        const fetchedItems: RegistryItem[] = [];

        // 1. Fetch Met Museum
        try {
          const metSearchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(cleanQuery)}`;
          const metSearchRes = await fetch(metSearchUrl);
          if (metSearchRes.ok) {
            const metSearchData = await metSearchRes.json();
            const objectIds = metSearchData.objectIDs ? metSearchData.objectIDs.slice(0, 3) : [];
            
            for (const id of objectIds) {
              const metObjUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
              const metObjRes = await fetch(metObjUrl);
              if (metObjRes.ok) {
                const metObj = await metObjRes.json();
                if (metObj.primaryImage || metObj.primaryImageSmall) {
                  fetchedItems.push({
                    id: `met_${id}`,
                    title: metObj.title || 'Untitled Artifact',
                    culture: metObj.culture || metObj.artistDisplayName || 'Unknown Culture',
                    date: metObj.objectDate || 'Unknown Date',
                    imageUrl: metObj.primaryImageSmall || metObj.primaryImage,
                    museum: 'The Metropolitan Museum of Art',
                    objectUrl: metObj.objectURL
                  });
                }
              }
            }
          }
        } catch (err) {
          console.warn('Met Museum fetch failed:', err);
        }

        // 2. Fetch Cleveland Museum of Art
        try {
          const clevelandSearchUrl = `https://openaccess-api.clevelandart.org/api/artworks/?q=${encodeURIComponent(cleanQuery)}&limit=3`;
          const clevelandRes = await fetch(clevelandSearchUrl);
          if (clevelandRes.ok) {
            const clevelandData = await clevelandRes.json();
            const artworks = clevelandData.data || [];
            
            for (const art of artworks) {
              if (art.images && art.images.web && art.images.web.url) {
                fetchedItems.push({
                  id: `cleveland_${art.id}`,
                  title: art.title || 'Untitled Artifact',
                  culture: (art.culture && art.culture[0]) || 'Unknown Culture',
                  date: art.creation_date || 'Unknown Date',
                  imageUrl: art.images.web.url,
                  museum: 'The Cleveland Museum of Art',
                  objectUrl: art.url || `https://www.clevelandart.org/art/${art.id}`
                });
              }
            }
          }
        } catch (err) {
          console.warn('Cleveland Museum fetch failed:', err);
        }

        setItems(fetchedItems);

        // 3. Fetch Wikipedia Reference
        try {
          const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|info&exintro=1&explaintext=1&inprop=url&titles=${encodeURIComponent(query)}&format=json&origin=*`;
          const wikiRes = await fetch(wikiUrl);
          if (wikiRes.ok) {
            const wikiData = await wikiRes.json();
            const pages = wikiData.query?.pages;
            if (pages) {
              const page = Object.values(pages)[0] as any;
              if (!page.missing && page.extract) {
                setWikiSummary(page.extract);
                setWikiUrl(page.fullurl);
              }
            }
          }
        } catch (err) {
          console.warn('Wikipedia sync failed:', err);
        }

      } catch (err) {
        setError('Unable to establish real-time archive synchronization.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className="space-y-4 border-t border-gold-500/10 pt-6 mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xs md:text-sm font-serif text-gold-500 font-bold uppercase tracking-wider flex items-center gap-2">
          <Database size={15} className="text-gold-500 animate-pulse-glow" /> Global Museum Collections Registry
        </h3>
        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono bg-matte-900 border border-gold-500/10 px-2 py-0.5 rounded">
          Sync Status: Online
        </span>
      </div>

      {loading && (
        <div className="py-8 text-center text-gray-400 text-xs flex justify-center items-center gap-2">
          <Loader2 className="animate-spin size-4 text-gold-500" />
          Synchronizing records with Metropolitan and Cleveland Museum archives...
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-xs rounded-lg">
          {error}
        </div>
      )}

      {!loading && items.length === 0 && !wikiSummary && (
        <div className="p-4 rounded-lg bg-matte-950 text-center text-gray-500 text-xs font-light">
          No external museum collection items or Wikipedia references found for "{query}".
        </div>
      )}

      {/* Wikipedia Summary Panel */}
      {!loading && wikiSummary && (
        <div className="p-4 rounded-xl bg-matte-900/40 border border-gold-500/5 space-y-2 text-xs">
          <h4 className="text-[10px] text-gold-400/80 uppercase tracking-widest font-bold flex items-center gap-1.5">
            <BookOpen size={11} /> Wikipedia Encyclopedic Extract
          </h4>
          <p className="text-gray-400 leading-relaxed font-light font-sans text-justify">
            {wikiSummary.length > 500 ? `${wikiSummary.substring(0, 500)}...` : wikiSummary}
          </p>
          {wikiUrl && (
            <a
              href={wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-gold-500 hover:text-white transition-colors pt-1"
            >
              Read full Wikipedia article <ExternalLink size={10} />
            </a>
          )}
        </div>
      )}

      {/* External Artifacts Grid */}
      {!loading && items.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] text-gold-400/80 uppercase tracking-widest font-bold flex items-center gap-1.5">
            <Layers size={11} /> Related Holdings in Global Museums
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map(item => (
              <div
                key={item.id}
                className="group relative rounded-xl bg-matte-950/80 border border-gold-500/5 hover:border-gold-500/25 p-3 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="space-y-2">
                  {/* Item Image */}
                  <div className="h-28 w-full rounded-lg overflow-hidden bg-matte-900 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 backdrop-blur rounded text-[8px] text-gold-500 font-semibold border border-gold-500/20">
                      {item.museum.includes('Metropolitan') ? 'The Met' : 'Cleveland'}
                    </div>
                  </div>
                  {/* Metadata */}
                  <div className="space-y-1">
                    <h5 className="font-serif text-white font-semibold text-xs leading-snug line-clamp-1 group-hover:text-gold-400 transition-colors">
                      {item.title}
                    </h5>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Culture:</span>
                      <span className="text-gray-300 font-light truncate max-w-[120px]">{item.culture}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Period:</span>
                      <span className="text-gray-300 font-light">{item.date}</span>
                    </div>
                  </div>
                </div>

                {/* External Link */}
                <div className="pt-3 border-t border-gold-500/5 mt-3 flex justify-end">
                  <a
                    href={item.objectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-matte-900 hover:bg-gold-500 hover:text-black rounded text-[9px] text-gray-300 font-semibold flex items-center gap-1 border border-gold-500/10 hover:border-gold-500/30 transition-all"
                  >
                    View Registry <ExternalLink size={8} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
