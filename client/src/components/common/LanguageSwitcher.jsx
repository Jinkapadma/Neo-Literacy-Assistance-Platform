import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../utils/constants.js';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = ({
  currentLanguage = 'en',
  onLanguageChange,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <Globe className="w-3.5 h-3.5 text-brand-300" />
          Lang:
        </span>
      )}
      <select
        value={currentLanguage}
        onChange={e => onLanguageChange && onLanguageChange(e.target.value)}
        className={`bg-slate-950/60 border border-white/20 text-white font-semibold rounded-xl focus:border-brand-400 focus:outline-none backdrop-blur-md transition-colors cursor-pointer shadow-sm ${
          size === 'sm' ? 'text-xs py-1 px-2' : 'text-sm py-1.5 px-3'
        }`}
      >
        {SUPPORTED_LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code} className="text-slate-900">
            {lang.flag} {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
};
