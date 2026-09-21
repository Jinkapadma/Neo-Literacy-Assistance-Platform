import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Globe, Sparkles } from 'lucide-react';
import { BRAND } from '../../../utils/branding.js';

export const FooterSection = () => {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {BRAND.name.split(' ')[0]}
                <span className="text-brand-400">Read</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {BRAND.tagline} Built to bridge the digital and functional literacy divide for adult and foundational neo-learners.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{BRAND.phase}</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Learning Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Core Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How Learning Works
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Learner Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Languages & Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Supported Languages
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                <span>English (Global)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                <span>हिंदी (Hindi)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                <span>Español (Spanish)</span>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                + Regional Indian dialects expanding in Phase 2
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-slate-300 transition-colors">
              Learner Login
            </Link>
            <span>•</span>
            <Link to="/register" className="hover:text-slate-300 transition-colors">
              Register Free
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
