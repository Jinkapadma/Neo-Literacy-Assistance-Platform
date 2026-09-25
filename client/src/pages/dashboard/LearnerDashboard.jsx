import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useProgress } from '../../context/ProgressContext.jsx';
import { useLanguage } from '../../hooks/useLanguage.js';
import { assessmentApi } from '../../api/assessmentApi.js';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { ProficiencyBadge } from '../../components/common/Badge.jsx';
import { Spinner } from '../../components/common/Loader.jsx';
import { SUPPORTED_LANGUAGES, PROFICIENCY_LEVELS } from '../../utils/constants.js';
import {
  GraduationCap,
  BookOpen,
  Award,
  Sparkles,
  Flame,
  Clock,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Volume2,
  Calendar,
  RotateCcw,
  Target,
  Zap,
  Globe,
  Bot,
} from 'lucide-react';

export const LearnerDashboard = () => {
  const { user } = useAuth();
  const { progress, curriculumPercentage } = useProgress();
  const {
    learningLanguage,
    interfaceLanguage,
    learningLangMeta,
    interfaceLangMeta,
    t,
    openAgentModal,
    speakInInterfaceLang,
  } = useLanguage();

  const navigate = useNavigate();
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve locally saved personalized plan if available
  const savedPlan = (() => {
    try {
      const saved = localStorage.getItem('neoread_personalized_plan');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  // Load user's diagnostic assessment and benchmark history
  useEffect(() => {
    if (user?._id) {
      assessmentApi
        .getUserBenchmark(user._id)
        .then(res => setBenchmarkData(res.data))
        .catch(() => setBenchmarkData(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?._id]);

  const proficiency =
    savedPlan?.assignedLevel ||
    user?.proficiencyLevel ||
    benchmarkData?.currentProficiencyLevel ||
    'beginner';

  const isUnassessed =
    !savedPlan && (proficiency === 'unassessed' || !benchmarkData?.latestBenchmark);

  const activeAgeCohort =
    savedPlan?.ageCohort ||
    (user?.age && user.age < 12 ? 'kids' : user?.age && user.age < 18 ? 'teens' : 'adults');

  const ageCohort =
    activeAgeCohort === 'kids'
      ? 'Junior Phonics'
      : activeAgeCohort === 'teens'
        ? 'Youth Reading'
        : 'Functional Adult';

  const latestScore =
    savedPlan?.overallScore || benchmarkData?.latestBenchmark?.overallScore || (isUnassessed ? 0 : 80);
  const readingScore =
    savedPlan?.skillScores?.reading || benchmarkData?.latestBenchmark?.readingScore || 75;
  const writingScore =
    savedPlan?.skillScores?.writing || benchmarkData?.latestBenchmark?.writingScore || 70;
  const comprehensionScore =
    savedPlan?.skillScores?.comprehension || benchmarkData?.latestBenchmark?.comprehensionScore || 85;

  if (loading) {
    return <Spinner size="lg" message="Loading your personalized dashboard..." className="min-h-[50vh]" />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* 1. TOP WELCOME & DUAL-LANGUAGE STATUS BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Target Learning Language Badge */}
              <span className="px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold flex items-center gap-1 border border-white/20 shadow-xs">
                <Target className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {learningLangMeta.flag} {learningLangMeta.nativeName} ({learningLangMeta.name}) Track
                </span>
              </span>

              {/* Interface Language Indicator */}
              <span className="px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-emerald-300 text-xs font-bold flex items-center gap-1 border border-white/20">
                <Globe className="w-3.5 h-3.5 text-emerald-300" />
                <span>UI: {interfaceLangMeta.nativeName}</span>
              </span>

              <span className="px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-indigo-200 text-xs font-bold border border-white/20">
                {ageCohort}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              {t('welcome', 'Welcome to Your Learning Portal')}, {user?.name || 'Learner'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed font-medium">
              Your personalized curriculum is calibrated for <strong>{learningLangMeta.name}</strong> phonics and voice practice with guidance in <strong>{interfaceLangMeta.name}</strong>.
            </p>
          </div>

          {/* Quick Streak & Daily Stats Widget */}
          <div className="flex items-center gap-3 bg-white/10 border border-white/15 p-3.5 rounded-2xl backdrop-blur-md self-start md:self-auto shrink-0 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 text-2xl">
              🔥
            </div>
            <div>
              <div className="flex items-center gap-1 font-black text-white text-base">
                <span>{progress.streakDays} {t('streak', 'Day Streak')}</span>
              </div>
              <span className="text-[11px] text-amber-200 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> 15 mins / day target
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROMINENT AI LEARNING AGENT PROGRESS SHOWCASE CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-brand-500/15 to-indigo-500/15 border-2 border-amber-300/70 backdrop-blur-md shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-fadeIn">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-brand-500 to-indigo-600 flex items-center justify-center text-3xl shadow-md shrink-0">
            🦉
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                AI Progress Agent
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {learningLangMeta.name} Literacy Progress by NeoAgent
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl">
              I've synthesized your phonetics, vocabulary recall, and speech pronunciation milestones in {learningLangMeta.nativeName}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={openAgentModal}
            className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-brand-600 hover:from-amber-600 hover:to-brand-700 text-white font-black shadow-md shadow-amber-500/20"
            icon={Sparkles}
          >
            Show Me Progress by Agent
          </Button>
        </div>
      </div>

      {/* 3. UNASSESSED CALLOUT (If user has not completed diagnostic test) */}
      {isUnassessed && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-brand-500/20 border-2 border-amber-300/60 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center text-2xl shadow-md shrink-0 font-bold">
              🎯
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Initial Diagnostic Assessment Needed
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Take our 3-minute voice-guided test in {learningLangMeta.name} to unlock your personalized curriculum!
              </p>
            </div>
          </div>

          <Link to="/initial-assessment" className="shrink-0 w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full sm:w-auto shadow-md" icon={ArrowRight} iconPosition="right">
              Take Diagnostic Test
            </Button>
          </Link>
        </div>
      )}

      {/* 4. CURRENT ACTIVE MODULE & RECOMMENDED LESSON */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Curriculum Track (2 cols) */}
        <Card className="lg:col-span-2 p-6 sm:p-8 space-y-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white rounded-3xl">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                <Target className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {learningLangMeta.name} Curriculum Path
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {savedPlan?.startingModule?.title ||
                    (proficiency === 'advanced'
                      ? `Module 4: ${learningLangMeta.name} Real-World Reading & Fluency`
                      : proficiency === 'intermediate'
                        ? `Module 3: ${learningLangMeta.name} Sentence Reading & Stories`
                        : proficiency === 'elementary'
                          ? `Module 2: ${learningLangMeta.name} Word Construction & Objects`
                          : `Module 1: ${learningLangMeta.name} Script & Phonics Foundations`)}
                </h3>
              </div>
            </div>

            <ProficiencyBadge level={proficiency} size="sm" />
          </div>

          {/* Module Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>{t('curriculumProgress', 'Curriculum Progress')}</span>
              <span className="text-brand-600 font-black">
                {progress.completedLessonsCount} of {progress.totalLessonsCount || 20} Lessons Completed ({curriculumPercentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${curriculumPercentage}%` }}
              />
            </div>
          </div>

          {/* Next Lesson Card Preview */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>{t('nextLesson', 'Next Up')} &bull; Lesson {progress.completedLessonsCount + 1}</span>
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {learningLangMeta.name} Acoustic Blends & Sight Words
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Practice vocabulary flashcards with Bhashini voice narration in {learningLangMeta.nativeName}
              </p>
            </div>

            <Link to="/curriculum" className="shrink-0 w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full sm:w-auto" icon={ArrowRight} iconPosition="right">
                {t('startLesson', 'Start Lesson')} {progress.completedLessonsCount + 1}
              </Button>
            </Link>
          </div>
        </Card>

        {/* Diagnostic Scorecard & Skill Summary (1 col) */}
        <Card className="p-6 sm:p-8 space-y-5 border border-slate-200 shadow-sm bg-white rounded-3xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>{t('skillMastery', 'Skill Mastery')}</span>
              </h3>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                {latestScore}% Overall
              </span>
            </div>

            {/* Mastery Meters */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>{t('readingFluency', 'Reading Fluency')}</span>
                  <span className="font-bold text-slate-900">{readingScore}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${readingScore}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>{t('sentenceConstruction', 'Sentence Construction')}</span>
                  <span className="font-bold text-slate-900">{writingScore}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full bg-sky-500" style={{ width: `${writingScore}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>{t('passageComprehension', 'Passage Comprehension')}</span>
                  <span className="font-bold text-slate-900">{comprehensionScore}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${comprehensionScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link to="/initial-assessment" className="w-full block">
              <Button variant="outline" size="sm" className="w-full justify-center" icon={RotateCcw}>
                Retake Diagnostic Test
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* 5. QUICK PRACTICE HUBS */}
      <div className="space-y-3">
        <h3 className="text-lg font-black text-slate-900">
          {learningLangMeta.name} Recommended Activities
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/curriculum"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
              {t('curriculum', 'Structured Modules')}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Step-by-step curriculum sequenced for {learningLangMeta.name} phonics and reading fluency.
            </p>
          </Link>

          <Link
            to="/content"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
              {t('library', 'Multilingual Library')}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Read illustrated stories with native TTS pronunciation in {learningLangMeta.nativeName}.
            </p>
          </Link>

          <Link
            to="/games"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
              {t('games', 'Games & Puzzles')}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Play Word Scramble, Sentence Builder, and Memory Cards in {learningLangMeta.nativeName}.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;
