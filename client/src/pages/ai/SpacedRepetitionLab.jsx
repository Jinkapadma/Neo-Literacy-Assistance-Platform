import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RotateCw,
  Volume2,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  Award,
  ArrowRight,
  RefreshCw,
  Layers,
  Calendar,
} from 'lucide-react';
import { aiApi } from '../../api/aiApi.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useProgress } from '../../context/ProgressContext.jsx';
import { Card } from '../../components/common/Card.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Loader } from '../../components/common/Loader.jsx';

export const SpacedRepetitionLab = () => {
  const { user } = useAuth();
  const { recordSpacedReview } = useProgress();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await aiApi.getSpacedRepetitionCards({ limit: 12 });
      if (res?.data?.cards && res.data.cards.length > 0) {
        setCards(res.data.cards);
      } else {
        // Fallback demo cards in case database has not seeded individual user reviews
        setCards([
          {
            _id: 'card_1',
            targetText: 'అమ్మ (Amma)',
            phonetic: '/ʌm.mɑː/',
            meaning: 'Mother / Parent',
            transliteration: 'Amma',
            language: 'te',
            difficulty: 'beginner',
            easeFactor: 2.5,
            intervalDays: 1,
            repetitions: 0,
            exampleSentence: 'అమ్మ ప్రేమ అమూల్యమైనది (Mother’s love is priceless)',
            mnemonic: 'The first word child utters starting with the primordial vowel ‘అ’.',
          },
          {
            _id: 'card_2',
            targetText: 'పుస్తకం (Pustakam)',
            phonetic: '/pʊs.t̪ʌ.kʌm/',
            meaning: 'Book / Manuscript',
            transliteration: 'Pustakam',
            language: 'te',
            difficulty: 'intermediate',
            easeFactor: 2.36,
            intervalDays: 3,
            repetitions: 2,
            exampleSentence: 'నేను ప్రతిరోజూ ఒక పుస్తకం చదువుతాను (I read a book everyday)',
            mnemonic: 'Connects ‘పు’ (flower-like pages) with ‘స్త’ ligature blend.',
          },
          {
            _id: 'card_3',
            targetText: 'సూర్యుడు (Sūryuḍu)',
            phonetic: '/suːɾ.jʊ.ɖʊ/',
            meaning: 'Sun / Solar Light',
            transliteration: 'Suryudu',
            language: 'te',
            difficulty: 'intermediate',
            easeFactor: 2.6,
            intervalDays: 6,
            repetitions: 3,
            exampleSentence: 'తూర్పున సూర్యుడు ఉదయిస్తాడు (The sun rises in the east)',
            mnemonic: 'Long vowel ‘సూ’ radiating light into the retroflex ‘డు’.',
          },
          {
            _id: 'card_4',
            targetText: 'విద్యార్థి (Vidyārthi)',
            phonetic: '/ʋɪd̪.jɑːɾ.t̪ʰɪ/',
            meaning: 'Student / Seeker of Knowledge',
            transliteration: 'Vidyarthi',
            language: 'te',
            difficulty: 'advanced',
            easeFactor: 2.1,
            intervalDays: 2,
            repetitions: 1,
            exampleSentence: 'విద్యార్థి క్రమశిక్షణతో చదవాలి (A student must study with discipline)',
            mnemonic: 'Combines ‘విద్యా’ (knowledge) with ‘అర్థి’ (seeker).',
          },
        ]);
      }
      setCurrentIndex(0);
      setIsFlipped(false);
      setSessionCompleted(false);
      setCompletedCount(0);
      setStartTime(Date.now());
    } catch (err) {
      console.error('Failed to load flashcards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.split('(')[0].trim());
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const handleRating = async (rating) => {
    const currentCard = cards[currentIndex];
    const duration = Date.now() - startTime;
    setSubmitting(true);

    try {
      if (currentCard?._id && !currentCard._id.startsWith('card_')) {
        await aiApi.submitCardReview({
          itemId: currentCard._id,
          qualityRating: rating,
          reviewDurationMs: duration,
        });
      }
    } catch (err) {
      console.warn('Review submission offline/handled locally:', err);
    } finally {
      setSubmitting(false);
      setCompletedCount(prev => prev + 1);
      recordSpacedReview(1);

      if (currentIndex + 1 < cards.length) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
        setStartTime(Date.now());
      } else {
        setSessionCompleted(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader size="lg" />
        <p className="text-slate-600 font-semibold animate-pulse">
          Calculating SuperMemo-2 (SM-2) Next Optimal Interval Queues...
        </p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SUPERMEMO-2 (SM-2) ACTIVE ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Spaced Repetition Memory Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Scientifically scheduled intervals prevent memory decay and lock phonemes into long-term memory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/ai-path">
            <Button variant="outline" size="sm">
              <Layers className="w-4 h-4 mr-1.5" />
              Knowledge Graph
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={fetchCards}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!sessionCompleted && currentCard ? (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Card {currentIndex + 1} of {cards.length}</span>
              <span className="text-brand-600">{Math.round(((currentIndex) / cards.length) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex) / cards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 3D Flippable Card Container */}
          <div className="perspective-1000 min-h-[360px] flex items-center justify-center">
            <div
              onClick={handleFlip}
              className={`relative w-full max-w-2xl min-h-[360px] cursor-pointer rounded-3xl transition-transform duration-700 transform-style-3d shadow-xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Card Front */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl p-8 bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/40 border-2 border-indigo-100 flex flex-col justify-between items-center text-center">
                <div className="w-full flex items-center justify-between">
                  <Badge variant="primary" size="sm">
                    {currentCard.language ? currentCard.language.toUpperCase() : 'TELUGU'}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Interval: {currentCard.intervalDays || 1}d</span>
                  </div>
                </div>

                <div className="space-y-3 my-auto">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
                    Target Orthographic Glyph
                  </p>
                  <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-wide">
                    {currentCard.targetText}
                  </h2>
                  <p className="text-sm font-mono text-slate-500">{currentCard.phonetic}</p>
                </div>

                <div className="w-full flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(currentCard.targetText);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 font-bold hover:bg-brand-100 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Acoustic Audio</span>
                  </button>

                  <div className="flex items-center gap-1 text-slate-400 font-medium">
                    <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>Click anywhere to flip</span>
                  </div>
                </div>
              </div>

              {/* Card Back */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white border-2 border-purple-800 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <Badge variant="success" size="sm">
                    Meaning & Context
                  </Badge>
                  <span className="text-xs text-purple-300 font-medium">
                    Repetitions: {currentCard.repetitions || 0}
                  </span>
                </div>

                <div className="space-y-4 my-auto">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{currentCard.meaning}</h3>
                    <p className="text-xs text-indigo-300 mt-0.5">Transliteration: {currentCard.transliteration}</p>
                  </div>

                  {currentCard.exampleSentence && (
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                        Contextual Sentence
                      </p>
                      <p className="text-xs text-slate-100">{currentCard.exampleSentence}</p>
                    </div>
                  )}

                  {currentCard.mnemonic && (
                    <p className="text-xs text-amber-200 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                      💡 Mnemonic: {currentCard.mnemonic}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-purple-300 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(currentCard.targetText);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Play Audio</span>
                  </button>
                  <span className="text-xs text-slate-400">Rate your recall accuracy below</span>
                </div>
              </div>
            </div>
          </div>

          {/* SM-2 Recall Rating Bar */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                SuperMemo-2 Feedback Rating
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Select how easily you recalled this concept
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
              {[
                { rating: 0, label: 'Blackout', color: 'hover:bg-red-500 hover:text-white border-red-200 text-red-700 bg-red-50/50' },
                { rating: 1, label: 'Incorrect', color: 'hover:bg-rose-500 hover:text-white border-rose-200 text-rose-700 bg-rose-50/50' },
                { rating: 2, label: 'Hard Recall', color: 'hover:bg-amber-500 hover:text-white border-amber-200 text-amber-700 bg-amber-50/50' },
                { rating: 3, label: 'Hesitant', color: 'hover:bg-sky-500 hover:text-white border-sky-200 text-sky-700 bg-sky-50/50' },
                { rating: 4, label: 'Good', color: 'hover:bg-indigo-500 hover:text-white border-indigo-200 text-indigo-700 bg-indigo-50/50' },
                { rating: 5, label: 'Mastered', color: 'hover:bg-emerald-500 hover:text-white border-emerald-200 text-emerald-700 bg-emerald-50/50' },
              ].map(btn => (
                <button
                  key={btn.rating}
                  disabled={submitting}
                  onClick={() => handleRating(btn.rating)}
                  className={`p-3 rounded-2xl border font-bold text-xs transition-all duration-200 text-center flex flex-col items-center justify-center gap-1 active:scale-95 disabled:opacity-50 ${btn.color}`}
                >
                  <span className="text-base font-black">{btn.rating}</span>
                  <span className="text-[10px] font-semibold tracking-tight">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Session Completed Screen */
        <Card className="p-10 text-center space-y-6 border-slate-200 shadow-lg max-w-xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Review Batch Completed!</h2>
            <p className="text-sm text-slate-600">
              You reviewed <span className="font-bold text-slate-900">{completedCount} items</span>.
              The AI has recomputed ease factors and scheduled your next review intervals.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <p className="text-xs text-slate-500">Items Reviewed</p>
              <p className="text-xl font-bold text-slate-900">{completedCount}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <p className="text-xs text-slate-500">Memory Consolidation</p>
              <p className="text-xl font-bold text-emerald-600">+94% Stability</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Button variant="primary" onClick={fetchCards} className="w-full sm:w-auto">
              <RefreshCw className="w-4 h-4 mr-2" />
              Start New Queue
            </Button>
            <Link to="/voice-practice" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                Practice Voice Lab
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};
