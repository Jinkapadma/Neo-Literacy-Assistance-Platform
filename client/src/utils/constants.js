export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', script: 'Latin' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', script: 'Devanagari' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', script: 'Latin' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', script: 'Latin' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', script: 'Bengali' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', script: 'Telugu' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', script: 'Tamil' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', script: 'Devanagari' },
];

export const PROFICIENCY_LEVELS = {
  unassessed: {
    key: 'unassessed',
    label: 'Unassessed',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    description: 'Initial assessment recommended to benchmark reading baseline.',
  },
  beginner: {
    key: 'beginner',
    label: 'Level 1: Novice Reader',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Mastering alphabet, short vowels, and high-frequency 3-letter sight words.',
  },
  elementary: {
    key: 'elementary',
    label: 'Level 2: Elementary Reader',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Reading basic compound words, short sentences, and everyday signs.',
  },
  intermediate: {
    key: 'intermediate',
    label: 'Level 3: Functional Reader',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Understanding multi-paragraph stories, forms, bills, and structured sentences.',
  },
  advanced: {
    key: 'advanced',
    label: 'Level 4: Fluent Reader',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Confident in functional, workplace, and expressive reading and writing.',
  },
};

export const CONTENT_TYPES = [
  { id: 'all', label: 'All Content Types' },
  { id: 'letter_phonics', label: '🔤 Alphabet & Phonics' },
  { id: 'sight_words', label: '👁️ Sight Words' },
  { id: 'sentence_builder', label: '🧩 Sentence Builder' },
  { id: 'short_story', label: '📖 Short Stories' },
  { id: 'functional_text', label: '🏥 Daily Life & Forms' },
];

export const TARGET_SKILLS_OPTIONS = [
  { id: 'phonics', label: 'Alphabet & Letter Sounds' },
  { id: 'vocabulary', label: 'Everyday Words & Vocabulary' },
  { id: 'reading', label: 'Sentence & Story Reading' },
  { id: 'writing', label: 'Spelling & Sentence Formation' },
  { id: 'comprehension', label: 'Understanding Context & Meaning' },
];
