import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { contentApi } from '../../api/contentApi.js';
import { bhashiniApi } from '../../api/bhashiniApi.js';
import { useProgress } from '../../context/ProgressContext.jsx';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { ProficiencyBadge, Badge } from '../../components/common/Badge.jsx';
import { Spinner, CardSkeleton } from '../../components/common/Loader.jsx';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher.jsx';
import { useAccessibility } from '../../hooks/useAccessibility.js';
import { SUPPORTED_LANGUAGES, CONTENT_TYPES } from '../../utils/constants.js';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Search,
  Globe,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  BookMarked,
  Languages,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useLanguage } from '../../hooks/useLanguage.js';

export const ContentLibrary = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { speakText, stopSpeaking } = useAccessibility();
  const { learningLanguage, setLearningLanguage, interfaceLanguage, learningLangMeta, interfaceLangMeta, t } = useLanguage();
  const { recordSpacedReview } = useProgress();

  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Active reading modal
  const [activeContent, setActiveContent] = useState(null);
  const [activeTranslationLang, setActiveTranslationLang] = useState(interfaceLanguage || null);
  const [dynamicTranslation, setDynamicTranslation] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState({});
  const [hasCompletedCurrentReading, setHasCompletedCurrentReading] = useState(false);

  const languageFilter = searchParams.get('lang') || learningLanguage || 'te';
  const directId = searchParams.get('id');

  const fetchContent = async () => {
    setLoading(true);
    try {
      const params = {
        language: languageFilter,
      };
      if (selectedType !== 'all') params.contentType = selectedType;
      if (selectedDifficulty) params.difficultyLevel = selectedDifficulty;
      if (searchQuery) params.search = searchQuery;

      const res = await contentApi.getAllContent(params);
      setContentList(res.data?.items || res.items || (Array.isArray(res.data) ? res.data : []));

      // If direct ID passed in URL, open it
      if (directId) {
        const item = res.data?.items?.find(i => i._id === directId);
        if (item) setActiveContent(item);
      }
    } catch {
      setContentList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageFilter, selectedType, selectedDifficulty]);

  const handleLanguageChange = langCode => {
    setSelectedLanguage(langCode);
    setSearchParams({ lang: langCode });
  };

  const openReader = item => {
    setActiveContent(item);
    setActiveTranslationLang(null);
    setDynamicTranslation(null);
    setQuizAnswers({});
    setQuizFeedback({});
    setHasCompletedCurrentReading(false);
  };

  const closeReader = () => {
    stopSpeaking();
    setActiveContent(null);
    setActiveTranslationLang(null);
    setDynamicTranslation(null);
  };

  const handleTranslationChange = async targetLang => {
    if (!targetLang || targetLang === activeContent?.language) {
      setActiveTranslationLang(null);
      setDynamicTranslation(null);
      return;
    }

    setActiveTranslationLang(targetLang);

    // Check pre-computed translation first
    const preExisting = activeContent.translations?.find(t => t.language === targetLang);
    if (preExisting) {
      setDynamicTranslation({
        title: preExisting.translatedTitle,
        text: preExisting.translatedText,
      });
      return;
    }

    // Otherwise call Bhashini NMT API for real-time translation
    try {
      setTranslating(true);
      const [titleRes, textRes] = await Promise.all([
        bhashiniApi.translateText(activeContent.title, activeContent.language, targetLang),
        bhashiniApi.translateText(activeContent.textContent, activeContent.language, targetLang),
      ]);

      setDynamicTranslation({
        title: titleRes.translatedText || activeContent.title,
        text: textRes.translatedText || activeContent.textContent,
      });
      toast.success(`Translated via Bhashini AI into ${targetLang.toUpperCase()}!`);
    } catch {
      toast.error('Bhashini translation fallback active');
    } finally {
      setTranslating(false);
    }
  };

  const handleQuizOption = (qIdx, selectedOpt, correctOpt) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: selectedOpt }));
    const isCorrect = selectedOpt === correctOpt;
    setQuizFeedback(prev => ({
      ...prev,
      [qIdx]: isCorrect,
    }));

    if (isCorrect && !hasCompletedCurrentReading) {
      recordSpacedReview(1);
      setHasCompletedCurrentReading(true);
      toast.success('Correct answer! +10 XP added to your progress');
    }
  };

  const handleMarkReadingComplete = () => {
    if (!hasCompletedCurrentReading) {
      recordSpacedReview(1);
      setHasCompletedCurrentReading(true);
      toast.success('Reading completed! +15 XP added to your progress');
    } else {
      toast('Reading already recorded!', { icon: '✨' });
    }
  };

  const getDisplayText = () => {
    if (!activeContent) return '';
    if (dynamicTranslation) return dynamicTranslation.text;
    return activeContent.textContent;
  };

  const getDisplayTitle = () => {
    if (!activeContent) return '';
    if (dynamicTranslation) return dynamicTranslation.title;
    return activeContent.title;
  };

  return (
    <div className="space-y-8 pb-12 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <BookOpen className="w-8 h-8 text-emerald-400" />
            Multilingual Content Repository
          </h1>
          <p className="text-sm text-slate-200 mt-1">
            Explore illustrated stories, phonics cards, and practical reading aids in your preferred language.
          </p>
        </div>

        <LanguageSwitcher
          currentLanguage={languageFilter}
          onLanguageChange={handleLanguageChange}
          size="md"
        />
      </div>

      {/* Filter and Content Type Tabs */}
      <div className="space-y-4">
        {/* Content Type Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CONTENT_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === type.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900/65 text-slate-200 hover:bg-slate-900/85 border border-white/20 backdrop-blur-md'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Search & Difficulty Filter */}
        <div className="bg-slate-900/65 rounded-3xl p-4 border border-white/20 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchContent()}
              placeholder="Search words, stories, tags..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-950/60 border border-white/20 text-white placeholder:text-slate-400 rounded-xl focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="p-2 text-xs font-bold bg-slate-950/60 border border-white/20 text-white rounded-xl focus:border-emerald-400 focus:outline-none"
            >
              <option value="" className="text-slate-900">All Difficulty Levels</option>
              <option value="beginner" className="text-slate-900">Beginner (Level 1)</option>
              <option value="elementary" className="text-slate-900">Elementary (Level 2)</option>
              <option value="intermediate" className="text-slate-900">Intermediate (Level 3)</option>
              <option value="advanced" className="text-slate-900">Advanced (Level 4)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : contentList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentList.map(item => {
            const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === item.language) || {
              flag: '🌐',
              nativeName: item.language,
            };

            return (
              <Card
                key={item._id}
                className="flex flex-col justify-between border border-white/20 hover:border-emerald-400 bg-slate-900/65 backdrop-blur-2xl shadow-2xl rounded-3xl text-white group transition-all"
              >
                <div className="space-y-4">
                  {/* Visual Header Image if available */}
                  {item.imageUrl && (
                    <div className="h-44 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden bg-slate-950/50 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20 shadow-md flex items-center gap-1">
                          <span>{langMeta.flag}</span>
                          <span>{langMeta.nativeName}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {!item.imageUrl && (
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-white/10 border border-white/15 rounded-full text-xs font-bold text-slate-200 flex items-center gap-1">
                        <span>{langMeta.flag}</span>
                        <span>{langMeta.nativeName}</span>
                      </span>
                      <ProficiencyBadge level={item.difficultyLevel} size="sm" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed font-normal">
                      {item.summary || item.textContent}
                    </p>
                  </div>

                  {/* Tags */}
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.tags.slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-4 border-t border-white/10">
                  <Button
                    variant="primary"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 font-bold"
                    onClick={() => openReader(item)}
                    icon={BookOpen}
                  >
                    Read & Practice
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-4 border-dashed border-2 border-white/20 bg-slate-900/65 backdrop-blur-2xl rounded-3xl text-white">
          <BookMarked className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Content Found</h3>
          <p className="text-sm text-slate-300 max-w-sm mx-auto">
            No learning materials match this language or category yet. Try selecting another language or clear your filters.
          </p>
        </Card>
      )}

      {/* Interactive Reader Modal */}
      <Modal
        isOpen={!!activeContent}
        onClose={closeReader}
        title={getDisplayTitle()}
        maxWidth="max-w-3xl"
      >
        {activeContent && (
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1 text-white">
            {/* Audio narration & Bhashini Translation switcher controls */}
            <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-2xl bg-white/5 border border-white/15">
              <button
                onClick={() =>
                  speakText(
                    getDisplayText(),
                    activeTranslationLang || activeContent.language
                  )
                }
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-sm shadow-md transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen Aloud (Audio Aid)</span>
              </button>

              {/* Bhashini Dynamic Translation Switcher */}
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Bhashini AI:</span>
                <select
                  value={activeTranslationLang || ''}
                  onChange={e => handleTranslationChange(e.target.value)}
                  disabled={translating}
                  className="text-xs font-bold p-2 bg-slate-950/80 text-white border border-white/20 rounded-xl focus:border-emerald-400 focus:outline-none cursor-pointer"
                >
                  <option value="" className="text-slate-900">Original ({activeContent.language?.toUpperCase()})</option>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code} className="text-slate-900">
                      {lang.flag} {lang.nativeName} ({lang.code.toUpperCase()})
                    </option>
                  ))}
                </select>
                {translating && <span className="text-xs text-amber-300 font-bold animate-pulse">Translating...</span>}
              </div>
            </div>

            {/* Phonetic Pronunciation Guide */}
            {activeContent.phoneticGuide && (
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Phonetic & Pronunciation Guide
                </p>
                <p className="text-sm font-semibold text-amber-100">
                  {activeContent.phoneticGuide}
                </p>
              </div>
            )}

            {/* Main Text Content */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <p className="text-lg sm:text-xl text-slate-100 leading-relaxed font-medium whitespace-pre-line">
                {getDisplayText()}
              </p>
            </div>

            {/* Vocabulary Flashcards */}
            {activeContent.vocabulary?.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Key Vocabulary Words ({activeContent.vocabulary.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeContent.vocabulary.map((vocab, vIdx) => (
                    <div
                      key={vIdx}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 backdrop-blur-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-white">{vocab.word}</span>
                        {vocab.phonetics && (
                          <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-400/30">
                            {vocab.phonetics}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-200 font-medium">{vocab.meaning}</p>
                      {vocab.exampleSentence && (
                        <p className="text-[11px] text-slate-400 italic">
                          "{vocab.exampleSentence}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comprehension Checkpoint Quiz */}
            {activeContent.comprehensionQuestions?.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Comprehension Checkpoint
                </h4>

                <div className="space-y-4">
                  {activeContent.comprehensionQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 backdrop-blur-md">
                      <p className="text-sm font-bold text-white">
                        {qIdx + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[qIdx] === opt;
                          const isEvaluated = quizFeedback[qIdx] !== undefined;

                          let btnStyle = 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10';
                          if (isEvaluated && isSelected) {
                            btnStyle = quizFeedback[qIdx]
                              ? 'border-emerald-400 bg-emerald-600/40 text-white font-bold'
                              : 'border-rose-400 bg-rose-600/40 text-white font-bold';
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleQuizOption(qIdx, opt, q.correctAnswer)}
                              className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-left transition-colors flex items-center justify-between cursor-pointer ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {isEvaluated && isSelected && (
                                <span>{quizFeedback[qIdx] ? '✅ Correct' : '❌ Try again'}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizFeedback[qIdx] !== undefined && q.explanation && (
                        <p className="text-xs text-indigo-200 bg-indigo-500/20 border border-indigo-400/30 p-2.5 rounded-xl">
                          💡 {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reading Complete & Progress Action */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              <Button
                variant={hasCompletedCurrentReading ? 'secondary' : 'primary'}
                className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 font-bold"
                onClick={handleMarkReadingComplete}
                icon={hasCompletedCurrentReading ? CheckCircle2 : Zap}
              >
                {hasCompletedCurrentReading ? 'Lesson Completed (+15 XP)' : 'Mark Reading Complete & Collect XP'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
