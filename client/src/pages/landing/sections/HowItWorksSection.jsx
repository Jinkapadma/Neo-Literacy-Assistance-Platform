import React from 'react';
import { UserPlus, Compass, BookOpen, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollRevealWrapper } from '../../../components/landing/ScrollRevealWrapper.jsx';

export const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Register & Pick Language',
      description:
        'Create a free account in 30 seconds and select your preferred native tongue — English, Hindi, or Spanish.',
      icon: UserPlus,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10 border-brand-500/20',
    },
    {
      step: '02',
      title: 'Quick Initial Assessment',
      description:
        'Take a 3-minute diagnostic check to discover your starting proficiency level with zero pressure.',
      icon: Compass,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      step: '03',
      title: 'Learn Daily (5–10 Mins)',
      description:
        'Engage with voice-guided phonics, cultural stories, and practical everyday clinic/transit modules.',
      icon: BookOpen,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      step: '04',
      title: 'Track Milestones & Grow',
      description:
        'Watch your confidence soar, advance from Novice to Fluent, and master real-world reading independence.',
      icon: Award,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <ScrollRevealWrapper className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          Simple Step-by-Step Flow
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          How NeoRead Accelerates Your Literacy
        </h2>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          From first letters to everyday functional literacy in 4 easy, self-paced steps.
        </p>
      </ScrollRevealWrapper>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <ScrollRevealWrapper key={item.step} delay={index * 0.12}>
              <div className="relative h-full p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl flex flex-col justify-between space-y-6 group hover:border-brand-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-700 group-hover:text-brand-400 transition-colors">
                    {item.step}
                  </span>
                  <div
                    className={`w-12 h-12 rounded-2xl ${item.bg} border flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
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
