import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
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
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../utils/constants.js';

export const Home = () => {
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Structured Literacy Curriculum',
      description: 'Step-by-step progressive pathways from alphabet phonics to functional daily reading.',
      icon: GraduationCap,
      color: 'bg-purple-100 text-purple-700',
      to: '/curriculum',
      btnText: 'Explore Curriculums',
    },
    {
      title: 'Multilingual Content Library',
      description: 'High-contrast stories, vocabulary flashcards, and audio-assisted texts across 8 languages.',
      icon: Globe2,
      color: 'bg-emerald-100 text-emerald-700',
      to: '/content',
      btnText: 'Browse Content',
    },
    {
      title: 'Proficiency Benchmarking',
      description: 'Diagnostic assessments evaluating reading accuracy, spelling, and story comprehension.',
      icon: Award,
      color: 'bg-amber-100 text-amber-700',
      to: '/assessment',
      btnText: 'Take Assessment',
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-950 text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-200 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Phase 1 Foundation: Content & Assessment Framework
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Empowering Every Learner Through <span className="text-brand-300">Intelligent Literacy</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            An accessible, icon-driven platform designed specifically for neo-learners and adult literacy.
            Master reading, writing, and comprehension at your own pace with multilingual support.
          </p>

          {isAuthenticated ? (
            <div className="p-4 sm:p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-brand-200 uppercase tracking-wider">Welcome back,</p>
                <h2 className="text-xl font-bold text-white mt-0.5">{user?.name}</h2>
                <div className="mt-2">
                  <ProficiencyBadge level={user?.proficiencyLevel} size="sm" />
                </div>
              </div>
              <div className="flex gap-3">
                <Link to="/curriculum">
                  <Button variant="primary" className="bg-white text-brand-900 hover:bg-brand-50">
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
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/register">
                <Button size="lg" variant="primary" className="bg-brand-500 hover:bg-brand-400 text-white shadow-glow" icon={ArrowRight} iconPosition="right">
                  Start Free Assessment
                </Button>
              </Link>
              <Link to="/content">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Explore Learning Library
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Multilingual Access Bar */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Supported Literacy Languages</h3>
            <p className="text-xs text-slate-500">
              Interactive reading materials and assessments available in multiple languages.
            </p>
          </div>
          <Link to="/content" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
            View All Content <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {SUPPORTED_LANGUAGES.map(lang => (
            <Link
              key={lang.code}
              to={`/content?lang=${lang.code}`}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 hover:bg-brand-50 border border-slate-200/80 hover:border-brand-300 transition-colors group text-center"
            >
              <span className="text-2xl mb-1">{lang.flag}</span>
              <span className="text-sm font-bold text-slate-800 group-hover:text-brand-700">
                {lang.nativeName}
              </span>
              <span className="text-[10px] text-slate-400">{lang.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Core Phase 1 Pillars */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Phase 1 Learning & Assessment Framework
          </h2>
          <p className="text-sm text-slate-600">
            A solid pedagogical foundation built for high accessibility, reading clarity, and verifiable proficiency benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl ${feat.color} flex items-center justify-center shadow-xs`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.description}</p>
                </div>
                <Link to={feat.to} className="block">
                  <Button variant="outline" className="w-full justify-between" icon={ArrowRight} iconPosition="right">
                    {feat.btnText}
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Benchmarking Callout */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md flex-shrink-0">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-950">
              Diagnostic Literacy Benchmark System
            </h3>
            <p className="text-sm text-amber-800/90 mt-1 max-w-xl">
              Evaluate reading fluency, phonetics, and writing mechanics. Get assigned an immediate proficiency level from Level 1 (Novice) to Level 4 (Fluent).
            </p>
          </div>
        </div>
        <Link to="/assessment" className="w-full sm:w-auto flex-shrink-0">
          <Button variant="primary" className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto">
            Take Baseline Test
          </Button>
        </Link>
      </section>
    </div>
  );
};
