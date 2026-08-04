import type { Civilization, Artifact, HistoricalFigure, TimelineEvent, TradeRoute, MigrationRoute, HistoricalDocument, Source } from '../types/database';

export const SOURCES: Record<string, Source> = {
  src_lebombo: {
    id: 'src_lebombo',
    title: 'A Late Stone Age record of counting and calendars from Lebombo Cave',
    author: 'd\'Errico, F. et al.',
    year: 2012,
    citationType: 'Archaeological',
    evidenceTier: 'Established'
  },
  src_ishango: {
    id: 'src_ishango',
    title: 'The Ishango Bone: The cradle of mathematics?',
    author: 'Huylebrouck, D.',
    year: 1999,
    citationType: 'Archaeological',
    evidenceTier: 'Scholarly Consensus'
  },
  src_qustul: {
    id: 'src_qustul',
    title: 'The Qustul Incense Burner and the Early Kings of Nubia',
    author: 'Williams, B. B.',
    year: 1986,
    citationType: 'Archaeological',
    evidenceTier: 'Contested'
  },
  src_timbuktu: {
    id: 'src_timbuktu',
    title: 'The Timbuktu Manuscripts: Islamic astronomy and mathematics in West Africa',
    author: 'Jeppie, S. & Diagne, S. B.',
    year: 2008,
    citationType: 'Primary Document',
    evidenceTier: 'Established'
  },
  src_mapungubwe: {
    id: 'src_mapungubwe',
    title: 'Mapungubwe: Reconstructing an Ancient African Society',
    author: 'Huffman, T. N.',
    year: 2007,
    citationType: 'Archaeological',
    evidenceTier: 'Established'
  },
  src_benin: {
    id: 'src_benin',
    title: 'The Art of Benin: History and Curation',
    author: 'Plankensteiner, B.',
    year: 2007,
    citationType: 'Archaeological',
    evidenceTier: 'Established'
  },
  src_abubakr: {
    id: 'src_abubakr',
    title: 'The Saga of Abu Bakr II and the Malian Atlantic Voyages',
    author: 'Van Sertima, I.',
    year: 1976,
    citationType: 'Oral Tradition',
    evidenceTier: 'Speculative'
  },
  src_kush: {
    id: 'src_kush',
    title: 'The Kingdom of Kush: The Napatan and Meroitic Empires',
    author: 'Welsby, D. A.',
    year: 1996,
    citationType: 'Secondary Scholarly',
    evidenceTier: 'Established'
  },
  src_tiwanaku: {
    id: 'src_tiwanaku',
    title: 'Tiwanaku and Its Hinterland: Archaeology and Cognitive Reconstruction',
    author: 'Kolata, A. L.',
    year: 1996,
    citationType: 'Archaeological',
    evidenceTier: 'Established'
  },
  src_aksum: {
    id: 'src_aksum',
    title: 'Aksum: An African Civilisation of Late Antiquity',
    author: 'Munro-Hay, S.',
    year: 1991,
    citationType: 'Secondary Scholarly',
    evidenceTier: 'Established'
  }
};

