/**
 * Multilingual Literacy Games, Quizzes & Puzzles Service
 * Supporting 8 Indian languages: te, ta, kn, ml, hi, en, bn, mr
 */

export class GamesService {
  /**
   * Word Scramble Puzzles: Letters are scrambled and learner must construct the word
   */
  static getWordScramblePuzzles(language = 'te', difficulty = 'beginner') {
    const repository = {
      te: [
        {
          id: 'ws_te_1',
          targetWord: 'అమ్మ',
          romanization: 'Amma',
          meaning: 'Mother',
          scrambledLetters: ['మ్మ', 'అ'],
          hint: 'The person who gives you unconditional love',
          audioText: 'అమ్మ',
        },
        {
          id: 'ws_te_2',
          targetWord: 'పుస్తకం',
          romanization: 'Pusthakam',
          meaning: 'Book',
          scrambledLetters: ['కం', 'స్త', 'పు'],
          hint: 'You read pages from this for knowledge',
          audioText: 'పుస్తకం',
        },
        {
          id: 'ws_te_3',
          targetWord: 'సూర్యుడు',
          romanization: 'Suryudu',
          meaning: 'Sun',
          scrambledLetters: ['డు', 'సూ', 'ర్యు'],
          hint: 'Rises in the east and provides sunlight',
          audioText: 'సూర్యుడు',
        },
        {
          id: 'ws_te_4',
          targetWord: 'బడి',
          romanization: 'Badi',
          meaning: 'School',
          scrambledLetters: ['డి', 'బ'],
          hint: 'Place where children go to learn and study',
          audioText: 'బడి',
        },
      ],
      ta: [
        {
          id: 'ws_ta_1',
          targetWord: 'அம்மா',
          romanization: 'Amma',
          meaning: 'Mother',
          scrambledLetters: ['மா', 'அம்'],
          hint: 'Mother in Tamil',
          audioText: 'அம்மா',
        },
        {
          id: 'ws_ta_2',
          targetWord: 'புத்தகம்',
          romanization: 'Puthagam',
          meaning: 'Book',
          scrambledLetters: ['கம்', 'த', 'புத்'],
          hint: 'Source of knowledge with printed pages',
          audioText: 'புத்தகம்',
        },
        {
          id: 'ws_ta_3',
          targetWord: 'பள்ளி',
          romanization: 'Palli',
          meaning: 'School',
          scrambledLetters: ['ளி', 'பள்'],
          hint: 'Where teachers guide students',
          audioText: 'பள்ளி',
        },
      ],
      kn: [
        {
          id: 'ws_kn_1',
          targetWord: 'ಅಮ್ಮ',
          romanization: 'Amma',
          meaning: 'Mother',
          scrambledLetters: ['ಮ್ಮ', 'ಅ'],
          hint: 'Loving parent',
          audioText: 'ಅಮ್ಮ',
        },
        {
          id: 'ws_kn_2',
          targetWord: 'ಪುಸ್ತಕ',
          romanization: 'Pustaka',
          meaning: 'Book',
          scrambledLetters: ['ಕ', 'ಸ್ತ', 'ಪು'],
          hint: 'Printed literature or notebook',
          audioText: 'ಪುಸ್ತಕ',
        },
        {
          id: 'ws_kn_3',
          targetWord: 'ಶಾಲೆ',
          romanization: 'Shaale',
          meaning: 'School',
          scrambledLetters: ['ಲೆ', 'ಶಾ'],
          hint: 'Institution of education',
          audioText: 'ಶಾಲೆ',
        },
      ],
      ml: [
        {
          id: 'ws_ml_1',
          targetWord: 'അമ്മ',
          romanization: 'Amma',
          meaning: 'Mother',
          scrambledLetters: ['മ്മ', 'അ'],
          hint: 'Mother in Malayalam',
          audioText: 'അമ്മ',
        },
        {
          id: 'ws_ml_2',
          targetWord: 'പുസ്തകം',
          romanization: 'Pusthakam',
          meaning: 'Book',
          scrambledLetters: ['കം', 'സ്ത', 'പു'],
          hint: 'Reading material',
          audioText: 'പുസ്തകം',
        },
        {
          id: 'ws_ml_3',
          targetWord: 'സ്കൂൾ',
          romanization: 'School',
          meaning: 'School',
          scrambledLetters: ['ൾ', 'സ്കൂ'],
          hint: 'Educational classroom center',
          audioText: 'സ്കൂൾ',
        },
      ],
      hi: [
        {
          id: 'ws_hi_1',
          targetWord: 'किताब',
          romanization: 'Kitaab',
          meaning: 'Book',
          scrambledLetters: ['ब', 'ता', 'कि'],
          hint: 'जिसे पढ़कर हम ज्ञान प्राप्त करते हैं',
          audioText: 'किताब',
        },
        {
          id: 'ws_hi_2',
          targetWord: 'सूरज',
          romanization: 'Sooraj',
          meaning: 'Sun',
          scrambledLetters: ['ज', 'र', 'सू'],
          hint: 'सुबह पूर्व दिशा में उगने वाला प्रकाश पुंज',
          audioText: 'सूरज',
        },
        {
          id: 'ws_hi_3',
          targetWord: 'विद्यालय',
          romanization: 'Vidyalaya',
          meaning: 'School',
          scrambledLetters: ['लय', 'द्या', 'वि'],
          hint: 'विद्या प्राप्ति का पवित्र स्थान',
          audioText: 'विद्यालय',
        },
      ],
      en: [
        {
          id: 'ws_en_1',
          targetWord: 'LEARN',
          romanization: 'Learn',
          meaning: 'Acquire knowledge',
          scrambledLetters: ['R', 'E', 'A', 'N', 'L'],
          hint: 'To gain skills through study and practice',
          audioText: 'Learn',
        },
        {
          id: 'ws_en_2',
          targetWord: 'WATER',
          romanization: 'Water',
          meaning: 'Life fluid',
          scrambledLetters: ['T', 'A', 'E', 'R', 'W'],
          hint: 'Transparent liquid essential for all life',
          audioText: 'Water',
        },
        {
          id: 'ws_en_3',
          targetWord: 'SCHOOL',
          romanization: 'School',
          meaning: 'Education center',
          scrambledLetters: ['O', 'C', 'H', 'S', 'L', 'O'],
          hint: 'A place where students learn',
          audioText: 'School',
        },
      ],
      bn: [
        {
          id: 'ws_bn_1',
          targetWord: 'বই',
          romanization: 'Boi',
          meaning: 'Book',
          scrambledLetters: ['ই', 'ব'],
          hint: 'পড়ার মাধ্যম',
          audioText: 'বই',
        },
        {
          id: 'ws_bn_2',
          targetWord: 'সূর্য',
          romanization: 'Surjo',
          meaning: 'Sun',
          scrambledLetters: ['র্য', 'সূ'],
          hint: 'পূর্ব দিকে উদিত আলো',
          audioText: 'সূর্য',
        },
      ],
      mr: [
        {
          id: 'ws_mr_1',
          targetWord: 'पुस्तक',
          romanization: 'Pustak',
          meaning: 'Book',
          scrambledLetters: ['क', 'स्त', 'पु'],
          hint: 'वाचनाचे साधन',
          audioText: 'पुस्तक',
        },
        {
          id: 'ws_mr_2',
          targetWord: 'शाळा',
          romanization: 'Shaala',
          meaning: 'School',
          scrambledLetters: ['ळा', 'शा'],
          hint: 'ज्ञानार्जनाचे ठिकाण',
          audioText: 'शाळा',
        },
      ],
    };

    return repository[language] || repository.te;
  }

