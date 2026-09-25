import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Volume2,
  BookOpen,
  Trophy,
  Flame,
  Target,
  Clock,
  Compass,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  ONBOARDING_REASONS,
  ONBOARDING_NEEDS,
  ONBOARDING_DAILY_GOALS,
  ONBOARDING_LEVELS,
} from '../../utils/constants.js';
import { VantaBirdsBackground } from '../../components/landing/VantaBirdsBackground.jsx';
import { BRAND } from '../../utils/branding.js';

// Web Audio API Sound Synthesizer for Duolingo-style sound effects
const playSound = type => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'select') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'next') {
      const notes = [440, 554.37, 659.25];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.06 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.12);
      });
    } else if (type === 'complete') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.25);
      });
    }
  } catch {
    // Graceful fallback if audio is not supported
  }
};

// Optional native TTS greeting pronunciation
const speakGreeting = (text, langCode) => {
  try {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.05;
      if (langCode === 'te') utterance.lang = 'te-IN';
      else if (langCode === 'ta') utterance.lang = 'ta-IN';
      else if (langCode === 'kn') utterance.lang = 'kn-IN';
      else if (langCode === 'ml') utterance.lang = 'ml-IN';
      else if (langCode === 'hi') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  } catch {
    // Ignore speech synthesis errors
  }
};

