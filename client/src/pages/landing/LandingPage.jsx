import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { BookOpen, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { BRAND } from '../../utils/branding.js';
import { SparkleButton } from '../../components/common/SparkleButton.jsx';

import { DualLanguageSwitcher } from '../../components/common/DualLanguageSwitcher.jsx';

import { HeroSection } from './sections/HeroSection.jsx';
import { FeaturesSection } from './sections/FeaturesSection.jsx';
import { HowItWorksSection } from './sections/HowItWorksSection.jsx';
import { ImpactSection } from './sections/ImpactSection.jsx';
import { TestimonialsSection } from './sections/TestimonialsSection.jsx';
import { CTASection } from './sections/CTASection.jsx';
import { FooterSection } from './sections/FooterSection.jsx';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll depth to transition navbar from transparent to solid
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If already authenticated with valid token, redirect to learner dashboard / profile
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Curriculums', to: '/curriculum' },
    { label: 'Library', to: '/content' },
    { label: 'Assessments', to: '/assessment' },
    { label: 'Games', to: '/games' },
    { label: 'Voice Lab', to: '/voice-practice' },
    { label: 'Analytics', to: '/analytics' },
  ];

  const handleScrollToSection = (e, href) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div
      translate="no"
      data-no-translate="true"
      className="landing-page-root notranslate relative min-h-screen bg-[#407c93] text-slate-100 selection:bg-brand-500 selection:text-white font-sans antialiased overflow-x-hidden"
    >
      {/* 1. STICKY DYNAMIC NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#407c93]/90 backdrop-blur-xl border-b border-white/20 shadow-2xl py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                {BRAND.name.split(' ')[0]}
                <span className="text-brand-300">Read</span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-slate-200 border border-white/20 rounded-full">
                  AI
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-200">
            {navLinks.map(link =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={e => handleScrollToSection(e, link.href)}
                  className="hover:text-white hover:text-brand-200 transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="hover:text-white hover:text-brand-200 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Dual Language & Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <DualLanguageSwitcher />
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-bold text-slate-100 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Log In
            </Link>
            <SparkleButton to="/onboarding">
              Get Started
            </SparkleButton>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <DualLanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-in Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#407c93]/95 border-b border-white/20 px-6 py-6 space-y-4 animate-fadeIn backdrop-blur-2xl">
            <nav className="flex flex-col space-y-3 text-base font-semibold text-slate-100">
              {navLinks.map(link =>
                link.href ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={e => handleScrollToSection(e, link.href)}
                    className="py-2 hover:text-brand-300 transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 hover:text-brand-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            <div className="pt-4 border-t border-white/15 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-slate-100 bg-white/10 hover:bg-white/20 border border-white/20"
              >
                Log In
              </Link>
              <SparkleButton to="/onboarding" className="w-full justify-center">
                Get Started
              </SparkleButton>
            </div>
          </div>
        )}
      </header>

      {/* 2. MAIN LANDING SECTIONS */}
      <main className="relative">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ImpactSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      {/* 3. FOOTER */}
      <FooterSection />
    </div>
  );
};

export default LandingPage;