  /**
   * Memory Matching Cards: Pair visual glyph with meaning/picture
   */
  static getMemoryMatchCards(language = 'te') {
    const cardPairs = {
      te: [
        { id: 1, text: 'అమ్మ', pairId: 101, type: 'glyph', audio: 'అమ్మ' },
        { id: 101, text: 'Mother (Parent)', pairId: 1, type: 'meaning' },
        { id: 2, text: 'ఆవు', pairId: 102, type: 'glyph', audio: 'ఆవు' },
        { id: 102, text: 'Cow (Milk giver)', pairId: 2, type: 'meaning' },
        { id: 3, text: 'కలం', pairId: 103, type: 'glyph', audio: 'కలం' },
        { id: 103, text: 'Pen (Writing tool)', pairId: 3, type: 'meaning' },
        { id: 4, text: 'చెట్టు', pairId: 104, type: 'glyph', audio: 'చెట్టు' },
        { id: 104, text: 'Tree (Green nature)', pairId: 4, type: 'meaning' },
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
        { id: 3, text: 'മരം', pairId: 103, type: 'glyph', audio: 'മരം' },
        { id: 103, text: 'Tree', pairId: 3, type: 'meaning' },
      ],
      en: [
        { id: 1, text: 'Mother', pairId: 101, type: 'glyph', audio: 'Mother' },
        { id: 101, text: 'A loving female parent', pairId: 1, type: 'meaning' },
        { id: 2, text: 'Book', pairId: 102, type: 'glyph', audio: 'Book' },
        { id: 102, text: 'Pages bound together for reading', pairId: 2, type: 'meaning' },
        { id: 3, text: 'Tree', pairId: 103, type: 'glyph', audio: 'Tree' },
        { id: 103, text: 'Plant with a wooden trunk', pairId: 3, type: 'meaning' },
      ],
      bn: [
        { id: 1, text: 'মা', pairId: 101, type: 'glyph', audio: 'মা' },
        { id: 101, text: 'Mother', pairId: 1, type: 'meaning' },
        { id: 2, text: 'গরু', pairId: 102, type: 'glyph', audio: 'গরু' },
        { id: 102, text: 'Cow', pairId: 2, type: 'meaning' },
      ],
      mr: [
        { id: 1, text: 'आई', pairId: 101, type: 'glyph', audio: 'आई' },
        { id: 101, text: 'Mother', pairId: 1, type: 'meaning' },
        { id: 2, text: 'झाड', pairId: 102, type: 'glyph', audio: 'झाड' },
        { id: 102, text: 'Tree', pairId: 2, type: 'meaning' },
      ],
    };

    const cards = cardPairs[language] || cardPairs.te;
    // Shuffle cards array
    return [...cards].sort(() => Math.random() - 0.5);
  }

