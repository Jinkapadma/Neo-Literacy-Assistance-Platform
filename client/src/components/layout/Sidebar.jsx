import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Award,
  User,
  Sparkles,
  Volume2,
  BarChart3,
  Layers,
  Zap,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();

  const coreNavItems = [
    ...(isAuthenticated
      ? [
          {
            to: '/dashboard',
            label: 'Learner Dashboard',
            icon: LayoutDashboard,
            color: 'text-brand-600',
          },
        ]
      : [
          {
            to: '/',
            label: 'Home',
            icon: Home,
            color: 'text-indigo-600',
          },
        ]),
    {
      to: '/curriculum',
      label: 'Curriculums & Modules',
      icon: GraduationCap,
      color: 'text-purple-600',
    },
    {
      to: '/content',
      label: 'Multilingual Library',
      icon: BookOpen,
      color: 'text-emerald-600',
    },
    {
      to: '/assessment',
      label: 'Assessments & Tests',
      icon: Award,
      color: 'text-amber-600',
    },
    {
      to: '/games',
      label: 'Games & Puzzles',
      icon: Gamepad2,
      color: 'text-violet-600',
    },
  ];

  const advancedEngines = [
    {
      to: '/ai-path',
      label: 'AI Adaptive Path',
      icon: Sparkles,
      color: 'text-brand-600',
      tag: 'P2',
    },
    {
      to: '/spaced-repetition',
      label: 'Spaced Repetition Lab',
      icon: Layers,
      color: 'text-indigo-600',
      tag: 'P2',
    },
    {
      to: '/voice-practice',
      label: 'Voice & Pronunciation',
      icon: Volume2,
      color: 'text-teal-600',
      tag: 'P3',
    },
    {
      to: '/analytics',
      label: 'Educator Analytics',
      icon: BarChart3,
      color: 'text-rose-600',
      tag: 'P4',
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 p-6 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Header on mobile */}
          <div className="flex items-center justify-between lg:hidden pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-brand-600" />
              <span className="font-bold text-lg text-slate-900">NeoRead</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Core Navigation Links */}
          <nav className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">
              Core Platform
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
                    `flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className={`p-1.5 rounded-xl bg-slate-50 group-hover:bg-white shadow-xs`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Intelligent Engines (Phase 2, 3, 4) */}
          <nav className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between px-3 pb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                AI & Intelligence Labs
              </p>
              <span className="text-[9px] font-bold uppercase bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded">
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
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-xl bg-slate-50 group-hover:bg-white shadow-xs`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {item.tag}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile / Status Footer */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          {isAuthenticated && (
            <NavLink
              to="/profile"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl font-semibold text-sm transition-colors ${
                  isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.fullName || 'Learner Account'}
                </p>
                <p className="text-[10px] text-slate-400 capitalize">
                  {user?.role || 'Learner'} • {user?.nativeLanguage?.toUpperCase() || 'TE'}
                </p>
              </div>
            </NavLink>
          )}

          <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/60 rounded-2xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-xs font-bold text-slate-900">Phases 1, 2, 3 & 4 Active</p>
            </div>
            <p className="text-[10px] text-slate-600 mt-1 leading-snug">
              Adaptive AI, SM-2 Flashcards, Voice Eval & Educator Analytics operational.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
