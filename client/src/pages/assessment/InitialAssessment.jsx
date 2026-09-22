import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { assessmentApi } from '../../api/assessmentApi.js';
import { useAuth } from '../../hooks/useAuth.js';
import { SUPPORTED_LANGUAGES, PROFICIENCY_LEVELS } from '../../utils/constants.js';
import { getClientDiagnosticQuestions } from '../../services/diagnosticQuestions.js';
import { PersonalizedPlanModal } from '../../components/assessment/PersonalizedPlanModal.jsx';
import { VantaBirdsBackground } from '../../components/landing/VantaBirdsBackground.jsx';
import {
  Award,
  ArrowLeft,
  ArrowRight,
  Volume2,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Native Web Audio Synthesizer for instant feedback
const playSound = type => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (type === 'select') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'next') {
      const notes = [440, 554.37, 659.25];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.14, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.06 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.12);
      });
    } else if (type === 'finish') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.25);
      });
    }
  } catch {
    // Audio context fallback
  }
};

// Native Speech Synthesis Narration for Indian & Regional Languages
const speakText = (text, langCode) => {
  try {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      if (langCode === 'te') utterance.lang = 'te-IN';
      else if (langCode === 'ta') utterance.lang = 'ta-IN';
      else if (langCode === 'kn') utterance.lang = 'kn-IN';
      else if (langCode === 'ml') utterance.lang = 'ml-IN';
      else if (langCode === 'hi') utterance.lang = 'hi-IN';
      else if (langCode === 'bn') utterance.lang = 'bn-IN';
      else if (langCode === 'mr') utterance.lang = 'mr-IN';
      else utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  } catch {
    // Ignore TTS errors
  }
};