  /**
   * Speed Literacy Quiz Questions
   */
  static getSpeedQuizQuestions(language = 'te') {
    const quizRepo = {
      te: [
        {
          id: 'sq_te_1',
          prompt: '‘ఆవు’ అనే పదంలో మొదటి అక్షరం ఏమిటి?',
          options: ['అ', 'ఆ', 'ఇ', 'ఈ'],
          correctAnswer: 'ఆ',
          audioText: 'ఆవు అనే పదంలో మొదటి అక్షరం ఏమిటి?',
        },
        {
          id: 'sq_te_2',
          prompt: '‘మంచి పుస్తకం’ అంటే ఏమిటి?',
          options: ['చెడ్డది', 'మంచి మిత్రుడు', 'ఆహారం', 'నీరు'],
          correctAnswer: 'మంచి మిత్రుడు',
          audioText: 'మంచి పుస్తకం అంటే ఏమిటి?',
        },
        {
          id: 'sq_te_3',
          prompt: 'సూర్యుడు ఎటువైపున ఉదయిస్తాడు?',
          options: ['పడమర', 'తూర్పు', 'ఉత్తరం', 'దక్షిణం'],
          correctAnswer: 'తూర్పు',
          audioText: 'సూర్యుడు ఎటువైపున ఉదయిస్తాడు?',
        },
      ],
      hi: [
        {
          id: 'sq_hi_1',
          prompt: '‘किताब’ शब्द का सही अर्थ क्या है?',
          options: ['पुस्तक', 'कलम', 'पेड़', 'पानी'],
          correctAnswer: 'पुस्तक',
          audioText: 'किताब शब्द का सही अर्थ क्या है?',
        },
        {
          id: 'sq_hi_2',
          prompt: 'सूरज किस दिशा में उगता है?',
          options: ['पश्चिम', 'पूर्व', 'उत्तर', 'दक्षिण'],
          correctAnswer: 'पूर्व',
          audioText: 'सूरज किस दिशा में उगता है?',
        },
      ],
      ta: [
        {
          id: 'sq_ta_1',
          prompt: '‘அம்மா’ என்ற சொல்லின் முதல் எழுத்து எது?',
          options: ['ஆ', 'அ', 'இ', 'ஈ'],
          correctAnswer: 'அ',
          audioText: 'அம்மா என்ற சொல்லின் முதல் எழுத்து எது?',
        },
        {
          id: 'sq_ta_2',
          prompt: 'பசு நமக்கு என்ன தருகிறது?',
          options: ['நீர்', 'பால்', 'மரம்', 'கனி'],
          correctAnswer: 'பால்',
          audioText: 'பசு நமக்கு என்ன தருகிறது?',
        },
      ],
      kn: [
        {
          id: 'sq_kn_1',
          prompt: '‘ಹಸು’ ನಮಗೆ ಏನು ನೀಡುತ್ತದೆ?',
          options: ['ಹಾಲು', 'ಹಣ್ಣು', 'ನೀರು', 'ಮಣ್ಣು'],
          correctAnswer: 'ಹಾಲು',
          audioText: 'ಹಸು ನಮಗೆ ಏನು ನೀಡುತ್ತದೆ?',
        },
      ],
      ml: [
        {
          id: 'sq_ml_1',
          prompt: '‘പശു’ നമുക്ക് എന്ത് നൽകുന്നു?',
          options: ['പാൽ', 'വെള്ളം', 'മണ്ണ്', 'പഴം'],
          correctAnswer: 'പാൽ',
          audioText: 'പശു നമുക്ക് എന്ത് നൽകുന്നു?',
        },
      ],
      en: [
        {
          id: 'sq_en_1',
          prompt: 'Which word is the opposite of ‘Slow’?',
          options: ['Quiet', 'Fast', 'Heavy', 'Cold'],
          correctAnswer: 'Fast',
          audioText: 'Which word is the opposite of Slow?',
        },
        {
          id: 'sq_en_2',
          prompt: 'What do trees produce that helps us breathe?',
          options: ['Carbon', 'Oxygen', 'Sand', 'Steam'],
          correctAnswer: 'Oxygen',
          audioText: 'What do trees produce that helps us breathe?',
        },
      ],
      bn: [
        {
          id: 'sq_bn_1',
          prompt: 'গরু আমাদের কী দেয়?',
          options: ['দুধ', 'জল', 'ফল', 'ফুল'],
          correctAnswer: 'দুধ',
          audioText: 'গরু আমাদের কী দেয়?',
        },
      ],
      mr: [
        {
          id: 'sq_mr_1',
          prompt: 'गाय आपल्याला काय देते?',
          options: ['दूध', 'पाणी', 'फळ', 'फुल'],
          correctAnswer: 'दूध',
          audioText: 'गाय आपल्याला काय देते?',
        },
      ],
    };

    return quizRepo[language] || quizRepo.te;
  }

