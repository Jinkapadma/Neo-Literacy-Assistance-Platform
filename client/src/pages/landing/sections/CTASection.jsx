import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { SparkleButton } from '../../../components/common/SparkleButton.jsx';
import { ScrollRevealWrapper } from '../../../components/landing/ScrollRevealWrapper.jsx';

export const CTASection = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 text-center">
      <ScrollRevealWrapper>
        <div className="relative p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-brand-900/60 via-indigo-900/60 to-purple-900/50 border border-brand-500/30 backdrop-blur-2xl shadow-2xl space-y-8 overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>100% Free & Open Literacy</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Begin Your Journey to Literacy Today
            </h2>

            <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
              Accessible on any smartphone or computer. Master letters, words, and everyday reading skills at your own pace.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-5 pt-2">
            <SparkleButton to="/register">
              Get Started Free
            </SparkleButton>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-base backdrop-blur-md transition-all"
            >
              <span>Sign In to Account</span>
            </Link>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Accessible on Mobile & Desktop
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Multilingual Voice Included
            </span>
          </div>
        </div>
      </ScrollRevealWrapper>
    </section>
  );
};
