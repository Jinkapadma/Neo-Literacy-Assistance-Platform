import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useAccessibility } from '../../hooks/useAccessibility.js';
import { LanguageSwitcher } from '../common/LanguageSwitcher.jsx';
import { ProficiencyBadge } from '../common/Badge.jsx';
import {
  BookOpen,
  User,
  LogOut,
  Type,
  Sun,
  Eye,
  Menu,
  X,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const {
    isDyslexicFont,
    setIsDyslexicFont,
    isHighContrast,
    setIsHighContrast,
    textScale,
    setTextScale,
    selectedLanguage,
    setSelectedLanguage,
  } = useAccessibility();

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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand & Sidebar toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  Neo<span className="text-brand-600">Read</span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-700 rounded-full">
                    Phase 1
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Intelligent Literacy Platform
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Accessibility Controls, Language, Auth */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Global Language Switcher */}
            <LanguageSwitcher
              currentLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              size="sm"
              showLabel={false}
              className="hidden md:inline-flex"
            />

            {/* Accessibility Quick Toggle Group */}
            <div className="relative">
              <button
                onClick={() => setIsAccessMenuOpen(!isAccessMenuOpen)}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-colors ${isDyslexicFont || isHighContrast || textScale !== 'normal'
                    ? 'bg-brand-50 border-brand-300 text-brand-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                title="Accessibility Preferences"
              >
                <Eye className="w-4 h-4 text-brand-600" />
                <span className="hidden sm:inline">Accessibility</span>
              </button>

              {isAccessMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-fadeIn space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Neo-Learner Readability
                  </div>

                  {/* Dyslexia font toggle */}
                  <label className="flex items-center justify-between cursor-pointer text-sm font-medium text-slate-700">
                    <span className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-brand-600" />
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
                  <label className="flex items-center justify-between cursor-pointer text-sm font-medium text-slate-700">
                    <span className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" />
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
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Text Size:</span>
                    <button
                      onClick={cycleTextScale}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-800 uppercase"
                    >
                      {textScale} (Click to change)
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
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=neo'}
                    alt={user?.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-100 border border-brand-200"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user?.role}</p>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      <div className="mt-2">
                        <ProficiencyBadge level={user?.proficiencyLevel} size="sm" />
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                    >
                      <User className="w-4 h-4 text-brand-600" />
                      My Learner Profile
                    </Link>
                    <Link
                      to="/curriculum"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                    >
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      My Learning Path
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
                  className="px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-500/20 transition-colors"
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
