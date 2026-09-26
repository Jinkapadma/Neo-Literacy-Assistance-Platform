import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { BRAND } from '../../utils/branding.js';

export const Footer = () => {
  return (
    <footer className="relative bg-[#407c93]/95 border-t border-white/20 mt-auto py-8 text-center text-sm text-slate-200 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        <div className="flex items-center justify-center gap-2 font-bold text-white text-base">
          <BookOpen className="w-5 h-5 text-brand-300" />
          <span>{BRAND.name} — AI-Assisted Multilingual Literacy Platform</span>
        </div>
        <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {BRAND.tagline} • Powered by Bhashini AI NMT & Acoustic Voice Synthesis.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

