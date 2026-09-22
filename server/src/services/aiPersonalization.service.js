import { SpacedRepetitionItem } from '../models/SpacedRepetitionItem.model.js';
import { User } from '../models/User.model.js';
import { Curriculum } from '../models/Curriculum.model.js';
import { Content } from '../models/Content.model.js';
import { AssessmentSubmission } from '../models/Assessment.model.js';
import { ApiError } from '../utils/apiError.js';

export class AiPersonalizationService {
  /**
   * SuperMemo-2 (SM-2) Scheduling Algorithm
   * @param {number} qualityRating - 0 to 5 (0: Blackout, 3: Passable with effort, 5: Perfect recall)
   * @param {number} repetitions - Current consecutive successful repetitions
   * @param {number} previousInterval - Interval in days from previous iteration
   * @param {number} previousEaseFactor - Ease factor (min 1.3, default 2.5)
   */
  static calculateSM2Schedule(qualityRating, repetitions = 0, previousInterval = 1, previousEaseFactor = 2.5) {
    let nextRepetitions = repetitions;
    let nextInterval = previousInterval;
    let nextEaseFactor = previousEaseFactor;

    // Calculate new Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    nextEaseFactor = previousEaseFactor + (0.1 - (5 - qualityRating) * (0.08 + (5 - qualityRating) * 0.02));
    if (nextEaseFactor < 1.3) nextEaseFactor = 1.3;

    if (qualityRating >= 3) {
      if (repetitions === 0) {
        nextInterval = 1;
      } else if (repetitions === 1) {
        nextInterval = 6;
      } else {
        nextInterval = Math.round(previousInterval * nextEaseFactor);
      }
      nextRepetitions += 1;
    } else {
      // Failed recall resets repetitions
      nextRepetitions = 0;
      nextInterval = 1;
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

    const masteryLevel = nextRepetitions >= 5 ? 'mastered' : nextRepetitions >= 2 ? 'reviewing' : 'learning';

    return {
      repetitions: nextRepetitions,
      intervalDays: nextInterval,
      easeFactor: Number(nextEaseFactor.toFixed(2)),
      nextReviewDate,
      masteryLevel,
    };
  }

  /**
   * Generates or retrieves due Spaced Repetition cards for a learner
   */
  static async getDueReviewCards(userId, language = 'te') {
    const user = await User.findById(userId);
    const targetLang = language || user?.preferredLanguage || 'te';

    let cards = await SpacedRepetitionItem.find({
      userId,
      language: targetLang,
      nextReviewDate: { $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    }).sort({ nextReviewDate: 1 }).limit(15);

    // If learner has no seeded review cards, generate foundational seed flashcards
    if (cards.length === 0) {
      cards = await this.seedInitialFlashcards(userId, targetLang);
    }

    return cards;
  }

  /**
   * Processes card review and updates SM-2 schedule
   */
  static async processCardReview(userId, cardId, qualityRating) {
    let item = await SpacedRepetitionItem.findOne({ userId, cardId });
    if (!item) {
      throw ApiError.notFound('Flashcard not found');
    }

    const schedule = this.calculateSM2Schedule(
      qualityRating,
      item.repetitions,
      item.intervalDays,
      item.easeFactor
    );

    item.repetitions = schedule.repetitions;
    item.intervalDays = schedule.intervalDays;
    item.easeFactor = schedule.easeFactor;
    item.nextReviewDate = schedule.nextReviewDate;
    item.masteryLevel = schedule.masteryLevel;
    item.lastReviewedAt = new Date();

    await item.save();
    return item;
  }

  /**
   * Generates AI Adaptive Learning Path using Knowledge Graph concept sequencing
   */
  static async getAdaptiveLearningPath(userId) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    const language = user.preferredLanguage || 'te';
    const proficiency = user.proficiencyLevel || 'beginner';

    // Fetch latest assessment submissions to compute Dynamic Difficulty Adjustment (DDA)
    const latestSubmissions = await AssessmentSubmission.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);

    let avgScore = 75;
    if (latestSubmissions.length > 0) {
      const sum = latestSubmissions.reduce((acc, sub) => acc + (sub.scores?.overallScore || 70), 0);
      avgScore = Math.round(sum / latestSubmissions.length);
    }

    // Dynamic Difficulty Adjustment index (-1: Ease down, 0: Steady, 1: Accelerated)
    const ddaIndex = avgScore > 85 ? 1 : avgScore < 50 ? -1 : 0;

    const knowledgeGraphNodes = [
      {
        nodeId: 'kg_phonics_01',
        title: 'Script & Acoustic Phonics',
        description: 'Vowels, acoustic consonants, and basic grapheme matching',
        icon: '🔤',
        tier: 'beginner',
        status: 'completed',
        masteryPercentage: 100,
        estimatedTimeMinutes: 15,
        prerequisites: [],
      },
      {
        nodeId: 'kg_vocab_02',
        title: 'High-Frequency Sight Words',
        description: 'Two-letter blending, core daily objects, and visual memory',
        icon: '🌿',
        tier: 'beginner',
        status: proficiency === 'beginner' && avgScore < 60 ? 'in_progress' : 'completed',
        masteryPercentage: proficiency === 'beginner' ? (avgScore < 60 ? 65 : 100) : 100,
        estimatedTimeMinutes: 20,
        prerequisites: ['kg_phonics_01'],
      },
      {
        nodeId: 'kg_sentence_03',
        title: 'Sentence Syntax & Reading',
        description: 'Subject-Object-Verb formation, punctuation, and illustrated dialogues',
        icon: '⚡',
        tier: 'elementary',
        status: proficiency === 'elementary' ? 'in_progress' : proficiency === 'beginner' ? 'locked' : 'completed',
        masteryPercentage: proficiency === 'intermediate' || proficiency === 'advanced' ? 100 : proficiency === 'elementary' ? 55 : 0,
        estimatedTimeMinutes: 25,
        prerequisites: ['kg_vocab_02'],
      },
      {
        nodeId: 'kg_comp_04',
        title: 'Paragraph Comprehension',
        description: 'Short stories, inference questions, and contextual extraction',
        icon: '📖',
        tier: 'intermediate',
        status: proficiency === 'intermediate' ? 'in_progress' : proficiency === 'advanced' ? 'completed' : 'locked',
        masteryPercentage: proficiency === 'advanced' ? 100 : proficiency === 'intermediate' ? 40 : 0,
        estimatedTimeMinutes: 30,
        prerequisites: ['kg_sentence_03'],
      },
      {
        nodeId: 'kg_functional_05',
        title: 'Functional Real-World Literacy',
        description: 'Public bus boards, clinic prescription slips, utility bills, and bank forms',
        icon: '🏆',
        tier: 'advanced',
        status: proficiency === 'advanced' ? 'in_progress' : 'locked',
        masteryPercentage: proficiency === 'advanced' ? 30 : 0,
        estimatedTimeMinutes: 35,
        prerequisites: ['kg_comp_04'],
      },
    ];

    return {
      userId: user._id,
      language,
      currentProficiency: proficiency,
      averageScore: avgScore,
      ddaRecommendation:
        ddaIndex === 1
          ? 'Fast-Track: You are mastering concepts quickly! Advanced practice unlocked.'
          : ddaIndex === -1
            ? 'Reinforce Foundations: Additional audio exercises and spaced repetition cards added.'
            : 'Optimal Pace: Steady progression maintained across all literacy skills.',
      recommendedDailyPracticeMinutes: avgScore < 50 ? 20 : 15,
      nodes: knowledgeGraphNodes,
      activeNodeId:
        proficiency === 'advanced'
          ? 'kg_functional_05'
          : proficiency === 'intermediate'
            ? 'kg_comp_04'
            : proficiency === 'elementary'
              ? 'kg_sentence_03'
              : 'kg_vocab_02',
    };
  }

