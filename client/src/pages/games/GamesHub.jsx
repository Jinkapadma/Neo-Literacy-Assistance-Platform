import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Gamepad2,
  Sparkles,
  Award,
  RotateCcw,
  Volume2,
  CheckCircle2,
  HelpCircle,
  Flame,
  Zap,
  Clock,
  Layers,
  BrainCircuit,
  ArrowRight,
  Shuffle,
  Smile,
} from 'lucide-react';
import { gamesApi } from '../../api/gamesApi.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useProgress } from '../../context/ProgressContext.jsx';
import { useAccessibility } from '../../hooks/useAccessibility.js';
import { Card } from '../../components/common/Card.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Loader } from '../../components/common/Loader.jsx';
import { useLanguage } from '../../hooks/useLanguage.js';
import { SUPPORTED_LANGUAGES } from '../../utils/constants.js';

// Comprehensive Fallback Repository for 8 Indian Languages
const FALLBACK_GAMES_DATA = {
  scramble: {
    te: [
      { id: 'ws_te_1', targetWord: 'అమ్మ', romanization: 'Amma', meaning: 'Mother (Loving Parent)', scrambledLetters: ['మ్మ', 'అ'], hint: 'The person who gives you unconditional love', audioText: 'అమ్మ' },
      { id: 'ws_te_2', targetWord: 'పుస్తకం', romanization: 'Pusthakam', meaning: 'Book', scrambledLetters: ['కం', 'స్త', 'పు'], hint: 'You read pages from this for knowledge', audioText: 'పుస్తకం' },
      { id: 'ws_te_3', targetWord: 'సూర్యుడు', romanization: 'Suryudu', meaning: 'Sun', scrambledLetters: ['డు', 'సూ', 'ర్యు'], hint: 'Rises in the east and provides sunlight', audioText: 'సూర్యుడు' },
      { id: 'ws_te_4', targetWord: 'బడి', romanization: 'Badi', meaning: 'School', scrambledLetters: ['డి', 'బ'], hint: 'Place where children go to learn and study', audioText: 'బడి' },
    ],
    hi: [
      { id: 'ws_hi_1', targetWord: 'किताब', romanization: 'Kitaab', meaning: 'Book', scrambledLetters: ['ब', 'ता', 'कि'], hint: 'जिसे पढ़कर ज्ञान प्राप्त करते हैं', audioText: 'किताब' },
      { id: 'ws_hi_2', targetWord: 'सूरज', romanization: 'Sooraj', meaning: 'Sun', scrambledLetters: ['ज', 'र', 'सू'], hint: 'सुबह पूर्व दिशा में उगने वाला प्रकाश पुंज', audioText: 'सूरज' },
      { id: 'ws_hi_3', targetWord: 'विद्यालय', romanization: 'Vidyalaya', meaning: 'School', scrambledLetters: ['लय', 'द्या', 'वि'], hint: 'विद्या प्राप्ति का स्थान', audioText: 'विद्यालय' },
    ],
    ta: [
      { id: 'ws_ta_1', targetWord: 'அம்மா', romanization: 'Amma', meaning: 'Mother', scrambledLetters: ['மா', 'அம்'], hint: 'Mother in Tamil', audioText: 'அம்மா' },
      { id: 'ws_ta_2', targetWord: 'புத்தகம்', romanization: 'Puthagam', meaning: 'Book', scrambledLetters: ['கம்', 'த', 'புத்'], hint: 'Printed pages for reading', audioText: 'புத்தகம்' },
      { id: 'ws_ta_3', targetWord: 'பள்ளி', romanization: 'Palli', meaning: 'School', scrambledLetters: ['ளி', 'பள்'], hint: 'Where teachers guide students', audioText: 'பள்ளி' },
    ],
    kn: [
      { id: 'ws_kn_1', targetWord: 'ಅಮ್ಮ', romanization: 'Amma', meaning: 'Mother', scrambledLetters: ['ಮ್ಮ', 'ಅ'], hint: 'Loving parent in Kannada', audioText: 'ಅಮ್ಮ' },
      { id: 'ws_kn_2', targetWord: 'ಪುಸ್ತಕ', romanization: 'Pustaka', meaning: 'Book', scrambledLetters: ['ಕ', 'ಸ್ತ', 'ಪು'], hint: 'Source of knowledge', audioText: 'ಪುಸ್ತಕ' },
      { id: 'ws_kn_3', targetWord: 'ಶಾಲೆ', romanization: 'Shaale', meaning: 'School', scrambledLetters: ['ಲೆ', 'ಶಾ'], hint: 'Educational center', audioText: 'ಶಾಲೆ' },
    ],
    ml: [
      { id: 'ws_ml_1', targetWord: 'അമ്മ', romanization: 'Amma', meaning: 'Mother', scrambledLetters: ['മ്മ', 'അ'], hint: 'Mother in Malayalam', audioText: 'അമ്മ' },
      { id: 'ws_ml_2', targetWord: 'പുസ്തകം', romanization: 'Pusthakam', meaning: 'Book', scrambledLetters: ['കം', 'സ്ത', 'പു'], hint: 'Reading material', audioText: 'പുസ്തകം' },
    ],
    en: [
      { id: 'ws_en_1', targetWord: 'LEARN', romanization: 'Learn', meaning: 'Acquire Knowledge', scrambledLetters: ['R', 'E', 'A', 'N', 'L'], hint: 'To gain skills through study', audioText: 'Learn' },
      { id: 'ws_en_2', targetWord: 'WATER', romanization: 'Water', meaning: 'Life Liquid', scrambledLetters: ['T', 'A', 'E', 'R', 'W'], hint: 'Essential liquid for all life', audioText: 'Water' },
      { id: 'ws_en_3', targetWord: 'SCHOOL', romanization: 'School', meaning: 'Education Center', scrambledLetters: ['O', 'C', 'H', 'S', 'L', 'O'], hint: 'A place where students learn', audioText: 'School' },
    ],
    bn: [
      { id: 'ws_bn_1', targetWord: 'বই', romanization: 'Boi', meaning: 'Book', scrambledLetters: ['ই', 'ব'], hint: 'পড়ার মাধ্যম', audioText: 'বই' },
      { id: 'ws_bn_2', targetWord: 'সূর্য', romanization: 'Surjo', meaning: 'Sun', scrambledLetters: ['র্য', 'সূ'], hint: 'পূর্ব আকাশে আলো দেয়', audioText: 'সূর্য' },
    ],
    mr: [
      { id: 'ws_mr_1', targetWord: 'पुस्तक', romanization: 'Pustak', meaning: 'Book', scrambledLetters: ['क', 'स्त', 'पु'], hint: 'वाचनाचे साधन', audioText: 'पुस्तक' },
      { id: 'ws_mr_2', targetWord: 'शाळा', romanization: 'Shaala', meaning: 'School', scrambledLetters: ['ळा', 'शा'], hint: 'शिक्षणाचे ठिकाण', audioText: 'शाळा' },
    ],
  },
  memory: {
    te: [
      { id: 1, text: 'అమ్మ', pairId: 101, type: 'glyph', audio: 'అమ్మ' },
      { id: 101, text: 'Mother (Parent)', pairId: 1, type: 'meaning' },
      { id: 2, text: 'ఆవు', pairId: 102, type: 'glyph', audio: 'ఆవు' },
      { id: 102, text: 'Cow (Milk giver)', pairId: 2, type: 'meaning' },
      { id: 3, text: 'కలం', pairId: 103, type: 'glyph', audio: 'కలం' },
      { id: 103, text: 'Pen (Writing tool)', pairId: 3, type: 'meaning' },
      { id: 4, text: 'చెట్టు', pairId: 104, type: 'glyph', audio: 'చెట్టు' },
      { id: 104, text: 'Tree (Nature)', pairId: 4, type: 'meaning' },
    ],
    hi: [
      { id: 1, text: 'माता / माँ', pairId: 101, type: 'glyph', audio: 'माँ' },
      { id: 101, text: 'Mother', pairId: 1, type: 'meaning' },
      { id: 2, text: 'गाय', pairId: 102, type: 'glyph', audio: 'गाय' },
      { id: 102, text: 'Cow', pairId: 2, type: 'meaning' },
      { id: 3, text: 'कलम', pairId: 103, type: 'glyph', audio: 'कलम' },
      { id: 103, text: 'Pen', pairId: 3, type: 'meaning' },
      { id: 4, text: 'पेड़', pairId: 104, type: 'glyph', audio: 'पेड़' },
      { id: 104, text: 'Tree', pairId: 4, type: 'meaning' },
    ],
    ta: [
      { id: 1, text: 'அம்மா', pairId: 101, type: 'glyph', audio: 'அம்மா' },
      { id: 101, text: 'Mother', pairId: 1, type: 'meaning' },
      { id: 2, text: 'பசு', pairId: 102, type: 'glyph', audio: 'பசு' },
      { id: 102, text: 'Cow', pairId: 2, type: 'meaning' },
      { id: 3, text: 'மரம்', pairId: 103, type: 'glyph', audio: 'மரம்' },
      { id: 103, text: 'Tree', pairId: 3, type: 'meaning' },
    ],
    kn: [
      { id: 1, text: 'ಅಮ್ಮ', pairId: 101, type: 'glyph', audio: 'ಅಮ್ಮ' },
      { id: 101, text: 'Mother', pairId: 1, type: 'meaning' },
      { id: 2, text: 'ಹಸು', pairId: 102, type: 'glyph', audio: 'ಹಸು' },
      { id: 102, text: 'Cow', pairId: 2, type: 'meaning' },
      { id: 3, text: 'ಮರ', pairId: 103, type: 'glyph', audio: 'ಮರ' },
      { id: 103, text: 'Tree', pairId: 3, type: 'meaning' },
    ],
    ml: [
      { id: 1, text: 'അമ്മ', pairId: 101, type: 'glyph', audio: 'അമ്മ' },
      { id: 101, text: 'Mother', pairId: 1, type: 'meaning' },
      { id: 2, text: 'പശു', pairId: 102, type: 'glyph', audio: 'പശു' },
      { id: 102, text: 'Cow', pairId: 2, type: 'meaning' },
    ],
    en: [
      { id: 1, text: 'Mother', pairId: 101, type: 'glyph', audio: 'Mother' },
      { id: 101, text: 'Loving Parent', pairId: 1, type: 'meaning' },
      { id: 2, text: 'Book', pairId: 102, type: 'glyph', audio: 'Book' },
      { id: 102, text: 'Pages for Reading', pairId: 2, type: 'meaning' },
      { id: 3, text: 'Tree', pairId: 103, type: 'glyph', audio: 'Tree' },
      { id: 103, text: 'Green plant with wood trunk', pairId: 3, type: 'meaning' },
    ],
    bn: [
      { id: 1, text: 'মা', pairId: 101, type: 'glyph', audio: 'মা' },
      { id: 101, text: 'Mother', pairId: 1, type: 'meaning' },
      { id: 2, text: 'বই', pairId: 102, type: 'glyph', audio: 'বই' },
      { id: 102, text: 'Book', pairId: 2, type: 'meaning' },
    ],
    mr: [
      { id: 1, text: 'आई', pairId: 101, type: 'glyph', audio: 'आई' },
      { id: 101, text: 'Mother', pairId: 1, type: 'meaning' },
      { id: 2, text: 'झाड', pairId: 102, type: 'glyph', audio: 'झाड' },
      { id: 102, text: 'Tree', pairId: 2, type: 'meaning' },
    ],
  },
  quiz: {
    te: [
      { id: 'sq_te_1', prompt: '‘ఆవు’ అనే పదంలో మొదటి అక్షరం ఏమిటి?', options: ['అ', 'ఆ', 'ఇ', 'ఈ'], correctAnswer: 'ఆ', audioText: 'ఆవు అనే పదంలో మొదటి అక్షరం ఏమిటి?' },
      { id: 'sq_te_2', prompt: '‘మంచి పుస్తకం’ అంటే ఏమిటి?', options: ['చెడ్డది', 'మంచి మిత్రుడు', 'ఆహారం', 'నీరు'], correctAnswer: 'మంచి మిత్రుడు', audioText: 'మంచి పుస్తకం అంటే ఏమిటి?' },
      { id: 'sq_te_3', prompt: 'సూర్యుడు ఎటువైపున ఉదయిస్తాడు?', options: ['పడమర', 'తూర్పు', 'ఉత్తరం', 'దక్షిణం'], correctAnswer: 'తూర్పు', audioText: 'సూర్యుడు ఎటువైపున ఉదయిస్తాడు?' },
    ],
    hi: [
      { id: 'sq_hi_1', prompt: '‘किताब’ शब्द का सही अर्थ क्या है?', options: ['पुस्तक', 'कलम', 'पेड़', 'पानी'], correctAnswer: 'पुस्तक', audioText: 'किताब शब्द का सही अर्थ क्या है?' },
      { id: 'sq_hi_2', prompt: 'सूरज किस दिशा में उगता है?', options: ['पश्चिम', 'पूर्व', 'उत्तर', 'दक्षिण'], correctAnswer: 'पूर्व', audioText: 'सूरज किस दिशा में उगता है?' },
    ],
    ta: [
      { id: 'sq_ta_1', prompt: '‘அம்மா’ என்ற சொல்லின் முதல் எழுத்து எது?', options: ['ஆ', 'அ', 'இ', 'ஈ'], correctAnswer: 'அ', audioText: 'அம்மா என்ற சொல்லின் முதல் எழுத்து எது?' },
      { id: 'sq_ta_2', prompt: 'பசு நமக்கு என்ன தருகிறது?', options: ['நீர்', 'பால்', 'மரம்', 'கனி'], correctAnswer: 'பால்', audioText: 'பசு நமக்கு என்ன தருகிறது?' },
    ],
    kn: [
      { id: 'sq_kn_1', prompt: '‘ಹಸು’ ನಮಗೆ ಏನು ನೀಡುತ್ತದೆ?', options: ['ಹಾಲು', 'ಹಣ್ಣು', 'ನೀರು', 'ಮಣ್ಣು'], correctAnswer: 'ಹಾಲು', audioText: 'ಹಸು ನಮಗೆ ಏನು ನೀಡುತ್ತದೆ?' },
    ],
    ml: [
      { id: 'sq_ml_1', prompt: '‘പശു’ നമുക്ക് എന്ത് നൽകുന്നു?', options: ['പാൽ', 'വെള്ളം', 'മണ്ണ്', 'പഴം'], correctAnswer: 'പാൽ', audioText: 'പശു നമുക്ക് എന്ത് നൽകുന്നു?' },
    ],
    en: [
      { id: 'sq_en_1', prompt: 'Which word is the opposite of ‘Slow’?', options: ['Quiet', 'Fast', 'Heavy', 'Cold'], correctAnswer: 'Fast', audioText: 'Which word is the opposite of Slow?' },
      { id: 'sq_en_2', prompt: 'What do trees produce that helps us breathe?', options: ['Carbon', 'Oxygen', 'Sand', 'Steam'], correctAnswer: 'Oxygen', audioText: 'What do trees produce that helps us breathe?' },
    ],
    bn: [
      { id: 'sq_bn_1', prompt: 'গরু আমাদের কী দেয়?', options: ['দুধ', 'জল', 'ফল', 'ফুল'], correctAnswer: 'দুধ', audioText: 'গরু আমাদের কী দেয়?' },
    ],
    mr: [
      { id: 'sq_mr_1', prompt: 'गाय आपल्याला काय देते?', options: ['दूध', 'पाणी', 'फळ', 'फुल'], correctAnswer: 'दूध', audioText: 'गाय आपल्याला काय देते?' },
    ],
  },
  builder: {
    te: [
      { id: 'sb_te_1', correctSentence: 'ఆవు మనకు పాలు ఇస్తుంది', tiles: ['ఇస్తుంది', 'ఆవు', 'పాలు', 'మనకు'], translation: 'The cow gives us milk', hint: 'Subject (ఆవు) comes first, verb (ఇస్తుంది) at the end' },
      { id: 'sb_te_2', correctSentence: 'నేను ప్రతిరోజూ పుస్తకం చదువుతాను', tiles: ['చదువుతాను', 'నేను', 'పుస్తకం', 'ప్రతిరోజూ'], translation: 'I read a book everyday', hint: 'Start with నేను (I) and end with చదువుతాను (read)' },
    ],
    hi: [
      { id: 'sb_hi_1', correctSentence: 'गाय हमें मीठा दूध देती है', tiles: ['देती है', 'गाय', 'दूध', 'हमें', 'मीठा'], translation: 'The cow gives us sweet milk', hint: 'Subject (गाय) comes first, verb (देती है) at the end' },
      { id: 'sb_hi_2', correctSentence: 'रोहन प्रतिदिन विद्यालय जाता है', tiles: ['जाता है', 'विद्यालय', 'रोहन', 'प्रतिदिन'], translation: 'Rohan goes to school everyday', hint: 'Start with रोहन and end with जाता है' },
    ],
    ta: [
      { id: 'sb_ta_1', correctSentence: 'பசு நமக்கு பால் தருகிறது', tiles: ['தருகிறது', 'பசு', 'பால்', 'நமக்கு'], translation: 'The cow gives us milk', hint: 'Subject (பசு) comes first' },
    ],
    kn: [
      { id: 'sb_kn_1', correctSentence: 'ಹಸು ನಮಗೆ ಹಾಲು ನೀಡುತ್ತದೆ', tiles: ['ನೀಡುತ್ತದೆ', 'ಹಸು', 'ಹಾಲು', 'ನಮಗೆ'], translation: 'The cow gives us milk', hint: 'Start with ಹಸು and end with ನೀಡುತ್ತದೆ' },
    ],
    ml: [
      { id: 'sb_ml_1', correctSentence: 'പശു നമുക്ക് പാൽ തരുന്നു', tiles: ['തരുന്നു', 'പശു', 'പാൽ', 'നമുക്ക്'], translation: 'The cow gives us milk', hint: 'Subject (പശു) comes first' },
    ],
    en: [
      { id: 'sb_en_1', correctSentence: 'The sun rises in the east', tiles: ['rises', 'The sun', 'the east', 'in'], translation: 'Universal truth sentence', hint: 'Subject-Verb-Preposition-Object order' },
    ],
    bn: [
      { id: 'sb_bn_1', correctSentence: 'গরু আমাদের পুষ্টিকর দুধ দেয়', tiles: ['দেয়', 'গরু', 'দুধ', 'আমাদের', 'পুষ্টিকর'], translation: 'The cow gives us nutritious milk', hint: 'Start with গরু and end with দেয়' },
    ],
    mr: [
      { id: 'sb_mr_1', correctSentence: 'गाय आपल्याला गोड दूध देते', tiles: ['देते', 'गाय', 'दूध', 'आपल्याला', 'गोड'], translation: 'The cow gives us sweet milk', hint: 'Start with गाय and end with देते' },
    ],
  },
};

