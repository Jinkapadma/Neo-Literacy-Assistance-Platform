import React from 'react';
import { Star, Quote } from 'lucide-react';
import { ScrollRevealWrapper } from '../../../components/landing/ScrollRevealWrapper.jsx';

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
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <ScrollRevealWrapper className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
          Learner Stories
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white">
          Real People Building Real Reading Confidence
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Hear how our voice-assisted modules are helping neo-learners gain lifelong independence.
        </p>
      </ScrollRevealWrapper>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item, index) => (
          <ScrollRevealWrapper key={item.name} delay={index * 0.15}>
            <div className="h-full p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-brand-500/30 transition-all duration-300 transform hover:-translate-y-1">
              <div className="space-y-4">
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-700" />
                </div>

                <p className="text-slate-300 text-sm leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* User Profile Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full bg-brand-500/20 border border-brand-400/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.role}</p>
                </div>
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-brand-300">
                  {item.language}
                </span>
              </div>
            </div>
          </ScrollRevealWrapper>
        ))}
      </div>
    </section>
  );
};
