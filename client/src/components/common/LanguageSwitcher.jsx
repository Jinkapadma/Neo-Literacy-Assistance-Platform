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
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Globe className="w-3.5 h-3.5 text-brand-500" />
          Lang:
        </span>
      )}
      <select
        value={currentLanguage}
        onChange={e => onLanguageChange && onLanguageChange(e.target.value)}
        className={`bg-white border-2 border-slate-200 text-slate-800 font-semibold rounded-xl focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 transition-colors cursor-pointer shadow-sm ${
          size === 'sm' ? 'text-xs py-1 px-2' : 'text-sm py-1.5 px-3'
        }`}
      >
        {SUPPORTED_LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
};
