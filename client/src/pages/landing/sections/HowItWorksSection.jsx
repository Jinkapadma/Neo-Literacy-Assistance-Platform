import React from 'react';
import { UserPlus, Compass, BookOpen, Award, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollRevealWrapper } from '../../../components/landing/ScrollRevealWrapper.jsx';
import { VantaBirdsBackground } from '../../../components/landing/VantaBirdsBackground.jsx';

export const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Register & Pick Language',
      description:
        'Create a free account in 30 seconds and select your preferred native tongue — English, Hindi, or Spanish.',
      icon: UserPlus,
      color: 'text-brand-300',
      bg: 'bg-brand-500/20 border-brand-400/30',
      glow: 'from-brand-500/30 to-indigo-500/30',
    },
    {
      step: '02',
      title: 'Quick Initial Assessment',
      description:
        'Take a 3-minute diagnostic check to discover your starting proficiency level with zero pressure.',
      icon: Compass,
      color: 'text-purple-300',
      bg: 'bg-purple-500/20 border-purple-400/30',
      glow: 'from-purple-500/30 to-pink-500/30',
    },
    {
      step: '03',
      title: 'Learn Daily (5–10 Mins)',
      description:
        'Engage with voice-guided phonics, cultural stories, and practical everyday clinic/transit modules.',
      icon: BookOpen,
      color: 'text-sky-300',
      bg: 'bg-sky-500/20 border-sky-400/30',
      glow: 'from-sky-500/30 to-cyan-500/30',
    },
    {
      step: '04',
      title: 'Track Milestones & Grow',
      description:
        'Watch your confidence soar, advance from Novice to Fluent, and master real-world reading independence.',
      icon: Award,
      color: 'text-emerald-300',
      bg: 'bg-emerald-500/20 border-emerald-400/30',
      glow: 'from-emerald-500/30 to-teal-500/30',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#407c93] text-white border-t border-white/10">
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
            <span>Simple Step-by-Step Flow</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            How NeoRead Accelerates Your Literacy
          </h2>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-medium">
            From first letters to everyday functional literacy in 4 easy, self-paced steps.
          </p>
        </ScrollRevealWrapper>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollRevealWrapper key={item.step} delay={index * 0.12}>
                <div className="relative h-full p-8 rounded-3xl bg-slate-900/60 border border-white/20 backdrop-blur-2xl flex flex-col justify-between space-y-6 group hover:border-white/40 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)] hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 transform-gpu overflow-hidden">
                  {/* Ambient Step Glow */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-tr ${item.glow} blur-2xl opacity-0 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`}
                  />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-4xl font-black text-white/40 group-hover:text-amber-300 transition-colors">
                      {item.step}
                    </span>
                    <div
                      className={`w-14 h-14 rounded-2xl ${item.bg} border flex items-center justify-center ${item.color} group-hover:scale-110 shadow-md transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>

                  <div className="relative z-10 space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed font-normal">{item.description}</p>
                  </div>
                </div>
              </ScrollRevealWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};
