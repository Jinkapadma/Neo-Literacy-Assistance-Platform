import React from 'react';
import { BookOpen, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-center text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        <div className="flex items-center justify-center gap-2 font-bold text-slate-800">
          <BookOpen className="w-5 h-5 text-brand-600" />
          <span>NeoRead — AI-Assisted Literacy Platform for Neo-Learners</span>
        </div>
        <p className="text-xs text-slate-400">
          Phase 1: Learning Content Management & Assessment Framework • Built for accessible, multi-lingual lifelong education.
        </p>
      </div>
    </footer>
  );
};
