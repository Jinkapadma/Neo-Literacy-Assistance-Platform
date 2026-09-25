import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage.js';
import { SUPPORTED_LANGUAGES } from '../../utils/constants.js';
import { Globe, Target, ChevronDown, Check, Sparkles, Volume2 } from 'lucide-react';

export const DualLanguageSwitcher = ({ className = '', compact = false }) => {
  const {
    interfaceLanguage,
    setInterfaceLanguage,
    learningLanguage,
    setLearningLanguage,
    interfaceLangMeta,
    learningLangMeta,
    speakInLearningLang,
  } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('both'); // 'interface' | 'learning' | 'both'
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-white/90 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-brand-400 text-slate-800 dark:text-slate-100 shadow-sm transition-all text-xs font-bold cursor-pointer"
        title="Switch Interface or Learning Language"
      >
        {/* Learning target flag badge */}
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-brand-50 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-[11px]">
            <Target className="w-3 h-3 text-brand-600" />
            <span>{learningLangMeta.flag} {learningLangMeta.name}</span>
          </span>

          <span className="text-slate-300 dark:text-slate-600">|</span>

          {/* Interface language flag badge */}
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px]">
            <Globe className="w-3 h-3 text-indigo-600" />
            <span className="hidden sm:inline">UI:</span>
            <span>{interfaceLangMeta.nativeName}</span>
          </span>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Multilingual Bhashini Matrix
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">8 Indian Languages</span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('learning')}
              className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'learning' || activeTab === 'both'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>1. Target to Learn</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('interface')}
              className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'interface'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>2. Website Interface</span>
            </button>
          </div>

          {/* SECTION 1: TARGET LANGUAGE TO LEARN */}
          {(activeTab === 'learning' || activeTab === 'both') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span className="flex items-center gap-1 text-brand-700 dark:text-brand-400 font-extrabold">
                  <Target className="w-3.5 h-3.5" /> Language You Are Learning:
                </span>
                <span className="text-brand-600 font-bold">{learningLangMeta.nativeName} ({learningLangMeta.name})</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
                {SUPPORTED_LANGUAGES.map(lang => {
                  const isSelected = learningLanguage === lang.code;
                  return (
                    <button
                      key={`learn-${lang.code}`}
                      type="button"
                      onClick={() => {
                        setLearningLanguage(lang.code);
                        speakInLearningLang(lang.greeting || lang.nativeName);
                      }}
                      className={`p-2 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/40 text-brand-900 dark:text-brand-200 shadow-sm ring-1 ring-brand-400'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-base">{lang.flag}</span>
                        <div className="min-w-0">
                          <p className="font-bold truncate text-[11px] leading-tight">{lang.nativeName}</p>
                          <p className="text-[10px] text-slate-400 truncate">{lang.name}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: WEBSITE INTERFACE LANGUAGE */}
          {(activeTab === 'interface' || activeTab === 'both') && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span className="flex items-center gap-1 text-indigo-700 dark:text-indigo-400 font-extrabold">
                  <Globe className="w-3.5 h-3.5" /> Website UI Language (Bhashini AI):
                </span>
                <span className="text-indigo-600 font-bold">{interfaceLangMeta.nativeName}</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
                {SUPPORTED_LANGUAGES.map(lang => {
                  const isSelected = interfaceLanguage === lang.code;
                  return (
                    <button
                      key={`ui-${lang.code}`}
                      type="button"
                      onClick={() => setInterfaceLanguage(lang.code)}
                      className={`p-2 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-200 shadow-sm ring-1 ring-indigo-400'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-base">{lang.flag}</span>
                        <div className="min-w-0">
                          <p className="font-bold truncate text-[11px] leading-tight">{lang.nativeName}</p>
                          <p className="text-[10px] text-slate-400 truncate">{lang.name}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Helper Explanatory Footer */}
          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[10px] font-medium text-amber-900 dark:text-amber-200 leading-snug">
            💡 <strong>NeoRead Rule:</strong> Educational lessons & puzzles focus on your{' '}
            <span className="font-bold">{learningLangMeta.name}</span> track, while labels and hints are translated into{' '}
            <span className="font-bold">{interfaceLangMeta.name}</span> via Bhashini AI!
          </div>
        </div>
      )}
    </div>
  );
};