  /**
   * Generates AI Contextual Hints & Phonetic Remediations
   */
  static async generateSmartHint(wordOrPrompt, language = 'te') {
    const hintsByLanguage = {
      te: {
        default: 'ధ్వనిని వినండి: అక్షరాల కలయికను గమనించండి. మొదటి అక్షరం యొక్క ధ్వనిని సరిగ్గా పలకండి.',
        phonics: 'అక్షరమాలలోని అచ్చులు మరియు హల్లుల స్వరూపాన్ని గుర్తుంచుకోండి.',
        writing: 'తెలుగు లిపిలో తలకట్టు మరియు గుణింతాల క్రమాన్ని సరిగ్గా పరిశీలించండి.',
      },
      ta: {
        default: 'ஒலியை கவனியுங்கள்: எழுத்துக்களின் அமைப்பை பிரித்து படியுங்கள்.',
        phonics: 'உயிர் மற்றும் மெய் எழுத்துக்களின் இணைப்பை நினைவில் கொள்ளுங்கள்.',
        writing: 'சரியான புள்ளி மற்றும் கொம்பு அமைப்பை கவனிக்கவும்.',
      },
      kn: {
        default: 'ಧ್ವನಿಯನ್ನು ಆಲಿಸಿ: ಅಕ್ಷರಗಳ ಜೋಡಣೆಯನ್ನು ಸರಿಯಾಗಿ ಗಮನಿಸಿ.',
        phonics: 'ಸ್ವರ ಮತ್ತು ವ್ಯಂಜನಗಳ ಉಚ್ಚಾರಣೆಯನ್ನು ಗಮನದಲ್ಲಿಡಿ.',
        writing: 'ಕಾಗುಣಿತ ಮತ್ತು ಒತ್ತಕ್ಷರಗಳನ್ನು ಗಮನಿಸಿ ಸರಿಯಾಗಿ ಉತ್ತರಿಸಿ.',
      },
      ml: {
        default: 'ശബ്ദം ശ്രദ്ധിക്കുക: അക്ഷരങ്ങൾ ചേർത്തുവെച്ച് വായിക്കുക.',
        phonics: 'സ്വരങ്ങളും കൂട്ടക്ഷരങ്ങളും ശ്രദ്ധിക്കുക.',
        writing: 'അക്ഷരവിന്യാസവും ചിഹ്നങ്ങളും ശരിയായി പരിശോധിക്കുക.',
      },
      hi: {
        default: 'ध्वनि सुनें: अक्षरों और मात्राओं को मिलाकर शुद्ध उच्चारण करें।',
        phonics: 'देवनागरी वर्णमाला के स्वर और व्यंजन के मेल को समझें।',
        writing: 'मात्रा और शिरोरेखा को ध्यान में रखकर सही वर्तनी चुनें।',
      },
      en: {
        default: 'Listen to the acoustic blend: Break down the word into individual syllables (CVC pattern).',
        phonics: 'Focus on short vowel sounds (A, E, I, O, U) and consonant blends.',
        writing: 'Check the subject-verb agreement and standard spelling rules.',
      },
      bn: {
        default: 'শব্দের উচ্চারণ শুনুন: বর্ণ এবং যুক্তাক্ষরগুলি সতর্কভাবে লক্ষ করুন।',
        phonics: 'স্বরবর্ণ ও ব্যঞ্জনবর্ণের সঠিক ধ্বনি মনে রাখুন।',
        writing: 'যুক্তাক্ষর এবং মাত্রার সঠিক ব্যবহার বিবেচনা করুন।',
      },
      mr: {
        default: 'उच्चार ऐका: अक्षरे आणि जोडाक्षरे जोडून योग्य वाचन करा.',
        phonics: 'स्वर आणि व्यंजनांचे स्पष्ट उच्चार लक्षात ठेवा.',
        writing: 'योग्य काना-मात्रा आणि विरामचिन्हांचा वापर तपासा.',
      },
    };

    const langDict = hintsByLanguage[language] || hintsByLanguage.en;
    return {
      language,
      wordOrPrompt,
      generalHint: langDict.default,
      phoneticMnemonic: langDict.phonics,
      grammarClue: langDict.writing,
    };
  }

