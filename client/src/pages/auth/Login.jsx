import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { loginSchema } from '../../utils/validators.js';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Card } from '../../components/common/Card.jsx';
import { BookOpen, Lock, Mail, ArrowRight, Sparkles, UserCheck } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/curriculum';

  const [isLoading, setIsLoading] = useState(false);

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
    <div className="max-w-md mx-auto py-8">
      <Card className="p-8 sm:p-10 border-2 border-slate-200">
        <div className="text-center space-y-2 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/30">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Sign in to NeoRead</h1>
          <p className="text-sm text-slate-500">
            Access your personalized multilingual learning portal
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick-Fill Seeded Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoFill('learner@literacy.org')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-left font-semibold text-slate-700 transition-colors"
            >
              🇮🇳 Learner (Hindi)
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('learner.en@literacy.org')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-left font-semibold text-slate-700 transition-colors"
            >
              🇬🇧 Learner (English)
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('educator@literacy.org')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-left font-semibold text-slate-700 transition-colors"
            >
              👩‍🏫 Educator
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin@literacy.org')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-left font-semibold text-slate-700 transition-colors"
            >
              🛡️ System Admin
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          New to NeoRead?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
};
