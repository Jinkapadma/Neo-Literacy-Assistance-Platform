import React from 'react';
import { PROFICIENCY_LEVELS } from '../../utils/constants.js';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant] || variants.default} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const ProficiencyBadge = ({ level = 'unassessed', size = 'md' }) => {
  const levelInfo = PROFICIENCY_LEVELS[level] || PROFICIENCY_LEVELS.unassessed;

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${levelInfo.badgeClass} ${
        size === 'sm' ? 'text-xs px-2.5 py-0.5' : size === 'lg' ? 'text-base px-4 py-1.5' : 'text-sm px-3 py-1'
      }`}
    >
      <span className="w-2 h-2 rounded-full mr-1.5 bg-current opacity-75"></span>
      {levelInfo.label}
    </span>
  );
};