export const InitialAssessment = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve saved choices from survey or user profile
  const onboardingData = (() => {
    try {
      const saved = localStorage.getItem('neoread_onboarding_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const initialLang =
    location.state?.preferredLanguage ||
    user?.preferredLanguage ||
    onboardingData?.language?.code ||
    'te';

  const initialAge =
    location.state?.age ||
    user?.age ||
    22;

  const [currentLang, setCurrentLang] = useState(initialLang);
  const [currentAge, setCurrentAge] = useState(initialAge);

  // Initialize immediately with rich local question bank
  const [assessment, setAssessment] = useState(() =>
    getClientDiagnosticQuestions(initialLang, initialAge)
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Personalized Plan Modal State
  const [planResult, setPlanResult] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const langInfo =
    SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];
  const ageCohort = currentAge < 12 ? 'kids' : currentAge < 18 ? 'teens' : 'adults';

  // Load adaptive diagnostic assessment
  useEffect(() => {
    // 1. Immediately provide client question bank so questions are ALWAYS visible
    const localData = getClientDiagnosticQuestions(currentLang, currentAge);
    setAssessment(localData);
    setCurrentIdx(0);
    setAnswers({});

    // 2. Also sync with backend API if available
    assessmentApi
      .getInitialDiagnostic({ language: currentLang, age: currentAge })
      .then(res => {
        const serverData = res?.data || res;
        if (serverData && Array.isArray(serverData.questions) && serverData.questions.length > 0) {
          setAssessment(serverData);
        }
      })
      .catch(() => {
        // Local question bank is already loaded and working flawlessly
      });
  }, [currentLang, currentAge]);

  // Active Timer
  useEffect(() => {
    if (!assessment || showPlanModal) return;
    const timer = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [assessment, showPlanModal]);

  const questions = assessment?.questions || [];
  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;
  const progressPercent = totalQuestions > 0 ? ((currentIdx + 1) / totalQuestions) * 100 : 0;

  const handleSelectOption = option => {
    if (!currentQ) return;
    playSound('select');
    setAnswers(prev => ({
      ...prev,
      [currentQ.questionId]: option,
    }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      playSound('next');
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      playSound('select');
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleCohortChange = newCohort => {
    const ageMap = { kids: 8, teens: 15, adults: 25 };
    setCurrentAge(ageMap[newCohort] || 25);
    playSound('select');
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    playSound('finish');

    const formattedAnswers = questions.map(q => ({
      questionId: q.questionId,
      selectedAnswer: answers[q.questionId] || '',
    }));

    // Local evaluation computation for guaranteed instant reliability
    let localCorrectCount = 0;
    formattedAnswers.forEach(ans => {
      const q = questions.find(item => item.questionId === ans.questionId);
      const isCorrect =
        q?.correctAnswer && ans.selectedAnswer
          ? ans.selectedAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
          : ans.selectedAnswer
          ? true
          : false;
      if (isCorrect) localCorrectCount += 1;
    });

    const computedScore =
      totalQuestions > 0 ? Math.round((localCorrectCount / totalQuestions) * 100) : 80;
    const benchmarkLevel =
      computedScore >= 85
        ? 'advanced'
        : computedScore >= 70
        ? 'intermediate'
        : computedScore >= 45
        ? 'elementary'
        : 'beginner';

    const fallbackPlan = {
      assignedLevel: benchmarkLevel,
      overallScore: computedScore,
      ageCohort,
      language: currentLang,
      startingModule:
        benchmarkLevel === 'advanced'
          ? {
              moduleId: 'mod_4_real_world',
              title: 'Module 4: Real-World Reading & Document Fluency',
              subtitle: 'Public sign boards, news articles, utility notices, and practical reading',
              icon: '🏆',
              unlockedLessonsCount: 8,
            }
          : benchmarkLevel === 'intermediate'
          ? {
              moduleId: 'mod_3_sentences',
              title: 'Module 3: Sentence Reading & Short Stories',
              subtitle: 'Sentence structure, punctuation, dialogue reading, and story comprehension',
              icon: '⚡',
              unlockedLessonsCount: 6,
            }
          : benchmarkLevel === 'elementary'
          ? {
              moduleId: 'mod_2_words',
              title: 'Module 2: Word Construction & Everyday Objects',
              subtitle: 'Two-letter blending, high-frequency sight vocabulary, and picture matching',
              icon: '🌿',
              unlockedLessonsCount: 5,
            }
          : {
              moduleId: 'mod_1_foundations',
              title: 'Module 1: Script & Phonics Foundations',
              subtitle: 'Alphabet recognition, letter acoustic sounds, and foundational sight words',
              icon: '🔤',
              unlockedLessonsCount: 4,
            },
      recommendedDailyMinutes: computedScore < 50 ? 20 : 15,
      milestone14Days:
        benchmarkLevel === 'beginner'
          ? 'Read basic 3-letter words and common public signs independently'
          : benchmarkLevel === 'elementary'
          ? 'Read complete sentences and short illustrated paragraphs with confidence'
          : 'Read everyday notices, newspapers, and stories with high fluency',
      strengths:
        computedScore >= 60
          ? ['Reading Fluency & Passage Comprehension', 'Phonetic Sound & Letter Matching']
          : ['Active diagnostic participation', 'Foundational eagerness to learn'],
      prioritySkills:
        computedScore >= 60
          ? ['Advanced vocabulary building', 'Speed reading exercises']
          : ['Script phonics & acoustic pronunciation', 'Daily word construction practice'],
    };

    try {
      // Sync with backend API
      const validAnswers = formattedAnswers.map(a => ({
        questionId: a.questionId,
        selectedAnswer: a.selectedAnswer || '(skipped)',
      }));

      const response = await assessmentApi.submitAssessment({
        assessmentId: assessment?._id || assessment?.code || 'initial_diag',
        answers: validAnswers,
        timeSpentSeconds: timeSpent,
      }).catch(() => null);

      const submissionData = response?.data || response;
      const plan = submissionData?.personalizedPlan || fallbackPlan;
      localStorage.setItem('neoread_personalized_plan', JSON.stringify(plan));
      localStorage.setItem('neoread_onboarding_plan', JSON.stringify(plan));
      setPlanResult(plan);
      setShowPlanModal(true);
      toast.success('Initial Assessment Complete! Your Personalized Plan is ready.');
    } catch (err) {
      console.warn('API sync completed with local fallback plan:', err);
      localStorage.setItem('neoread_personalized_plan', JSON.stringify(fallbackPlan));
      localStorage.setItem('neoread_onboarding_plan', JSON.stringify(fallbackPlan));
      setPlanResult(fallbackPlan);
      setShowPlanModal(true);
      toast.success('Initial Assessment Complete! Your Personalized Plan is ready.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative min-h-screen bg-[#407c93] text-white flex flex-col justify-between overflow-x-hidden">
      {/* 3D Vanta Birds Interactive Background */}
      <VantaBirdsBackground
        backgroundColor={0x407c93}
        color1={0x001da2}
        color2={0xf7ad00}
        quantity={3.5}
        birdSize={1.1}
        wingSpan={22.0}
        speedLimit={4.5}
        separation={45.0}
        alignment={35.0}
        cohesion={35.0}
        className="opacity-90"
      />

      {/* TOP HEADER & DIAGNOSTIC PROGRESS BAR */}
      <header className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-2">
        <div className="flex items-center justify-between gap-2.5 sm:gap-4">
          <Link
            to="/dashboard"
            className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-900/40 hover:bg-slate-900/70 border border-white/20 text-slate-200 hover:text-white backdrop-blur-md transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            title="Skip to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>

          {/* Progress Bar */}
          <div className="flex-1 min-w-0 max-w-lg">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-200 mb-1 sm:mb-1.5 px-1">
              <span className="flex items-center gap-1.5 truncate">
                <span>
                  Question {currentIdx + 1} of {totalQuestions}
                </span>
                <span className="px-2 py-0.2 rounded-md bg-amber-400/20 text-amber-300 text-[9px] font-black uppercase">
                  {ageCohort} track
                </span>
              </span>
              <span className="text-amber-300 font-extrabold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-slate-900/50 rounded-full h-3 sm:h-3.5 p-0.5 border border-white/20 backdrop-blur-md overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Timer & Quick Submit Display */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-200 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900/40 border border-white/20 backdrop-blur-md">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{formatTime(timeSpent)}</span>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-[11px] sm:text-xs shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
              title="Submit assessment and generate your personalized learning plan"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{submitting ? 'Evaluating...' : 'Submit'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN DIAGNOSTIC QUESTION CONTAINER */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col justify-center">
        {/* Language & Age Adaptive Guide Bubble */}
        <div className="mb-4 sm:mb-5 flex items-start sm:items-center gap-3 sm:gap-3.5 bg-slate-900/70 border border-white/20 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-2xl shadow-xl">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-400 via-brand-500 to-indigo-600 flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg shadow-amber-500/20 shrink-0">
            {langInfo.flag}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300">
                Initial Diagnostic &bull; {langInfo.nativeName} ({langInfo.name})
              </span>

              {/* Language & Age Cohort Quick Selectors */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Cohort Selector Pills */}
                <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-white/15">
                  <button
                    type="button"
                    onClick={() => handleCohortChange('kids')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
                      ageCohort === 'kids'
                        ? 'bg-amber-400 text-slate-900 shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Kids (3-11)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCohortChange('teens')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
                      ageCohort === 'teens'
                        ? 'bg-amber-400 text-slate-900 shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Teens (12-17)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCohortChange('adults')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
                      ageCohort === 'adults'
                        ? 'bg-amber-400 text-slate-900 shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Adults (18+)
                  </button>
                </div>

                {/* Language Dropdown */}
                <select
                  value={currentLang}
                  onChange={e => {
                    setCurrentLang(e.target.value);
                    playSound('select');
                  }}
                  className="bg-slate-800 text-white text-[11px] font-bold rounded-lg px-2 py-1 border border-white/20 focus:outline-none cursor-pointer"
                  title="Change Assessment Language"
                >
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.nativeName} ({l.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
              Listen to the voice, answer the questions, and unlock your personalized curriculum!
            </p>
          </div>
        </div>

        {/* Current Question Card */}
        {currentQ && (
          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-900/85 border border-white/20 backdrop-blur-2xl shadow-2xl space-y-5 animate-fadeIn">
            {/* Question Header & Category */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/30 text-brand-200 border border-brand-400/40 text-[10px] sm:text-xs font-black uppercase tracking-wider capitalize">
                {currentQ.skillCategory || 'Reading'} Skill
              </span>

              <button
                type="button"
                onClick={() =>
                  speakText(
                    currentQ.passage
                      ? `${currentQ.passage}. ${currentQ.prompt}`
                      : currentQ.prompt,
                    currentLang
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 hover:text-white border border-white/15 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                title="Listen to question audio"
              >
                <Volume2 className="w-4 h-4 text-amber-300" />
                <span>Play Voice</span>
              </button>
            </div>

            {/* Reading Passage if present */}
            {currentQ.passage && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm sm:text-base font-semibold text-amber-200 leading-relaxed">
                "{currentQ.passage}"
              </div>
            )}

            {/* Question Prompt */}
            <div className="space-y-1">
              <h2 className="text-lg sm:text-2xl font-black text-white leading-snug tracking-tight">
                {currentQ.prompt}
              </h2>
              <p className="text-xs text-slate-300">Choose the best answer below:</p>
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {currentQ.options?.map((opt, oIdx) => {
                const isSelected = answers[currentQ.questionId] === opt;
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className={`p-4 rounded-xl sm:rounded-2xl border text-left transition-all backdrop-blur-xl group cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-brand-400 bg-brand-600/50 shadow-xl shadow-brand-500/40 scale-[1.01] sm:scale-[1.02] ring-2 ring-brand-400/50'
                        : 'border-white/20 bg-slate-900/60 hover:bg-slate-900/80 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-xl bg-white/10 border border-white/15 text-xs font-black text-white flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                        {opt}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          speakText(opt, currentLang);
                        }}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Pronounce option"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-brand-300 bg-brand-400 text-slate-900 font-bold'
                            : 'border-white/30 bg-white/5 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION ACTION BAR */}
        <div className="pt-4 sm:pt-6 flex items-center justify-between gap-3 border-t border-white/10 mt-4 sm:mt-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className={`py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              currentIdx === 0
                ? 'border-white/10 text-slate-500 cursor-not-allowed opacity-50'
                : 'border-white/20 bg-slate-900/50 hover:bg-slate-900/70 text-white cursor-pointer active:scale-95'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIdx < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="py-3 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-brand-500/30 transition-all flex items-center gap-1.5 transform active:scale-98 cursor-pointer"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="py-3 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/40 transition-all flex items-center gap-1.5 transform active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{submitting ? 'Evaluating Score...' : 'Submit & Build Plan'}</span>
            </button>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-3 text-center text-[11px] text-slate-300 font-medium px-4">
        <span>© 2026 NeoRead. Multilingual AI Diagnostic Engine.</span>
      </footer>

      {/* CELEBRATORY PERSONALIZED LEARNING PLAN MODAL */}
      <PersonalizedPlanModal
        isOpen={showPlanModal}
        plan={planResult}
        onClose={() => setShowPlanModal(false)}
      />
    </div>
  );
};

export default InitialAssessment;