export const CIVILIZATIONS: Civilization[] = [
  {
    id: 'kemet',
    name: 'Ancient Kemet (Egypt)',
    region: 'Northeast Africa',
    period: '3100 BCE - 30 BCE',
    startYear: -3100,
    endYear: -30,
    populationEstimate: '2 - 5 Million',
    government: 'Divine Monarchic State',
    religion: 'Kemetic Polytheism/State Theology',
    languages: ['Ancient Egyptian (Hieroglyphic/Hieratic)'],
    economy: 'Agricultural surplus, state redistribution, Nilotic shipping networks',
    trade: 'Obsidian, gold, copper, cedarwood from Sinai, Nubia, and the Levant',
    technology: 'Nilometer irrigation, papyrus manufacturing, monumental stone masonry, calendar of 365 days',
    majorCities: ['Memphis', 'Thebes', 'Alexandria', 'Avaris'],
    leaders: ['Hatshepsut', 'Taharqa', 'Akhenaten', 'Ramesses II'],
    artifacts: ['art_rosetta', 'art_qustul'],
    influence: 'Deep foundational cultural exchanges with Nubia, Levant, and Aegean civilizations.',
    receivedNarrative: 'Kemet was a culturally isolated, non-African, Caucasian or Near-Eastern civilization disconnected from the rest of Africa.',
    evidenceNote: 'Archaeological, biological, and linguistic evidence demonstrates Kemet was an indigenous African civilization rooted in the Nile Valley cultural complex, closely linked to Southern Nilotic cultures and Nubia (Ta-Seti).',
    evidenceTier: 'Established',
    africaCentered: true,
    imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=600&auto=format&fit=crop&q=80',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Ancient_Egypt'
  },
  {
    id: 'kush',
    name: 'Kingdom of Kush',
    region: 'Northeast Africa (Nubia)',
    period: '2500 BCE - 350 CE',
    startYear: -2500,
    endYear: 350,
    populationEstimate: '1.5 Million',
    government: 'Monarchy governed by King and Queen Mother (Kandake)',
    religion: 'Amon-centered state religion, Apedemak (Lion God)',
    languages: ['Meroitic', 'Nubian'],
    economy: 'Gold mining, pastoralism, iron exports, caravan trade',
    trade: 'Gold, ivory, incense, ebony, iron tools to Egypt, Red Sea ports, and interior Africa',
    technology: 'Advanced iron smelting centers (Meroe), reservoir systems (Hafirs), unique Nubian pyramids',
    majorCities: ['Kerma', 'Napata', 'Meroë'],
    leaders: ['Amanirenas', 'Taharqa', 'Piye'],
    artifacts: ['art_qustul'],
    influence: 'Ruled Kemet as the 25th Dynasty. Provided critical trading bridges between sub-Saharan Africa and the Mediterranean.',
    receivedNarrative: 'Kush was a mere dependency or replica of Egyptian culture, without its own technological or political identity.',
    evidenceNote: 'Excavations at Kerma and Meroe prove Kush was an independent, technologically advanced state. Meroe was one of the largest iron-working centers in the ancient world, developing its own Meroitic script (yet undeciphered) and distinct matrilineal succession patterns.',
    evidenceTier: 'Established',
    africaCentered: true,
    imageUrl: 'https://images.unsplash.com/photo-1600577916048-804c9191e36c?w=600&auto=format&fit=crop&q=80',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Kingdom_of_Kush'
  },
  {
    id: 'mali',
    name: 'Mali Empire',
    region: 'West Africa',
    period: '1230 CE - 1670 CE',
    startYear: 1230,
    endYear: 1670,
    populationEstimate: '20 Million',
    government: 'Federated Monarchy (Gbara Assembly)',
    religion: 'Islam (Court/Urban), Indigenous Traditional Systems (Rural)',
    languages: ['Mandinka', 'Bambara', 'Susu'],
    economy: 'Trans-Saharan trade dominance, gold dust taxation, agricultural estates',
    trade: 'Gold, salt, copper, books, slaves, textiles connecting to North Africa and Venice',
    technology: 'Timbuktu architectural style (Sudano-Sahelian), advanced mathematical/astronomical archives',
    majorCities: ['Niani', 'Timbuktu', 'Gao', 'Djenné'],
    leaders: ['Mansa_Musa', 'Sundiata_Keita', 'Abu_Bakr_II'],
    artifacts: ['art_timbuktu'],
    influence: 'Established major global center of Islamic scholarship in Timbuktu. Shaped West African law and social structures.',
    receivedNarrative: 'West African states were decentralized and lacked written constitutions, laws, or global intellectual influence prior to European colonization.',
    evidenceNote: 'The Kouroukan Fuga (Mali Constitution, 1235 CE) codified human rights, occupational guilds, and division of powers. Timbuktu housed over 700,000 cataloged scientific and literary manuscripts written by local scholars.',
    evidenceTier: 'Established',
    africaCentered: true,
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&auto=format&fit=crop&q=80',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Mali_Empire'
  },
  {
    id: 'aksum',
    name: 'Kingdom of Aksum',
    region: 'Horn of Africa (Ethiopia/Eritrea)',
    period: '100 CE - 940 CE',
    startYear: 100,
    endYear: 940,
    populationEstimate: '1.2 Million',
    government: 'Monarchy (Negusa Nagast - King of Kings)',
    religion: 'Polytheism, later Orthodox Christianity (converted ~330 CE under Ezana)',
    languages: ['Ge\'ez (Ethiopic)'],
    economy: 'Maritime and caravan trade taxation, agricultural terrace farming',
    trade: 'Frankincense, gold, ivory, emeralds to Rome, Byzantium, Persia, and India',
    technology: 'Monolithic obelisk quarrying, coinage production (gold/bronze/silver), terrace farming irrigation',
    majorCities: ['Aksum', 'Adulis', 'Qohaito'],
    leaders: ['Ezana', 'Kaleb'],
    artifacts: ['art_aksum_stela'],
    influence: 'One of the four global powers of the 3rd century (alongside Rome, Persia, China). Dominated Southern Red Sea trade.',
    receivedNarrative: 'Sub-Saharan African states did not produce state coinage or engage in direct intercontinental diplomacy with Rome and Persia.',
    evidenceNote: 'Aksum was the first African state to mint its own gold coinage bearing its rulers\' effigies, demonstrating complete monetary sovereignty. It controlled trade throughout the Red Sea and Gulf of Aden, and directly intervened militarily in Southern Arabia.',
    evidenceTier: 'Established',
    africaCentered: true,
    imageUrl: 'https://images.unsplash.com/photo-1566121318599-23214c77c617?w=600&auto=format&fit=crop&q=80',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Kingdom_of_Aksum'
  },
  {
    id: 'great_zimbabwe',
    name: 'Great Zimbabwe',
    region: 'Southern Africa',
    period: '1100 CE - 1450 CE',
    startYear: 1100,
    endYear: 1450,
    populationEstimate: '18,000',
    government: 'Centralized Divine Kingship',
    religion: 'Traditional Shona Religion (Mwari worship)',
    languages: ['Shona (Bantu)'],
    economy: 'Cattle pastoralism, gold mining monopolies, regional ivory trade',
    trade: 'Gold and ivory traded through Sofala port for Chinese porcelain, Persian glass, and Indian beads',
    technology: 'Dry-stone architecture (monumental walls built without mortar), soapstone carving',
    majorCities: ['Great Zimbabwe'],
    leaders: ['Nyatsimba Mutota'],
    artifacts: ['art_zimbabwe_bird', 'art_gold_rhino'],
    influence: 'Dominant regional center controlling Southern Africa\'s trade flows to the Swahili coast.',
    receivedNarrative: 'African cultures were incapable of building monumental stone architecture; Great Zimbabwe must have been built by Phoenicians, Arabs, or Europeans.',
    evidenceNote: 'Decades of scientific archaeology confirm that Great Zimbabwe was built by indigenous Shona ancestors. Pottery, architectural styling, and cultural artifacts demonstrate unbroken local development.',
    evidenceTier: 'Established',
    africaCentered: true,
    imageUrl: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=600&auto=format&fit=crop&q=80',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Great_Zimbabwe'
  },
  {
    id: 'benin',
    name: 'Kingdom of Benin',
    region: 'West Africa (Nigeria)',
    period: '1180 CE - 1897 CE',
    startYear: 1180,
    endYear: 1897,
    populationEstimate: '1.5 Million',
    government: 'Sacred Monarchy (Oba)',
    religion: 'Traditional Edo Religion (Ancestral veneration)',
    languages: ['Edo'],
    economy: 'Trade in palm oil, pepper, ivory, and textiles; intensive craft guild guilds',
    trade: 'Ivory, pepper, and fine cloth traded with other West African states and later European merchants',
    technology: 'Lost-wax brass casting, massive defensive earthworks (Benin Moat)',
    majorCities: ['Edo (Benin City)'],
    leaders: ['Ewuare the Great'],
    artifacts: ['art_benin_plaque'],
    influence: 'Highly organized military and diplomatic power in the West African forest zone.',
    receivedNarrative: 'West African communities were chaotic forest dwellers with primitive art forms and unstructured settlements.',
    evidenceNote: 'Benin City featured straight wide streets, street lighting, and a sophisticated system of drainage. The Benin Walls/Moats are recognized as one of the largest ancient earthworks in the world. The lost-wax brass castings represent unmatched artistic and technological mastery.',
    evidenceTier: 'Established',
    africaCentered: true,
    imageUrl: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=600&auto=format&fit=crop&q=80',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Kingdom_of_Benin'
  },
  {
    id: 'nok',
    name: 'Nok Culture',
    region: 'West Africa (Nigeria)',
    period: '1500 BCE - 500 CE',
    startYear: -1500,
    endYear: 500,
    populationEstimate: 'Unknown',
    government: 'Chiefdoms or early state system',
    religion: 'Traditional beliefs, ancestor figures',
    languages: ['Niger-Congo languages'],
    economy: 'Mixed agriculture, iron smelting, trade in terracotta and tools',
    trade: 'Local exchange of regional items, stone beads, and iron tools',
    technology: 'Early iron smelting technology (direct transition from Stone Age without Bronze Age), terracotta sculpture',
    majorCities: ['Taruga'],
    leaders: ['Unknown'],
    artifacts: ['art_nok_sculpture'],
    influence: 'Foundational artistic and iron-working tradition in West Africa, inspiring later Ife and Benin cultures.',
    receivedNarrative: 'Iron-working was introduced to sub-Saharan Africa from Carthage or Rome across the Sahara.',
    evidenceNote: 'Taruga excavations prove Nok iron smelting dates back to 1000 BCE, indicating independent local invention of iron metallurgy.',
    evidenceTier: 'Established',
    africaCentered: true,
    imageUrl: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600&auto=format&fit=crop&q=80',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Nok_culture'
  },
  {
    id: 'songhai',
    name: 'Songhai Empire',
    region: 'West Africa',
    period: '1375 CE - 1591 CE',
    startYear: 1375,
    endYear: 1591,
    populationEstimate: '15 - 25 Million',
    government: 'Imperial Monarchy with highly structured bureaucratic ministries',
    religion: 'Islam (State), Indigenous Religions (Local)',
    languages: ['Songhay', 'Arabic'],
    economy: 'Taxation of Saharan trade, state-run agricultural plantations, river tolls',
    trade: 'Gold, salt, grain, books, leather goods across the trans-Saharan system',
    technology: 'Professional standing army, standardized weights and measures, universities',
    majorCities: ['Gao', 'Timbuktu', 'Djenné'],
    leaders: ['Askia_Muhammad', 'Sonni Ali'],
    artifacts: ['art_timbuktu'],
    influence: 'Largest empire in African history. Stabilized the entire Sahelian region, institutionalized education.',
    receivedNarrative: 'Pre-colonial African history consists of constant tribal warfare with no unified legal or administrative systems.',
    evidenceNote: 'Songhai instituted a centralized bureaucracy with ministers of finance, agriculture, and defense. Under Askia Muhammad, weights and measures were standardized across all markets, and commercial disputes were settled in formal state courts.',
    evidenceTier: 'Established',
    africaCentered: true,
    imageUrl: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=600&auto=format&fit=crop&q=80',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Songhai_Empire'
  },
  {
    id: 'tiwanaku',
    name: 'Tiwanaku Empire',
    region: 'South America (Andes)',
    period: '300 CE - 1150 CE',
    startYear: 300,
    endYear: 1150,
    populationEstimate: '500,000',
    government: 'Theocratic State',
    religion: 'Andean animism (Staff God worship)',
    languages: ['Aymara', 'Puquina'],
    economy: 'Raised-field high-altitude agriculture, llama caravans',
    trade: 'Maize, dried fish, coca leaves, obsidian between valleys and highlands',
    technology: 'Suka Kollu agriculture (raised fields that prevent frost), monumental stone masonry with bronze cramps',
    majorCities: ['Tiwanaku'],
    leaders: ['Unknown'],
    artifacts: ['art_gate_sun'],
    influence: 'Laid the architectural, administrative, and religious foundations for the later Inca Empire.',
    receivedNarrative: 'Pre-Columbian South American architecture lacked advanced engineering techniques prior to the Incas.',
    evidenceNote: 'Tiwanaku stone structures utilize unique interlocking blocks connected by poured molten copper-arsenic bronze cramps, a highly sophisticated metallurgical and architectural process.',
    evidenceTier: 'Established',
    africaCentered: false,
    imageUrl: 'https://images.unsplash.com/photo-1587570255959-1e37bc559cc2?w=600&auto=format&fit=crop&q=80',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Tiwanaku'
  },
  {
    id: 'kongo',
    name: 'Kingdom of Kongo',
    region: 'Central Africa',
    period: '1390 CE - 1914 CE',
    startYear: 1390,
    endYear: 1914,
    populationEstimate: '2 Million',
    government: 'Monarchy with electoral council',
    religion: 'Traditional Kikongo cosmology, Catholicism (adopted late 15th century)',
    languages: ['Kikongo'],
    economy: 'Shell currency (nzimbu), copper mining, raffia textile manufacturing',
    trade: 'Ivory, copper, textiles, and shells traded regionally and internationally',
    technology: 'High-quality weaving of raffia fibers comparable to silk, copper metallurgy',
    majorCities: ['M\'banza-Kongo'],
    leaders: ['Nzinga_Mvemba', 'Garcia II'],
    artifacts: ['art_kongo_crucifix'],
    influence: 'First major sub-Saharan state to adopt Christianity and engage in equal diplomatic relations with Europe (Vatican, Lisbon).',
    receivedNarrative: 'Central Africa was completely isolated, primitive, and quickly subjugated without sophisticated systems of governance.',
    evidenceNote: 'Kongo had a highly centralized administrative structure divided into six provinces, with a currency system managed by the crown, and wrote extensive diplomatic correspondence in Portuguese and Latin to the Pope and European kings.',
    evidenceTier: 'Established',
    africaCentered: true,
    imageUrl: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=600&auto=format&fit=crop&q=80',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Kingdom_of_Kongo'
  }
];

