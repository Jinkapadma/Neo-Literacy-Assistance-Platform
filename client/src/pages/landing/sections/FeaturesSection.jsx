import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Volume2, Globe2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { ScrollRevealWrapper } from '../../../components/landing/ScrollRevealWrapper.jsx';
import { VantaBirdsBackground } from '../../../components/landing/VantaBirdsBackground.jsx';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Personalization',
      tag: 'Adaptive Engine',
      description:
        'Tailors lessons to each learner’s unique pace, phonics retention, and reading fluency, ensuring no student is left behind.',
      color: 'from-brand-500/30 to-indigo-500/30',
      borderHover: 'hover:border-brand-400/50',
      iconColor: 'text-brand-300',
      to: '/ai-path',
    },
    {
      icon: Volume2,
      title: 'Voice-Guided Phonics Coaching',
      tag: 'Real-Time Audio',
      description:
        'Tap any letter, vowel blend, or word to hear crisp native speech synthesis at an accessible 0.85x listening tempo.',
      color: 'from-purple-500/30 to-pink-500/30',
      borderHover: 'hover:border-purple-400/50',
      iconColor: 'text-purple-300',
      to: '/voice-practice',
    },
    {
      icon: Globe2,
      title: 'Multilingual Content Repository',
      tag: 'Native Dialects',
      description:
        'Rich illustrated stories and functional reading passages across English, Hindi, and Spanish with native script support.',
      color: 'from-sky-500/30 to-cyan-500/30',
      borderHover: 'hover:border-sky-400/50',
      iconColor: 'text-sky-300',
      to: '/content',
    },
    {
      icon: TrendingUp,
      title: 'Milestone Progress Tracking',
      tag: 'Zero Pressure',
      description:
        'Low-stress checkpoints and visual proficiency benchmarks (Novice ➔ Fluent) that celebrate every small victory.',
      color: 'from-emerald-500/30 to-teal-500/30',
      borderHover: 'hover:border-emerald-400/50',
      iconColor: 'text-emerald-300',
      to: '/assessment',
    },
  ];

  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#407c93] text-white border-t border-white/10">
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
        <ScrollRevealWrapper className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/30 border border-white/20 backdrop-blur-md shadow-inner text-xs sm:text-sm font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Core Platform Pillars</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Everything You Need to Build Reading Confidence
          </h2>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-medium">
            Engineered with modern pedagogical science to assist adults and neo-learners in achieving real-world literacy.
          </p>
        </ScrollRevealWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollRevealWrapper key={item.title} delay={index * 0.1}>
                <Link
                  to={item.to}
                  className={`relative h-full p-8 rounded-3xl bg-slate-900/60 border border-white/20 backdrop-blur-2xl ${item.borderHover} transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)] flex flex-col justify-between group overflow-hidden block`}
                >
                  {/* Ambient Card Glow */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-tr ${item.color} blur-2xl opacity-0 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`}
                  />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center ${item.iconColor} group-hover:scale-110 shadow-md transition-transform duration-300`}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white group-hover:text-brand-300 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-slate-300 text-sm leading-relaxed font-normal">{item.description}</p>
                  </div>

                  <div className="relative z-10 pt-4 flex items-center gap-1.5 text-xs font-bold text-brand-300 group-hover:text-white transition-colors">
                    <span>Explore Module</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </ScrollRevealWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};
