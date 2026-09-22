import React, { createContext, useState, useEffect } from 'react';

export const AccessibilityContext = createContext(null);

export const AccessibilityProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('neo_dark_mode') === 'true';
  });

  const [isDyslexicFont, setIsDyslexicFont] = useState(() => {
    return localStorage.getItem('neo_dyslexic') === 'true';
  });

  const [isHighContrast, setIsHighContrast] = useState(() => {
    return localStorage.getItem('neo_contrast') === 'true';
  });

  const [textScale, setTextScale] = useState(() => {
    return localStorage.getItem('neo_text_scale') || 'normal'; // normal, large, xlarge
  });

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('neo_lang') || 'en';
  });

  // Apply dark mode class
  useEffect(() => {
    localStorage.setItem('neo_dark_mode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Apply body classes
  useEffect(() => {
    localStorage.setItem('neo_dyslexic', isDyslexicFont);
    if (isDyslexicFont) {
      document.body.classList.add('font-dyslexic');
    } else {
      document.body.classList.remove('font-dyslexic');
    }
  }, [isDyslexicFont]);

  useEffect(() => {
    localStorage.setItem('neo_contrast', isHighContrast);
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  useEffect(() => {
    localStorage.setItem('neo_text_scale', textScale);
    let remValue = '1rem';
    if (textScale === 'large') remValue = '1.125rem';
    if (textScale === 'xlarge') remValue = '1.25rem';
    document.documentElement.style.setProperty('--text-scale', remValue);
  }, [textScale]);

  useEffect(() => {
    localStorage.setItem('neo_lang', selectedLanguage);
  }, [selectedLanguage]);

  // Audio speech synthesis helper for neo-learners
  const speakText = (text, langCode = 'en') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // stop previous speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slightly slower pace for neo-learners
    utterance.pitch = 1.0;

    const langMap = {
      en: 'en-US',
      hi: 'hi-IN',
      es: 'es-ES',
      fr: 'fr-FR',
      bn: 'bn-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      mr: 'mr-IN',
    };

    utterance.lang = langMap[langCode] || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const value = {
    isDarkMode,
    setIsDarkMode,
    isDyslexicFont,
    setIsDyslexicFont,
    isHighContrast,
    setIsHighContrast,
    textScale,
    setTextScale,
    selectedLanguage,
    setSelectedLanguage,
    speakText,
    stopSpeaking,
  };

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
};
