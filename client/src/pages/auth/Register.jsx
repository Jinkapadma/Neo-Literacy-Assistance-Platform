import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { registerSchema } from '../../utils/validators.js';
import { SUPPORTED_LANGUAGES, TARGET_SKILLS_OPTIONS } from '../../utils/constants.js';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Card } from '../../components/common/Card.jsx';
import { BookOpen, Lock, Mail, User, Globe, ArrowRight, CheckSquare } from 'lucide-react';

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
    <div className="max-w-lg mx-auto py-6">
      <Card className="p-8 sm:p-10 border-2 border-slate-200">
        <div className="text-center space-y-2 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/30">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Create Your Account</h1>
          <p className="text-sm text-slate-500">
            Join the Intelligent Literacy Platform for customized learning
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            <label className="block text-sm font-semibold text-slate-700">
              Primary Learning Language <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setValue('preferredLanguage', lang.code)}
                  className={`p-2.5 rounded-xl border-2 text-center text-xs font-bold transition-all ${
                    selectedLanguage === lang.code
                      ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="text-lg">{lang.flag}</div>
                  <div>{lang.nativeName}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Skills */}
          <div className="space-y-2 pt-2">
            <label className="block text-sm font-semibold text-slate-700">
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
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 text-left text-xs font-semibold transition-colors ${
                      isChecked
                        ? 'border-brand-500 bg-brand-50/60 text-brand-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{skill.label}</span>
                    <CheckSquare
                      className={`w-4 h-4 ${isChecked ? 'text-brand-600' : 'text-slate-300'}`}
                    />
                  </button>
                );
              })}
            </div>
            {errors.targetSkills && (
              <p className="text-xs text-rose-500">{errors.targetSkills.message}</p>
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

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};
