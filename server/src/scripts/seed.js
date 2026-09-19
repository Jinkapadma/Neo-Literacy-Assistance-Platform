import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.model.js';
import { Curriculum } from '../models/Curriculum.model.js';
import { Content } from '../models/Content.model.js';
import { Assessment, AssessmentSubmission } from '../models/Assessment.model.js';
import { logger } from '../utils/logger.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/literacy_assistance_db';

const seedDatabase = async () => {
  try {
    logger.info('🌱 Connecting to MongoDB for seeding...');
    await mongoose.connect(MONGO_URI);
    logger.info('Connected to MongoDB.');

    // Clear existing collections & indexes
    logger.info('🧹 Dropping existing collections and indexes...');
    try {
      await mongoose.connection.db.dropDatabase();
      logger.info('Database dropped cleanly.');
    } catch {
      // ignore
    }

    // 1. Create Users
    logger.info('👤 Creating default users...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@literacy.org',
      password: 'Password123!',
      role: 'admin',
      preferredLanguage: 'en',
      proficiencyLevel: 'advanced',
      targetSkills: ['reading', 'writing', 'comprehension', 'phonics', 'vocabulary'],
    });

    const educatorUser = await User.create({
      name: 'Priya Sharma (Educator)',
      email: 'educator@literacy.org',
      password: 'Password123!',
      role: 'educator',
      preferredLanguage: 'hi',
      proficiencyLevel: 'advanced',
      targetSkills: ['reading', 'writing', 'comprehension'],
    });

    const learnerHi = await User.create({
      name: 'Aarav Patel',
      email: 'learner@literacy.org',
      password: 'Password123!',
      role: 'learner',
      preferredLanguage: 'hi',
      proficiencyLevel: 'beginner',
      targetSkills: ['reading', 'phonics', 'vocabulary'],
    });

    const learnerEn = await User.create({
      name: 'John Miller',
      email: 'learner.en@literacy.org',
      password: 'Password123!',
      role: 'learner',
      preferredLanguage: 'en',
      proficiencyLevel: 'elementary',
      targetSkills: ['writing', 'comprehension'],
    });

    const learnerEs = await User.create({
      name: 'Maria Gonzalez',
      email: 'learner.es@literacy.org',
      password: 'Password123!',
      role: 'learner',
      preferredLanguage: 'es',
      proficiencyLevel: 'unassessed',
      targetSkills: ['reading', 'vocabulary'],
    });

    // 2. Create Multilingual Content Repository
    logger.info('📚 Creating multilingual learning content...');
    const contents = await Content.create([
      // English Beginner Phonics & Sight Words
      {
        title: 'Essential Phonics: Vowels & Short Sounds (A, E, I, O, U)',
        language: 'en',
        difficultyLevel: 'beginner',
        contentType: 'letter_phonics',
        textContent: 'The English alphabet has 5 primary vowels: A, E, I, O, U. Listen to the short vowel sounds: A as in Apple (/æ/), E as in Elephant (/ɛ/), I as in Iguana (/ɪ/), O as in Octopus (/ɒ/), U as in Umbrella (/ʌ/).',
        phoneticGuide: 'Short vowel patterns: CVC (Consonant - Vowel - Consonant): C-A-T (Cat), B-E-D (Bed), P-I-N (Pin), H-O-T (Hot), S-U-N (Sun).',
        summary: 'Learn basic short vowel sounds and pronunciation patterns for 3-letter words.',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
        vocabulary: [
          { word: 'Apple', meaning: 'A round fruit with red or green skin and crisp flesh.', phonetics: '/ˈæp.əl/', exampleSentence: 'She ate a sweet red apple.' },
          { word: 'Sun', meaning: 'The star at the center of our solar system providing light and heat.', phonetics: '/sʌn/', exampleSentence: 'The sun shines brightly in the morning.' },
          { word: 'Bed', meaning: 'A piece of furniture for sleeping on.', phonetics: '/bɛd/', exampleSentence: 'I rest on my comfortable bed.' },
        ],
        comprehensionQuestions: [
          { question: 'Which of the following is a short vowel word?', options: ['Cat', 'Sky', 'Fly', 'Rhythm'], correctAnswer: 'Cat', explanation: 'Cat contains the short vowel "A".' },
          { question: 'What vowel is found in the word "Sun"?', options: ['A', 'E', 'O', 'U'], correctAnswer: 'U', explanation: '"Sun" has the short "U" sound (/ʌ/).' },
        ],
        translations: [
          { language: 'hi', translatedTitle: 'आवश्यक ध्वनियां: स्वर (A, E, I, O, U)', translatedText: 'अंग्रेजी वर्णमाला में 5 मुख्य स्वर हैं: A, E, I, O, U।', phoneticGuide: 'कैट (Cat), बेड (Bed), पिन (Pin), हॉट (Hot), सन (Sun)' },
          { language: 'es', translatedTitle: 'Fonética Esencial: Vocales Cortas (A, E, I, O, U)', translatedText: 'El alfabeto inglés tiene 5 vocales primarias: A, E, I, O, U.', phoneticGuide: 'Cat (/kæt/), Bed (/bɛd/), Pin (/pɪn/)' },
        ],
        tags: ['phonics', 'vowels', 'beginner', 'alphabet'],
        estimatedReadTimeMinutes: 3,
        createdBy: educatorUser._id,
      },

      // English Functional Reading Story
      {
        title: 'Visiting the Community Health Clinic',
        language: 'en',
        difficultyLevel: 'elementary',
        contentType: 'functional_text',
        textContent: 'Ravi needed to visit the community healthcare clinic on Tuesday morning. He carried his identity card and registration slip. At the reception counter, the nurse asked for his full name, date of birth, and primary symptoms. Ravi explained that he had a mild fever and a sore throat for two days. The nurse issued him token number 14 and directed him to Waiting Room B. Doctor Anita examined Ravi, checked his temperature with a thermometer, and wrote a clear prescription for medicines and warm water hydration.',
        phoneticGuide: 'Key terms: Clin-ic (/ˈklɪn.ɪk/), Re-cep-tion (/rɪˈsɛp.ʃən/), Pre-scrip-tion (/prɪˈskrɪp.ʃən/).',
        summary: 'A practical real-world reading guide on navigating medical appointments, understanding clinic signs, and communicating with healthcare staff.',
        imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800',
        vocabulary: [
          { word: 'Clinic', meaning: 'A place where people receive medical treatment.', phonetics: '/ˈklɪn.ɪk/', exampleSentence: 'The village clinic opens at 8 AM.' },
          { word: 'Prescription', meaning: 'A doctor’s written order for medicine.', phonetics: '/prɪˈskrɪp.ʃən/', exampleSentence: 'The pharmacist gave him medicines as per the prescription.' },
          { word: 'Symptom', meaning: 'A physical sign of an illness.', phonetics: '/ˈsɪmptəm/', exampleSentence: 'Fever is a common symptom of flu.' },
        ],
        comprehensionQuestions: [
          { question: 'Why did Ravi go to the health clinic?', options: ['To buy groceries', 'He had a fever and sore throat', 'To visit a friend', 'To pay electricity bill'], correctAnswer: 'He had a fever and sore throat', explanation: 'Ravi visited because of fever and sore throat symptoms.' },
          { question: 'What token number was Ravi given?', options: ['Token 12', 'Token 14', 'Token 24', 'Token 4'], correctAnswer: 'Token 14', explanation: 'The receptionist handed him token number 14.' },
          { question: 'What should you carry when visiting a clinic?', options: ['A textbook', 'Identity card and registration slip', 'A toy', 'Blank paper'], correctAnswer: 'Identity card and registration slip', explanation: 'Identity documents are needed for medical registration.' },
        ],
        translations: [
          { language: 'hi', translatedTitle: 'सामुदायिक स्वास्थ्य केंद्र की यात्रा', translatedText: 'रवि को मंगलवार सुबह सामुदायिक स्वास्थ्य केंद्र जाना था। उसने अपना पहचान पत्र और पर्ची साथ रखी।', phoneticGuide: 'क्लीनिक, रिसेप्शन, प्रिस्क्रिप्शन' },
          { language: 'es', translatedTitle: 'Visita a la Clínica de Salud Comunitaria', translatedText: 'Ravi necesitaba visitar la clínica de salud comunitaria el martes por la mañana.', phoneticGuide: 'Clínica, Recepción, Receta' },
        ],
        tags: ['health', 'community', 'practical', 'reading', 'dialogue'],
        estimatedReadTimeMinutes: 4,
        createdBy: educatorUser._id,
      },

      // Hindi Beginner Aksharmala & Words
      {
        title: 'हिंदी वर्णमाला: स्वर और बुनियादी शब्द (अ, आ, इ, ई, उ, ऊ)',
        language: 'hi',
        difficultyLevel: 'beginner',
        contentType: 'letter_phonics',
        textContent: 'हिंदी वर्णमाला में स्वर वर्ण बहुत महत्वपूर्ण होते हैं। अ से अनार (मीठा फल), आ से आम (फलों का राजा), इ से इमली (खट्टी इमली), ई से ईख (गन्ना), उ से उल्लू, ऊ से ऊन। इन स्वरों की सहायता से मात्राएं बनती हैं।',
        phoneticGuide: 'A (अ), Aa (आ), I (इ), Ee (ई), U (उ), Oo (ऊ)। उदाहरण: क + आ = का, क + इ = कि।',
        summary: 'हिंदी भाषा के मूल स्वरों और उनसे बनने वाले दैनिक शब्दों की सचित्र पहचान।',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
        vocabulary: [
          { word: 'अनार', meaning: 'एक लाल दानेदार मीठा फल (Pomegranate).', phonetics: 'Anaar', exampleSentence: 'अनार का रस स्वास्थ्य के लिए उत्तम है।' },
          { word: 'आम', meaning: 'गर्मी के मौसम का प्रसिद्ध फल (Mango).', phonetics: 'Aam', exampleSentence: 'पका हुआ आम बहुत मीठा होता है।' },
          { word: 'किताब', meaning: 'ज्ञान और पठन की पुस्तक (Book).', phonetics: 'Kitaab', exampleSentence: 'राधा प्रतिदिन एक नई किताब पढ़ती है।' },
        ],
        comprehensionQuestions: [
          { question: '"आम" शब्द किस स्वर से शुरू होता है?', options: ['अ', 'आ', 'इ', 'उ'], correctAnswer: 'आ', explanation: '"आम" शब्द दीर्घ स्वर "आ" से शुरू होता है।' },
          { question: 'इनमें से कौन सा शब्द स्वर "इ" से संबंधित है?', options: ['अनार', 'इमली', 'ऊन', 'कमल'], correctAnswer: 'इमली', explanation: '"इमली" शब्द "इ" से आरंभ होता है।' },
        ],
        translations: [
          { language: 'en', translatedTitle: 'Hindi Alphabet: Vowels & Basic Words (A, Aa, I, Ee, U, Oo)', translatedText: 'Vowels are essential in the Hindi alphabet. A for Pomegranate, Aa for Mango, I for Tamarind...', phoneticGuide: 'Anaar, Aam, Imli, Eekh' },
        ],
        tags: ['hindi', 'varnamala', 'vowels', 'beginner'],
        estimatedReadTimeMinutes: 3,
        createdBy: educatorUser._id,
      },

      // Hindi Daily Living & Market Story
      {
        title: 'बाज़ार में खरीदारी और हिसाब-किताब',
        language: 'hi',
        difficultyLevel: 'elementary',
        contentType: 'short_story',
        textContent: 'सुनीता हर शनिवार सुबह स्थानीय साप्ताहिक बाज़ार जाती है। बाज़ार में ताज़ी हरी सब्जियाँ, दालें और फल मिलते हैं। आज उसने दो किलो आलू पचास रुपये में, एक किलो टमाटर तीस रुपये में और आधा किलो पालक बीस रुपये में खरीदा। कुल मिलाकर उसने दुकानदार को सौ रुपये का नोट दिया। दुकानदार ने उसे कोई छुट्टा नहीं लौटाया क्योंकि कुल बिल ठीक सौ रुपये का था। सुनीता ने अपनी कपड़े की थैली में सारी सब्जियाँ रखीं और घर लौटी।',
        phoneticGuide: 'कठिन शब्द: साप्ताहिक (Saaptaahik), किलोग्राम (Kilogram), हिसाब (Hisaab), दुकानदार (Dukaandaar).',
        summary: 'दैनिक जीवन में बाजार की सूची पढ़ना, मूल्यों को समझना और साधारण हिसाब लगाना।',
        imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800',
        vocabulary: [
          { word: 'बाज़ार', meaning: 'क्रय-विक्रय का सार्वजनिक स्थान (Market).', phonetics: 'Baazaar', exampleSentence: 'बाज़ार में बहुत भीड़ थी।' },
          { word: 'हिसाब', meaning: 'पैसों या वस्तुओं की सही गणना (Calculation).', phonetics: 'Hisaab', exampleSentence: 'सुनीता ने पूरा हिसाब सही तरीके से लगाया।' },
        ],
        comprehensionQuestions: [
          { question: 'सुनीता ने कुल कितने रुपये की सब्जियाँ खरीदीं?', options: ['₹80', '₹90', '₹100', '₹120'], correctAnswer: '₹100', explanation: 'आलू ₹50 + टमाटर ₹30 + पालक ₹20 = ₹100.' },
          { question: 'सुनीता किस दिन बाज़ार जाती है?', options: ['सोमवार', 'शनिवार', 'रविवार', 'बुधवार'], correctAnswer: 'शनिवार', explanation: 'कहानी के अनुसार वह हर शनिवार सुबह बाज़ार जाती है।' },
        ],
        translations: [
          { language: 'en', translatedTitle: 'Shopping & Budgeting at the Market', translatedText: 'Sunita goes to the local weekly market every Saturday morning...', phoneticGuide: 'Market shopping story with budgeting skills.' },
        ],
        tags: ['market', 'shopping', 'math_literacy', 'daily_life'],
        estimatedReadTimeMinutes: 4,
        createdBy: educatorUser._id,
      },

      // Spanish Beginner Literacy
      {
        title: 'Las Vocales y Palabras Básicas en Español',
        language: 'es',
        difficultyLevel: 'beginner',
        contentType: 'letter_phonics',
        textContent: 'En español hay cinco vocales claras y definidas: A, E, I, O, U. A de Auto (coche), E de Estrella (en el cielo), I de Isla (tierra rodeada de agua), O de Oso (animal del bosque), U de Uva (fruta deliciosa).',
        phoneticGuide: 'Pronunciación pura: A (/a/), E (/e/), I (/i/), O (/o/), U (/u/).',
        summary: 'Aprende las 5 vocales fundamentales y vocabulario diario en español con apoyo visual.',
        imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
        vocabulary: [
          { word: 'Estrella', meaning: 'Cuerpo celeste que brilla en el cielo nocturno (Star).', phonetics: '/esˈtɾe.ʝa/', exampleSentence: 'La estrella brilla en la noche.' },
          { word: 'Isla', meaning: 'Porción de tierra rodeada de agua por todas partes (Island).', phonetics: '/ˈiz.la/', exampleSentence: 'Viajamos a una isla hermosa.' },
        ],
        comprehensionQuestions: [
          { question: '¿Cuál es la primera vocal del alfabeto?', options: ['A', 'E', 'I', 'O'], correctAnswer: 'A', explanation: 'La letra "A" es la primera vocal.' },
          { question: '¿Qué palabra empieza con la vocal "O"?', options: ['Auto', 'Oso', 'Uva', 'Estrella'], correctAnswer: 'Oso', explanation: '"Oso" empieza con la letra "O".' },
        ],
        translations: [
          { language: 'en', translatedTitle: 'Vowels & Basic Words in Spanish', translatedText: 'In Spanish there are five clear vowels: A, E, I, O, U...', phoneticGuide: 'Auto, Estrella, Isla, Oso, Uva' },
        ],
        tags: ['spanish', 'vocales', 'beginner'],
        estimatedReadTimeMinutes: 3,
        createdBy: educatorUser._id,
      },
    ]);

    // 3. Create Curriculums
    logger.info('🎓 Creating structured curriculums...');
    await Curriculum.create([
      {
        title: 'Foundational English Literacy for Adults & Neo-Learners',
        code: 'CURR-ENG-101',
        description: 'A step-by-step progressive pathway covering letter phonetics, sight words, basic sentences, and practical daily reading.',
        language: 'en',
        targetLevel: 'beginner',
        category: 'Alphabet & Phonics',
        sequence: 1,
        icon: 'BookOpen',
        modules: [
          {
            moduleId: 'MOD-ENG-1',
            title: 'Module 1: Alphabet Sounds & Letter Recognition',
            description: 'Master uppercase and lowercase letter sounds, vowels, and simple 3-letter words.',
            order: 1,
            badgeReward: 'Phonics Pioneer',
            lessons: [
              {
                lessonId: 'LES-ENG-101',
                title: 'Short Vowels and Consonant Blends',
                type: 'phonics',
                description: 'Understand A, E, I, O, U sound patterns.',
                contentRef: contents[0]._id,
                order: 1,
                objectives: ['Identify 5 English short vowels', 'Read 10 CVC words correctly'],
                estimatedMinutes: 15,
              },
              {
                lessonId: 'LES-ENG-102',
                title: 'High-Frequency Sight Words',
                type: 'vocabulary',
                description: 'Recognize the 50 most common sight words by sight without sounding out letter by letter.',
                order: 2,
                objectives: ['Recognize words: The, And, Is, You, To, In'],
                estimatedMinutes: 20,
              },
            ],
          },
          {
            moduleId: 'MOD-ENG-2',
            title: 'Module 2: Practical Everyday Reading & Signs',
            description: 'Navigate public transport signs, safety notices, and clinic appointments with confidence.',
            order: 2,
            badgeReward: 'Community Navigator',
            lessons: [
              {
                lessonId: 'LES-ENG-201',
                title: 'Healthcare & Clinic Literacy',
                type: 'story_reading',
                description: 'Read clinic appointment slips, doctor instructions, and medicine dosages.',
                contentRef: contents[1]._id,
                order: 1,
                objectives: ['Read a clinic slip', 'Identify symptom vocabulary'],
                estimatedMinutes: 25,
              },
            ],
          },
        ],
        createdBy: educatorUser._id,
      },

      {
        title: 'बुनियादी हिंदी साक्षरता एवं व्यावहारिक ज्ञान',
        code: 'CURR-HIN-101',
        description: 'अक्षर ज्ञान, मात्राओं की समझ, दैनिक शब्दावली और व्यावहारिक जीवन में पठन-पाठन का संपूर्ण पाठ्यक्रम।',
        language: 'hi',
        targetLevel: 'beginner',
        category: 'Alphabet & Phonics',
        sequence: 1,
        icon: 'GraduationCap',
        modules: [
          {
            moduleId: 'MOD-HIN-1',
            title: 'भाग १: वर्णमाला और स्वर पहचान',
            description: 'हिंदी स्वरों और व्यंजनों की आकृति और उच्चारण का अभ्यास।',
            order: 1,
            badgeReward: 'वर्णमाला प्रवीण',
            lessons: [
              {
                lessonId: 'LES-HIN-101',
                title: 'स्वर वर्ण और सरल शब्द',
                type: 'phonics',
                description: 'अ से अः तक स्वरों का शुद्ध उच्चारण।',
                contentRef: contents[2]._id,
                order: 1,
                objectives: ['स्वर पहचान', 'सरल शब्दों का पठन'],
                estimatedMinutes: 15,
              },
            ],
          },
          {
            moduleId: 'MOD-HIN-2',
            title: 'भाग २: व्यावहारिक दैनिक साक्षरता',
            description: 'बाज़ार की खरीदारी, बैंक की पर्ची और सूचना पट्ट पढ़ना।',
            order: 2,
            badgeReward: 'दैनिक साक्षरता शिल्पी',
            lessons: [
              {
                lessonId: 'LES-HIN-201',
                title: 'बाज़ार और मुद्रा का हिसाब',
                type: 'practical_usage',
                description: 'सब्जी मंडी और किराने की दुकान पर बिल समझना।',
                contentRef: contents[3]._id,
                order: 1,
                objectives: ['बिल पढ़ना', 'संख्याओं का ज्ञान'],
                estimatedMinutes: 20,
              },
            ],
          },
        ],
        createdBy: educatorUser._id,
      },
    ]);

    // 4. Create Diagnostic & Benchmark Assessments
    logger.info('📝 Creating benchmark assessments...');
    const assessments = await Assessment.create([
      // English Comprehensive Literacy Benchmark Assessment
      {
        title: 'English Diagnostic Literacy Benchmark (Reading, Writing & Comprehension)',
        code: 'ASSESS-ENG-BENCH-01',
        description: 'Comprehensive baseline evaluation to gauge reading accuracy, spelling, vocabulary, and reading comprehension.',
        language: 'en',
        type: 'benchmark',
        targetLevel: 'beginner',
        timeLimitMinutes: 15,
        totalPoints: 100,
        passingScorePercentage: 60,
        questions: [
          {
            questionId: 'Q-ENG-1',
            type: 'multiple_choice',
            prompt: 'Which word matches the sound of the letter blend "B-A-T"?',
            options: ['Bat', 'Tab', 'Bet', 'Bit'],
            correctAnswer: 'Bat',
            points: 15,
            skillCategory: 'phonics',
            explanation: 'B + A + T forms the word "Bat".',
          },
          {
            questionId: 'Q-ENG-2',
            type: 'picture_match',
            prompt: 'Identify the word for an object used to keep rain off you:',
            options: ['Umbrella', 'Shoe', 'Window', 'Pencil'],
            correctAnswer: 'Umbrella',
            points: 15,
            skillCategory: 'vocabulary',
            explanation: 'An umbrella protects you from rain.',
          },
          {
            questionId: 'Q-ENG-3',
            type: 'fill_in_blank',
            prompt: 'Complete the sentence with the correct spelling: "Please write your _____ on the clinic form."',
            options: ['naem', 'name', 'nema', 'neym'],
            correctAnswer: 'name',
            points: 20,
            skillCategory: 'writing',
            explanation: 'The correct English spelling is "name".',
          },
          {
            questionId: 'Q-ENG-4',
            type: 'sentence_reorder',
            prompt: 'Arrange the scrambled words to form a sensible sentence: [morning / the / rises / in / sun / the]',
            options: [
              'The sun rises in the morning',
              'Rises the sun in the morning',
              'Morning in the sun rises the',
              'The morning rises in the sun',
            ],
            correctAnswer: 'The sun rises in the morning',
            points: 25,
            skillCategory: 'writing',
            explanation: 'Standard Subject-Verb-Preposition syntax.',
          },
          {
            questionId: 'Q-ENG-5',
            type: 'reading_passage',
            prompt: 'According to the passage, where should Priya wait for the doctor?',
            passage: 'Priya visited the village clinic at 10 AM. The receptionist handed her token number 7 and asked her to sit quietly in Waiting Room A until her name was called.',
            options: ['Outside in the parking lot', 'In Waiting Room A', 'In the pharmacy', 'At the grocery store'],
            correctAnswer: 'In Waiting Room A',
            points: 25,
            skillCategory: 'comprehension',
            explanation: 'The passage explicitly states she was asked to sit in Waiting Room A.',
          },
        ],
        createdBy: educatorUser._id,
      },

      // Hindi Comprehensive Benchmark Assessment
      {
        title: 'हिंदी प्रारंभिक साक्षरता मूल्यांकन परीक्षा (पठन, लेखन और बोध)',
        code: 'ASSESS-HIN-BENCH-01',
        description: 'नव-शिक्षार्थियों के लिए अक्षर ज्ञान, शब्द वर्तनी और वाक्य समझ का व्यापक प्रारंभिक परीक्षण।',
        language: 'hi',
        type: 'benchmark',
        targetLevel: 'beginner',
        timeLimitMinutes: 15,
        totalPoints: 100,
        passingScorePercentage: 60,
        questions: [
          {
            questionId: 'Q-HIN-1',
            type: 'multiple_choice',
            prompt: 'अक्षर "क" और "ल" को मिलाकर कौन सा शब्द बनता है?',
            options: ['कल', 'लक', 'कम', 'जल'],
            correctAnswer: 'कल',
            points: 20,
            skillCategory: 'phonics',
            explanation: 'क + ल = कल।',
          },
          {
            questionId: 'Q-HIN-2',
            type: 'fill_in_blank',
            prompt: 'सही शब्द चुनकर वाक्य पूरा करें: "राधा प्रतिदिन विद्यालय जाकर _____ पढ़ती है।"',
            options: ['किताब', 'कुर्सी', 'दीवार', 'सड़क'],
            correctAnswer: 'किताब',
            points: 20,
            skillCategory: 'vocabulary',
            explanation: 'विद्यालय में किताब पढ़ी जाती है।',
          },
          {
            questionId: 'Q-HIN-3',
            type: 'fill_in_blank',
            prompt: 'दिए गए शब्दों में से सही वर्तनी (Spelling) वाला शब्द चुनें:',
            options: ['स्वास्थय', 'स्वास्थ्य', 'स्वास्थ', 'सवास्थ्य'],
            correctAnswer: 'स्वास्थ्य',
            points: 25,
            skillCategory: 'writing',
            explanation: '"स्वास्थ्य" शुद्ध वर्तनी है।',
          },
          {
            questionId: 'Q-HIN-4',
            type: 'reading_passage',
            prompt: 'रमेश ने कुल कितने रुपये खर्च किए?',
            passage: 'रमेश बाज़ार गया। उसने बीस रुपये की कॉपी और दस रुपये की कलम खरीदी। उसने दुकानदार को पचास रुपये का नोट दिया।',
            options: ['₹20', '₹30', '₹40', '₹50'],
            correctAnswer: '₹30',
            points: 35,
            skillCategory: 'comprehension',
            explanation: 'कॉपी (₹20) + कलम (₹10) = ₹30 कुल खर्च।',
          },
        ],
        createdBy: educatorUser._id,
      },
    ]);

    // 5. Seed a sample past assessment submission for Aarav Patel
    logger.info('📊 Creating sample benchmark submission for learner...');
    const sampleAssessment = assessments[0];
    await AssessmentSubmission.create({
      userId: learnerHi._id,
      assessmentId: sampleAssessment._id,
      answers: [
        { questionId: 'Q-ENG-1', selectedAnswer: 'Bat', isCorrect: true, pointsEarned: 15, skillCategory: 'phonics' },
        { questionId: 'Q-ENG-2', selectedAnswer: 'Umbrella', isCorrect: true, pointsEarned: 15, skillCategory: 'vocabulary' },
        { questionId: 'Q-ENG-3', selectedAnswer: 'name', isCorrect: true, pointsEarned: 20, skillCategory: 'writing' },
        { questionId: 'Q-ENG-4', selectedAnswer: 'The sun rises in the morning', isCorrect: true, pointsEarned: 25, skillCategory: 'writing' },
        { questionId: 'Q-ENG-5', selectedAnswer: 'In Waiting Room A', isCorrect: true, pointsEarned: 25, skillCategory: 'comprehension' },
      ],
      scores: {
        overallScore: 100,
        readingScore: 100,
        writingScore: 100,
        comprehensionScore: 100,
        totalQuestions: 5,
        correctCount: 5,
      },
      benchmarkAssigned: 'advanced',
      feedback: 'Outstanding performance! You have demonstrated strong reading fluency, precise spelling, and deep comprehension.',
      strengths: ['Reading Fluency & Passage Comprehension', 'Sentence Construction & Spelling', 'Story Understanding & Context Extraction'],
      areasForImprovement: ['Keep challenging yourself with advanced texts'],
      timeSpentSeconds: 180,
    });

    // Update learner profile
    await User.findByIdAndUpdate(learnerHi._id, {
      $set: { proficiencyLevel: 'advanced' },
      $push: {
        benchmarkHistory: {
          assessmentId: sampleAssessment._id,
          benchmarkLevel: 'advanced',
          overallScore: 100,
          readingScore: 100,
          writingScore: 100,
          comprehensionScore: 100,
          feedback: 'Outstanding performance in diagnostic baseline.',
          assessedAt: new Date(),
        },
      },
    });

    logger.info('🎉 Database successfully seeded with full Phase 1 dataset!');
    logger.info('---------------------------------------------------------');
    logger.info('Default Credentials:');
    logger.info('  Admin:    admin@literacy.org / Password123!');
    logger.info('  Educator: educator@literacy.org / Password123!');
    logger.info('  Learner:  learner@literacy.org / Password123! (Hindi)');
    logger.info('  Learner:  learner.en@literacy.org / Password123! (English)');
    logger.info('  Learner:  learner.es@literacy.org / Password123! (Spanish)');
    logger.info('---------------------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