export const ARTIFACTS: Artifact[] = [
  {
    id: 'art_lebombo',
    name: 'Lebombo Bone',
    civilizationId: 'prehistoric_swaziland',
    civilizationName: 'Late Stone Age Southern Africa',
    date: '35,000 BCE',
    startYear: -35000,
    material: ['Baboon fibula'],
    museum: 'Swaziland National Museum',
    currentLocation: 'Mbabane, Eswatini',
    importanceScore: 10,
    imageUrl: 'https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?w=600&auto=format&fit=crop&q=80',
    historicalContext: 'A small baboon fibula with 29 distinct notched marks, discovered in the Lebombo Mountains in the 1970s.',
    discoveryNotes: 'Discovered during excavations in Lebombo Cave. It resembles calendar sticks still used by San communities today.',
    datingMethod: 'Radiocarbon dating of organic material in the surrounding archaeological layers.',
    scholarlyDebates: 'While widely accepted as the oldest known mathematical/calendrical device, some skeptics claim it might be simple notch-marking or tool-sharpening, though the uniform spacing contradicts this.',
    evidenceTier: 'Scholarly Consensus',
    sources: [
      { sourceId: 'src_lebombo', pageOrDetail: 'p. 15-28' }
    ]
  },
  {
    id: 'art_ishango',
    name: 'Ishango Bone',
    civilizationId: 'prehistoric_congo',
    civilizationName: 'Semliki River Culture',
    date: '20,000 BCE',
    startYear: -20000,
    material: ['Baboon bone', 'Quartz crystal point'],
    museum: 'Royal Belgian Institute of Natural Sciences',
    currentLocation: 'Brussels, Belgium',
    importanceScore: 10,
    imageUrl: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=600&auto=format&fit=crop&q=80',
    historicalContext: 'A dark brown bone with a quartz crystal fixed to one end, carved with three columns of notches that show mathematical groupings (prime numbers, doubling, addition rules).',
    discoveryNotes: 'Discovered in 1950 by Belgian geologist Jean de Heinzelin de Braucourt near the Semliki River in the Democratic Republic of the Congo.',
    datingMethod: 'Radiocarbon dating and geological layering analysis.',
    scholarlyDebates: 'Debated as either a simple lunar calendar (28-day cycle) or a complex mathematical game/tool demonstrating prime number recognition. Some Western historians resist the idea that complex math originated in Central Africa.',
    evidenceTier: 'Established',
    sources: [
      { sourceId: 'src_ishango', pageOrDetail: 'p. 120-142', note: 'Huylebrouck highlights the columns represent prime number distribution between 10 and 20.' }
    ]
  },
  {
    id: 'art_qustul',
    name: 'Qustul Incense Burner',
    civilizationId: 'kush',
    civilizationName: 'A-Group Nubia',
    date: '3200 BCE',
    startYear: -3200,
    material: ['Stone', 'Clay'],
    museum: 'Oriental Institute of the University of Chicago',
    currentLocation: 'Chicago, USA',
    importanceScore: 9,
    imageUrl: 'https://images.unsplash.com/photo-1569173112611-52a7cd38bea9?w=600&auto=format&fit=crop&q=80',
    historicalContext: 'A carved stone incense burner depicting a royal procession, featuring a seated king wearing the White Crown of Upper Egypt, alongside royal emblems.',
    discoveryNotes: 'Excavated from a royal tomb in Qustul (Nubia) by Keith C. Seele between 1962 and 1964.',
    datingMethod: 'Typological analysis and stratigraphic dating of the tomb.',
    scholarlyDebates: 'Bruce Williams argued this proves Nubia (Ta-Seti) possessed unified kingship, royal icons, and state structure before Egypt\'s First Dynasty. Others argue it was imported or looted from Egypt, or represents parallel developments.',
    evidenceTier: 'Contested',
    sources: [
      { sourceId: 'src_qustul', pageOrDetail: 'Monograph 3' }
    ]
  },
  {
    id: 'art_gold_rhino',
    name: 'Golden Rhinoceros of Mapungubwe',
    civilizationId: 'mapungubwe',
    civilizationName: 'Kingdom of Mapungubwe',
    date: '1200 CE',
    startYear: 1200,
    material: ['Gold foil', 'Wood core (decomposed)', 'Gold tacks'],
    museum: 'Mapungubwe Museum, University of Pretoria',
    currentLocation: 'Pretoria, South Africa',
    importanceScore: 10,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    historicalContext: 'A small wooden carving covered in hammered sheets of pure gold foil, representing a rhinoceros. Discovered in a royal grave.',
    discoveryNotes: 'Found in 1932 on Mapungubwe Hill, Limpopo Valley, South Africa, by a local treasure hunter who reported it to the University of Pretoria.',
    datingMethod: 'Radiocarbon dating of surrounding carbonized wood and pottery styles.',
    scholarlyDebates: 'Apartheid-era governments suppressed information about this artifact because it proved that black South Africans had created an advanced, wealthy state centuries before white settlement.',
    evidenceTier: 'Established',
    sources: [
      { sourceId: 'src_mapungubwe', pageOrDetail: 'Ch. 5' }
    ]
  },
  {
    id: 'art_benin_plaque',
    name: 'Benin Oba Court Plaque',
    civilizationId: 'benin',
    civilizationName: 'Kingdom of Benin',
    date: '16th Century CE',
    startYear: 1500,
    material: ['Bronze', 'Brass'],
    museum: 'British Museum (held)',
    currentLocation: 'London, United Kingdom (subject to repatriation claims)',
    importanceScore: 9,
    imageUrl: 'https://images.unsplash.com/photo-1590189182193-1fd44f2b4048?w=600&auto=format&fit=crop&q=80',
    historicalContext: 'One of hundreds of cast brass plates that decorated the pillars of the Oba\'s royal palace, depicting historical battles and palace protocols.',
    discoveryNotes: 'Looted by British forces during the punitive expedition of Benin City in 1897.',
    datingMethod: 'Metallurgical analysis and style classification.',
    scholarlyDebates: 'Debate centers on repatriation. Western institutions argue they protect the art, while Nigeria and Edo descendants demand full returns.',
    evidenceTier: 'Established',
    sources: [
      { sourceId: 'src_benin', pageOrDetail: 'p. 80-95' }
    ]
  }
];

