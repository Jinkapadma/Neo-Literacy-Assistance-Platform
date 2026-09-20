import React from 'react';
import { Users, Globe2, Sparkles, BookOpenCheck } from 'lucide-react';
import { AnimatedCounter } from '../../../components/landing/AnimatedCounter.jsx';
import { ScrollRevealWrapper } from '../../../components/landing/ScrollRevealWrapper.jsx';

export const ImpactSection = () => {
  const stats = [
    {
      value: 15000,
      suffix: '+',
      label: 'Active Neo-Learners',
      description: 'Adults and foundational students actively mastering literacy.',
      icon: Users,
      color: 'text-brand-400',
    },
    {
      value: 8,
      suffix: '+',
      label: 'Native Languages',
      description: 'Localized phonetics, scripts, and audio dialects supported.',
      icon: Globe2,
      color: 'text-purple-400',
    },
    {
      value: 94,
      suffix: '%',
      label: 'Confidence Boost',
      description: 'Learners reporting ease in reading medical slips and transit signs.',
      icon: Sparkles,
      color: 'text-sky-400',
    },
    {
      value: 500,
      suffix: '+',
      label: 'Practical Modules',
      description: 'Everyday functional texts, phonics cards, and comprehension stories.',
      icon: BookOpenCheck,
      color: 'text-emerald-400',
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <ScrollRevealWrapper className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Platform Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Making Measurable Strides in Global Literacy
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Empowering non-readers and adult learners worldwide to achieve independent literacy.
          </p>
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3"
              >
                <div className={`w-10 h-10 mx-auto rounded-xl bg-white/5 flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  <AnimatedCounter value={item.value} suffix={item.suffix} />
                </div>

                <h4 className="text-base font-bold text-slate-200">{item.label}</h4>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <span className="text-[11px] text-slate-500 italic">
            * Benchmark impact metrics collected across simulated user testing & literacy cohort trials (Phase 1).
          </span>
        </div>
      </ScrollRevealWrapper>
    </section>
  );
};
