import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';
import { ScrollRevealWrapper } from '../../../components/landing/ScrollRevealWrapper.jsx';
import { VantaBirdsBackground } from '../../../components/landing/VantaBirdsBackground.jsx';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Ramesh K.',
      role: 'Adult Neo-Learner',
      language: 'हिंदी / English',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ramesh',
      quote:
        'I always struggled with doctor prescription slips and hospital boards. The voice guidance and Hindi translations helped me read my clinic notes on my own for the first time.',
      rating: 5,
    },
    {
      name: 'Maria S.',
      role: 'Foundational Reader',
      language: 'Español / English',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=maria',
      quote:
        'The slow 0.85x voice speed is a lifesaver. I can tap any 3-letter word and repeat it until I get the pronunciation right. The app gives me immense confidence.',
      rating: 5,
    },
    {
      name: 'David L.',
      role: 'Community Student',
      language: 'English',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=david',
      quote:
        'Other apps feel childish with cartoons. NeoRead feels respectful, modern, and focused on real-life tasks like reading bus schedules and market receipts.',
      rating: 5,
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
        <ScrollRevealWrapper className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/30 border border-white/20 backdrop-blur-md shadow-inner text-xs font-bold uppercase tracking-wider text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Learner Stories</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Real People Building Real Reading Confidence
          </h2>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
            Hear how our voice-assisted modules are helping neo-learners gain lifelong independence.
          </p>
        </ScrollRevealWrapper>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <ScrollRevealWrapper key={item.name} delay={index * 0.15}>
              <div className="h-full p-8 rounded-3xl bg-slate-900/60 border border-white/20 backdrop-blur-2xl flex flex-col justify-between space-y-6 hover:border-white/40 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)] hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 transform-gpu overflow-hidden group">
                <div className="space-y-4">
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-300">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-white/30 group-hover:text-amber-300 transition-colors" />
                  </div>

                  <p className="text-slate-200 text-sm leading-relaxed italic font-normal">
                    "{item.quote}"
                  </p>
                </div>

                {/* User Profile Footer */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full bg-brand-500/30 border border-white/30"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{item.name}</h4>
                    <p className="text-xs text-slate-300">{item.role}</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200 backdrop-blur-md">
                    {item.language}
                  </span>
                </div>
              </div>
            </ScrollRevealWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};
