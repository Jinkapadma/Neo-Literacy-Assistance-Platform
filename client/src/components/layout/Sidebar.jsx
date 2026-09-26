import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Award,
  Gamepad2,
  User,
  Sparkles,
  Volume2,
  BarChart3,
  Layers,
  Zap,
  CheckCircle2,
  X,
  Target,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useLanguage } from '../../hooks/useLanguage.js';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const { t, learningLangMeta, interfaceLangMeta } = useLanguage();

  const coreNavItems = [
    ...(isAuthenticated
      ? [
          {
            to: '/dashboard',
            label: t('dashboard', 'Learner Dashboard'),
            icon: LayoutDashboard,
            color: 'text-brand-300',
          },
        ]
      : [
          {
            to: '/',
            label: t('home', 'Home'),
            icon: Home,
            color: 'text-indigo-300',
          },
        ]),
    {
      to: '/curriculum',
      label: t('curriculum', 'Curriculums & Modules'),
      icon: GraduationCap,
      color: 'text-purple-300',
    },
    {
      to: '/content',
      label: t('library', 'Multilingual Library'),
      icon: BookOpen,
      color: 'text-emerald-300',
    },
    {
      to: '/assessment',
      label: t('assessments', 'Assessments & Tests'),
      icon: Award,
      color: 'text-amber-300',
    },
    {
      to: '/games',
      label: t('games', 'Games & Puzzles'),
      icon: Gamepad2,
      color: 'text-violet-300',
    },
  ];

  const advancedEngines = [
    {
      to: '/ai-path',
      label: t('aiPath', 'AI Adaptive Path'),
      icon: Sparkles,
      color: 'text-brand-300',
      tag: 'P2',
    },
    {
      to: '/spaced-repetition',
      label: t('spacedRepetition', 'Spaced Repetition Lab'),
      icon: Layers,
      color: 'text-indigo-300',
      tag: 'P2',
    },
    {
      to: '/voice-practice',
      label: t('voiceLab', 'Voice & Pronunciation'),
      icon: Volume2,
      color: 'text-teal-300',
      tag: 'P3',
    },
    {
      to: '/analytics',
      label: t('analytics', 'Educator Analytics'),
      icon: BarChart3,
      color: 'text-rose-300',
      tag: 'P4',
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900/85 backdrop-blur-2xl border-r border-white/20 p-6 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 text-slate-200 shadow-2xl rounded-r-3xl lg:rounded-3xl my-0 lg:my-2 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Header on mobile */}
          <div className="flex items-center justify-between lg:hidden pb-4 border-b border-white/15">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-brand-300" />
              <span className="font-bold text-lg text-white">NeoRead</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Core Navigation Links */}
          <nav className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300 px-3 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Platform</span>
            </p>
            {coreNavItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-600/50 to-indigo-600/50 text-white shadow-lg border border-brand-400/50 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <div className={`p-1.5 rounded-xl bg-white/10 group-hover:bg-white/20 shadow-xs`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Intelligent Engines (Phase 2, 3, 4) */}
          <nav className="space-y-1.5 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between px-3 pb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                AI & Intelligence Labs
              </p>
              <span className="text-[9px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded-full">
                Active
              </span>
            </div>
            {advancedEngines.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-600/50 to-indigo-600/50 text-white shadow-lg border border-brand-400/50 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-xl bg-white/10 group-hover:bg-white/20 shadow-xs`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/10 text-slate-300 border border-white/15 rounded">
                    {item.tag}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Dual-Language Active Status */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          {/* Dual Language State Badge */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/20 space-y-1.5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-400 flex items-center gap-1">
                <Target className="w-3 h-3 text-amber-300" /> Learning:
              </span>
              <span className="text-amber-300 font-extrabold">
                {learningLangMeta.flag} {learningLangMeta.nativeName}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-400 flex items-center gap-1">
                <Globe className="w-3 h-3 text-indigo-300" /> Interface:
              </span>
              <span className="text-indigo-300 font-extrabold">
                {interfaceLangMeta.nativeName}
              </span>
            </div>
          </div>

          {isAuthenticated && (
            <NavLink
              to="/profile"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-2xl font-semibold text-sm transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <div className="w-8 h-8 rounded-full bg-brand-500/40 text-white border border-white/20 flex items-center justify-center font-bold text-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || 'Learner Account'}
                </p>
                <p className="text-[10px] text-slate-300 capitalize">
                  {user?.role || 'Learner'} • {learningLangMeta.code.toUpperCase()}
                </p>
              </div>
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

