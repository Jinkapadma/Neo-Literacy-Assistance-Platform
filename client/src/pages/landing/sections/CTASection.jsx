import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { SparkleButton } from '../../../components/common/SparkleButton.jsx';
import { ScrollRevealWrapper } from '../../../components/landing/ScrollRevealWrapper.jsx';
import { VantaBirdsBackground } from '../../../components/landing/VantaBirdsBackground.jsx';

export const CTASection = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#407c93] text-white border-t border-white/10 text-center">
      {/* 3D Vanta Birds Interactive Background */}
      <VantaBirdsBackground
        backgroundColor={0x407c93}
        color1={0x001da2}
        color2={0xf7ad00}
        quantity={3.5}
        birdSize={1.1}
        wingSpan={22.0}
        speedLimit={4.5}
        separation={45.0}
        alignment={35.0}
        cohesion={35.0}
        className="opacity-95"
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollRevealWrapper>
          <div className="relative p-10 sm:p-16 rounded-3xl bg-slate-900/60 border border-white/20 backdrop-blur-2xl shadow-2xl space-y-8 overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/30 border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span>100% Free & Open Literacy</span>
              </span>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Begin Your Journey to Literacy Today
              </h2>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-medium">
                Accessible on any smartphone or computer. Master letters, words, and everyday reading skills at your own pace.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-center pt-2">
              <SparkleButton to="/onboarding">
                Get Started
              </SparkleButton>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-200 font-medium">
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
      </div>
    </section>
  );
};
