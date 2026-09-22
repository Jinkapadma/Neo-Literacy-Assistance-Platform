import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', message = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 space-y-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-brand-600 animate-spin`} />
      {message && <p className="text-sm font-medium text-slate-600">{message}</p>}
    </div>
  );
};

export const Loader = Spinner;

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-100 rounded"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
          </div>
          <div className="h-10 bg-slate-200 rounded-xl mt-4"></div>
        </div>
      ))}
    </div>
  );
};
