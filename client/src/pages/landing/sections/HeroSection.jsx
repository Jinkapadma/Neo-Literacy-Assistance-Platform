import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, ChevronDown, Sparkles, Volume2, Globe2, CheckCircle2 } from 'lucide-react';
import { BRAND } from '../../../utils/branding.js';
import { VantaNetBackground } from '../../../components/landing/VantaNetBackground.jsx';

// Pure lazy dynamic import for 3D chunk isolation
const Hero3DScene = lazy(() => import('../../../components/landing/Hero3DScene.jsx'));

// Lightweight 2D Fallback rendered instantly while 3D bundle loads
const Static2DHeroFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-brand-600/25 via-purple-600/20 to-sky-500/15 blur-3xl" />
    <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-3xl border border-brand-500/30 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center shadow-2xl">
      <span className="text-7xl sm:text-8xl font-black bg-gradient-to-tr from-brand-400 via-indigo-200 to-sky-300 bg-clip-text text-transparent">
        N
      </span>
    </div>
  </div>
);

export const HeroSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const handleScrollToHowItWorks = e => {
    e.preventDefault();
    const target = document.getElementById('how-it-works');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#34153c] text-white"
    >
      {/* Vanta.NET 3D Interactive Connected Lines Animation */}
      <VantaNetBackground
        color={0xffef3f}
        backgroundColor={0x34153c}
        className="opacity-80"
      />

      {/* 3D Focal Model Overlay (Suspense + Fallback) */}
      <Suspense fallback={<Static2DHeroFallback />}>
        <Hero3DScene isVisible={inView} />
      </Suspense>

      {/* Subtle Background Glow Gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-brand-600/20 via-purple-600/15 to-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Foreground Overlaid Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center my-auto space-y-6 sm:space-y-8">
        {/* Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner text-xs sm:text-sm font-bold text-slate-200">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Intelligent Multi-Lingual Literacy for Neo-Learners</span>
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
          {BRAND.name.split(' ')[0]}{' '}
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
            {BRAND.name.split(' ').slice(1).join(' ')}
          </span>
        </h1>

        {/* Tagline / Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          {BRAND.tagline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-indigo-600 to-sky-500 hover:from-brand-400 hover:to-sky-400 text-white font-bold text-base shadow-xl shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 min-h-[48px]"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href="#how-it-works"
            onClick={handleScrollToHowItWorks}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-semibold text-base backdrop-blur-md transition-all min-h-[48px]"
          >
            <span>See How It Works</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Free Public Access</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-sky-400" />
            <span>English • हिंदी • Español</span>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>0.85x Voice-Guided Audio</span>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-8">
        <a
          href="#how-it-works"
          onClick={handleScrollToHowItWorks}
          className="flex flex-col items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          aria-label="Scroll down to features and how it works"
        >
          <span className="tracking-widest uppercase text-[10px]">Scroll Down</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-brand-400" />
        </a>
      </div>
    </section>
  );
};