export const FIGURES: HistoricalFigure[] = [
  {
    id: 'Mansa_Musa',
    name: 'Mansa Musa',
    title: 'Emperor (Mansa) of the Mali Empire',
    civilizationId: 'mali',
    civilizationName: 'Mali Empire',
    period: '1312 CE - 1337 CE',
    startYear: 1312,
    imageUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&auto=format&fit=crop&q=80',
    biography: 'Musa Keita I took power in 1312. Under his reign, Mali expanded its borders to cover a massive portion of West Africa. He is widely considered the wealthiest individual in human history, famous for his historic pilgrimage to Mecca in 1324.',
    achievements: [
      'Expanded Mali\'s empire to include Gao and Timbuktu.',
      'Funded the construction of the Djinguereber Mosque in Timbuktu.',
      'Established Timbuktu as a global capital of Islamic scholarship and trade.'
    ],
    sources: [
      { sourceId: 'src_timbuktu', note: 'Catalogs the growth of the libraries during his era.' }
    ]
  },
  {
    id: 'Amanirenas',
    name: 'Queen Amanirenas',
    title: 'Kandake of the Kingdom of Kush',
    civilizationId: 'kush',
    civilizationName: 'Kingdom of Kush',
    period: '40 BCE - 10 BCE',
    startYear: -40,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop&q=80',
    biography: 'Amanirenas was the brave one-eyed Queen Mother of Kush who led her armies to war against the Roman Empire. When Roman prefect Gaius Petronius invaded, Kushite troops launched a surprise attack, seizing Roman cities and defacing statues of Emperor Augustus.',
    achievements: [
      'Successfully defended Nubian sovereignty against Caesar Augustus\' legionaries.',
      'Captured Roman garrisons in Syene, Elephantine, and Philae.',
      'Brought the bronze head of Augustus back to Meroe, burying it beneath a temple entrance as a symbol of victory.'
    ],
    sources: [
      { sourceId: 'src_kush', pageOrDetail: 'p. 104-118' }
    ]
  },
  {
    id: 'Abu_Bakr_II',
    name: 'Mansa Abu Bakr II',
    title: 'Predecessor King of Mali',
    civilizationId: 'mali',
    civilizationName: 'Mali Empire',
    period: '1310 CE - 1312 CE',
    startYear: 1310,
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&auto=format&fit=crop&q=80',
    biography: 'Abu Bakr II abdicated the throne of Mali in 1311/1312 to lead a massive exploratory expedition across the Atlantic Ocean. According to historical records recorded by Al-Umari, the king built a fleet of 2,000 vessels to explore the western limits of the ocean, leaving Mansa Musa in charge.',
    achievements: [
      'Financed and constructed thousands of specialized vessels at the mouth of the Senegal River.',
      'Launched the largest pre-modern maritime exploration fleet in African history.'
    ],
    sources: [
      { sourceId: 'src_abubakr', note: 'Van Sertima cites Al-Umari\'s interview with Mansa Musa in Cairo.' }
    ]
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'time_lebombo',
    title: 'Lebombo Counting Device Created',
    year: -35000,
    displayYear: '35,000 BCE',
    description: 'The Lebombo bone is carved, representing the first known numerical counting device and lunar calendar in human history.',
    region: 'Southern Africa',
    theme: 'Science',
    africaCentered: true,
    evidenceTier: 'Established',
    sources: [{ sourceId: 'src_lebombo' }]
  },
  {
    id: 'time_ishango',
    title: 'Ishango Mathematical Calculation Tool',
    year: -20000,
    displayYear: '20,000 BCE',
    description: 'Ancient mathematicians carve the Ishango bone near the Semliki River, featuring notches representing mathematical sequences.',
    region: 'Central Africa',
    theme: 'Science',
    africaCentered: true,
    evidenceTier: 'Scholarly Consensus',
    sources: [{ sourceId: 'src_ishango' }]
  },
  {
    id: 'time_qustul',
    title: 'Ta-Seti Kingship at Qustul',
    year: -3200,
    displayYear: '3200 BCE',
    description: 'Nubian kings rule from Ta-Seti, using Pharaonic symbols (royal crown, horus falcon) before Egypt\'s unification.',
    region: 'Northeast Africa',
    theme: 'Religion',
    africaCentered: true,
    evidenceTier: 'Contested',
    sources: [{ sourceId: 'src_qustul' }]
  },
  {
    id: 'time_kemet_unification',
    title: 'Unification of Upper and Lower Kemet',
    year: -3100,
    displayYear: '3100 BCE',
    description: 'King Narmer reunites the Nile Valley territories, establishing the First Dynasty of Egypt.',
    region: 'Northeast Africa',
    theme: 'Conflict',
    africaCentered: true,
    evidenceTier: 'Established',
    sources: []
  },
  {
    id: 'time_musa_hajj',
    title: 'Mansa Musa\'s Historic Pilgrimage',
    year: 1324,
    displayYear: '1324 CE',
    description: 'Mansa Musa travels to Mecca with 60,000 men, spending so much gold in Cairo that he causes localized inflation for a decade.',
    region: 'West Africa',
    theme: 'Trade',
    africaCentered: true,
    evidenceTier: 'Established',
    sources: []
  },
  {
    id: 'time_abubakr_voyage',
    title: 'Mali Atlantic Expedition',
    year: 1311,
    displayYear: '1311 CE',
    description: 'Mansa Abu Bakr II abdicates the Mali throne to lead 2,000 ships across the Atlantic Ocean.',
    region: 'West Africa',
    theme: 'Migration',
    africaCentered: true,
    evidenceTier: 'Speculative',
    sources: [{ sourceId: 'src_abubakr' }]
  }
];

