export type EvidenceTier = 'Established' | 'Scholarly Consensus' | 'Contested' | 'Speculative';

export interface Source {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  year: number;
  url?: string;
  citationType: 'Archaeological' | 'Primary Document' | 'Oral Tradition' | 'Genetic Study' | 'Linguistic Study' | 'Secondary Scholarly';
  evidenceTier: EvidenceTier;
}

export interface Citation {
  sourceId: string;
  pageOrDetail?: string;
  note?: string;
}

export interface Civilization {
  id: string;
  name: string;
  region: string;
  period: string; // e.g. "3000 BCE - 350 BCE"
  startYear: number; // For timeline sorting (BCE is negative)
  endYear: number;
  populationEstimate?: string;
  government?: string;
  religion?: string;
  languages: string[];
  economy?: string;
  trade?: string;
  technology?: string;
  majorCities: string[];
  leaders: string[]; // Figure IDs or names
  artifacts: string[]; // Artifact IDs
  influence?: string;
  receivedNarrative?: string; // Falsities/biases to correct
  evidenceNote?: string; // The corrective explanation based on real evidence
  evidenceTier: EvidenceTier;
  africaCentered: boolean;
  imageUrl?: string;
  wikipediaUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface Artifact {
  id: string;
  name: string;
  civilizationId: string;
  civilizationName: string;
  date: string;
  startYear: number;
  material: string[];
  museum: string;
  currentLocation: string;
  importanceScore: number; // 1-10
  imageUrl?: string;
  historicalContext: string;
  discoveryNotes: string;
  datingMethod: string;
  scholarlyDebates?: string;
  conservationHistory?: string;
  evidenceTier: EvidenceTier;
  sources: Citation[];
}

export interface HistoricalFigure {
  id: string;
  name: string;
  title: string;
  civilizationId: string;
  civilizationName: string;
  period: string;
  startYear: number;
  imageUrl?: string;
  biography: string;
  achievements: string[];
  sources: Citation[];
  historicalSources?: string;
  familyTreePlaceholder?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  year: number;
  displayYear: string;
  description: string;
  civilizationId?: string;
  region: string;
  theme: 'Technology' | 'Religion' | 'Trade' | 'Conflict' | 'Migration' | 'Agriculture' | 'Science' | 'Architecture' | 'Culture';
  africaCentered: boolean;
  evidenceTier: EvidenceTier;
  sources: Citation[];
}

export interface TradeRoute {
  id: string;
  name: string;
  period: string;
  description: string;
  goods: string[];
  regions: string[];
  coordinates: [number, number][]; // lat, lng points along the route
  startYear?: number;
  endYear?: number;
}

export interface MigrationRoute {
  id: string;
  name: string;
  period: string;
  description: string;
  origin: string;
  destinations: string[];
  coordinates: [number, number][]; // path points
  startYear?: number;
  endYear?: number;
}

export interface HistoricalDocument {
  id: string;
  title: string;
  author?: string;
  date: string;
  civilizationName: string;
  excerpt: string;
  significance: string;
  evidenceTier: EvidenceTier;
  sources: Citation[];
  startYear?: number;
  endYear?: number;
}

export interface DBQuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  category: string;
}