export const GamesHub = () => {
  const { user } = useAuth();
  const { progress, recordGameWin } = useProgress();
  const { speakText } = useAccessibility();
  const { learningLanguage, interfaceLanguage, learningLangMeta, interfaceLangMeta, t } = useLanguage();

  const [activeTab, setActiveTab] = useState('scramble'); // 'scramble' | 'memory' | 'quiz' | 'builder'
  const [selectedLanguage, setSelectedLanguage] = useState(learningLanguage || 'te');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (learningLanguage) {
      setSelectedLanguage(learningLanguage);
    }
  }, [learningLanguage]);

  // 1. Word Scramble State
  const [scramblePuzzles, setScramblePuzzles] = useState([]);
  const [currentScrambleIdx, setCurrentScrambleIdx] = useState(0);
  const [scrambleSelectedLetters, setScrambleSelectedLetters] = useState([]);
  const [scrambleCompleted, setScrambleCompleted] = useState(false);

  // 2. Memory Match State
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [movesCount, setMovesCount] = useState(0);

  // 3. Speed Quiz State
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // 4. Sentence Builder State
  const [builderPuzzles, setBuilderPuzzles] = useState([]);
  const [currentBuilderIdx, setCurrentBuilderIdx] = useState(0);
  const [selectedBuilderTiles, setSelectedBuilderTiles] = useState([]);
  const [builderFeedback, setBuilderFeedback] = useState(null);

  useEffect(() => {
    loadGameData();
  }, [activeTab, selectedLanguage]);

  const loadGameData = async () => {
    setLoading(true);
    const lang = selectedLanguage || 'te';
    try {
      if (activeTab === 'scramble') {
        const fallback = FALLBACK_GAMES_DATA.scramble[lang] || FALLBACK_GAMES_DATA.scramble.te;
        let list = fallback;
        try {
          const res = await gamesApi.getWordScramblePuzzles({ language: lang });
          if (res?.data?.puzzles && res.data.puzzles.length > 0) {
            list = res.data.puzzles;
          }
        } catch {
          // Use fallback
        }
        setScramblePuzzles(list);
        setCurrentScrambleIdx(0);
        setScrambleSelectedLetters([]);
        setScrambleCompleted(false);
      } else if (activeTab === 'memory') {
        const fallback = FALLBACK_GAMES_DATA.memory[lang] || FALLBACK_GAMES_DATA.memory.te;
        let cards = [...fallback].sort(() => Math.random() - 0.5);
        try {
          const res = await gamesApi.getMemoryMatchCards({ language: lang });
          if (res?.data?.cards && res.data.cards.length > 0) {
            cards = res.data.cards;
          }
        } catch {
          // Use fallback
        }
        setMemoryCards(cards);
        setFlippedCards([]);
        setMatchedPairs([]);
        setMovesCount(0);
      } else if (activeTab === 'quiz') {
        const fallback = FALLBACK_GAMES_DATA.quiz[lang] || FALLBACK_GAMES_DATA.quiz.te;
        let questions = fallback;
        try {
          const res = await gamesApi.getSpeedQuizQuestions({ language: lang });
          if (res?.data?.questions && res.data.questions.length > 0) {
            questions = res.data.questions;
          }
        } catch {
          // Use fallback
        }
        setQuizQuestions(questions);
        setCurrentQuizIdx(0);
        setQuizScore(0);
        setQuizFinished(false);
      } else if (activeTab === 'builder') {
        const fallback = FALLBACK_GAMES_DATA.builder[lang] || FALLBACK_GAMES_DATA.builder.te;
        let puzzles = fallback;
        try {
          const res = await gamesApi.getSentenceBuilderPuzzles({ language: lang });
          if (res?.data?.puzzles && res.data.puzzles.length > 0) {
            puzzles = res.data.puzzles;
          }
        } catch {
          // Use fallback
        }
        setBuilderPuzzles(puzzles);
        setCurrentBuilderIdx(0);
        setSelectedBuilderTiles([]);
        setBuilderFeedback(null);
      }
    } catch (err) {
      console.error('Failed to load game data:', err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // SCRAMBLE LOGIC
  // ----------------------------------------------------
  const currentScramble = scramblePuzzles[currentScrambleIdx];

  const handleTileClick = letter => {
    if (scrambleSelectedLetters.includes(letter)) {
      setScrambleSelectedLetters(scrambleSelectedLetters.filter(l => l !== letter));
    } else {
      const nextArr = [...scrambleSelectedLetters, letter];
      setScrambleSelectedLetters(nextArr);

      // Check if complete
      if (nextArr.join('') === currentScramble.targetWord) {
        toast.success(`🎉 Correct! You built "${currentScramble.targetWord}" (+25 XP)`);
        recordGameWin('word_scramble', 25);
        gamesApi.recordGameCompletion({ gameType: 'word_scramble', xpEarned: 25, score: 100 });
        setScrambleCompleted(true);
      }
    }
  };

  const nextScramblePuzzle = () => {
    if (currentScrambleIdx + 1 < scramblePuzzles.length) {
      setCurrentScrambleIdx(prev => prev + 1);
      setScrambleSelectedLetters([]);
      setScrambleCompleted(false);
    } else {
      toast.success('🏆 All scramble puzzles completed!');
    }
  };

  // ----------------------------------------------------
  // MEMORY MATCH LOGIC
  // ----------------------------------------------------
  const handleMemoryCardClick = card => {
    if (flippedCards.length === 2 || flippedCards.some(c => c.id === card.id) || matchedPairs.includes(card.id)) {
      return;
    }

    if (card.audio) {
      speakText(card.audio, selectedLanguage);
    }

    const nextFlipped = [...flippedCards, card];
    setFlippedCards(nextFlipped);

    if (nextFlipped.length === 2) {
      setMovesCount(prev => prev + 1);
      const [first, second] = nextFlipped;

      if (first.pairId === second.id || second.pairId === first.id) {
        setMatchedPairs(prev => [...prev, first.id, second.id]);
        setFlippedCards([]);
        toast.success('✨ Pair Matched!');

        if (matchedPairs.length + 2 >= memoryCards.length && memoryCards.length > 0) {
          toast.success('🏆 You matched all memory pairs! (+30 XP)');
          recordGameWin('memory_match', 30);
          gamesApi.recordGameCompletion({ gameType: 'memory_match', xpEarned: 30, score: 100 });
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // ----------------------------------------------------
  // SPEED QUIZ LOGIC
  // ----------------------------------------------------
  const currentQuiz = quizQuestions[currentQuizIdx];

  const handleQuizAnswer = option => {
    const isCorrect = option === currentQuiz.correctAnswer;
    if (isCorrect) {
      setQuizScore(prev => prev + 10);
      toast.success('🎯 Correct!');
    } else {
      toast.error(`Incorrect. Correct answer was: ${currentQuiz.correctAnswer}`);
    }

    if (currentQuizIdx + 1 < quizQuestions.length) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
      const xp = (quizScore + (isCorrect ? 10 : 0)) * 2;
      recordGameWin('speed_quiz', xp);
      gamesApi.recordGameCompletion({ gameType: 'speed_quiz', xpEarned: xp, score: quizScore });
    }
  };

  // ----------------------------------------------------
  // SENTENCE BUILDER LOGIC
  // ----------------------------------------------------
  const currentBuilder = builderPuzzles[currentBuilderIdx];

  const handleBuilderTileClick = tile => {
    if (selectedBuilderTiles.includes(tile)) {
      setSelectedBuilderTiles(selectedBuilderTiles.filter(t => t !== tile));
      setBuilderFeedback(null);
    } else {
      setSelectedBuilderTiles([...selectedBuilderTiles, tile]);
      setBuilderFeedback(null);
    }
  };

  const handleCheckSentence = () => {
    const formedSentence = selectedBuilderTiles.join(' ');
    if (formedSentence === currentBuilder.correctSentence) {
      setBuilderFeedback({ correct: true, message: '🎉 Perfect Sentence Structure! (+25 XP)' });
      speakText(formedSentence, selectedLanguage);
      recordGameWin('sentence_builder', 25);
      gamesApi.recordGameCompletion({ gameType: 'sentence_builder', xpEarned: 25, score: 100 });
    } else {
      setBuilderFeedback({ correct: false, message: 'Incorrect word order. Check grammatical placement.' });
    }
  };

  return (
    <div className="space-y-8 pb-12 text-white">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/70 border border-white/20 p-8 text-white shadow-2xl backdrop-blur-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/30 border border-brand-400/30 text-brand-200 text-xs font-bold">
              <Gamepad2 className="w-4 h-4 text-brand-300" />
              <span>MULTILINGUAL LITERACY GAMES & PUZZLES</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Language Play Arena
            </h1>
            <p className="text-slate-200 max-w-2xl text-xs sm:text-sm leading-relaxed">
              Reinforce orthographic spelling, sentence syntax, and memory retention through interactive
              multilingual games across 8 Indian languages.
            </p>
          </div>

          {/* Language Selector & XP Tracker */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="text-xs font-bold px-3 py-2.5 rounded-xl bg-slate-950/80 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code} className="text-slate-900">
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-bold shadow-sm">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{progress.totalXp} XP</span>
            </div>
          </div>
        </div>

        {/* Game Mode Selector Navigation */}
        <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-white/10">
          {[
            { id: 'scramble', label: '🔤 Word Scramble', icon: Shuffle },
            { id: 'memory', label: '🃏 Memory Cards', icon: Layers },
            { id: 'quiz', label: '⚡ Speed Literacy Quiz', icon: Zap },
            { id: 'builder', label: '🧩 Sentence Builder', icon: BrainCircuit },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/30 scale-[1.02] border border-white/20'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader size="lg" />
          <p className="text-white font-bold text-sm">Loading Multilingual Game Arena...</p>
        </div>
      ) : (
        /* GAME ARENA CONTAINER */
        <div className="max-w-4xl mx-auto">
          {/* ==================================================== */}
          {/* 1. WORD SCRAMBLE / GLYPH PUZZLE */}
          {/* ==================================================== */}
          {activeTab === 'scramble' && currentScramble && (
            <Card className="p-8 border border-white/20 shadow-2xl space-y-8 text-center bg-slate-900/70 backdrop-blur-2xl rounded-3xl text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <Badge variant="primary">Word Scramble</Badge>
                <span className="text-xs font-bold text-amber-300">
                  Puzzle {currentScrambleIdx + 1} of {scramblePuzzles.length}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Target Meaning</p>
                <h3 className="text-2xl font-black text-white">{currentScramble.meaning}</h3>
                <p className="text-xs text-brand-300 font-semibold">💡 Hint: {currentScramble.hint}</p>
              </div>

              {/* Formed Word Stage */}
              <div className="p-6 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 min-h-[90px] flex items-center justify-center gap-3 flex-wrap backdrop-blur-md">
                {scrambleSelectedLetters.length > 0 ? (
                  scrambleSelectedLetters.map((char, i) => (
                    <button
                      key={i}
                      onClick={() => handleTileClick(char)}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-2xl font-black shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all border border-white/20"
                    >
                      {char}
                    </button>
                  ))
                ) : (
                  <span className="text-sm font-semibold text-slate-300">
                    Click the scrambled glyph tiles below to assemble the word in order
                  </span>
                )}
              </div>

              {/* Scrambled Character Tiles */}
              <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
                {currentScramble.scrambledLetters.map((char, i) => {
                  const isUsed = scrambleSelectedLetters.includes(char);
                  return (
                    <button
                      key={i}
                      disabled={isUsed}
                      onClick={() => handleTileClick(char)}
                      className={`px-6 py-4 rounded-2xl text-2xl font-black border transition-all cursor-pointer ${
                        isUsed
                          ? 'bg-white/5 border-white/10 text-slate-500 opacity-40 cursor-not-allowed'
                          : 'bg-white/15 hover:bg-white/25 border-white/20 text-white shadow-lg hover:border-brand-400 active:scale-95'
                      }`}
                    >
                      {char}
                    </button>
                  );
                })}
              </div>

              {/* Action Controls */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  onClick={() => speakText(currentScramble.audioText, selectedLanguage)}
                >
                  <Volume2 className="w-4 h-4 mr-1.5 text-brand-300" />
                  Listen Pronunciation
                </Button>

                {scrambleCompleted && (
                  <Button variant="primary" size="sm" onClick={nextScramblePuzzle}>
                    Next Puzzle <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* ==================================================== */}
          {/* 2. MEMORY MATCH CARDS */}
          {/* ==================================================== */}
          {activeTab === 'memory' && (
            <Card className="p-8 border border-white/20 shadow-2xl space-y-6 bg-slate-900/70 backdrop-blur-2xl rounded-3xl text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <Badge variant="primary">Memory Match</Badge>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-200">
                  <span>Moves: {movesCount}</span>
                  <span className="text-emerald-300 font-extrabold">
                    Matched: {matchedPairs.length / 2} / {memoryCards.length / 2}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {memoryCards.map(card => {
                  const isFlipped = flippedCards.some(c => c.id === card.id) || matchedPairs.includes(card.id);
                  const isMatched = matchedPairs.includes(card.id);

                  return (
                    <div
                      key={card.id}
                      onClick={() => handleMemoryCardClick(card)}
                      className={`h-32 rounded-2xl border-2 flex items-center justify-center text-center p-3 font-bold transition-all duration-300 cursor-pointer select-none backdrop-blur-md ${
                        isMatched
                          ? 'bg-emerald-600/40 border-emerald-400 text-white shadow-lg opacity-90'
                          : isFlipped
                          ? 'bg-gradient-to-r from-brand-600 to-indigo-600 border-white/40 text-white shadow-xl scale-105'
                          : 'bg-white/10 border-white/15 text-transparent hover:border-white/30 hover:bg-white/15'
                      }`}
                    >
                      {isFlipped || isMatched ? (
                        <div className="space-y-1">
                          <p className="text-base sm:text-lg font-black text-white">
                            {card.text}
                          </p>
                          {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-300 mx-auto" />}
                        </div>
                      ) : (
                        <Sparkles className="w-6 h-6 text-amber-300/60" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center pt-4">
                <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20" onClick={loadGameData}>
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  Restart Game Deck
                </Button>
              </div>
            </Card>
          )}

          {/* ==================================================== */}
          {/* 3. SPEED LITERACY QUIZ */}
          {/* ==================================================== */}
          {activeTab === 'quiz' && currentQuiz && !quizFinished && (
            <Card className="p-8 border border-white/20 shadow-2xl space-y-6 bg-slate-900/70 backdrop-blur-2xl rounded-3xl text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <Badge variant="primary">Speed Literacy Quiz</Badge>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-slate-300">Q {currentQuizIdx + 1}/{quizQuestions.length}</span>
                  <span className="text-amber-300 font-extrabold flex items-center gap-1">
                    <Flame className="w-4 h-4" /> {quizScore} pts
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-center py-4">
                <h3 className="text-2xl font-black text-white leading-snug">{currentQuiz.prompt}</h3>
                <button
                  onClick={() => speakText(currentQuiz.audioText, selectedLanguage)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-amber-300 hover:text-white border border-white/15 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-brand-300" />
                  <span>Audio Prompt</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQuiz.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(opt)}
                    className="p-4 rounded-2xl border border-white/15 bg-white/10 hover:bg-brand-600/40 hover:border-brand-400 font-bold text-base sm:text-lg text-white text-left transition-all active:scale-98 cursor-pointer flex items-center gap-3 backdrop-blur-md"
                  >
                    <span className="w-7 h-7 rounded-xl bg-white/15 text-white flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'quiz' && quizFinished && (
            <Card className="p-10 text-center space-y-6 border border-white/20 shadow-2xl max-w-lg mx-auto bg-slate-900/80 backdrop-blur-2xl rounded-3xl text-white">
              <div className="w-20 h-20 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Speed Quiz Completed!</h2>
                <p className="text-sm text-slate-200">
                  You earned <span className="font-bold text-amber-300">{quizScore * 2} XP</span> across {quizQuestions.length} vocabulary rounds.
                </p>
              </div>
              <Button variant="primary" onClick={loadGameData} className="w-full font-bold">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Another Round
              </Button>
            </Card>
          )}

          {/* ==================================================== */}
          {/* 4. SENTENCE BUILDER PUZZLE */}
          {/* ==================================================== */}
          {activeTab === 'builder' && currentBuilder && (
            <Card className="p-8 border border-white/20 shadow-2xl space-y-8 bg-slate-900/70 backdrop-blur-2xl rounded-3xl text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <Badge variant="primary">Sentence Builder</Badge>
                <span className="text-xs font-bold text-amber-300">
                  Puzzle {currentBuilderIdx + 1} of {builderPuzzles.length}
                </span>
              </div>

              <div className="space-y-2 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-300">English Translation</p>
                <h3 className="text-xl font-bold text-white">"{currentBuilder.translation}"</h3>
                <p className="text-xs text-brand-300 font-semibold">💡 Clue: {currentBuilder.hint}</p>
              </div>

              {/* Drop/Constructed Sentence Stage */}
              <div className="p-6 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 min-h-[90px] flex items-center justify-center gap-3 flex-wrap backdrop-blur-md">
                {selectedBuilderTiles.length > 0 ? (
                  selectedBuilderTiles.map((tile, i) => (
                    <button
                      key={i}
                      onClick={() => handleBuilderTileClick(tile)}
                      className="px-5 py-3 rounded-2xl bg-indigo-600 text-white text-lg font-bold shadow-md cursor-pointer hover:bg-indigo-700 transition-colors border border-white/20"
                    >
                      {tile}
                    </button>
                  ))
                ) : (
                  <span className="text-sm font-semibold text-slate-300">
                    Click word tiles below in the correct sentence order
                  </span>
                )}
              </div>

              {/* Word Tiles to Choose From */}
              <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
                {currentBuilder.tiles.map((tile, i) => {
                  const isUsed = selectedBuilderTiles.includes(tile);
                  return (
                    <button
                      key={i}
                      disabled={isUsed}
                      onClick={() => handleBuilderTileClick(tile)}
                      className={`px-5 py-3 rounded-2xl text-lg font-bold border transition-all cursor-pointer ${
                        isUsed
                          ? 'bg-white/5 border-white/10 text-slate-500 opacity-40 cursor-not-allowed'
                          : 'bg-white/15 hover:bg-white/25 border-white/20 text-white shadow-sm hover:border-brand-400 active:scale-95'
                      }`}
                    >
                      {tile}
                    </button>
                  );
                })}
              </div>

              {builderFeedback && (
                <div
                  className={`p-4 rounded-2xl text-xs font-bold text-center ${
                    builderFeedback.correct
                      ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-400/40'
                      : 'bg-rose-600/30 text-rose-200 border border-rose-400/40'
                  }`}
                >
                  {builderFeedback.message}
                </div>
              )}

              <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
                <Button variant="primary" size="md" onClick={handleCheckSentence}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Check Sentence
                </Button>

                {builderFeedback?.correct && currentBuilderIdx + 1 < builderPuzzles.length && (
                  <Button
                    variant="outline"
                    size="md"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    onClick={() => {
                      setCurrentBuilderIdx(prev => prev + 1);
                      setSelectedBuilderTiles([]);
                      setBuilderFeedback(null);
                    }}
                  >
                    Next Sentence <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
