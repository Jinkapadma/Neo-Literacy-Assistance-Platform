import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { registerSchema } from '../../utils/validators.js';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import {
  BookOpen,
  Lock,
  Mail,
  User,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { VantaBirdsBackground } from '../../components/landing/VantaBirdsBackground.jsx';

export const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve saved onboarding choices from survey
  const onboardingData = (() => {
    try {
      const saved = localStorage.getItem('neoread_onboarding_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const currentLanguage =
    location.state?.preferredLanguage || onboardingData?.language?.code || 'te';
  const currentSkills =
    location.state?.targetSkills ||
    onboardingData?.needs || ['reading', 'vocabulary', 'phonics'];
  const languageName =
    onboardingData?.language?.name || (currentLanguage === 'te' ? 'Telugu' : 'Selected');
  const languageNativeName =
    onboardingData?.language?.nativeName || (currentLanguage === 'te' ? 'తెలుగు' : 'భాష');
  const languageFlag = onboardingData?.language?.flag || '🇮🇳';
  const goalDisplay = onboardingData?.dailyGoal?.hoursDisplay || '15 mins / day';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      age: '',
      password: '',
      confirmPassword: '',
      preferredLanguage: currentLanguage,
      role: 'learner',
      targetSkills: currentSkills,
    },
  });

  const onSubmit = async values => {
    setIsLoading(true);
    try {
      // Ensure language and skills from survey are attached
      const payload = {
        ...values,
        preferredLanguage: currentLanguage,
        targetSkills: currentSkills,
      };
      const newUser = await registerAuth(payload);
      navigate('/initial-assessment', {
        replace: true,
        state: {
          preferredLanguage: newUser?.preferredLanguage || currentLanguage,
          age: newUser?.age || values.age,
        },
      });
    } catch {
      // Notification handled in AuthContext
    } finally {
      setIsLoading(false);
    }
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
        {/* Back to Home & Survey Links */}
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
            <span>Retake Survey</span>
          </Link>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/75 border border-white/20 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="text-center space-y-2 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-sky-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/30">
              <BookOpen className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              Join the Intelligent Literacy Platform for customized learning
            </p>
          </div>

          {/* Duolingo Onboarding Pre-configured Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-600/40 to-purple-600/40 border border-brand-400/30 backdrop-blur-md text-xs flex items-center justify-between animate-fadeIn shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{languageFlag}</span>
              <div>
                <div className="font-bold text-white text-sm">
                  {languageNativeName} ({languageName}) Curriculum
                </div>
                <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 mt-0.5">
                  🎯 {goalDisplay} Goal Pre-configured
                </span>
              </div>
            </div>
            <Link
              to="/onboarding"
              className="text-[11px] font-extrabold uppercase tracking-wider text-white hover:text-white bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-xl border border-white/20 transition-all cursor-pointer shadow-sm"
            >
              Change
            </Link>
          </div>

          {/* Registration Form: Name, Email, Age, Password, Confirm Password */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="e.g. Maya Devi"
              icon={User}
              required
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. maya@example.com"
              icon={Mail}
              required
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Age (Years)"
              name="age"
              type="number"
              placeholder="e.g. 24"
              min="3"
              max="120"
              icon={Calendar}
              required
              error={errors.age?.message}
              {...register('age')}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              icon={Lock}
              required
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              icon={ShieldCheck}
              required
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-4"
              icon={ArrowRight}
              iconPosition="right"
            >
              Create Account & Begin
            </Button>
          </form>

          <div className="text-center text-xs text-slate-300 font-medium pt-2">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-brand-300 hover:text-white hover:underline ml-1"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