export const OnboardingFlow = () => {
  const navigate = useNavigate();

  // Current survey step: 1 (Language), 2 (Reason), 3 (Needs), 4 (Time/Hours), 5 (Level), 6 (Celebration)
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Survey answers state
  const [selectedLanguage, setSelectedLanguage] = useState('te'); // Default to Telugu (Target Learning Language)
  const [selectedInterfaceLanguage, setSelectedInterfaceLanguage] = useState('en'); // Interface Language (Bhashini AI)
  const [selectedReason, setSelectedReason] = useState('career');
  const [selectedNeeds, setSelectedNeeds] = useState(['phonics', 'vocabulary']);
  const [selectedDailyGoal, setSelectedDailyGoal] = useState('regular');
  const [selectedLevel, setSelectedLevel] = useState('beginner');

  // Find current objects
  const currentLangObj =
    SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];
  const currentInterfaceLangObj =
    SUPPORTED_LANGUAGES.find(l => l.code === selectedInterfaceLanguage) || SUPPORTED_LANGUAGES[5];
  const currentGoalObj =
    ONBOARDING_DAILY_GOALS.find(g => g.id === selectedDailyGoal) || ONBOARDING_DAILY_GOALS[1];
  const currentReasonObj =
    ONBOARDING_REASONS.find(r => r.id === selectedReason) || ONBOARDING_REASONS[0];
  const currentLevelObj =
    ONBOARDING_LEVELS.find(lvl => lvl.id === selectedLevel) || ONBOARDING_LEVELS[0];

  // Mascot dynamic quotes per step
  const mascotSpeech = {
    1: `Namaskaram! Choose the language you want to learn, and your preferred interface language.`,
    2: `Great choice! What inspires you to learn ${currentLangObj.name} (${currentLangObj.nativeName})?`,
    3: `Personalizing your lessons! Which literacy skills would you like to master?`,
    4: `Consistency is the secret to fluency! How much time can you commit each day?`,
    5: `Where should we begin your personalized reading path?`,
    6: `Fantastic! Your custom ${currentLangObj.name} curriculum is generated and ready to go! 🎉`,
  };

  const handleLanguageSelect = lang => {
    setSelectedLanguage(lang.code);
    playSound('select');
    speakGreeting(lang.greeting || lang.nativeName, lang.code);
  };

  const handleNeedToggle = needId => {
    playSound('select');
    setSelectedNeeds(prev => {
      if (prev.includes(needId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(id => id !== needId);
      } else {
        return [...prev, needId];
      }
    });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      playSound('next');
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === totalSteps) {
      // Step 6: Celebration screen
      playSound('complete');
      setStep(6);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Save onboarding preferences to localStorage
      const onboardingData = {
        language: currentLangObj,
        learningLanguage: selectedLanguage,
        interfaceLanguage: selectedInterfaceLanguage,
        reason: currentReasonObj,
        needs: selectedNeeds,
        dailyGoal: currentGoalObj,
        level: currentLevelObj,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem('neoread_onboarding_data', JSON.stringify(onboardingData));
      localStorage.setItem('neoread_learning_lang', selectedLanguage);
      localStorage.setItem('neoread_interface_lang', selectedInterfaceLanguage);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      playSound('select');
      setStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleProceedToLogin = () => {
    playSound('next');
    navigate('/login', {
      state: {
        fromOnboarding: true,
        preferredLanguage: selectedLanguage,
        learningLanguage: selectedLanguage,
        interfaceLanguage: selectedInterfaceLanguage,
        dailyGoal: currentGoalObj,
      },
    });
  };

  const handleProceedToRegister = () => {
    playSound('next');
    navigate('/register', {
      state: {
        fromOnboarding: true,
        preferredLanguage: selectedLanguage,
        learningLanguage: selectedLanguage,
        interfaceLanguage: selectedInterfaceLanguage,
        targetSkills: selectedNeeds,
        dailyGoal: currentGoalObj,
      },
    });
  };

  const progressPercent = step <= totalSteps ? (step / totalSteps) * 100 : 100;

  return (
    <div className="relative min-h-screen bg-[#407c93] text-white flex flex-col justify-between overflow-x-hidden">
      {/* 3D Vanta Birds Interactive Background */}
      <VantaBirdsBackground
        backgroundColor={0x407c93}
        color1={0x001da2}
        color2={0xf7ad00}
        quantity={3.5}
        birdSize={1.1}
        wingSpan={22.0}
        speedLimit={4.5}
        separation={45.0}
        alignment={35.0}
        cohesion={35.0}
        className="opacity-90"
      />

      {/* TOP HEADER & DUOLINGO-STYLE PROGRESS BAR */}
      <header className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-2">
        <div className="flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-900/40 hover:bg-slate-900/70 border border-white/20 text-slate-200 hover:text-white backdrop-blur-md transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            aria-label="Previous step"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Duolingo Progress Bar */}
          <div className="flex-1 min-w-0 max-w-lg">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-200 mb-1 sm:mb-1.5 px-1">
              <span>{step <= totalSteps ? `Step ${step} of ${totalSteps}` : 'Curriculum Ready!'}</span>
              <span className="text-amber-300 font-extrabold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-slate-900/50 rounded-full h-3 sm:h-3.5 p-0.5 border border-white/20 backdrop-blur-md overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick Direct Login Option - REMOVED after survey is completed (step > totalSteps) */}
          {step <= totalSteps ? (
            <Link
              to="/login"
              className="text-[11px] sm:text-xs font-bold text-slate-200 hover:text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 border border-white/20 backdrop-blur-md transition-all whitespace-nowrap shadow-sm shrink-0"
            >
              Sign In
            </Link>
          ) : (
            /* Spacer to keep progress bar centered cleanly when survey is completed */
            <div className="w-8 sm:w-10 shrink-0" />
          )}
        </div>
      </header>

      {/* MAIN QUESTIONNAIRE CONTAINER */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col justify-center">
        {/* DUOLINGO MASCOT & SPEECH BUBBLE */}
        <div className="mb-4 sm:mb-6 flex items-start sm:items-center gap-3 sm:gap-3.5 bg-slate-900/60 border border-white/20 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl backdrop-blur-2xl shadow-xl animate-fadeIn">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-400 via-brand-500 to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl shadow-lg shadow-amber-500/20 shrink-0 transform hover:scale-105 transition-transform">
            🦉
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300">
                NeoRead Guide
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs sm:text-sm md:text-base font-semibold text-white leading-snug">
              {mascotSpeech[step]}
            </p>
          </div>
        </div>

        {/* =========================================================================
            STEP 1: CHOOSE TARGET LANGUAGE (South Indian Languages Highlighted)
           ========================================================================= */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                What language would you like to learn?
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                Master South Indian scripts & regional Indian languages with interactive phonics
              </p>
            </div>

            {/* South Indian Languages Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-300 pt-1 sm:pt-2">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span>Featured South Indian Languages</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {SUPPORTED_LANGUAGES.slice(0, 4).map(lang => {
                  const isSelected = selectedLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageSelect(lang)}
                      className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all backdrop-blur-xl group cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-brand-400 bg-brand-600/40 shadow-xl shadow-brand-500/30 scale-[1.01] sm:scale-[1.02] ring-2 ring-brand-400/50'
                          : 'border-white/20 bg-slate-900/50 hover:bg-slate-900/70 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                        <div className="text-2xl sm:text-3xl p-1.5 sm:p-2 rounded-xl bg-white/10 border border-white/10 shrink-0">
                          {lang.flag}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-base sm:text-lg font-black text-white tracking-tight">
                              {lang.nativeName}
                            </span>
                            <span className="text-xs font-semibold text-slate-300 truncate">
                              ({lang.name})
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-300 font-medium truncate">
                            {lang.region}
                          </p>
                          <span className="inline-block mt-0.5 sm:mt-1 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            {lang.badge || lang.speakers}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-brand-300 bg-brand-400 text-slate-900 font-bold'
                              : 'border-white/30 bg-white/5 text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                        </div>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            speakGreeting(lang.audioText || lang.greeting, lang.code);
                          }}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Listen to pronunciation"
                          aria-label={`Pronounce ${lang.name}`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Other Languages Section */}
            <div className="space-y-2 pt-1 sm:pt-2">
              <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-300">
                Additional Languages
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {SUPPORTED_LANGUAGES.slice(4).map(lang => {
                  const isSelected = selectedLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageSelect(lang)}
                      className={`relative p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all backdrop-blur-xl group cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-brand-400 bg-brand-600/40 shadow-xl shadow-brand-500/30 scale-[1.01] sm:scale-[1.02] ring-2 ring-brand-400/50'
                          : 'border-white/20 bg-slate-900/50 hover:bg-slate-900/70 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="text-xl sm:text-2xl p-1.5 rounded-lg bg-white/10 border border-white/10 shrink-0">
                          {lang.flag}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                              {lang.nativeName}
                            </span>
                            <span className="text-xs text-slate-300 truncate">({lang.name})</span>
                          </div>
                          <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">{lang.region}</p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-all ${
                          isSelected
                            ? 'border-brand-300 bg-brand-400 text-slate-900 font-bold'
                            : 'border-white/30 bg-white/5 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interface Language Preference Section */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/20 backdrop-blur-md space-y-2.5 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Website Interface Language (Bhashini AI)
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  UI: {currentInterfaceLangObj.nativeName}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Which language should the website menus, instructions, hints, and explanations be shown in?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {SUPPORTED_LANGUAGES.map(lang => {
                  const isSelected = selectedInterfaceLanguage === lang.code;
                  return (
                    <button
                      key={`ui-select-${lang.code}`}
                      type="button"
                      onClick={() => setSelectedInterfaceLanguage(lang.code)}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-600/40 text-white font-bold ring-1 ring-indigo-400'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="truncate">{lang.flag} {lang.nativeName}</span>
                      {isSelected && <Check className="w-3 h-3 text-indigo-300 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: WHY ARE YOU LEARNING? (Motivation)
           ========================================================================= */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                Why are you learning {currentLangObj.name}?
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                We'll tailor your lessons and daily exercises to help you reach this goal
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              {ONBOARDING_REASONS.map(reason => {
                const isSelected = selectedReason === reason.id;
                return (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => {
                      setSelectedReason(reason.id);
                      playSound('select');
                    }}
                    className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all backdrop-blur-xl group cursor-pointer flex items-start gap-3 sm:gap-3.5 ${
                      isSelected
                        ? 'border-brand-400 bg-brand-600/40 shadow-xl shadow-brand-500/30 scale-[1.01] sm:scale-[1.02] ring-2 ring-brand-400/50'
                        : 'border-white/20 bg-slate-900/50 hover:bg-slate-900/70 hover:border-white/40'
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl p-1.5 sm:p-2 rounded-xl bg-white/10 border border-white/10 shrink-0">
                      {reason.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-xs sm:text-sm md:text-base font-bold text-white truncate">
                          {reason.title}
                        </h3>
                        {reason.popular && (
                          <span className="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: WHAT DO YOU NEED THE MOST? (Literacy Needs)
           ========================================================================= */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                What literacy skills do you need most?
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                Select one or more key areas you would like to strengthen
              </p>
            </div>

            <div className="space-y-2 sm:space-y-2.5 pt-1 sm:pt-2">
              {ONBOARDING_NEEDS.map(need => {
                const isSelected = selectedNeeds.includes(need.id);
                return (
                  <button
                    key={need.id}
                    type="button"
                    onClick={() => handleNeedToggle(need.id)}
                    className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all backdrop-blur-xl group cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-brand-400 bg-brand-600/40 shadow-xl shadow-brand-500/30 scale-[1.01] ring-2 ring-brand-400/50'
                        : 'border-white/20 bg-slate-900/50 hover:bg-slate-900/70 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                      <div className="text-xl sm:text-2xl p-1.5 sm:p-2 rounded-xl bg-white/10 border border-white/10 shrink-0">
                        {need.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm md:text-base font-bold text-white truncate">
                          {need.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                          {need.description}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border flex items-center justify-center shrink-0 ml-2 transition-all ${
                        isSelected
                          ? 'border-brand-300 bg-brand-400 text-slate-900 font-bold'
                          : 'border-white/30 bg-white/5 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: DAILY TIME COMMITMENT (How many hours/minutes)
           ========================================================================= */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                What's your daily practice goal?
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                Setting a realistic routine builds lasting literacy confidence
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
              {ONBOARDING_DAILY_GOALS.map(goal => {
                const isSelected = selectedDailyGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => {
                      setSelectedDailyGoal(goal.id);
                      playSound('select');
                    }}
                    className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all backdrop-blur-xl group cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-brand-400 bg-brand-600/40 shadow-xl shadow-brand-500/30 scale-[1.01] sm:scale-[1.02] ring-2 ring-brand-400/50'
                        : 'border-white/20 bg-slate-900/50 hover:bg-slate-900/70 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl">{goal.icon}</span>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-white">
                            {goal.levelTitle}
                          </h3>
                          <span className="text-[11px] sm:text-xs font-black text-amber-300">
                            {goal.hoursDisplay}
                          </span>
                        </div>
                      </div>
                      {goal.recommended && (
                        <span className="px-2 py-0.5 text-[8px] sm:text-[10px] font-black uppercase tracking-wider rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 shrink-0">
                          Recommended
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mb-2 sm:mb-3">
                      {goal.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] sm:text-[11px] font-semibold text-slate-300">
                      <span>Pace: {goal.pace}</span>
                      <span className="text-amber-300 font-bold">{goal.xpMultiplier}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: CURRENT KNOWLEDGE LEVEL
           ========================================================================= */}
        {step === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                How much {currentLangObj.name} do you know?
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                This places you at the ideal starting module in the curriculum
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
              {ONBOARDING_LEVELS.map(lvl => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => {
                      setSelectedLevel(lvl.id);
                      playSound('select');
                    }}
                    className={`w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all backdrop-blur-xl group cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-brand-400 bg-brand-600/40 shadow-xl shadow-brand-500/30 scale-[1.01] ring-2 ring-brand-400/50'
                        : 'border-white/20 bg-slate-900/50 hover:bg-slate-900/70 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                      <div className="text-2xl sm:text-3xl p-1.5 sm:p-2 rounded-xl bg-white/10 border border-white/10 shrink-0">
                        {lvl.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <h3 className="text-xs sm:text-sm md:text-base font-bold text-white">
                            {lvl.title}
                          </h3>
                          <span className="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-bold rounded-md bg-white/10 text-slate-300 border border-white/20">
                            {lvl.badge}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-0.5">
                          {lvl.subtitle}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-all ${
                        isSelected
                          ? 'border-brand-300 bg-brand-400 text-slate-900 font-bold'
                          : 'border-white/30 bg-white/5 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 6: CELEBRATION & PERSONALIZED PLAN SUMMARY (Survey Completed)
           ========================================================================= */}
        {step === 6 && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn py-1 sm:py-2">
            <div className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-slate-900/85 border border-white/20 backdrop-blur-2xl shadow-2xl text-center space-y-4 sm:space-y-6">
              {/* Confetti & Trophy Badge */}
              <div className="relative inline-block mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-amber-400 via-brand-500 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-2xl shadow-amber-400/30 animate-bounce">
                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-200" />
                </div>
                <div className="absolute -top-1 -right-1 text-xl sm:text-2xl animate-spin">✨</div>
                <div className="absolute -bottom-1 -left-1 text-xl sm:text-2xl animate-pulse">🎉</div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Personalized Learning Plan Ready</span>
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  You're Ready to Learn {currentLangObj.name}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 max-w-md mx-auto leading-relaxed">
                  We've calibrated your curriculum with voice assistance and phonics lessons
                </p>
              </div>

              {/* Personalized Plan Snapshot Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-left">
                <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5 sm:mb-1">
                    Learning Track
                  </span>
                  <div className="flex items-center gap-1.5 font-black text-white text-sm sm:text-base truncate">
                    <span>{currentLangObj.flag}</span>
                    <span className="truncate">{currentLangObj.nativeName}</span>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5 sm:mb-1">
                    UI Language
                  </span>
                  <div className="flex items-center gap-1.5 font-black text-indigo-300 text-sm sm:text-base truncate">
                    <span>{currentInterfaceLangObj.flag}</span>
                    <span className="truncate">{currentInterfaceLangObj.nativeName}</span>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5 sm:mb-1">
                    Daily Goal
                  </span>
                  <div className="flex items-center gap-1 font-black text-amber-300 text-xs sm:text-sm truncate">
                    <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                    <span className="truncate">{currentGoalObj.hoursDisplay}</span>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5 sm:mb-1">
                    Target Goal
                  </span>
                  <div className="flex items-center gap-1 font-bold text-white text-[11px] sm:text-xs truncate">
                    <Target className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{currentReasonObj.title.split('&')[0]}</span>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5 sm:mb-1">
                    Starting Point
                  </span>
                  <div className="flex items-center gap-1 font-bold text-emerald-300 text-[11px] sm:text-xs truncate">
                    <span className="truncate">{currentLevelObj.badge}</span>
                  </div>
                </div>
              </div>

              {/* Projected Milestone Pill */}
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-brand-600/30 to-indigo-600/30 border border-brand-400/30 text-[11px] sm:text-xs font-semibold text-slate-200 leading-snug">
                🚀 Projected Milestone:{' '}
                <span className="text-white font-bold">
                  Read complete sentences in just 14 days with {currentGoalObj.hoursDisplay}!
                </span>
              </div>

              {/* Action Buttons to Register or Login */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleProceedToRegister}
                  className="w-full py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                  <span>Create Free Account & Start Learning</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 pt-1">
                  <span>Already have an account?</span>
                  <button
                    type="button"
                    onClick={handleProceedToLogin}
                    className="font-bold text-amber-300 hover:text-white underline hover:no-underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM CONTINUE ACTION BAR (Steps 1 to 5) */}
        {step <= totalSteps && (
          <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-white/10 mt-4 sm:mt-6">
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium text-center sm:text-left">
              Press <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded">Continue</span> to save your choices
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full sm:w-auto py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
            >
              <span>{step === totalSteps ? 'Complete & Generate Plan' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-3 sm:py-4 text-center text-[11px] sm:text-xs text-slate-300 font-medium px-4">
        <span>© 2026 {BRAND.name}. Free Public Multilingual Literacy Platform.</span>
      </footer>
    </div>
  );
};

export default OnboardingFlow;
