import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { loginSchema } from '../../utils/validators.js';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { BookOpen, Lock, Mail, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { VantaBirdsBackground } from '../../components/landing/VantaBirdsBackground.jsx';
import { BRAND } from '../../utils/branding.js';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/curriculum';

  const [isLoading, setIsLoading] = useState(false);

  // Check for saved onboarding preferences
  const [onboardingData, setOnboardingData] = useState(() => {
    try {
      const saved = localStorage.getItem('neoread_onboarding_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async values => {
    setIsLoading(true);
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch {
      // Error notification handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (email, password = 'Password123!') => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#407c93] text-white">
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

      <div className="relative z-10 w-full max-w-md my-8">
        {/* Back to Home & Retake Survey Links */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900/40 border border-white/20 backdrop-blur-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/onboarding"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 px-3.5 py-2 rounded-xl bg-slate-900/40 border border-amber-400/30 backdrop-blur-md transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Custom Survey</span>
          </Link>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/70 border border-white/20 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="text-center space-y-2 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-sky-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/30">
              <BookOpen className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sign in to NeoRead
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              Access your personalized multilingual learning portal
            </p>
          </div>

          {/* Duolingo Onboarding Progress Badge if completed */}
          {onboardingData?.language && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-brand-600/40 to-purple-600/40 border border-brand-400/30 backdrop-blur-md text-xs flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="text-lg">{onboardingData.language.flag}</span>
                <div>
                  <div className="font-bold text-white">
                    {onboardingData.language.nativeName} ({onboardingData.language.name})
                  </div>
                  <span className="text-[11px] text-amber-300 font-medium">
                    🎯 {onboardingData.dailyGoal?.hoursDisplay || '15 mins / day'} Goal Saved
                  </span>
                </div>
              </div>
              <Link
                to="/onboarding"
                className="text-[10px] font-extrabold uppercase tracking-wider text-brand-200 hover:text-white bg-white/10 px-2 py-1 rounded-lg border border-white/20"
              >
                Change
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. learner@literacy.org"
              icon={Mail}
              required
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              required
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Logins for Instant Testing */}
          <div className="pt-5 border-t border-white/10 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Quick-Fill Seeded Accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill('learner@literacy.org')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left font-semibold text-slate-200 transition-colors backdrop-blur-md"
              >
                🇮🇳 Learner (Hindi)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('learner.en@literacy.org')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left font-semibold text-slate-200 transition-colors backdrop-blur-md"
              >
                🇬🇧 Learner (English)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('educator@literacy.org')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left font-semibold text-slate-200 transition-colors backdrop-blur-md"
              >
                👩‍🏫 Educator
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin@literacy.org')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left font-semibold text-slate-200 transition-colors backdrop-blur-md"
              >
                🛡️ System Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-300 font-medium pt-2">
            New to NeoRead?{' '}
            <Link to="/register" className="font-bold text-brand-300 hover:text-white hover:underline ml-1">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
