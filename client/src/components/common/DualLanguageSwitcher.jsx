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
        className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-900/95 border border-white/20 hover:border-white/40 text-white shadow-lg backdrop-blur-xl transition-all text-xs font-bold cursor-pointer"
        title="Switch Interface or Learning Language"
      >
        {/* Learning target flag badge */}
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-400/30 text-[11px] font-extrabold">
            <Target className="w-3 h-3 text-brand-400" />
            <span>{learningLangMeta.flag} {learningLangMeta.name}</span>
          </span>

          <span className="text-white/30">|</span>

          {/* Interface language flag badge */}
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-extrabold">
            <Globe className="w-3 h-3 text-indigo-400" />
            <span className="hidden sm:inline">UI:</span>
            <span>{interfaceLangMeta.nativeName}</span>
          </span>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-slate-300 ml-0.5" />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-slate-900/95 border border-white/20 backdrop-blur-2xl shadow-2xl p-4 z-50 animate-fadeIn space-y-4 text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Multilingual Bhashini Matrix
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-300">8 Indian Languages</span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/60 border border-white/10 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('learning')}
              className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'learning' || activeTab === 'both'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
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
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>2. Website Interface</span>
            </button>
          </div>

          {/* SECTION 1: TARGET LANGUAGE TO LEARN */}
          {(activeTab === 'learning' || activeTab === 'both') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1 text-brand-300 font-extrabold">
                  <Target className="w-3.5 h-3.5 text-brand-400" /> Language You Are Learning:
                </span>
                <span className="text-amber-300 font-bold">{learningLangMeta.nativeName} ({learningLangMeta.name})</span>
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
                          ? 'border-brand-400 bg-brand-600/40 text-white shadow-md ring-1 ring-brand-400'
                          : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-base">{lang.flag}</span>
                        <div className="min-w-0">
                          <p className="font-bold truncate text-[11px] leading-tight text-white">{lang.nativeName}</p>
                          <p className="text-[10px] text-slate-400 truncate">{lang.name}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-300 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: WEBSITE INTERFACE LANGUAGE */}
          {(activeTab === 'interface' || activeTab === 'both') && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1 text-indigo-300 font-extrabold">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" /> Website UI Language (Bhashini AI):
                </span>
                <span className="text-amber-300 font-bold">{interfaceLangMeta.nativeName}</span>
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
                          ? 'border-indigo-400 bg-indigo-600/40 text-white shadow-md ring-1 ring-indigo-400'
                          : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-base">{lang.flag}</span>
                        <div className="min-w-0">
                          <p className="font-bold truncate text-[11px] leading-tight text-white">{lang.nativeName}</p>
                          <p className="text-[10px] text-slate-400 truncate">{lang.name}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-300 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Helper Explanatory Footer */}
          <div className="p-2.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-[10px] font-medium text-amber-200 leading-snug">
            💡 <strong>NeoRead Rule:</strong> Educational lessons & puzzles focus on your{' '}
            <span className="font-bold text-white">{learningLangMeta.name}</span> track, while labels and hints are translated into{' '}
            <span className="font-bold text-white">{interfaceLangMeta.name}</span> via Bhashini AI!
          </div>
        </div>
      )}
    </div>
  );
};
