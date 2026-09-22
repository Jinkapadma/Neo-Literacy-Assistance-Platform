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
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();

  const navItems = [
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
    ...(isAuthenticated
      ? [
          {
            to: '/profile',
            label: 'Learner Profile & Scores',
            icon: User,
            color: 'text-sky-600',
          },
        ]
      : []),
  ];

  const roadmapItems = [
    { label: 'AI Adaptive Engine', phase: 'Phase 2', icon: Sparkles },
    { label: 'Voice & Pronunciation', phase: 'Phase 3', icon: Volume2 },
    { label: 'Educator Analytics', phase: 'Phase 4', icon: BarChart3 },
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
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

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-2">
              Learning Portal
            </p>
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className={`p-1.5 rounded-xl bg-slate-50 group-hover:bg-white shadow-xs`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Future Roadmap / Phase indicators */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Platform Roadmap
          </p>
          <div className="space-y-2">
            {roadmapItems.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs font-medium text-slate-400 cursor-not-allowed opacity-75"
                  title="Coming in later development phases"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md">
                    {item.phase}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-100 rounded-2xl text-center">
            <p className="text-xs font-bold text-brand-900">Phase 1 Active</p>
            <p className="text-[11px] text-brand-600 mt-0.5">Content & Assessment Engine</p>
          </div>
        </div>
      </aside>
    </>
  );
};
