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
      <Loader2 className={`${sizeClasses[size]} text-amber-400 animate-spin`} />
      {message && <p className="text-sm font-medium text-slate-200">{message}</p>}
    </div>
  );
};

export const Loader = Spinner;

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-slate-900/65 rounded-3xl border border-white/20 p-6 space-y-4 backdrop-blur-2xl shadow-2xl">
          <div className="h-4 bg-white/10 rounded w-1/3"></div>
          <div className="h-6 bg-white/20 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded w-5/6"></div>
          </div>
          <div className="h-10 bg-white/15 rounded-xl mt-4"></div>
        </div>
      ))}
    </div>
  );
};
