import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-brand-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none shadow-sm';

  const variants = {
    primary:
      'bg-brand-500 hover:bg-brand-400 text-slate-950 font-black shadow-lg shadow-brand-500/25 border border-transparent',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-white shadow-slate-900/20 border border-white/10',
    outline:
      'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md',
    ghost:
      'bg-transparent hover:bg-white/10 text-slate-200 hover:text-white shadow-none',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20 border border-transparent',
    success:
      'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-emerald-500/20 border border-transparent',
    audio:
      'bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow-amber-400/25 border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-base gap-2',
    lg: 'px-6 py-3.5 text-lg gap-2.5',
    xl: 'px-8 py-4 text-xl gap-3 rounded-2xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5 flex-shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 flex-shrink-0" />}
        </>
      )}
    </button>
  );
};