  /**
   * Seeds initial flashcard deck for new learners
   */
  static async seedInitialFlashcards(userId, language = 'te') {
    const flashcardTemplates = {
      te: [
        { cardId: 'te_fc_1', frontText: 'అమ్మ', backText: 'Mother (Amma)', phoneticGuide: '/am-ma/', category: 'vocabulary', exampleSentence: 'అమ్మ ప్రేమ అమూల్యమైనది.' },
        { cardId: 'te_fc_2', frontText: 'ఆవు', backText: 'Cow (Aavu)', phoneticGuide: '/aa-vu/', category: 'vocabulary', exampleSentence: 'ఆవు మనకు పాలు ఇస్తుంది.' },
        { cardId: 'te_fc_3', frontText: 'కలం', backText: 'Pen (Kalam)', phoneticGuide: '/ka-lam/', category: 'sight_words', exampleSentence: 'నేను కలంతో రాస్తాను.' },
        { cardId: 'te_fc_4', frontText: 'బడి', backText: 'School (Badi)', phoneticGuide: '/ba-di/', category: 'functional_signs', exampleSentence: 'పిల్లలు బడికి వెళ్తున్నారు.' },
        { cardId: 'te_fc_5', frontText: 'పుస్తకం', backText: 'Book (Pusthakam)', phoneticGuide: '/pus-tha-kam/', category: 'vocabulary', exampleSentence: 'రాధ పుస్తకం చదువుతోంది.' },
      ],
      ta: [
        { cardId: 'ta_fc_1', frontText: 'அம்மா', backText: 'Mother (Amma)', phoneticGuide: '/am-maa/', category: 'vocabulary', exampleSentence: 'அம்மா உணவு சமைத்தார்.' },
        { cardId: 'ta_fc_2', frontText: 'பசு', backText: 'Cow (Pasu)', phoneticGuide: '/pa-su/', category: 'vocabulary', exampleSentence: 'பசு பால் தருகிறது.' },
        { cardId: 'ta_fc_3', frontText: 'பல்', backText: 'Tooth (Pal)', phoneticGuide: '/pal/', category: 'sight_words', exampleSentence: 'தினமும் பல் துலக்குங்கள்.' },
        { cardId: 'ta_fc_4', frontText: 'பள்ளி', backText: 'School (Palli)', phoneticGuide: '/pal-li/', category: 'functional_signs', exampleSentence: 'அன்பு பள்ளிக்குச் சென்றான்.' },
        { cardId: 'ta_fc_5', frontText: 'புத்தகம்', backText: 'Book (Puthagam)', phoneticGuide: '/puth-tha-gam/', category: 'vocabulary', exampleSentence: 'புதிய புத்தகம் படித்தான்.' },
      ],
      kn: [
        { cardId: 'kn_fc_1', frontText: 'ಅಮ್ಮ', backText: 'Mother (Amma)', phoneticGuide: '/am-ma/', category: 'vocabulary', exampleSentence: 'ಅಮ್ಮ ಪ್ರೀತಿ ಶ್ರೇಷ್ಠ.' },
        { cardId: 'kn_fc_2', frontText: 'ಹಸು', backText: 'Cow (Hasu)', phoneticGuide: '/ha-su/', category: 'vocabulary', exampleSentence: 'ಹಸು ಹಾಲು ನೀಡುತ್ತದೆ.' },
        { cardId: 'kn_fc_3', frontText: 'ಮರ', backText: 'Tree (Mara)', phoneticGuide: '/ma-ra/', category: 'sight_words', exampleSentence: 'ಮರ ಶುದ್ಧ ಗಾಳಿ ಕೊಡುತ್ತದೆ.' },
        { cardId: 'kn_fc_4', frontText: 'ಶಾಲೆ', backText: 'School (Shaale)', phoneticGuide: '/shaa-le/', category: 'functional_signs', exampleSentence: 'ರಾಜು ಶಾಲೆಗೆ ಹೋದನು.' },
        { cardId: 'kn_fc_5', frontText: 'ಪುಸ್ತಕ', backText: 'Book (Pustaka)', phoneticGuide: '/pus-ta-ka/', category: 'vocabulary', exampleSentence: 'ಪುಸ್ತಕ ಓದುವುದು ಒಳ್ಳೆಯ ಅಭ್ಯಾಸ.' },
      ],
      ml: [
        { cardId: 'ml_fc_1', frontText: 'അമ്മ', backText: 'Mother (Amma)', phoneticGuide: '/am-ma/', category: 'vocabulary', exampleSentence: 'അമ്മ സ്നേഹത്തിന്റെ പ്രതീകമാണ്.' },
        { cardId: 'ml_fc_2', frontText: 'പശു', backText: 'Cow (Pashu)', phoneticGuide: '/pa-shu/', category: 'vocabulary', exampleSentence: 'പശു പാൽ തരുന്നു.' },
        { cardId: 'ml_fc_3', frontText: 'മരം', backText: 'Tree (Maram)', phoneticGuide: '/ma-ram/', category: 'sight_words', exampleSentence: 'മരം പ്രകൃതിയുടെ വരദാനമാണ്.' },
        { cardId: 'ml_fc_4', frontText: 'സ്കൂൾ', backText: 'School (School)', phoneticGuide: '/skool/', category: 'functional_signs', exampleSentence: 'അപ്പു സ്കൂളിൽ പോയി.' },
        { cardId: 'ml_fc_5', frontText: 'പുസ്തകം', backText: 'Book (Pusthakam)', phoneticGuide: '/pus-tha-kam/', category: 'vocabulary', exampleSentence: 'പുസ്തകം വായിക്കുന്നത് അറിവ് വർദ്ധിപ്പിക്കും.' },
      ],
      hi: [
        { cardId: 'hi_fc_1', frontText: 'माता / माँ', backText: 'Mother (Maa)', phoneticGuide: '/maa/', category: 'vocabulary', exampleSentence: 'माँ का प्यार अनमोल है।' },
        { cardId: 'hi_fc_2', frontText: 'गाय', backText: 'Cow (Gaay)', phoneticGuide: '/gaay/', category: 'vocabulary', exampleSentence: 'गाय हमें मीठा दूध देती है।' },
        { cardId: 'hi_fc_3', frontText: 'कलम', backText: 'Pen (Kalam)', phoneticGuide: '/ka-lam/', category: 'sight_words', exampleSentence: 'रोहन कलम से लिखता है।' },
        { cardId: 'hi_fc_4', frontText: 'विद्यालय', backText: 'School (Vidyalaya)', phoneticGuide: '/vid-yaa-lay/', category: 'functional_signs', exampleSentence: 'बच्चे विद्यालय जाते हैं।' },
        { cardId: 'hi_fc_5', frontText: 'किताब', backText: 'Book (Kitaab)', phoneticGuide: '/ki-taab/', category: 'vocabulary', exampleSentence: 'राधा किताब पढ़ती है।' },
      ],
      en: [
        { cardId: 'en_fc_1', frontText: 'Mother', backText: 'A female parent', phoneticGuide: '/ˈmʌð.ər/', category: 'vocabulary', exampleSentence: 'My mother reads to me every night.' },
        { cardId: 'en_fc_2', frontText: 'Water', backText: 'Clear liquid essential for life', phoneticGuide: '/ˈwɔː.tər/', category: 'vocabulary', exampleSentence: 'Drink clean drinking water.' },
        { cardId: 'en_fc_3', frontText: 'Hospital', backText: 'Place for medical treatment', phoneticGuide: '/ˈhɒs.pɪ.təl/', category: 'functional_signs', exampleSentence: 'The clinic is near the hospital.' },
        { cardId: 'en_fc_4', frontText: 'Clinic Sign', backText: 'Public healthcare notice', phoneticGuide: '/ˈklɪn.ɪk/', category: 'functional_signs', exampleSentence: 'Follow the clinic sign for reception.' },
        { cardId: 'en_fc_5', frontText: 'Library', backText: 'Building containing collections of books', phoneticGuide: '/ˈlaɪ.brər.i/', category: 'vocabulary', exampleSentence: 'We study quietly in the library.' },
      ],
      bn: [
        { cardId: 'bn_fc_1', frontText: 'মা', backText: 'Mother (Maa)', phoneticGuide: '/maa/', category: 'vocabulary', exampleSentence: 'মায়ের স্নেহ অতুলনীয়।' },
        { cardId: 'bn_fc_2', frontText: 'গরু', backText: 'Cow (Goru)', phoneticGuide: '/go-ru/', category: 'vocabulary', exampleSentence: 'গরু আমাদের দুধ দেয়।' },
        { cardId: 'bn_fc_3', frontText: 'কলম', backText: 'Pen (Kolom)', phoneticGuide: '/ko-lom/', category: 'sight_words', exampleSentence: 'আমি নতুন কলম দিয়ে লিখছি।' },
        { cardId: 'bn_fc_4', frontText: 'বিদ্যালয়', backText: 'School (Bidyalay)', phoneticGuide: '/bid-yaa-lay/', category: 'functional_signs', exampleSentence: 'রবি বিদ্যালয়ে যাচ্ছে।' },
        { cardId: 'bn_fc_5', frontText: 'বই', backText: 'Book (Boi)', phoneticGuide: '/boi/', category: 'vocabulary', exampleSentence: 'প্রতিদিন বই পড়া ভালো অভ্যাস।' },
      ],
      mr: [
        { cardId: 'mr_fc_1', frontText: 'आई', backText: 'Mother (Aai)', phoneticGuide: '/aai/', category: 'vocabulary', exampleSentence: 'आईचे प्रेम अमूल्य आहे.' },
        { cardId: 'mr_fc_2', frontText: 'गाय', backText: 'Cow (Gaay)', phoneticGuide: '/gaay/', category: 'vocabulary', exampleSentence: 'गाय आपल्याला दूध देते.' },
        { cardId: 'mr_fc_3', frontText: 'कप', backText: 'Cup (Kap)', phoneticGuide: '/kap/', category: 'sight_words', exampleSentence: 'गरम चहा कपात ओता.' },
        { cardId: 'mr_fc_4', frontText: 'शाळा', backText: 'School (Shaala)', phoneticGuide: '/shaa-laa/', category: 'functional_signs', exampleSentence: 'मुले शाळेत जात आहेत.' },
        { cardId: 'mr_fc_5', frontText: 'पुस्तक', backText: 'Book (Pustak)', phoneticGuide: '/pus-tak/', category: 'vocabulary', exampleSentence: 'रोहन गोष्टीचे पुस्तक वाचत आहे.' },
      ],
    };

    const templates = flashcardTemplates[language] || flashcardTemplates.en;
    const createdItems = [];

    for (const t of templates) {
      const item = await SpacedRepetitionItem.findOneAndUpdate(
        { userId, cardId: t.cardId },
        {
          $setOnInsert: {
            userId,
            cardId: t.cardId,
            language,
            frontText: t.frontText,
            backText: t.backText,
            phoneticGuide: t.phoneticGuide,
            exampleSentence: t.exampleSentence,
            category: t.category,
            repetitions: 0,
            intervalDays: 1,
            easeFactor: 2.5,
            nextReviewDate: new Date(),
            masteryLevel: 'learning',
          },
        },
        { upsert: true, new: true }
      );
      createdItems.push(item);
    }

    return createdItems;
  }
}
