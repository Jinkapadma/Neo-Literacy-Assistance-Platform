import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useAccessibility } from '../hooks/useAccessibility.js';
import { Button } from '../components/common/Button.jsx';
import { Card } from '../components/common/Card.jsx';
import { ProficiencyBadge } from '../components/common/Badge.jsx';
import { LiteracyGalaxy3D } from '../components/3d/LiteracyGalaxy3D.jsx';
import { Card3DTilt } from '../components/3d/Card3DTilt.jsx';
import { InteractiveBook3D } from '../components/3d/InteractiveBook3D.jsx';
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
  Compass,
  Zap,
  TrendingUp,
  Brain,
  Headphones,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../utils/constants.js';

export const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    speakText,
    selectedLanguage,
    setSelectedLanguage,
    isDyslexicFont,
    setIsDyslexicFont,
    isHighContrast,
    setIsHighContrast,
  } = useAccessibility();

  // Active language for live interactive sound demo
  const [heroLang, setHeroLang] = useState('en');

  // Feature Showcase Active Tab
  const [activeFeatureTab, setActiveFeatureTab] = useState('phonics');

  // Interactive 10-Second Reading Sandbox
  const [sandboxAnswer, setSandboxAnswer] = useState(null);
  const [sandboxSubmitted, setSandboxSubmitted] = useState(false);

  const featureTabs = [
    {
      id: 'phonics',
      title: 'Phonics & Letter Sounds',
      icon: '🔤',
      badge: 'Step 1: Novice',
      headline: 'Master Letter Sounds & Pronunciation with Audio Guidance',
      desc: 'Understand how consonants and vowels blend into everyday 3-letter words through pictorial associations and native voice aids.',
      highlights: ['Interactive Sound Cards', 'Short Vowel Patterns (A, E, I, O, U)', 'Visual Pictograms & Transliterations'],
      linkTo: '/curriculum',
      btnText: 'Start Phonics Lessons',
    },
    {
      id: 'stories',
      title: 'Multilingual Reader',
      icon: '📖',
      badge: 'Step 2: Elementary',
      headline: 'Rich Illustrated Stories & Real-Time Vocabulary Flashcards',
      desc: 'Read cultural stories and practical passages across 8 languages. Tap any word to see definitions, phonetics, and hear pronunciation.',
      highlights: ['8 Native Languages with Native Scripts', 'One-Click Audio Narration at 0.85x Speed', 'Vocabulary Breakdown & Synonyms'],
      linkTo: '/content',
      btnText: 'Browse Story Library',
    },
    {
      id: 'functional',
      title: 'Real-Life Literacy',
      icon: '🏥',
      badge: 'Step 3: Functional',
      headline: 'Gain Independence with Practical Healthcare, Market & Transit Forms',
      desc: 'Learn to read doctor prescription slips, supermarket price labels, utility bills, and public transportation routes.',
      highlights: ['Medical & Clinic Prescriptions', 'Weekly Grocery & Math Literacy', 'Street Signs, Bus Routes & Safety Notices'],
      linkTo: '/content?contentType=functional_text',
      btnText: 'Explore Practical Texts',
    },
    {
      id: 'benchmark',
      title: 'Diagnostic Benchmark',
      icon: '🎯',
      badge: 'Step 4: Certified',
      headline: 'Automated Literacy Evaluation with Actionable Feedback',
      desc: 'Take interactive reading, spelling, and comprehension assessments to receive an immediate proficiency score and roadmap.',
      highlights: ['Instant CEFR-Aligned Scorecard', 'Reading, Writing & Comprehension Indices', 'Personalized Strengths & Improvement Areas'],
      linkTo: '/assessment',
      btnText: 'Take Benchmark Check',
    },
  ];

  const currentTabContent = featureTabs.find(t => t.id === activeFeatureTab) || featureTabs[0];

  const functionalThemes = [
    {
      title: 'Healthcare & Clinic Forms',
      icon: Stethoscope,
      desc: 'Read doctor prescriptions, symptom forms, and medicine dosages independently.',
      gradient: 'from-blue-600 to-cyan-500',
    },
    {
      title: 'Market & Budgeting Literacy',
      icon: ShoppingCart,
      desc: 'Verify grocery totals, price per kilogram, change calculations, and receipt bills.',
      gradient: 'from-emerald-600 to-teal-500',
    },
    {
      title: 'Public Transit & Street Signs',
      icon: Bus,
      desc: 'Identify bus stops, train platforms, safety warnings, and street destination boards.',
      gradient: 'from-amber-600 to-orange-500',
    },
    {
      title: 'Official Forms & Documentation',
      icon: FileText,
      desc: 'Confidently fill in your name, address, date, and identity details on standard applications.',
      gradient: 'from-purple-600 to-indigo-500',
    },
  ];

  const milestones = [
    {
      level: 'Level 1',
      title: 'Novice Reader',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Recognizing alphabet letters, short vowel sounds, and 50 core sight words.',
      icon: '🔤',
    },
    {
      level: 'Level 2',
      title: 'Elementary Reader',
      badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
      description: 'Reading basic compound words, short sentences, and everyday signboards.',
      icon: '🧩',
    },
    {
      level: 'Level 3',
      title: 'Functional Reader',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: 'Understanding multi-paragraph stories, utility bills, and clinic appointment slips.',
      icon: '📖',
    },
    {
      level: 'Level 4',
      title: 'Fluent Reader',
      badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
      description: 'Independent, confident reading in workplace, financial, and educational contexts.',
      icon: '🏆',
    },
  ];

  const testimonials = [
    {
      quote: 'Before NeoRead, I had to ask strangers at the bus stop which bus to take. Now I can read the destination boards and clinic prescription slips completely on my own!',
      name: 'Sunita Devi',
      role: 'Adult Neo-Learner',
      level: 'Level 3: Functional Reader',
      location: 'Lucknow, India',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    },
    {
      quote: 'The 3D audio phonics and bilingual Hindi-English cards helped my students bridge letter sounds in days rather than months. An invaluable tool for community tutors.',
      name: 'Priya Sharma',
      role: 'Community Educator & Literacy Mentor',
      level: 'Educator Partner',
      location: 'Delhi, India',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    {
      quote: 'The dyslexia font and audio button give my father the confidence to practice reading without feeling overwhelmed. The interactive assessments are clear and encouraging.',
      name: 'Carlos Mendoza',
      role: 'Family Learner',
      level: 'Level 2: Elementary Reader',
      location: 'Madrid, Spain',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* ========================================================================= */}
      {/* 1. 3D IMMERSIVE HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-brand-950 to-indigo-950 text-white p-6 sm:p-12 lg:p-16 shadow-2xl border border-brand-800/40">
        {/* Three.js 3D Background Particle Galaxy */}
        <LiteracyGalaxy3D className="opacity-75" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-200 text-xs font-bold tracking-wide uppercase shadow-lg animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Intelligent 3D Literacy Platform for Neo-Learners
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
              Literacy Opens <br />
              <span className="bg-gradient-to-r from-brand-300 via-indigo-200 to-amber-300 bg-clip-text text-transparent">
                Every Door in Life.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-xl">
              Learn to read, write, and understand in your native language. An accessible, icon-driven 3D platform designed for adult learners, low-literacy candidates, and multilingual students.
            </p>

            {/* Language Selector for Live Hero Demo */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Preview Language:
              </span>
              <div className="flex rounded-xl bg-black/40 p-1 border border-white/15">
                {[
                  { code: 'en', label: '🇬🇧 English' },
                  { code: 'hi', label: '🇮🇳 हिंदी' },
                  { code: 'es', label: '🇪🇸 Español' },
                ].map(l => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setHeroLang(l.code)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${heroLang === l.code
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'text-slate-300 hover:text-white'
                      }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {isAuthenticated ? (
              <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div>
                  <p className="text-xs font-bold text-brand-200 uppercase tracking-wider">Welcome back,</p>
                  <h2 className="text-xl font-bold text-white mt-0.5">{user?.name}</h2>
                  <div className="mt-2">
                    <ProficiencyBadge level={user?.proficiencyLevel} size="sm" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link to="/curriculum">
                    <Button variant="primary" className="bg-white text-slate-950 hover:bg-slate-100 shadow-lg font-bold">
                      Continue Learning
                    </Button>
                  </Link>
                  <Link to="/assessment">
                    <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold">
                      Assess Skills
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/register">
                  <Button
                    size="xl"
                    variant="primary"
                    className="bg-brand-500 hover:bg-brand-400 text-white shadow-glow font-bold text-lg px-8 py-4 rounded-2xl transform hover:scale-105 transition-all"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Start Free Learning
                  </Button>
                </Link>
                <Link to="/assessment">
                  <Button
                    size="xl"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-4 rounded-2xl"
                  >
                    Take Reading Check
                  </Button>
                </Link>
              </div>
            )}

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Audio-First Narration</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-sky-400" />
                <span>8 Native Scripts</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>No Prior Literacy Needed</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Touch Sound-Sphere Showcase */}
          <div className="lg:col-span-5">
            <InteractiveBook3D
              activeLang={heroLang}
              onPlaySound={(sound, lang) => speakText(sound, lang)}
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LIVE INTERACTIVE FEATURE SHOWCASE WITH 3D DEPTH */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-200">
            Interactive Learning Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            Engineered for Neo-Learner Success
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Explore the four foundational learning systems designed to take learners from basic alphabet sounds to independent comprehension.
          </p>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {featureTabs.map(tab => {
            const isActive = activeFeatureTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFeatureTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all transform active:scale-95 ${isActive
                    ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/30 scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90 shadow-card'
                  }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic 3D Feature Showcase Stage */}
        <Card3DTilt
          maxTilt={8}
          scale={1.01}
          className="bg-white rounded-3xl border-2 border-slate-200/90 p-6 sm:p-10 shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                {currentTabContent.badge}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {currentTabContent.headline}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {currentTabContent.desc}
              </p>

              <div className="space-y-2.5 pt-2">
                {currentTabContent.highlights.map((item, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link to={currentTabContent.linkTo}>
                  <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="font-bold">
                    {currentTabContent.btnText}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Visual Sandbox Preview */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-brand-950 rounded-3xl p-6 text-white space-y-4 shadow-xl border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Live Preview Mode
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-white/10 rounded-md">
                  Interactive
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-300">
                  Click to listen to sample learning text:
                </p>
                <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-sm leading-relaxed text-slate-100 font-medium">
                  "Ravi visits the village clinic and reads his medicine slip carefully."
                </div>
                <button
                  type="button"
                  onClick={() =>
                    speakText(
                      'Ravi visits the village clinic and reads his medicine slip carefully.',
                      'en'
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen to Sample Aloud</span>
                </button>
              </div>
            </div>
          </div>
        </Card3DTilt>
      </section>

      {/* ========================================================================= */}
      {/* 3. 4-STAGE 3D MILESTONE PROGRESSION LADDER */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Progressive Pedagogical Ladder
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            From Zero to Fluent Reader in 4 Milestones
          </h2>
          <p className="text-sm text-slate-600">
            Each level awards verifiable badges, unlocking practical real-world comprehension skills.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
          {milestones.map((m, idx) => (
            <Card3DTilt
              key={idx}
              maxTilt={10}
              className="bg-white rounded-3xl border-2 border-slate-200/90 p-6 flex flex-col justify-between space-y-4 shadow-card hover:border-brand-500 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{m.icon}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${m.badgeClass}`}>
                    {m.level}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{m.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{m.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600">
                <span>Milestone {idx + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card3DTilt>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. REAL-WORLD PRACTICAL LITERACY THEMES */}
      {/* ========================================================================= */}
      <section className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl space-y-10 border border-slate-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold uppercase">
            <Compass className="w-3.5 h-3.5" />
            Practical Daily Empowerment
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Literacy Designed for Everyday Life
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Gain immediate confidence in real-world scenarios — healthcare appointments, weekly market calculations, public transit signs, and official paperwork.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {functionalThemes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card3DTilt
                key={idx}
                maxTilt={12}
                className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 space-y-4 hover:bg-white/15 transition-all shadow-xl"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center shadow-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-lg">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </Card3DTilt>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MULTILINGUAL GLOBAL MATRIX */}
      {/* ========================================================================= */}
      <section className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <Globe2 className="w-7 h-7 text-brand-600" />
              Supported Regional & Global Languages
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Interactive reading materials, vocabulary banks, and baseline assessments available in native scripts.
            </p>
          </div>
          <Link to="/content" className="text-sm font-bold text-brand-600 hover:underline flex items-center gap-1">
            View All Content <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {SUPPORTED_LANGUAGES.map(lang => (
            <Card3DTilt
              key={lang.code}
              maxTilt={15}
              scale={1.05}
              onClick={() => setSelectedLanguage(lang.code)}
            >
              <Link
                to={`/content?lang=${lang.code}`}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white hover:bg-brand-50/80 border-2 border-slate-200/80 hover:border-brand-400 transition-all group shadow-card text-center h-full"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{lang.flag}</span>
                <span className="text-sm font-bold text-slate-900 group-hover:text-brand-700">
                  {lang.nativeName}
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5">{lang.name}</span>
              </Link>
            </Card3DTilt>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. UNIVERSAL ACCESSIBILITY LAB SHOWCASE */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200/90 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-brand-600" />
              <h2 className="text-2xl font-black text-slate-900">Universal Accessibility Lab</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Test real-time accessibility modes built for dyslexia and visual comfort.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDyslexicFont(!isDyslexicFont)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${isDyslexicFont
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md scale-105'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
            >
              <Type className="w-4 h-4" />
              Dyslexia Font (Lexend): {isDyslexicFont ? 'ACTIVE' : 'OFF'}
            </button>

            <button
              type="button"
              onClick={() => setIsHighContrast(!isHighContrast)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${isHighContrast
                  ? 'bg-slate-950 text-amber-300 border-slate-950 shadow-md scale-105'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              High-Contrast Mode: {isHighContrast ? 'ACTIVE' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Type className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Scientific Lexend Font</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Engineered by cognitive researchers to reduce visual crowding, making character shapes distinct and readable for dyslexic learners.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Volume2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Paced Audio Synthesis</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every sentence and word is synthesized at 0.85x speed with clear articulation to train listening comprehension alongside reading.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <Sun className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">High-Contrast Dark Palette</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-luminance text contrast prevents eye strain and enables effortless reading in low-light and high-glare environments.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MINI 10-SECOND READING CHECK (INTERACTIVE SANDBOX) */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-r from-indigo-50 via-brand-50 to-purple-50 rounded-3xl p-6 sm:p-10 border-2 border-brand-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-200/60">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-brand-600" />
              <h3 className="text-xl font-bold text-slate-900">10-Second Reading Check</h3>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Sample question from our Diagnostic Literacy Benchmark. Click speaker to hear audio.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              speakText(
                'Sample Reading Question: Which word matches the short vowel sound of the letter blend B, A, T?',
                'en'
              )
            }
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-sm self-start sm:self-auto transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Read Question Aloud</span>
          </button>
        </div>

        <div className="space-y-4 max-w-2xl">
          <p className="text-base sm:text-lg font-bold text-slate-900">
            Which word matches the sound of the letter blend <span className="text-brand-600 font-black">"B-A-T"</span>?
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Bat', 'Tab', 'Bet', 'Bit'].map((opt, oIdx) => {
              const isSelected = sandboxAnswer === opt;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => {
                    setSandboxAnswer(opt);
                    setSandboxSubmitted(true);
                  }}
                  className={`p-4 rounded-xl border-2 text-center text-sm font-bold transition-all transform active:scale-95 ${isSelected
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
              className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-between gap-3 ${sandboxAnswer === 'Bat'
                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                  : 'bg-rose-100 text-rose-950 border border-rose-200'
                }`}
            >
              <div className="flex items-center gap-2">
                {sandboxAnswer === 'Bat' ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                    <span>Correct! "B-A-T" forms the short vowel word "Bat".</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-5 h-5 text-rose-700 flex-shrink-0" />
                    <span>Not quite. "B + A + T" spells "Bat".</span>
                  </>
                )}
              </div>
              <Link to="/assessment">
                <Button size="sm" variant="primary" className="bg-brand-600 text-white font-bold">
                  Take Full Benchmark Test
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. COMMUNITY TESTIMONIALS */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Real Stories, Real Independence
          </h2>
          <p className="text-sm text-slate-500">
            How learners and community educators are transforming their lives with NeoRead.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Card3DTilt
              key={idx}
              maxTilt={10}
              className="p-6 sm:p-8 space-y-4 bg-white border border-slate-200/90 rounded-3xl shadow-card flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-brand-600 font-semibold">{t.role}</p>
                  <p className="text-[11px] text-slate-400">{t.location}</p>
                </div>
              </div>
            </Card3DTilt>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL 3D CALL TO ACTION BANNER */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-700 text-white p-8 sm:p-12 lg:p-16 text-center space-y-6 shadow-2xl">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider text-amber-200 border border-white/20">
            Join Thousands of Learners Worldwide
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Begin Your Literacy Journey Today
          </h2>
          <p className="text-base text-brand-100 leading-relaxed font-normal">
            No prerequisites or prior literacy required. Start with simple letter sounds or take a quick diagnostic check to find your perfect level.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button
                size="xl"
                variant="primary"
                className="bg-white text-brand-950 hover:bg-brand-50 shadow-2xl font-black text-lg px-8 py-4 rounded-2xl transform hover:scale-105 transition-all"
                icon={ArrowRight}
                iconPosition="right"
              >
                Create Free Account
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="xl"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 font-bold text-lg px-8 py-4 rounded-2xl"
              >
                Sign In to Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/20 rounded-full blur-3xl pointer-events-none" />
      </section>
    </div>
  );
};
