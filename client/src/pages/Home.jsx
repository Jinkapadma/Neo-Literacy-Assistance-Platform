import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useAccessibility } from '../hooks/useAccessibility.js';
import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';
import { ProficiencyBadge } from '../components/common/Badge.jsx';
import {
  BookOpen,
  GraduationCap,
  Award,
  Globe2,
  Volume2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Eye,
  Type,
  Sun,
  Layers,
  HeartHandshake,
  Check,
  Play,
  FileText,
  Bus,
  Stethoscope,
  ShoppingCart,
  Users,
  Star,
  BookMarked,
  ShieldCheck,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../utils/constants.js';

export const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const { speakText, selectedLanguage, setSelectedLanguage, isDyslexicFont, setIsDyslexicFont, isHighContrast, setIsHighContrast } = useAccessibility();

  // Interactive Phonics Demo state
  const [activePhonicWord, setActivePhonicWord] = useState('Apple');
  const [activeLangTab, setActiveLangTab] = useState('en');

  // Mini Assessment Sandbox state
  const [sandboxAnswer, setSandboxAnswer] = useState(null);
  const [sandboxSubmitted, setSandboxSubmitted] = useState(false);

  const phonicsSamples = {
    en: [
      { letter: 'A a', word: 'Apple', icon: '🍎', phonetics: '/ˈæp.əl/', soundText: 'A as in Apple' },
      { letter: 'B b', word: 'Bird', icon: '🐦', phonetics: '/bɜːrd/', soundText: 'B as in Bird' },
      { letter: 'C c', word: 'Cat', icon: '🐱', phonetics: '/kæt/', soundText: 'C as in Cat' },
      { letter: 'S s', word: 'Sun', icon: '☀️', phonetics: '/sʌn/', soundText: 'S as in Sun' },
    ],
    hi: [
      { letter: 'अ', word: 'अनार', icon: '🍇', phonetics: 'Anaar', soundText: 'अ से अनार' },
      { letter: 'आ', word: 'आम', icon: '🥭', phonetics: 'Aam', soundText: 'आ से आम' },
      { letter: 'क', word: 'कमल', icon: '🪷', phonetics: 'Kamal', soundText: 'क से कमल' },
      { letter: 'ख', word: 'खरगोश', icon: '🐰', phonetics: 'Khargosh', soundText: 'ख से खरगोश' },
    ],
    es: [
      { letter: 'A a', word: 'Auto', icon: '🚗', phonetics: '/ˈaw.to/', soundText: 'A de Auto' },
      { letter: 'E e', word: 'Estrella', icon: '⭐', phonetics: '/esˈtɾe.ʝa/', soundText: 'E de Estrella' },
      { letter: 'I i', word: 'Isla', icon: '🏝️', phonetics: '/ˈiz.la/', soundText: 'I de Isla' },
      { letter: 'O o', word: 'Oso', icon: '🐻', phonetics: '/ˈo.so/', soundText: 'O de Oso' },
    ],
  };

  const handlePlayPhonic = sample => {
    setActivePhonicWord(sample.word);
    speakText(sample.soundText, activeLangTab);
  };

  const pillars = [
    {
      title: 'Structured Literacy Curriculum',
      description: 'Step-by-step modular lessons taking you from individual letter phonetics to confident paragraph reading.',
      icon: GraduationCap,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      badge: 'Step-by-Step',
      to: '/curriculum',
      btnText: 'Explore Curriculums',
    },
    {
      title: 'Multilingual Reading Library',
      description: 'Stories, daily life documents, and vocabulary flashcards in 8 languages with instant audio read-aloud support.',
      icon: Globe2,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      badge: '8 Languages',
      to: '/content',
      btnText: 'Browse Content',
    },
    {
      title: 'Diagnostic Benchmark System',
      description: 'Test your reading, writing, and comprehension skills to benchmark your current literacy level (Novice to Fluent).',
      icon: Award,
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      badge: 'Instant Results',
      to: '/assessment',
      btnText: 'Take Benchmark Test',
    },
  ];

  const functionalThemes = [
    {
      title: 'Healthcare & Clinic Forms',
      icon: Stethoscope,
      desc: 'Understand doctor prescriptions, medical appointment slips, and clinic instructions.',
      color: 'bg-blue-500 text-white',
    },
    {
      title: 'Daily Market & Budgeting',
      icon: ShoppingCart,
      desc: 'Read grocery lists, calculate totals, check price labels, and verify receipt bills.',
      color: 'bg-emerald-500 text-white',
    },
    {
      title: 'Public Transit & Street Signs',
      icon: Bus,
      desc: 'Read bus timetable routes, platform signs, caution alerts, and street directions independently.',
      color: 'bg-amber-500 text-white',
    },
    {
      title: 'Official Forms & Documentation',
      icon: FileText,
      desc: 'Fill in basic name, address, and date fields on government and bank applications.',
      color: 'bg-purple-500 text-white',
    },
  ];

  const testimonials = [
    {
      quote: 'I can now read my children’s school notices and clinic prescription slips on my own without feeling anxious.',
      name: 'Sunita Devi',
      role: 'Adult Neo-Learner',
      level: 'Level 3: Functional Reader',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    },
    {
      quote: 'The audio read-aloud feature and native Hindi script allowed my mother to learn letter sounds at her own comfortable pace.',
      name: 'Rajesh Kumar',
      role: 'Community Educator',
      level: 'Educator & Mentor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-950 via-brand-900 to-indigo-950 text-white p-6 sm:p-12 shadow-2xl border border-brand-800/60">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-200 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              AI-Powered Literacy Platform for Neo-Learners
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15]">
              Literacy Opens Every Door. <br />
              <span className="bg-gradient-to-r from-brand-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                Learn to Read & Understand.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl">
              An accessible, icon-driven literacy sanctuary built for adult learners and multilingual students.
              Master phonics, everyday vocabulary, and practical reading in your native language with voice assistance.
            </p>

            {isAuthenticated ? (
              <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                <div>
                  <p className="text-xs font-bold text-brand-200 uppercase tracking-wider">Welcome back,</p>
                  <h2 className="text-xl font-bold text-white mt-0.5">{user?.name}</h2>
                  <div className="mt-2">
                    <ProficiencyBadge level={user?.proficiencyLevel} size="sm" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link to="/curriculum">
                    <Button variant="primary" className="bg-white text-brand-950 hover:bg-brand-50 shadow-md">
                      Continue Learning
                    </Button>
                  </Link>
                  <Link to="/assessment">
                    <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                      Assess Skills
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/register">
                  <Button size="xl" variant="primary" className="bg-brand-500 hover:bg-brand-400 text-white shadow-glow font-bold text-lg" icon={ArrowRight} iconPosition="right">
                    Start Free Learning
                  </Button>
                </Link>
                <Link to="/assessment">
                  <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold">
                    Take Reading Check
                  </Button>
                </Link>
              </div>
            )}

            {/* Quick Guarantees */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                100% Free & Open Access
              </span>
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-400" />
                Audio Narration Included
              </span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-sky-400" />
                8 Regional & Global Languages
              </span>
            </div>
          </div>

          {/* Right Column: Live Interactive Phonics Demo */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-300" />
                <h3 className="text-base font-bold text-white">Interactive Phonics Demo</h3>
              </div>
              {/* Language switcher for demo */}
              <div className="flex rounded-xl bg-black/20 p-1 border border-white/10">
                {['en', 'hi', 'es'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setActiveLangTab(lang)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase transition-all ${
                      activeLangTab === lang
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {lang === 'hi' ? 'हिंदी' : lang === 'es' ? 'Español' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tap any card to hear the letter sound and native pronunciation:
            </p>

            <div className="grid grid-cols-2 gap-3">
              {phonicsSamples[activeLangTab]?.map((sample, sIdx) => {
                const isActive = activePhonicWord === sample.word;
                return (
                  <button
                    key={sIdx}
                    onClick={() => handlePlayPhonic(sample)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 transform active:scale-95 flex flex-col justify-between ${
                      isActive
                        ? 'bg-white text-slate-900 border-amber-400 shadow-lg ring-2 ring-amber-400/40'
                        : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-2xl">{sample.icon}</span>
                      <Volume2 className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-300'}`} />
                    </div>
                    <div className="mt-3">
                      <span className={`text-xl font-black ${isActive ? 'text-brand-900' : 'text-white'}`}>
                        {sample.letter}
                      </span>
                      <p className={`text-sm font-bold ${isActive ? 'text-slate-800' : 'text-slate-200'}`}>
                        {sample.word}
                      </p>
                      <p className={`text-[11px] font-medium ${isActive ? 'text-brand-700' : 'text-brand-300'}`}>
                        {sample.phonetics}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>🔊 Powered by browser voice synthesis</span>
              <span className="text-amber-300 font-semibold">Tap to listen</span>
            </div>
          </div>
        </div>

        {/* Decorative background blur glow */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-brand-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. ACCESSIBILITY DEMO SHOWCASE */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-600" />
              <h2 className="text-xl font-bold text-slate-900">Universal Accessibility Suite</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Customized visual and phonetic comfort tools built directly into the core platform for neo-learners.
            </p>
          </div>

          {/* Quick live interactive controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsDyslexicFont(!isDyslexicFont)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${
                isDyslexicFont
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Type className="w-4 h-4" />
              Dyslexia Font: {isDyslexicFont ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${
                isHighContrast
                  ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              High Contrast: {isHighContrast ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <Type className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Dyslexia-Optimized Typography</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Utilizes the scientific <strong>Lexend</strong> typeface with increased letter spacing to eliminate visual crowding.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              <Volume2 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Paced Text-to-Speech</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every story, question, and word can be spoken aloud at a gentle 0.85x speed in native accents.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
              <Sun className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">High-Contrast Dark Mode</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              One-click high luminance mode for users with low vision or high glare sensitivity.
            </p>
          </div>
        </div>
      </section>

      {/* 3. MULTILINGUAL SUPPORT MATRIX */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <Globe2 className="w-7 h-7 text-brand-600" />
              Multilingual Literacy Pathways
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select your native language to browse structured curricula, stories, and assessments.
            </p>
          </div>
          <Link to="/content" className="text-sm font-bold text-brand-600 hover:underline flex items-center gap-1">
            Open Multilingual Library <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {SUPPORTED_LANGUAGES.map(lang => (
            <Link
              key={lang.code}
              to={`/content?lang=${lang.code}`}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white hover:bg-brand-50 border border-slate-200/90 hover:border-brand-300 transition-all group shadow-card text-center transform hover:-translate-y-1"
            >
              <span className="text-3xl mb-1.5">{lang.flag}</span>
              <span className="text-sm font-bold text-slate-800 group-hover:text-brand-700">
                {lang.nativeName}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">{lang.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. THE 4 PILLARS OF PHASE 1 */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Phase 1 Core Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            From Letter Sounds to Fluent Comprehension
          </h2>
          <p className="text-sm text-slate-600">
            A comprehensive pedagogy developed to empower neo-learners with verifiable milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card key={idx} className="flex flex-col justify-between space-y-6 border-2 border-slate-200/80 hover:border-brand-500">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl ${pillar.color} flex items-center justify-center border shadow-xs`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{pillar.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
                </div>
                <Link to={pillar.to} className="block">
                  <Button variant="primary" className="w-full justify-between" icon={ArrowRight} iconPosition="right">
                    {pillar.btnText}
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 5. PRACTICAL REAL-LIFE FUNCTIONAL LITERACY */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Real-World Empowerment
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Literacy for Daily Independence
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            NeoRead focuses on functional everyday texts so learners immediately gain the confidence to navigate life, healthcare, transportation, and finance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {functionalThemes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-3 hover:bg-white/15 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. MINI INTERACTIVE LITERACY CHECK (SANDBOX) */}
      <section className="bg-gradient-to-r from-indigo-50 via-brand-50 to-purple-50 rounded-3xl p-6 sm:p-10 border-2 border-brand-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-200/60">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-brand-600" />
              <h3 className="text-xl font-bold text-slate-900">Try a 10-Second Reading Check</h3>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Sample question from our Diagnostic Literacy Benchmark. Click speaker to hear audio.
            </p>
          </div>

          <button
            onClick={() =>
              speakText(
                'Sample Reading Question: Which word matches the short vowel sound of the letter blend B, A, T?',
                'en'
              )
            }
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-sm self-start sm:self-auto transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Read Question Aloud</span>
          </button>
        </div>

        <div className="space-y-4 max-w-2xl">
          <p className="text-base sm:text-lg font-bold text-slate-900">
            Which word matches the sound of the letter blend <span className="text-brand-600">"B-A-T"</span>?
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Bat', 'Tab', 'Bet', 'Bit'].map((opt, oIdx) => {
              const isSelected = sandboxAnswer === opt;
              return (
                <button
                  key={oIdx}
                  onClick={() => {
                    setSandboxAnswer(opt);
                    setSandboxSubmitted(true);
                  }}
                  className={`p-3.5 rounded-xl border-2 text-center text-sm font-bold transition-all ${
                    isSelected
                      ? opt === 'Bat'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-rose-600 text-white border-rose-600 shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-brand-400'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {sandboxSubmitted && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between ${
                sandboxAnswer === 'Bat'
                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                  : 'bg-rose-100 text-rose-950 border border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {sandboxAnswer === 'Bat' ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-700" />
                    <span>Correct! "B-A-T" forms the short vowel word "Bat".</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-5 h-5 text-rose-700" />
                    <span>Not quite. "B + A + T" spells "Bat".</span>
                  </>
                )}
              </div>
              <Link to="/assessment">
                <Button size="sm" variant="primary" className="bg-brand-600 text-white">
                  Take Full Benchmark Test
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 7. COMMUNITY & LEARNER IMPACT STORIES */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Inspiring Real Stories</h2>
          <p className="text-sm text-slate-500">
            How learners and community educators are transforming lives with NeoRead.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="p-6 sm:p-8 space-y-4 border border-slate-200/80">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-base text-slate-700 italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-brand-600 font-semibold">{t.role}</p>
                  <p className="text-[11px] text-slate-400">{t.level}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 8. CALL TO ACTION FOOTER BANNER */}
      <section className="bg-gradient-to-r from-brand-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Begin Your Literacy Journey Today
          </h2>
          <p className="text-base text-brand-100 leading-relaxed">
            No prerequisites required. Start with simple letter sounds or take a quick diagnostic check to find your perfect level.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/register">
            <Button size="xl" variant="primary" className="bg-white text-brand-900 hover:bg-brand-50 shadow-lg font-bold" icon={ArrowRight} iconPosition="right">
              Create Free Account
            </Button>
          </Link>
          <Link to="/login">
            <Button size="xl" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold">
              Sign In to Portal
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
