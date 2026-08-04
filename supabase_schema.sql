-- Historical Intelligence Platform (HIP) - Supabase / PostgreSQL Schema Migration
-- Defines tables, relationships, and default seed data matching the mock database records.

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CIVILIZATIONS TABLE
CREATE TABLE IF NOT EXISTS civilizations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    period VARCHAR(100) NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL,
    population_estimate VARCHAR(100),
    government VARCHAR(100),
    religion VARCHAR(100),
    languages TEXT[] NOT NULL DEFAULT '{}',
    economy TEXT,
    trade TEXT,
    technology TEXT,
    major_cities TEXT[] NOT NULL DEFAULT '{}',
    leaders TEXT[] NOT NULL DEFAULT '{}',
    artifacts TEXT[] NOT NULL DEFAULT '{}',
    influence TEXT,
    received_narrative TEXT,
    evidence_note TEXT,
    evidence_tier VARCHAR(50) NOT NULL DEFAULT 'Established',
    africa_centered BOOLEAN NOT NULL DEFAULT TRUE,
    image_url TEXT,
    wikipedia_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ARTIFACTS TABLE
CREATE TABLE IF NOT EXISTS artifacts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    civilization_id VARCHAR(50) REFERENCES civilizations(id) ON DELETE SET NULL,
    civilization_name VARCHAR(100) NOT NULL,
    date_period VARCHAR(100) NOT NULL,
    start_year INTEGER NOT NULL,
    material TEXT[] NOT NULL DEFAULT '{}',
    museum VARCHAR(150),
    current_location VARCHAR(150),
    importance_score INTEGER NOT NULL DEFAULT 5,
    image_url TEXT,
    historical_context TEXT NOT NULL,
    discovery_notes TEXT,
    dating_method VARCHAR(100),
    scholarly_debates TEXT,
    conservation_history TEXT,
    evidence_tier VARCHAR(50) NOT NULL DEFAULT 'Established',
    sources JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. HISTORICAL FIGURES TABLE
CREATE TABLE IF NOT EXISTS historical_figures (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    civilization_id VARCHAR(50) REFERENCES civilizations(id) ON DELETE SET NULL,
    civilization_name VARCHAR(100) NOT NULL,
    period VARCHAR(100) NOT NULL,
    start_year INTEGER NOT NULL,
    image_url TEXT,
    biography TEXT NOT NULL,
    achievements TEXT[] NOT NULL DEFAULT '{}',
    sources JSONB NOT NULL DEFAULT '[]',
    historical_sources TEXT,
    family_tree_placeholder TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TIMELINE EVENTS TABLE
CREATE TABLE IF NOT EXISTS timeline_events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    event_year INTEGER NOT NULL,
    display_year VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    civilization_id VARCHAR(50) REFERENCES civilizations(id) ON DELETE SET NULL,
    region VARCHAR(100) NOT NULL,
    theme VARCHAR(50) NOT NULL,
    africa_centered BOOLEAN NOT NULL DEFAULT TRUE,
    evidence_tier VARCHAR(50) NOT NULL DEFAULT 'Established',
    sources JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TRADE ROUTES TABLE
CREATE TABLE IF NOT EXISTS trade_routes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    period VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    goods TEXT[] NOT NULL DEFAULT '{}',
    regions TEXT[] NOT NULL DEFAULT '{}',
    coordinates JSONB NOT NULL, -- Array of [lat, lng] points
    start_year INTEGER,
    end_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. MIGRATION ROUTES TABLE
CREATE TABLE IF NOT EXISTS migration_routes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    period VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destinations TEXT[] NOT NULL DEFAULT '{}',
    coordinates JSONB NOT NULL, -- Array of [lat, lng] points
    start_year INTEGER,
    end_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. HISTORICAL DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS historical_documents (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100),
    date_string VARCHAR(50) NOT NULL,
    civilization_name VARCHAR(100) NOT NULL,
    excerpt TEXT NOT NULL,
    significance TEXT NOT NULL,
    evidence_tier VARCHAR(50) NOT NULL DEFAULT 'Established',
    sources JSONB NOT NULL DEFAULT '[]',
    start_year INTEGER,
    end_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. QUIZ QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS quiz_questions (
    id VARCHAR(50) PRIMARY KEY,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL DEFAULT '{}',
    answer_index INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA INSERTIONS

-- Seed Civilizations
INSERT INTO civilizations (id, name, region, period, start_year, end_year, languages, evidence_tier, received_narrative, evidence_note, image_url) VALUES 
('kemet', 'Ancient Kemet', 'Northeast Africa / Nile Valley', 'c. 3100 BCE - 332 BCE', -3100, -332, ARRAY['Ancient Egyptian'], 'Established', 'Kemet is often isolated from its African context, treated as an extension of Mediterranean history.', 'Kemet arose directly out of Saharan cattle pastoralist cultures. Early dynastic symbols like the white crown trace to Nubia.', 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600&auto=format&fit=crop&q=80'),
('kush', 'Kingdom of Kush', 'Nubia / Nile Valley', 'c. 2500 BCE - 350 CE', -2500, 350, ARRAY['Meroitic', 'Nobiin'], 'Established', 'Often depicted merely as a vassal state or subordinate province of Egypt.', 'Kush was a highly advanced independent kingdom. The 25th Dynasty Kushite rulers unified and ruled the entire Nile Valley, defeating Roman legions.', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&auto=format&fit=crop&q=80'),
('aksum', 'Aksumite Empire', 'Horn of Africa', 'c. 100 BCE - 940 CE', -100, 940, ARRAY['Ge''ez'], 'Established', 'Considered isolated from continental trade networks, relying entirely on South Arabia.', 'Aksum was ranked as one of the four great world empires alongside Rome, Persia, and China, controlling critical Red Sea trade loops.', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&auto=format&fit=crop&q=80');

-- Seed Artifacts
INSERT INTO artifacts (id, name, civilization_id, civilization_name, date_period, start_year, material, museum, current_location, importance_score, historical_context, discovery_notes, dating_method) VALUES
('art_ishango', 'Ishango Bone', 'kush', 'Early African Peoples', 'c. 20,000 BCE', -20000, ARRAY['Baboon Bone', 'Quartz'], 'Royal Belgian Institute of Natural Sciences', 'Brussels, Belgium', 10, 'A dark baboon fibula with a sharp piece of quartz fixed to one end, displaying mathematical tally marks.', 'Excavated in 1950 by Belgian geologist Jean de Heinzelin de Braucourt near Lake Edward.', 'Stratigraphy and radiocarbon carbon logging', 'Carbon-14 (20,000 BCE)');

-- Seed Quiz Questions
INSERT INTO quiz_questions (id, question, options, answer_index, explanation, category) VALUES
('quiz_1', 'What mathematical calculating tool discovered in the Congo is dated to c. 20,000 BCE?', ARRAY['Lebombo Bone', 'Ishango Bone', 'Qustul Incense Burner', 'Rosetta Stone'], 1, 'The Ishango Bone was excavated in the Congo and displays distinct numerical groupings, including prime numbers.', 'Mathematics'),
('quiz_2', 'Which Candace ruler successfully led the Kingdom of Kush against the Roman Empire?', ARRAY['Queen Nzinga', 'Queen Hatshepsut', 'Queen Amanirenas', 'Empress Taytu Betul'], 2, 'Queen Amanirenas led Kushite armies in battle against Roman legions in Egypt, bringing back Augustus'' bronze head to Meroe.', 'History');
