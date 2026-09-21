import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { registerSchema } from '../../utils/validators.js';
import { SUPPORTED_LANGUAGES, TARGET_SKILLS_OPTIONS } from '../../utils/constants.js';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { BookOpen, Lock, Mail, User, Globe, ArrowRight, CheckSquare, ArrowLeft } from 'lucide-react';
import { VantaBirdsBackground } from '../../components/landing/VantaBirdsBackground.jsx';

export const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      preferredLanguage: 'en',
      role: 'learner',
      targetSkills: ['reading', 'vocabulary', 'comprehension'],
    },
  });

  const selectedLanguage = watch('preferredLanguage');
  const selectedSkills = watch('targetSkills') || [];

  const handleSkillToggle = skillId => {
    const current = [...selectedSkills];
    const index = current.indexOf(skillId);
    if (index > -1) {
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      current.push(skillId);
    }
    setValue('targetSkills', current, { shouldValidate: true });
  };

  const onSubmit = async values => {
    setIsLoading(true);
    try {
      await registerAuth(values);
      navigate('/assessment', { replace: true });
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

      <div className="relative z-10 w-full max-w-lg my-8">
        {/* Back to Home Link */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white px-3.5 py-2 rounded-xl bg-slate-900/40 border border-white/20 backdrop-blur-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/70 border border-white/20 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="text-center space-y-2 mb-6">
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
              label="Password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              icon={Lock}
              required
              error={errors.password?.message}
              {...register('password')}
            />

            {/* Primary Language Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Primary Learning Language <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setValue('preferredLanguage', lang.code)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all backdrop-blur-md ${
                      selectedLanguage === lang.code
                        ? 'border-brand-400 bg-brand-600/40 text-white shadow-lg'
                        : 'border-white/15 hover:border-white/30 text-slate-200 bg-white/5'
                    }`}
                  >
                    <div className="text-lg">{lang.flag}</div>
                    <div>{lang.nativeName}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Skills */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-slate-200">
                Target Literacy Goals
              </label>
              <div className="space-y-2">
                {TARGET_SKILLS_OPTIONS.map(skill => {
                  const isChecked = selectedSkills.includes(skill.id);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => handleSkillToggle(skill.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition-colors backdrop-blur-md ${
                        isChecked
                          ? 'border-brand-400 bg-brand-600/30 text-white'
                          : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <span>{skill.label}</span>
                      <CheckSquare
                        className={`w-4 h-4 ${isChecked ? 'text-brand-300' : 'text-slate-400'}`}
                      />
                    </button>
                  );
                })}
              </div>
              {errors.targetSkills && (
                <p className="text-xs text-rose-400">{errors.targetSkills.message}</p>
              )}
            </div>

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
            <Link to="/login" className="font-bold text-brand-300 hover:text-white hover:underline ml-1">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
