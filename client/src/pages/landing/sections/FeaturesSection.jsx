import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Volume2, Globe2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { ScrollRevealWrapper } from '../../../components/landing/ScrollRevealWrapper.jsx';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Personalization',
      tag: 'Adaptive Engine',
      description:
        'Tailors lessons to each learner’s unique pace, phonics retention, and reading fluency, ensuring no student is left behind.',
      color: 'from-brand-500/20 to-indigo-500/20',
      borderHover: 'hover:border-brand-500/40',
      iconColor: 'text-brand-400',
    },
    {
      icon: Volume2,
      title: 'Voice-Guided Phonics Coaching',
      tag: 'Real-Time Audio',
      description:
        'Tap any letter, vowel blend, or word to hear crisp native speech synthesis at an accessible 0.85x listening tempo.',
      color: 'from-purple-500/20 to-pink-500/20',
      borderHover: 'hover:border-purple-500/40',
      iconColor: 'text-purple-400',
    },
    {
      icon: Globe2,
      title: 'Multilingual Content Repository',
      tag: 'Native Dialects',
      description:
        'Rich illustrated stories and functional reading passages across English, Hindi, and Spanish with native script support.',
      color: 'from-sky-500/20 to-cyan-500/20',
      borderHover: 'hover:border-sky-500/40',
      iconColor: 'text-sky-400',
    },
    {
      icon: TrendingUp,
      title: 'Milestone Progress Tracking',
      tag: 'Zero Pressure',
      description:
        'Low-stress checkpoints and visual proficiency benchmarks (Novice ➔ Fluent) that celebrate every small victory.',
      color: 'from-emerald-500/20 to-teal-500/20',
      borderHover: 'hover:border-emerald-500/40',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <ScrollRevealWrapper className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Core Platform Pillars</span>
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Everything You Need to Build Reading Confidence
        </h2>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Engineered with modern pedagogical science to assist adults and neo-learners in achieving real-world literacy.
        </p>
      </ScrollRevealWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <ScrollRevealWrapper key={item.title} delay={index * 0.1}>
              <div
                className={`relative h-full p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl ${item.borderHover} transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between group overflow-hidden`}
              >
                {/* Ambient Card Glow */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-tr ${item.color} blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white group-hover:text-brand-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            </ScrollRevealWrapper>
          );
        })}
      </div>
    </section>
  );
};
