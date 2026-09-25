import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { bhashiniApi } from '../api/bhashiniApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { SUPPORTED_LANGUAGES } from '../utils/constants.js';

export const LanguageContext = createContext(null);

const STORAGE_KEY_INTERFACE = 'neoread_interface_lang';
const STORAGE_KEY_LEARNING = 'neoread_learning_lang';

// Instant local fallback dictionary for zero latency
const LOCAL_UI_DICTIONARY = {
  en: {
    dashboard: 'Learner Dashboard',
    curriculum: 'Curriculums & Modules',
    library: 'Multilingual Library',
    assessments: 'Assessments & Tests',
    games: 'Games & Puzzles',
    spacedRepetition: 'Spaced Repetition Lab',
    voiceLab: 'Voice & Pronunciation',
    analytics: 'Educator Analytics',
    aiAgent: 'AI Agent Progress',
    profile: 'Learner Profile',
    welcome: 'Welcome to Your Learning Portal',
    streak: 'Day Streak',
    xp: 'Total XP',
    startLesson: 'Start Lesson',
    curriculumProgress: 'Curriculum Progress',
    skillMastery: 'Skill Mastery',
    readingFluency: 'Reading Fluency',
    sentenceConstruction: 'Sentence Construction',
    passageComprehension: 'Passage Comprehension',
    interfaceLanguage: 'Interface Language',
    languageToLearn: 'Language to Learn',
    listeningAid: 'Listen Aloud (Audio Aid)',
  },
  te: {
    dashboard: 'లెర్నర్ డాష్‌బోర్డ్',
    curriculum: 'పాఠ్యాంశాలు & మాడ్యూల్స్',
    library: 'బహుభాషా గ్రంథాలయం',
    assessments: 'పరీక్షలు & మూల్యాంకనాలు',
    games: 'ఆటలు & పజిల్స్',
    spacedRepetition: 'జ్ఞాపకశక్తి పునశ్చరణ ల్యాబ్',
    voiceLab: 'ధ్వని & ఉచ్చారణ సాధన',
    analytics: 'ఉపాధ్యాయ విశ్లేషణలు',
    aiAgent: 'AI అసిస్టెంట్ అభ్యసన ప్రగతి',
    profile: 'అభ్యాసకుని ప్రొఫైల్',
    welcome: 'మీ అభ్యాస వేదికకు స్వాగతం',
    streak: 'రోజుల నిరంతర సాధన',
    xp: 'మొత్తం XP',
    startLesson: 'పాఠం ప్రారంభించండి',
    curriculumProgress: 'పాఠ్యాంశ పురోగతి',
    skillMastery: 'నైపుణ్య ప్రావీణ్యం',
    readingFluency: 'పఠన నైపుణ్యం',
    sentenceConstruction: 'వాక్య నిర్మాణం',
    passageComprehension: 'అవగాహన శక్తి',
    interfaceLanguage: 'వెబ్‌సైట్ ఇంటర్‌ఫేస్ భాష',
    languageToLearn: 'నేర్చుకోవలసిన భాష',
    listeningAid: 'ధ్వని వినండి (ఆడియో సహాయం)',
  },
  hi: {
    dashboard: 'शिक्षार्थी डैशबोर्ड',
    curriculum: 'पाठ्यक्रम और मॉड्यूल',
    library: 'बहुभाषी पुस्तकालय',
    assessments: 'मूल्यांकन और परीक्षाएं',
    games: 'खेल और पहेलियां',
    spacedRepetition: 'स्मृति अभ्यास प्रयोगशाला',
    voiceLab: 'वाणी और उच्चारण अभ्यास',
    analytics: 'शिक्षक विश्लेषण',
    aiAgent: 'AI एजेंट प्रगति रिपोर्ट',
    profile: 'शिक्षार्थी प्रोफ़ाइल',
    welcome: 'आपके अध्ययन पोर्टल में आपका स्वागत है',
    streak: 'दैनिक स्ट्रीक',
    xp: 'कुल XP',
    startLesson: 'पाठ शुरू करें',
    curriculumProgress: 'पाठ्यक्रम प्रगति',
    skillMastery: 'कौशल प्रवीणता',
    readingFluency: 'पठन प्रवाह',
    sentenceConstruction: 'वाक्य रचना',
    passageComprehension: 'गद्यांश समझ',
    interfaceLanguage: 'इंटरफ़ेस भाषा',
    languageToLearn: 'सीखने की भाषा',
    listeningAid: 'बोलकर सुनें (ऑडियो सहायता)',
  },
  ta: {
    dashboard: 'கற்றல் முகப்பு பலகை',
    curriculum: 'பாடத்திட்டம் & தொகுதிகள்',
    library: 'பன்மொழி நூலகம்',
    assessments: 'மதிப்பீடுகள் & தேர்வுகள்',
    games: 'விளையாட்டுகள் & புதிர்கள்',
    spacedRepetition: 'நினைவாற்றல் பயிற்சி கூடம்',
    voiceLab: 'குரல் & உச்சரிப்பு பயிற்சி',
    analytics: 'ஆசிரியர் பகுப்பாய்வு',
    aiAgent: 'AI முகவர் முன்னேற்றம்',
    profile: 'கற்பவர் சுயவிவரம்',
    welcome: 'உங்கள் கற்றல் தளத்திற்கு நல்வரவு',
    streak: 'தொடர் நாட்கள்',
    xp: 'மொத்த XP',
    startLesson: 'பாடத்தைத் தொடங்குங்கள்',
    curriculumProgress: 'பாடத்திட்ட முன்னேற்றம்',
    skillMastery: 'திறன் தேர்ச்சி',
    readingFluency: 'வாசிப்பு சரளம்',
    sentenceConstruction: 'வாக்கிய உருவாக்கம்',
    passageComprehension: 'பத்தி புரிதல்',
    interfaceLanguage: 'இடைமுக மொழி',
    languageToLearn: 'கற்க வேண்டிய மொழி',
    listeningAid: 'ஒலி கேட்கவும் (ஆடியோ உதவி)',
  },
  kn: {
    dashboard: 'ಕಲಿಕಾರ್ಥಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    curriculum: 'ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಮಾಡ್ಯೂಲ್‌ಗಳು',
    library: 'ಬಹುಭಾಷಾ ಗ್ರಂಥಾಲಯ',
    assessments: 'ಮೌಲ್ಯಮಾಪನಗಳು ಮತ್ತು ಪರೀಕ್ಷೆಗಳು',
    games: 'ಆಟಗಳು ಮತ್ತು ಒಗಟುಗಳು',
    spacedRepetition: 'ಮೆಮೊರಿ ಪುನರಾವರ್ತನೆ ಲ್ಯಾಬ್',
    voiceLab: 'ಧ್ವನಿ ಮತ್ತು ಉಚ್ಚಾರಣೆ ಪ್ರಯೋಗಾಲಯ',
    analytics: 'ಶಿಕ್ಷಕರ ವಿಶ್ಲೇಷಣೆಗಳು',
    aiAgent: 'AI ಏಜೆಂಟ್ ಪ್ರಗತಿ',
    profile: 'ಕಲಿಕಾರ್ಥಿ ಪ್ರೊಫೈಲ್',
    welcome: 'ನಿಮ್ಮ ಕಲಿಕಾ ವೇದಿಕೆಗೆ ಸುಸ್ವಾಗತ',
    streak: 'ದೈನಂದಿನ ಸ್ಟ್ರೀಕ್',
    xp: 'ಒಟ್ಟು XP',
    startLesson: 'ಪಾಠವನ್ನು ಪ್ರಾರಂಭಿಸಿ',
    curriculumProgress: 'ಪಠ್ಯಕ್ರಮದ ಪ್ರಗತಿ',
    skillMastery: 'ಕೌಶಲ್ಯ ಪಾಂಡಿತ್ಯ',
    readingFluency: 'ಓದುವ ನಿರರ್ಗಳತೆ',
    sentenceConstruction: 'ವಾಕ್ಯ ರಚನೆ',
    passageComprehension: 'ಅರ್ಥೈಸಿಕೊಳ್ಳುವಿಕೆ',
    interfaceLanguage: 'ಇಂಟರ್ಫೇಸ್ ಭಾಷೆ',
    languageToLearn: 'ಕಲಿಯಬೇಕಾದ ಭಾಷೆ',
    listeningAid: 'ಧ್ವನಿಯನ್ನು ಆಲಿಸಿ',
  },
  ml: {
    dashboard: 'പഠിതാവിന്റെ ഡാഷ്‌ബോർഡ്',
    curriculum: 'പാഠ്യപദ്ധതിയും മൊഡ്യൂളുകളും',
    library: 'ബഹുഭാഷാ ലൈബ്രറി',
    assessments: 'മൂല്യനിർണ്ണയങ്ങളും പരീക്ഷകളും',
    games: 'ഗെയിമുകളും പസിലുകളും',
    spacedRepetition: 'ഓർമ്മശక్తి പരിശീലന ലാബ്',
    voiceLab: 'ശബ്ദവും ഉച്ചാരണവും',
    analytics: 'അധ്യാപക അനലിറ്റിക്‌സ്',
    aiAgent: 'AI ഏജന്റ് പുരോഗതി',
    profile: 'പഠിതാവിന്റെ പ്രൊഫൈൽ',
    welcome: 'നിങ്ങളുടെ പഠന പോർട്ടലിലേക്ക് സ്വാഗതം',
    streak: 'തുടർച്ചയായ ദിവസങ്ങൾ',
    xp: 'ആകെ XP',
    startLesson: 'പാഠം ആരംഭിക്കുക',
    curriculumProgress: 'പാഠ്യപദ്ധതി പുരോഗതി',
    skillMastery: 'നൈപുണ്യ വൈദഗ്ദ്ധ്യം',
    readingFluency: 'വായനാ പ്രാവീണ്യം',
    sentenceConstruction: 'വാക്യ നിർമ്മാണം',
    passageComprehension: 'വിശകലന ഗ്രഹണം',
    interfaceLanguage: 'ഇന്റർഫേസ് ഭാഷ',
    languageToLearn: 'പഠിക്കേണ്ട ഭാഷ',
    listeningAid: 'ശബ്ദം കേൾക്കുക',
  },
  bn: {
    dashboard: 'শিক্ষার্থী ড্যাশবোর্ড',
    curriculum: 'পাঠ্যক্রম এবং মডিউল',
    library: 'বহুভাষিক লাইব্রেরি',
    assessments: 'মূল্যায়ন ও পরীক্ষা',
    games: 'খেলা ও ধাঁধা',
    spacedRepetition: 'স্মৃতি ঝালাই ল্যাব',
    voiceLab: 'কণ্ঠ ও উচ্চারণ ল্যাব',
    analytics: 'শিক্ষক অ্যানালিটিক্স',
    aiAgent: 'AI এজেন্ট অগ্রগতি',
    profile: 'শিক্ষার্থী প্রোফাইল',
    welcome: 'আপনার লার্নিং পোর্টালে স্বাগতম',
    streak: 'ধারাবাহিক দিন',
    xp: 'মোট XP',
    startLesson: 'পাঠ শুরু করুন',
    curriculumProgress: 'পাঠ্যক্রমের অগ্রগতি',
    skillMastery: 'দক্ষতার দক্ষতা',
    readingFluency: 'পড়ার সাবলীলতা',
    sentenceConstruction: 'বাক্য গঠন',
    passageComprehension: 'অনুচ্ছেদ অনুধাবন',
    interfaceLanguage: 'ইন্টারফেস ভাষা',
    languageToLearn: 'শেখার ভাষা',
    listeningAid: 'শব্দ শুনুন (অডিও সহায়তা)',
  },
  mr: {
    dashboard: 'शिकणाऱ्यांचा डॅशबोर्ड',
    curriculum: 'अभ्यासक्रम आणि मॉड्यूल्स',
    library: 'बहुभाषिक ग्रंथालय',
    assessments: 'मूल्यमापन आणि चाचण्या',
    games: 'खेळ आणि कोडी',
    spacedRepetition: 'स्मृती उजळणी प्रयोगशाळा',
    voiceLab: 'आवाज आणि उच्चार सराव',
    analytics: 'शिक्षक विश्लेषण',
    aiAgent: 'AI एजंट प्रगती',
    profile: 'शिकणाऱ्याचे प्रोफाईल',
    welcome: 'तुमच्या लर्निंग पोर्टलवर स्वागत आहे',
    streak: 'सलग दिवस',
    xp: 'एकूण XP',
    startLesson: 'धडा सुरू करा',
    curriculumProgress: 'अभ्यासक्रम प्रगती',
    skillMastery: 'कौशल्य प्राविण्य',
    readingFluency: 'वाचन प्रवाहीपणा',
    sentenceConstruction: 'वाक्य रचना',
    passageComprehension: 'उतारा आकलन',
    interfaceLanguage: 'इंटरफेस भाषा',
    languageToLearn: 'शिकायची भाषा',
    listeningAid: 'ऐका (ऑडिओ मदत)',
  },
};

