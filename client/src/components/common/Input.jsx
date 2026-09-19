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
          <label htmlFor={name} className="block text-sm font-semibold text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
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
            className={`block w-full rounded-xl border-2 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors duration-150 sm:text-base ${
              Icon ? 'pl-11' : 'pl-4'
            } pr-4 py-2.5 ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
                : 'border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-sm font-medium text-rose-600 animate-fadeIn">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
