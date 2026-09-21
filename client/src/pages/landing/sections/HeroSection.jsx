import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, ChevronDown, Sparkles, Volume2, Globe2, CheckCircle2 } from 'lucide-react';
import { SparkleButton } from '../../../components/common/SparkleButton.jsx';
import { BRAND } from '../../../utils/branding.js';
import { VantaBirdsBackground } from '../../../components/landing/VantaBirdsBackground.jsx';

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
      className="relative min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#407c93] text-white"
    >
      {/* Vanta.BIRDS 3D Interactive Animation */}
      <VantaBirdsBackground
        backgroundColor={0x407c93}
        color1={0x001da2}
        color2={0xf7ad00}
        quantity={4.0}
        birdSize={1.2}
        wingSpan={24.0}
        speedLimit={5.0}
        separation={40.0}
        alignment={40.0}
        cohesion={40.0}
        className="opacity-95"
      />

      {/* Main Foreground Overlaid Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center my-auto space-y-6 sm:space-y-8">
        {/* Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/30 border border-white/20 backdrop-blur-md shadow-inner text-xs sm:text-sm font-bold text-white">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>Intelligent Multi-Lingual Literacy for Neo-Learners</span>
          <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2">
          <SparkleButton to="/login">
            Get Started
          </SparkleButton>

          <a
            href="#how-it-works"
            onClick={handleScrollToHowItWorks}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-semibold text-base backdrop-blur-md transition-all min-h-[48px]"
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
