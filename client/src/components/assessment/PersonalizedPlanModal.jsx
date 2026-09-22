import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Sparkles,
  Flame,
  Target,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  LayoutDashboard,
  ShieldCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { SUPPORTED_LANGUAGES, PROFICIENCY_LEVELS } from '../../utils/constants.js';

export const PersonalizedPlanModal = ({ isOpen, plan, submissionId, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isOpen || !plan) return null;

  const langInfo =
    SUPPORTED_LANGUAGES.find(l => l.code === plan.language) ||
    SUPPORTED_LANGUAGES[0] || {
      code: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      flag: '🇮🇳',
    };

  const levelKey = plan.assignedLevel || 'beginner';
  const levelInfo =
    PROFICIENCY_LEVELS[levelKey] ||
    PROFICIENCY_LEVELS.beginner || {
      label: 'Level 1: Novice Reader',
    };

  const handleGoToDashboard = () => {
    if (onClose) onClose();
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login', { state: { planCreated: true } });
    }
  };

  const handleRegisterAndSave = () => {
    if (onClose) onClose();
    navigate('/register', { state: { planCreated: true } });
  };

  const handleGoToCurriculum = () => {
    if (onClose) onClose();
    navigate('/curriculum');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-white/20 rounded-3xl p-5 sm:p-8 text-white shadow-2xl space-y-6 my-auto">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Celebration Header */}
        <div className="text-center space-y-3">
          <div className="relative inline-block mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-brand-500 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-2xl shadow-amber-400/30 animate-bounce">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-200" />
            </div>
            <div className="absolute -top-1 -right-1 text-xl sm:text-2xl animate-spin">✨</div>
            <div className="absolute -bottom-1 -left-1 text-xl sm:text-2xl animate-pulse">🎉</div>
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Diagnostic Benchmark Assessed</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Your Personalized Learning Plan
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Calibrated for <span className="text-white font-bold">{langInfo.nativeName} ({langInfo.name})</span> &bull; {plan.ageCohort ? plan.ageCohort.toUpperCase() : 'LEARNER'} Track
            </p>
          </div>
        </div>

        {/* Diagnostic Score & Assigned Level Badge */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Score
            </span>
            <div className="text-lg sm:text-xl font-black text-amber-300">
              {plan.overallScore ?? 80}%
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Level Assigned
            </span>
            <div className="text-xs sm:text-sm font-black text-emerald-400 uppercase truncate">
              {levelInfo.label || plan.assignedLevel || 'Level 1: Novice'}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Daily Target
            </span>
            <div className="flex items-center gap-1 text-xs sm:text-sm font-black text-amber-300 truncate">
              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{plan.recommendedDailyMinutes || 15}m / day</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Track Pace
            </span>
            <div className="text-xs sm:text-sm font-bold text-sky-400 truncate">
              Recommended
            </div>
          </div>
        </div>

        {/* Recommended Starting Curriculum Module */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-600/30 via-indigo-600/30 to-purple-600/30 border border-brand-400/40 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>Recommended Starting Module</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-400/20 text-brand-200 border border-brand-400/30">
              {plan.startingModule?.unlockedLessonsCount || 4} Lessons Unlocked
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-white/10 border border-white/10">
              {plan.startingModule?.icon || '🔤'}
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {plan.startingModule?.title || 'Module 1: Foundations'}
              </h3>
              <p className="text-xs text-slate-300 leading-snug mt-0.5">
                {plan.startingModule?.subtitle || 'Alphabet recognition and foundational sight words'}
              </p>
            </div>
          </div>
        </div>

        {/* 14-Day Projected Milestone */}
        {plan.milestone14Days && (
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong className="text-white">14-Day Milestone:</strong> {plan.milestone14Days}
            </span>
          </div>
        )}

        {/* Diagnostic Priority Skills & Strengths */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {plan.strengths?.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Strengths
              </span>
              <ul className="space-y-1 text-slate-200">
                {plan.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {plan.prioritySkills?.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                Focus Areas
              </span>
              <ul className="space-y-1 text-slate-200">
                {plan.prioritySkills.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleGoToDashboard}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Enter My Dashboard</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRegisterAndSave}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-500 via-indigo-600 to-purple-600 hover:from-brand-600 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Save Plan & Create Account</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleGoToCurriculum}
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-brand-300" />
            <span>Explore Modules</span>
          </button>
        </div>
      </div>
    </div>
  );
};
