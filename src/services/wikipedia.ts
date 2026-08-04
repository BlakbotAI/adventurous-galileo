export interface WikiSearchResult {
  title: string;
  pageid: number;
  snippet: string;
}

export interface WikiPageDetails {
  title: string;
  extract: string;
  imageUrl?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  url: string;
}

export const searchWikipedia = async (query: string): Promise<WikiSearchResult[]> => {
  if (!query.trim()) return [];
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Wikipedia search failed');
    const data = await res.json();
    return (data.query?.search || []).map((item: any) => ({
      title: item.title,
      pageid: item.pageid,
      snippet: item.snippet.replace(/<\/?[^>]+(>|$)/g, "") // Strip HTML tags
    }));
  } catch (err) {
    console.error('searchWikipedia error:', err);
    throw err;
  }
};

export const getWikipediaPageDetails = async (title: string): Promise<WikiPageDetails> => {
  if (!title) throw new Error('Title is required');
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages|coordinates|info&exintro=1&explaintext=1&piprop=original&inprop=url&titles=${encodeURIComponent(title)}&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Wikipedia details fetch failed');
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) throw new Error('Page not found on Wikipedia');
    
    const page = Object.values(pages)[0] as any;
    if (page.missing) {
      throw new Error(`Page "${title}" does not exist.`);
    }

    return {
      title: page.title,
      extract: page.extract || '',
      imageUrl: page.original?.source,
      coordinates: page.coordinates?.[0] ? {
        lat: page.coordinates[0].lat,
        lon: page.coordinates[0].lon
      } : undefined,
      url: page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`
    };
  } catch (err) {
    console.error('getWikipediaPageDetails error:', err);
    throw err;
  }
};
