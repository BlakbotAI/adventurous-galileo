import { CIVILIZATIONS, ARTIFACTS, FIGURES, TIMELINE_EVENTS, TRADE_ROUTES, MIGRATION_ROUTES, HISTORICAL_DOCUMENTS } from '../data/mockDatabase';
import type { Civilization, Artifact, HistoricalFigure, TimelineEvent, TradeRoute, MigrationRoute, HistoricalDocument, DBQuizQuestion } from '../types/database';

export interface DBCollectionItem {
  id: string;
  collectionId: string;
  itemId: string;
  itemType: 'Artifact' | 'Civilization';
}

export interface DBCollection {
  id: string;
  userId: string;
  name: string;
  description: string;
}

class LocalDatabase {
  private supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  private supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  constructor() {
    this.init();
    this.syncFromSupabase();
  }

  private get isSupabaseConfigured(): boolean {
    return Boolean(this.supabaseUrl && this.supabaseKey);
  }

  private mapToSupabase(obj: any): any {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      const snake = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      res[snake] = obj[key];
    }
    return res;
  }

  private mapFromSupabase(obj: any): any {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      const camel = key.replace(/([-_][a-z])/g, group =>
        group.toUpperCase().replace('-', '').replace('_', '')
      );
      res[camel] = obj[key];
    }
    return res;
  }

  private async syncFromSupabase() {
    if (!this.isSupabaseConfigured) return;
    try {
      const headers = {
        'apikey': this.supabaseKey,
        'Authorization': `Bearer ${this.supabaseKey}`
      };
      
      const tables = [
        { local: 'civilizations', remote: 'civilizations' },
        { local: 'artifacts', remote: 'artifacts' },
        { local: 'figures', remote: 'historical_figures' },
        { local: 'quiz_questions', remote: 'quiz_questions' }
      ];

      for (const t of tables) {
        const res = await fetch(`${this.supabaseUrl}/rest/v1/${t.remote}?select=*`, { headers });
        if (res.ok) {
          const rawData = await res.json();
          if (rawData && rawData.length > 0) {
            const data = rawData.map((d: any) => this.mapFromSupabase(d));
            localStorage.setItem(`hios_db_${t.local}`, JSON.stringify(data));
          }
        }
      }
    } catch (err) {
      console.warn('Supabase sync background fail:', err);
    }
  }

  private async pushToSupabase(table: string, data: any) {
    if (!this.isSupabaseConfigured) return;
    try {
      const mapped = this.mapToSupabase(data);
      await fetch(`${this.supabaseUrl}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(mapped)
      });
    } catch (err) {
      console.warn(`Supabase save fail for ${table}:`, err);
    }
  }

  private async deleteFromSupabase(table: string, id: string) {
    if (!this.isSupabaseConfigured) return;
    try {
      await fetch(`${this.supabaseUrl}/rest/v1/${table}?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`
        }
      });
    } catch (err) {
      console.warn(`Supabase delete fail for ${table}:`, err);
    }
  }

  private init() {
    if (localStorage.getItem('hios_db_initialized') !== 'v2') {
      localStorage.setItem('hios_db_civilizations', JSON.stringify(CIVILIZATIONS));
      localStorage.setItem('hios_db_artifacts', JSON.stringify(ARTIFACTS));
      localStorage.setItem('hios_db_figures', JSON.stringify(FIGURES));
      localStorage.setItem('hios_db_timeline_events', JSON.stringify(TIMELINE_EVENTS));
      localStorage.setItem('hios_db_trade_routes', JSON.stringify(TRADE_ROUTES));
      localStorage.setItem('hios_db_migration_routes', JSON.stringify(MIGRATION_ROUTES));
      localStorage.setItem('hios_db_documents', JSON.stringify(HISTORICAL_DOCUMENTS));
      
      // Default Collections
      const defaultCollections: DBCollection[] = [
        {
          id: 'coll_math',
          userId: 'default_user_id',
          name: 'African Mathematics & Metrology',
          description: 'Curation of the oldest numerical counting tools, mathematical calendars, and astronomical treatises across Central and Southern Africa.'
        },
        {
          id: 'coll_royal',
          userId: 'default_user_id',
          name: 'Nile Valley Monarchy Indicators',
          description: 'Items showcasing early dynastic crown symbols and incense burners pre-dating lower Egypt unification.'
        }
      ];

      const defaultCollectionItems: DBCollectionItem[] = [
        { id: 'item_1', collectionId: 'coll_math', itemId: 'art_lebombo', itemType: 'Artifact' },
        { id: 'item_2', collectionId: 'coll_math', itemId: 'art_ishango', itemType: 'Artifact' },
        { id: 'item_3', collectionId: 'coll_royal', itemId: 'art_qustul', itemType: 'Artifact' }
      ];

      localStorage.setItem('hios_db_collections', JSON.stringify(defaultCollections));
      localStorage.setItem('hios_db_collection_items', JSON.stringify(defaultCollectionItems));
      
      // Default Quiz Questions
      const defaultQuizzes: DBQuizQuestion[] = [
        {
          id: 'quiz_1',
          question: 'What mathematical calculating tool discovered in the Congo is dated to c. 20,000 BCE?',
          options: ['Lebombo Bone', 'Ishango Bone', 'Qustul Incense Burner', 'Rosetta Stone'],
          answerIndex: 1,
          explanation: 'The Ishango Bone was excavated in the Congo and displays distinct numerical groupings, including prime numbers.',
          category: 'Mathematics'
        },
        {
          id: 'quiz_2',
          question: 'Which Candace ruler successfully led the Kingdom of Kush against the Roman Empire?',
          options: ['Queen Nzinga', 'Queen Hatshepsut', 'Queen Amanirenas', 'Empress Taytu Betul'],
          answerIndex: 2,
          explanation: 'Queen Amanirenas led Kushite armies in battle against Roman legions in Egypt, bringing back Augustus\' bronze head to Meroe.',
          category: 'History'
        },
        {
          id: 'quiz_3',
          question: 'Under which emperor did Timbuktu reach its pinnacle as a global capital of science and trade?',
          options: ['Sundiata Keita', 'Mansa Musa', 'King Ezana', 'Oba Ewuare'],
          answerIndex: 1,
          explanation: 'Mansa Musa funded major libraries, universities (Sankore), and mosques, turning Timbuktu into an intellectual beacon.',
          category: 'History'
        },
        {
          id: 'quiz_4',
          question: 'Which West African culture transitioned directly from the Stone Age to the Iron Age without a Bronze Age?',
          options: ['Mali Empire', 'Kingdom of Benin', 'Nok Culture', 'Ghana Empire'],
          answerIndex: 2,
          explanation: 'Excavations at Taruga prove the Nok culture independently invented iron-smelting metallurgy by 1000 BCE.',
          category: 'Technology'
        }
      ];
      localStorage.setItem('hios_db_quiz_questions', JSON.stringify(defaultQuizzes));
      
      localStorage.setItem('hios_db_initialized', 'v2');
    }

    if (!localStorage.getItem('hios_db_quiz_questions')) {
      const defaultQuizzes: DBQuizQuestion[] = [
        {
          id: 'quiz_1',
          question: 'What mathematical calculating tool discovered in the Congo is dated to c. 20,000 BCE?',
          options: ['Lebombo Bone', 'Ishango Bone', 'Qustul Incense Burner', 'Rosetta Stone'],
          answerIndex: 1,
          explanation: 'The Ishango Bone was excavated in the Congo and displays distinct numerical groupings, including prime numbers.',
          category: 'Mathematics'
        },
        {
          id: 'quiz_2',
          question: 'Which Candace ruler successfully led the Kingdom of Kush against the Roman Empire?',
          options: ['Queen Nzinga', 'Queen Hatshepsut', 'Queen Amanirenas', 'Empress Taytu Betul'],
          answerIndex: 2,
          explanation: 'Queen Amanirenas led Kushite armies in battle against Roman legions in Egypt, bringing back Augustus\' bronze head to Meroe.',
          category: 'History'
        },
        {
          id: 'quiz_3',
          question: 'Under which emperor did Timbuktu reach its pinnacle as a global capital of science and trade?',
          options: ['Sundiata Keita', 'Mansa Musa', 'King Ezana', 'Oba Ewuare'],
          answerIndex: 1,
          explanation: 'Mansa Musa funded major libraries, universities (Sankore), and mosques, turning Timbuktu into an intellectual beacon.',
          category: 'History'
        },
        {
          id: 'quiz_4',
          question: 'Which West African culture transitioned directly from the Stone Age to the Iron Age without a Bronze Age?',
          options: ['Mali Empire', 'Kingdom of Benin', 'Nok Culture', 'Ghana Empire'],
          answerIndex: 2,
          explanation: 'Excavations at Taruga prove the Nok culture independently invented iron-smelting metallurgy by 1000 BCE.',
          category: 'Technology'
        }
      ];
      localStorage.setItem('hios_db_quiz_questions', JSON.stringify(defaultQuizzes));
    }
  }

  private getTable<T>(name: string): T[] {
    const raw = localStorage.getItem(`hios_db_${name}`);
    return raw ? JSON.parse(raw) : [];
  }

  private saveTable<T>(name: string, data: T[]): void {
    localStorage.setItem(`hios_db_${name}`, JSON.stringify(data));
  }

  // --- CIVILIZATIONS ---
  public getCivilizations(): Civilization[] {
    return this.getTable<Civilization>('civilizations');
  }

  public saveCivilization(civ: Civilization): void {
    const table = this.getCivilizations();
    const idx = table.findIndex(c => c.id === civ.id);
    if (idx >= 0) {
      table[idx] = civ;
    } else {
      table.push(civ);
    }
    this.saveTable('civilizations', table);
    this.pushToSupabase('civilizations', civ);
  }

  public deleteCivilization(id: string): void {
    const table = this.getCivilizations().filter(c => c.id !== id);
    this.saveTable('civilizations', table);
    this.deleteFromSupabase('civilizations', id);
  }

  // --- ARTIFACTS ---
  public getArtifacts(): Artifact[] {
    return this.getTable<Artifact>('artifacts');
  }

  public saveArtifact(art: Artifact): void {
    const table = this.getArtifacts();
    const idx = table.findIndex(a => a.id === art.id);
    if (idx >= 0) {
      table[idx] = art;
    } else {
      table.push(art);
    }
    this.saveTable('artifacts', table);
    this.pushToSupabase('artifacts', art);
  }

  public deleteArtifact(id: string): void {
    const table = this.getArtifacts().filter(a => a.id !== id);
    this.saveTable('artifacts', table);
    this.deleteFromSupabase('artifacts', id);
  }

  // --- FIGURES ---
  public getFigures(): HistoricalFigure[] {
    return this.getTable<HistoricalFigure>('figures');
  }

  public saveFigure(fig: HistoricalFigure): void {
    const table = this.getFigures();
    const idx = table.findIndex(f => f.id === fig.id);
    if (idx >= 0) {
      table[idx] = fig;
    } else {
      table.push(fig);
    }
    this.saveTable('figures', table);
    this.pushToSupabase('historical_figures', fig);
  }

  public deleteFigure(id: string): void {
    const table = this.getFigures().filter(f => f.id !== id);
    this.saveTable('figures', table);
    this.deleteFromSupabase('historical_figures', id);
  }

  // --- TIMELINE EVENTS ---
  public getTimelineEvents(): TimelineEvent[] {
    return this.getTable<TimelineEvent>('timeline_events');
  }

  public saveTimelineEvent(ev: TimelineEvent): void {
    const table = this.getTimelineEvents();
    const idx = table.findIndex(e => e.id === ev.id);
    if (idx >= 0) {
      table[idx] = ev;
    } else {
      table.push(ev);
    }
    this.saveTable('timeline_events', table);
  }

  // --- DOCUMENTS ---
  public getDocuments(): HistoricalDocument[] {
    return this.getTable<HistoricalDocument>('documents');
  }

  // --- COLLECTIONS ---
  public getCollections(userId?: string): DBCollection[] {
    const table = this.getTable<DBCollection>('collections');
    if (userId) {
      return table.filter(c => c.userId === userId);
    }
    return table;
  }

  public saveCollection(coll: DBCollection): void {
    const table = this.getTable<DBCollection>('collections');
    const idx = table.findIndex(c => c.id === coll.id);
    if (idx >= 0) {
      table[idx] = coll;
    } else {
      table.push(coll);
    }
    this.saveTable('collections', table);
  }

  public deleteCollection(id: string): void {
    const table = this.getTable<DBCollection>('collections').filter(c => c.id !== id);
    this.saveTable('collections', table);
    // Cascade delete items
    const items = this.getCollectionItems(id);
    items.forEach(item => this.deleteCollectionItem(item.id));
  }

  // --- COLLECTION ITEMS ---
  public getCollectionItems(collectionId?: string): DBCollectionItem[] {
    const table = this.getTable<DBCollectionItem>('collection_items');
    if (collectionId) {
      return table.filter(i => i.collectionId === collectionId);
    }
    return table;
  }

  public addCollectionItem(item: DBCollectionItem): void {
    const table = this.getCollectionItems();
    // Prevent duplicates in same collection
    const exists = table.some(i => i.collectionId === item.collectionId && i.itemId === item.itemId);
    if (!exists) {
      table.push(item);
      this.saveTable('collection_items', table);
    }
  }

  public deleteCollectionItem(id: string): void {
    const table = this.getCollectionItems().filter(i => i.id !== id);
    this.saveTable('collection_items', table);
  }

  // --- SECTIONS DATA SYNC FOR GRAPH & MAPS ---
  public getTradeRoutes(): TradeRoute[] {
    return this.getTable<TradeRoute>('trade_routes');
  }

  public getMigrationRoutes(): MigrationRoute[] {
    return this.getTable<MigrationRoute>('migration_routes');
  }

  // --- QUIZ QUESTIONS ---
  public getQuizQuestions(): DBQuizQuestion[] {
    return this.getTable<DBQuizQuestion>('quiz_questions');
  }

  public saveQuizQuestion(question: DBQuizQuestion): void {
    const table = this.getQuizQuestions();
    const idx = table.findIndex(q => q.id === question.id);
    if (idx >= 0) {
      table[idx] = question;
    } else {
      table.push(question);
    }
    this.saveTable('quiz_questions', table);
    this.pushToSupabase('quiz_questions', question);
  }

  public deleteQuizQuestion(id: string): void {
    const table = this.getQuizQuestions().filter(q => q.id !== id);
    this.saveTable('quiz_questions', table);
    this.deleteFromSupabase('quiz_questions', id);
  }
}

export const db = new LocalDatabase();