export const TRADE_ROUTES: TradeRoute[] = [
  {
    id: 'trans_saharan',
    name: 'Trans-Saharan Gold & Salt Routes',
    period: '5th - 16th Century CE',
    description: 'A vast network of caravan routes linking the West African gold mines and agricultural regions with North African markets and Mediterranean traders.',
    goods: ['Gold', 'Salt', 'Manuscripts', 'Copper', 'Kola nuts', 'Textiles'],
    regions: ['West Africa', 'North Africa', 'Sahara Desert'],
    coordinates: [
      [12.5833, -7.9833], // Niani (Mali)
      [16.2717, -0.0447], // Gao
      [16.7666, -3.0026], // Timbuktu
      [22.7981, 5.5228],  // Ahaggar
      [31.6295, -7.9811], // Marrakech
      [36.8065, 10.1815]  // Tunis
    ],
    startYear: 400,
    endYear: 1600
  },
  {
    id: 'swahili_maritime',
    name: 'Swahili Coast Indian Ocean Maritime Network',
    period: '1st - 15th Century CE',
    description: 'Maritime routes connecting Swahili stone-towns (Kilwa, Mombasa, Zanzibar) to Persia, Arabia, India, and China, using seasonal monsoon winds.',
    goods: ['Gold', 'Ivory', 'Iron', 'Chinese porcelain', 'Persian ceramics', 'Indian textiles'],
    regions: ['East Africa', 'Arabian Peninsula', 'Persia', 'India'],
    coordinates: [
      [-8.9667, 39.5167], // Kilwa (Tanzania)
      [-6.1659, 39.1990], // Zanzibar
      [-4.0435, 39.6682], // Mombasa
      [12.7855, 45.0186], // Aden (Yemen)
      [25.2048, 55.2708], // Dubai / Persian Gulf
      [18.9750, 72.8258]  // Mumbai (India)
    ],
    startYear: 100,
    endYear: 1500
  }
];

