import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      name,
      type = 'text',
      error,
      helperText,
      icon: Icon,
      placeholder,
      className = '',
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={name} className="block text-xs font-bold uppercase tracking-wider text-slate-200">
            {label} {required && <span className="text-rose-400">*</span>}
          </label>
        )}
        <div className="relative rounded-2xl shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            className={`block w-full rounded-2xl border-2 bg-slate-900/70 backdrop-blur-md text-white placeholder:text-slate-400 focus:outline-none transition-colors duration-150 sm:text-base ${
              Icon ? 'pl-11' : 'pl-4'
            } pr-4 py-3 ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20'
                : 'border-white/20 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/20'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-bold text-rose-400 animate-fadeIn">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-300 font-medium">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