  /**
   * Sentence Builder Puzzles (Re-order word tiles to construct a grammatically correct sentence)
   */
  static getSentenceBuilderPuzzles(language = 'te') {
    const builderRepo = {
      te: [
        {
          id: 'sb_te_1',
          correctSentence: 'ఆవు మనకు పాలు ఇస్తుంది',
          tiles: ['ఇస్తుంది', 'ఆవు', 'పాలు', 'మనకు'],
          translation: 'The cow gives us milk',
          hint: 'Subject (ఆవు) comes first, verb (ఇస్తుంది) comes at the end',
        },
        {
          id: 'sb_te_2',
          correctSentence: 'నేను ప్రతిరోజూ పుస్తకం చదువుతాను',
          tiles: ['చదువుతాను', 'నేను', 'పుస్తకం', 'ప్రతిరోజూ'],
          translation: 'I read a book everyday',
          hint: 'Start with నేను (I) and end with చదువుతాను (read)',
        },
      ],
      hi: [
        {
          id: 'sb_hi_1',
          correctSentence: 'गाय हमें मीठा दूध देती है',
          tiles: ['देती है', 'गाय', 'दूध', 'हमें', 'मीठा'],
          translation: 'The cow gives us sweet milk',
          hint: 'Subject (गाय) comes first, verb (देती है) at the end',
        },
        {
          id: 'sb_hi_2',
          correctSentence: 'रोहन प्रतिदिन विद्यालय जाता है',
          tiles: ['जाता है', 'विद्यालय', 'रोहन', 'प्रतिदिन'],
          translation: 'Rohan goes to school everyday',
          hint: 'Start with रोहन and end with जाता है',
        },
      ],
      ta: [
        {
          id: 'sb_ta_1',
          correctSentence: 'பசு நமக்கு பால் தருகிறது',
          tiles: ['தருகிறது', 'பசு', 'பால்', 'நமக்கு'],
          translation: 'The cow gives us milk',
          hint: 'Subject (பசு) comes first',
        },
      ],
      kn: [
        {
          id: 'sb_kn_1',
          correctSentence: 'ಹಸು ನಮಗೆ ಹಾಲು ನೀಡುತ್ತದೆ',
          tiles: ['ನೀಡುತ್ತದೆ', 'ಹಸು', 'ಹಾಲು', 'ನಮಗೆ'],
          translation: 'The cow gives us milk',
          hint: 'Start with ಹಸು and end with ನೀಡುತ್ತದೆ',
        },
      ],
      ml: [
        {
          id: 'sb_ml_1',
          correctSentence: 'പശു നമുക്ക് പാൽ തരുന്നു',
          tiles: ['തരുന്നു', 'പശു', 'പാൽ', 'നമുക്ക്'],
          translation: 'The cow gives us milk',
          hint: 'Subject (പശു) comes first',
        },
      ],
      en: [
        {
          id: 'sb_en_1',
          correctSentence: 'The sun rises in the east',
          tiles: ['rises', 'The sun', 'the east', 'in'],
          translation: 'Universal truth sentence',
          hint: 'Subject-Verb-Preposition-Object order',
        },
      ],
      bn: [
        {
          id: 'sb_bn_1',
          correctSentence: 'গরু আমাদের পুষ্টিকর দুধ দেয়',
          tiles: ['দেয়', 'গরু', 'দুধ', 'আমাদের', 'পুষ্টিকর'],
          translation: 'The cow gives us nutritious milk',
          hint: 'Start with গরু and end with দেয়',
        },
      ],
      mr: [
        {
          id: 'sb_mr_1',
          correctSentence: 'गाय आपल्याला गोड दूध देते',
          tiles: ['देते', 'गाय', 'दूध', 'आपल्याला', 'गोड'],
          translation: 'The cow gives us sweet milk',
          hint: 'Start with गाय and end with देते',
        },
      ],
    };

    return builderRepo[language] || builderRepo.te;
  }
}