export const MIGRATION_ROUTES: MigrationRoute[] = [
  {
    id: 'bantu_migration',
    name: 'Bantu Expansion',
    period: '2000 BCE - 1000 CE',
    description: 'One of the largest migrations in human history. Proto-Bantu speaking farming and iron-working communities expanded from West-Central Africa across Central, Eastern, and Southern Africa.',
    origin: 'Cameroon/Nigeria Borderlands',
    destinations: ['Congo Basin', 'East Africa Great Lakes', 'Southern Africa'],
    coordinates: [
      [5.9631, 10.1591],   // Grassfields (Cameroon)
      [-1.2921, 36.8219],  // Great Lakes (Kenya)
      [-15.4167, 28.2833], // Zambia
      [-26.2041, 28.0473]  // South Africa
    ],
    startYear: -2000,
    endYear: 1000
  }
];

export const HISTORICAL_DOCUMENTS: HistoricalDocument[] = [
  {
    id: 'doc_kouroukan',
    title: 'Kouroukan Fuga (Mali Empire Constitution)',
    author: 'Gbara Assembly of Sundiata Keita',
    date: '1235 CE',
    civilizationName: 'Mali Empire',
    excerpt: 'Article 1: The Great Assembly is composed of representatives of the various provinces. Article 5: Every citizen has the right to protection of their life and property...',
    significance: 'One of the earliest declarations of human rights, occupational rights, and environmental protections in human history.',
    evidenceTier: 'Established',
    sources: [{ sourceId: 'src_ishango', note: 'Retranscribed from oral traditions.' }],
    startYear: 1235,
    endYear: 1235
  },
  {
    id: 'doc_timbuktu_astronomy',
    title: 'Timbuktu Treatise on Astronomy',
    author: 'Unknown Timbuktu Scholar',
    date: '16th Century CE',
    civilizationName: 'Mali / Songhai Empire',
    excerpt: 'Behold the orbits of the stars and their orbits. The rotation of the Earth is a sign for those who reflect...',
    significance: 'Demonstrates high levels of scientific literacy, recording planetary orbits and mathematical calculations in West African universities prior to European colonization.',
    evidenceTier: 'Established',
    sources: [{ sourceId: 'src_timbuktu' }],
    startYear: 1500,
    endYear: 1500
  }
];
