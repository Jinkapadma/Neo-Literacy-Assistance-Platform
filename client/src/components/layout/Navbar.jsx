import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useAccessibility } from '../../hooks/useAccessibility.js';
import { useLanguage } from '../../hooks/useLanguage.js';
import { DualLanguageSwitcher } from '../common/DualLanguageSwitcher.jsx';
import { ProficiencyBadge } from '../common/Badge.jsx';
import {
  BookOpen,
  User,
  LogOut,
  Type,
  Sun,
  Moon,
  Eye,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  Bot,
} from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const {
    isDarkMode,
    setIsDarkMode,
    isDyslexicFont,
    setIsDyslexicFont,
    isHighContrast,
    setIsHighContrast,
    textScale,
    setTextScale,
  } = useAccessibility();

  const { learningLangMeta, interfaceLangMeta, t } = useLanguage();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const cycleTextScale = () => {
    if (textScale === 'normal') setTextScale('large');
    else if (textScale === 'large') setTextScale('xlarge');
    else setTextScale('normal');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#407c93]/90 backdrop-blur-xl border-b border-white/20 shadow-lg text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand & Sidebar toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 lg:hidden focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Neo<span className="text-brand-300">Read</span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white rounded-full border border-white/20">
                    Bhashini AI
                  </span>
                </span>
                <p className="text-[11px] text-slate-200 font-medium hidden sm:block">
                  Multilingual Intelligence Platform
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Dual Language, Accessibility, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Dual-Language Switcher (Target Learn vs Interface) */}
            <DualLanguageSwitcher />

            {/* Accessibility Quick Toggle Group */}
            <div className="relative">
              <button
                onClick={() => setIsAccessMenuOpen(!isAccessMenuOpen)}
                className={`p-2 sm:px-3 sm:py-2 rounded-2xl border flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  isDyslexicFont || isHighContrast || textScale !== 'normal'
                    ? 'bg-brand-600/50 border-brand-300 text-white shadow-md'
                    : 'bg-slate-900/60 border-white/20 text-slate-200 hover:bg-slate-900/80 hover:text-white shadow-sm'
                }`}
                title="Accessibility Preferences"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span className="hidden xl:inline">Accessibility</span>
              </button>

              {isAccessMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-4 z-50 animate-fadeIn space-y-3 text-white">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Neo-Learner Readability
                  </div>

                  {/* Dyslexia font toggle */}
                  <label className="flex items-center justify-between cursor-pointer text-sm font-medium text-slate-200">
                    <span className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-brand-300" />
                      Dyslexia-Friendly Font
                    </span>
                    <input
                      type="checkbox"
                      checked={isDyslexicFont}
                      onChange={e => setIsDyslexicFont(e.target.checked)}
                      className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                    />
                  </label>

                  {/* High Contrast */}
                  <label className="flex items-center justify-between cursor-pointer text-sm font-medium text-slate-200">
                    <span className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-300" />
                      High Contrast Mode
                    </span>
                    <input
                      type="checkbox"
                      checked={isHighContrast}
                      onChange={e => setIsHighContrast(e.target.checked)}
                      className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                    />
                  </label>

                  {/* Text Size Scale */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-200">Text Size:</span>
                    <button
                      onClick={cycleTextScale}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white uppercase border border-white/15 cursor-pointer"
                    >
                      {textScale} (Change)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl bg-slate-900/60 hover:bg-slate-900/80 border border-white/20 transition-colors cursor-pointer"
                >
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=neo'}
                    alt={user?.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-500/40 border border-white/30"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-white leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-slate-300 capitalize">{user?.role}</p>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-2.5 z-50 animate-fadeIn text-white space-y-1">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs font-bold text-white">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <ProficiencyBadge level={user?.proficiencyLevel} size="sm" />
                        <span className="text-[10px] font-bold text-amber-300">
                          {learningLangMeta.flag} {learningLangMeta.name}
                        </span>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-brand-300" />
                      {t('profile', 'My Learner Profile')}
                    </Link>
                    <Link
                      to="/curriculum"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-xl transition-colors"
                    >
                      <GraduationCap className="w-4 h-4 text-indigo-300" />
                      {t('curriculum', 'My Learning Path')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-bold text-slate-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl shadow-md shadow-brand-500/30 transition-all border border-white/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

