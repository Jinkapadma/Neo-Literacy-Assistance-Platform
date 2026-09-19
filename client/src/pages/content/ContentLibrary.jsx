import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { contentApi } from '../../api/contentApi.js';
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
} from 'lucide-react';

export const ContentLibrary = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedLanguage, setSelectedLanguage, speakText, stopSpeaking } = useAccessibility();

  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Active reading modal
  const [activeContent, setActiveContent] = useState(null);
  const [activeTranslationLang, setActiveTranslationLang] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState({});

  const languageFilter = searchParams.get('lang') || selectedLanguage || 'en';
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
      setContentList(res.data?.items || []);

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
    setQuizAnswers({});
    setQuizFeedback({});
  };

  const closeReader = () => {
    stopSpeaking();
    setActiveContent(null);
    setActiveTranslationLang(null);
  };

  const handleQuizOption = (qIdx, selectedOpt, correctOpt) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: selectedOpt }));
    setQuizFeedback(prev => ({
      ...prev,
      [qIdx]: selectedOpt === correctOpt,
    }));
  };

  const getDisplayText = () => {
    if (!activeContent) return '';
    if (activeTranslationLang) {
      const trans = activeContent.translations?.find(t => t.language === activeTranslationLang);
      return trans ? trans.translatedText : activeContent.textContent;
    }
    return activeContent.textContent;
  };

  const getDisplayTitle = () => {
    if (!activeContent) return '';
    if (activeTranslationLang) {
      const trans = activeContent.translations?.find(t => t.language === activeTranslationLang);
      return trans ? trans.translatedTitle : activeContent.title;
    }
    return activeContent.title;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-8 h-8 text-emerald-600" />
            Multilingual Content Repository
          </h1>
          <p className="text-sm text-slate-500 mt-1">
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
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedType === type.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Search & Difficulty Filter */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchContent()}
              placeholder="Search words, stories, tags..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="p-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
            >
              <option value="">All Difficulty Levels</option>
              <option value="beginner">Beginner (Level 1)</option>
              <option value="elementary">Elementary (Level 2)</option>
              <option value="intermediate">Intermediate (Level 3)</option>
              <option value="advanced">Advanced (Level 4)</option>
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
                className="flex flex-col justify-between border-2 border-slate-200/80 hover:border-emerald-500 group"
              >
                <div className="space-y-4">
                  {/* Visual Header Image if available */}
                  {item.imageUrl && (
                    <div className="h-44 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden bg-slate-100 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                          <span>{langMeta.flag}</span>
                          <span>{langMeta.nativeName}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {!item.imageUrl && (
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1">
                        <span>{langMeta.flag}</span>
                        <span>{langMeta.nativeName}</span>
                      </span>
                      <ProficiencyBadge level={item.difficultyLevel} size="sm" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {item.summary || item.textContent}
                    </p>
                  </div>

                  {/* Tags */}
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.tags.slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Button
                    variant="primary"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
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
        <Card className="p-12 text-center space-y-4 border-dashed border-2 border-slate-300">
          <BookMarked className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Content Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
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
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Audio narration & Translation switcher controls */}
            <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <button
                onClick={() =>
                  speakText(
                    getDisplayText(),
                    activeTranslationLang || activeContent.language
                  )
                }
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm shadow-sm transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen Aloud (Audio Aid)</span>
              </button>

              {/* Translation switcher if translations exist */}
              {activeContent.translations?.length > 0 && (
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-600">Translate:</span>
                  <select
                    value={activeTranslationLang || ''}
                    onChange={e => setActiveTranslationLang(e.target.value || null)}
                    className="text-xs font-bold p-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="">Original ({activeContent.language.toUpperCase()})</option>
                    {activeContent.translations.map(tr => (
                      <option key={tr.language} value={tr.language}>
                        {tr.language.toUpperCase()} Translation
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Phonetic Pronunciation Guide */}
            {activeContent.phoneticGuide && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Phonetic & Pronunciation Guide
                </p>
                <p className="text-sm font-semibold text-amber-950">
                  {activeContent.phoneticGuide}
                </p>
              </div>
            )}

            {/* Main Text Content */}
            <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80">
              <p className="text-lg sm:text-xl text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                {getDisplayText()}
              </p>
            </div>

            {/* Vocabulary Flashcards */}
            {activeContent.vocabulary?.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Key Vocabulary Words ({activeContent.vocabulary.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeContent.vocabulary.map((vocab, vIdx) => (
                    <div
                      key={vIdx}
                      className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-emerald-950">{vocab.word}</span>
                        {vocab.phonetics && (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                            {vocab.phonetics}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{vocab.meaning}</p>
                      {vocab.exampleSentence && (
                        <p className="text-[11px] text-slate-500 italic">
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
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  Comprehension Checkpoint
                </h4>

                <div className="space-y-4">
                  {activeContent.comprehensionQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3">
                      <p className="text-sm font-bold text-slate-900">
                        {qIdx + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[qIdx] === opt;
                          const isEvaluated = quizFeedback[qIdx] !== undefined;
                          const isCorrectChoice = opt === q.correctAnswer;

                          let btnStyle = 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50';
                          if (isEvaluated && isSelected) {
                            btnStyle = quizFeedback[qIdx]
                              ? 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold'
                              : 'border-rose-500 bg-rose-100 text-rose-950 font-bold';
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleQuizOption(qIdx, opt, q.correctAnswer)}
                              className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-left transition-colors flex items-center justify-between ${btnStyle}`}
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
                        <p className="text-xs text-indigo-900 bg-indigo-100/50 p-2.5 rounded-xl">
                          💡 {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