export const LanguageProvider = ({ children }) => {
  const { user, updateProfile } = useAuth();

  // 1. Interface Language (for UI, labels, menus, guidance, explanations)
  const [interfaceLanguage, setInterfaceLanguageState] = useState(() => {
    return (
      localStorage.getItem(STORAGE_KEY_INTERFACE) ||
      user?.interfaceLanguage ||
      'en'
    );
  });

  // 2. Learning Language (the language the user is studying/practicing)
  const [learningLanguage, setLearningLanguageState] = useState(() => {
    return (
      localStorage.getItem(STORAGE_KEY_LEARNING) ||
      user?.learningLanguage ||
      user?.preferredLanguage ||
      'te'
    );
  });

  const [uiBundle, setUiBundle] = useState(() => {
    return LOCAL_UI_DICTIONARY[interfaceLanguage] || LOCAL_UI_DICTIONARY.en;
  });

  const [isTranslating, setIsTranslating] = useState(false);

  // Sync with user profile on login
  useEffect(() => {
    if (user?.interfaceLanguage) {
      setInterfaceLanguageState(user.interfaceLanguage);
      localStorage.setItem(STORAGE_KEY_INTERFACE, user.interfaceLanguage);
    }
    if (user?.learningLanguage || user?.preferredLanguage) {
      const targetLang = user.learningLanguage || user.preferredLanguage;
      setLearningLanguageState(targetLang);
      localStorage.setItem(STORAGE_KEY_LEARNING, targetLang);
    }
  }, [user?.interfaceLanguage, user?.learningLanguage, user?.preferredLanguage]);

  // Fetch full Bhashini UI bundle whenever interfaceLanguage changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INTERFACE, interfaceLanguage);

    // Instant local bundle fallback
    const local = LOCAL_UI_DICTIONARY[interfaceLanguage] || LOCAL_UI_DICTIONARY.en;
    setUiBundle(local);

    // Async fetch complete server bundle via Bhashini API
    bhashiniApi
      .getUIBundle(interfaceLanguage)
      .then(res => {
        if (res?.data?.bundle) {
          setUiBundle(prev => ({ ...prev, ...res.data.bundle }));
        }
      })
      .catch(() => {
        // Fallback already in place
      });
  }, [interfaceLanguage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LEARNING, learningLanguage);
  }, [learningLanguage]);

  const setInterfaceLanguage = useCallback(
    async newLang => {
      setInterfaceLanguageState(newLang);
      localStorage.setItem(STORAGE_KEY_INTERFACE, newLang);
      if (user?._id && updateProfile) {
        try {
          await updateProfile({ interfaceLanguage: newLang });
        } catch {
          // Ignore profile sync error
        }
      }
    },
    [user?._id, updateProfile]
  );

  const setLearningLanguage = useCallback(
    async newLang => {
      setLearningLanguageState(newLang);
      localStorage.setItem(STORAGE_KEY_LEARNING, newLang);
      if (user?._id && updateProfile) {
        try {
          await updateProfile({ learningLanguage: newLang, preferredLanguage: newLang });
        } catch {
          // Ignore profile sync error
        }
      }
    },
    [user?._id, updateProfile]
  );

  /**
   * Fast translation helper: looks up key in active Bhashini UI bundle,
   * local dictionary, or client translation cache.
   */
  const t = useCallback(
    (key, defaultText = '') => {
      if (!key) return defaultText || '';
      if (interfaceLanguage === 'en') return defaultText || key;

      // 1. Direct key match in active Bhashini bundle
      if (uiBundle && uiBundle[key]) return uiBundle[key];

      // 2. Default text match in active Bhashini bundle
      if (defaultText && uiBundle && uiBundle[defaultText]) return uiBundle[defaultText];

      // 3. Local hardcoded UI dictionary match
      if (LOCAL_UI_DICTIONARY[interfaceLanguage]?.[key]) {
        return LOCAL_UI_DICTIONARY[interfaceLanguage][key];
      }

      // 4. Check client translation cache
      try {
        const cached = localStorage.getItem(`neoread_translations_${interfaceLanguage}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed[key]) return parsed[key];
          if (defaultText && parsed[defaultText]) return parsed[defaultText];
        }
      } catch {
        // Ignore JSON error
      }

      return defaultText || key;
    },
    [uiBundle, interfaceLanguage]
  );

  /**
   * Dynamic translation using Bhashini API
   */
  const translateText = useCallback(
    async (text, sourceLang = learningLanguage, targetLang = interfaceLanguage) => {
      if (!text || sourceLang === targetLang) return text;
      try {
        setIsTranslating(true);
        const res = await bhashiniApi.translateText(text, sourceLang, targetLang);
        return res?.data?.translatedText || res?.translatedText || text;
      } catch {
        return text;
      } finally {
        setIsTranslating(false);
      }
    },
    [learningLanguage, interfaceLanguage]
  );

  /**
   * Text to speech helper in specific language
   */
  const speakText = useCallback((text, langCode = 'en') => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88;
    utterance.pitch = 1.0;

    const langMap = {
      te: 'te-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      hi: 'hi-IN',
      en: 'en-US',
      bn: 'bn-IN',
      mr: 'mr-IN',
    };

    utterance.lang = langMap[langCode] || 'en-US';
    window.speechSynthesis.speak(utterance);
  }, []);

  const speakInInterfaceLang = useCallback(
    text => {
      speakText(text, interfaceLanguage);
    },
    [speakText, interfaceLanguage]
  );

  const speakInLearningLang = useCallback(
    text => {
      speakText(text, learningLanguage);
    },
    [speakText, learningLanguage]
  );

  const learningLangMeta =
    SUPPORTED_LANGUAGES.find(l => l.code === learningLanguage) || SUPPORTED_LANGUAGES[0];

  const interfaceLangMeta =
    SUPPORTED_LANGUAGES.find(l => l.code === interfaceLanguage) || SUPPORTED_LANGUAGES[5];

  const value = {
    interfaceLanguage,
    setInterfaceLanguage,
    learningLanguage,
    setLearningLanguage,
    interfaceLangMeta,
    learningLangMeta,
    uiBundle,
    t,
    translateText,
    isTranslating,
    speakText,
    speakInInterfaceLang,
    speakInLearningLang,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
