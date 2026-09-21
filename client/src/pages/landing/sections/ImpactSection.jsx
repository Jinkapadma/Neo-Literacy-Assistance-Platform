import React from 'react';
import { Users, Globe2, Sparkles, BookOpenCheck } from 'lucide-react';
import { AnimatedCounter } from '../../../components/landing/AnimatedCounter.jsx';
import { ScrollRevealWrapper } from '../../../components/landing/ScrollRevealWrapper.jsx';
import { VantaBirdsBackground } from '../../../components/landing/VantaBirdsBackground.jsx';

export const ImpactSection = () => {
  const stats = [
    {
      value: 15000,
      suffix: '+',
      label: 'Active Neo-Learners',
      description: 'Adults and foundational students actively mastering literacy.',
      icon: Users,
      color: 'text-brand-300',
      bg: 'bg-brand-500/20 border-brand-400/30',
    },
    {
      value: 8,
      suffix: '+',
      label: 'Native Languages',
      description: 'Localized phonetics, scripts, and audio dialects supported.',
      icon: Globe2,
      color: 'text-purple-300',
      bg: 'bg-purple-500/20 border-purple-400/30',
    },
    {
      value: 94,
      suffix: '%',
      label: 'Confidence Boost',
      description: 'Learners reporting ease in reading medical slips and transit signs.',
      icon: Sparkles,
      color: 'text-sky-300',
      bg: 'bg-sky-500/20 border-sky-400/30',
    },
    {
      value: 500,
      suffix: '+',
      label: 'Practical Modules',
      description: 'Everyday functional texts, phonics cards, and comprehension stories.',
      icon: BookOpenCheck,
      color: 'text-emerald-300',
      bg: 'bg-emerald-500/20 border-emerald-400/30',
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#407c93] text-white border-t border-white/10">
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

      <div className="relative z-10 max-w-7xl mx-auto">
        <ScrollRevealWrapper className="p-10 sm:p-14 rounded-3xl bg-slate-900/60 border border-white/20 shadow-2xl backdrop-blur-2xl space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/30 border border-white/20 backdrop-blur-md shadow-inner text-xs font-bold uppercase tracking-wider text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Platform Impact</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Making Measurable Strides in Global Literacy
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
              Empowering non-readers and adult learners worldwide to achieve independent literacy.
            </p>
          </div>

          {/* Counters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="text-center p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-3 hover:border-white/30 hover:-translate-y-1.5 transition-all duration-300 transform-gpu shadow-lg"
                >
                  <div className={`w-12 h-12 mx-auto rounded-xl ${item.bg} border flex items-center justify-center ${item.color} shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    <AnimatedCounter value={item.value} suffix={item.suffix} />
                  </div>

                  <h4 className="text-base font-bold text-white">{item.label}</h4>
                  <p className="text-xs text-slate-200 font-normal">{item.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <span className="text-[11px] text-slate-300 italic">
              * Benchmark impact metrics collected across simulated user testing & literacy cohort trials (Phase 1).
            </span>
          </div>
        </ScrollRevealWrapper>
      </div>
    </section>
  );
};
