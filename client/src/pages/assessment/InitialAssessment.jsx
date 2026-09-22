import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { assessmentApi } from '../../api/assessmentApi.js';
import { useAuth } from '../../hooks/useAuth.js';
import { SUPPORTED_LANGUAGES, PROFICIENCY_LEVELS } from '../../utils/constants.js';
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
} from 'lucide-react';
import toast from 'react-hot-toast';

// Native Web Audio Synthesizer for feedback
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

  // Determine user language and age
  const preferredLanguage =
    location.state?.preferredLanguage || user?.preferredLanguage || 'te';
  const age = location.state?.age || user?.age || 22;

  const [assessment, setAssessment] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Personalized Plan Modal State
  const [planResult, setPlanResult] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const langInfo =
    SUPPORTED_LANGUAGES.find(l => l.code === preferredLanguage) || SUPPORTED_LANGUAGES[0];
  const ageCohort = age < 12 ? 'kids' : age < 18 ? 'teens' : 'adults';

  // Load adaptive diagnostic assessment
  useEffect(() => {
    setLoading(true);
    assessmentApi
      .getInitialDiagnostic({ language: preferredLanguage, age })
      .then(res => {
        setAssessment(res.data);
        setCurrentIdx(0);
        setAnswers({});
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Failed to load initial assessment');
      })
      .finally(() => setLoading(false));
  }, [preferredLanguage, age]);

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

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to record your diagnostic score and personalized plan.');
      navigate('/login');
      return;
    }

    const formattedAnswers = questions.map(q => ({
      questionId: q.questionId,
      selectedAnswer: answers[q.questionId] || '',
    }));

    const unanswered = formattedAnswers.filter(a => !a.selectedAnswer).length;
    if (unanswered > 0) {
      const confirm = window.confirm(
        `You have ${unanswered} unanswered question(s). Would you like to submit anyway?`
      );
      if (!confirm) return;
    }

    setSubmitting(true);
    try {
      playSound('finish');
      const response = await assessmentApi.submitAssessment({
        assessmentId: assessment._id || assessment.code,
        answers: formattedAnswers,
        timeSpentSeconds: timeSpent,
      });

      const submissionData = response.data || response;
      const plan = submissionData.personalizedPlan || {
        assignedLevel: submissionData.benchmarkAssigned || 'beginner',
        overallScore: submissionData.scores?.overallScore || 70,
        ageCohort,
        language: preferredLanguage,
        startingModule: {
          title: 'Module 1: Script & Phonics Foundations',
          subtitle: 'Alphabet recognition, letter acoustic sounds, and foundational sight words',
          icon: '🔤',
          unlockedLessonsCount: 4,
        },
        recommendedDailyMinutes: 15,
        milestone14Days: 'Read sentences and illustrated short stories with confidence',
        strengths: submissionData.strengths || ['High participation'],
        prioritySkills: submissionData.areasForImprovement || ['Daily reading practice'],
      };

      setPlanResult(plan);
      setShowPlanModal(true);
      toast.success('Initial Assessment Complete! Your Personalized Plan is ready.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#407c93] flex items-center justify-center text-white">
        <div className="p-8 rounded-3xl bg-slate-900/70 border border-white/20 backdrop-blur-xl text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-200">
            Calibrating {langInfo.name} Initial Diagnostic Assessment...
          </p>
        </div>
      </div>
    );
  }

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
                <span>Question {currentIdx + 1} of {totalQuestions}</span>
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

          {/* Timer Display */}
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-200 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900/40 border border-white/20 backdrop-blur-md shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>{formatTime(timeSpent)}</span>
          </div>
        </div>
      </header>

      {/* MAIN DIAGNOSTIC QUESTION CONTAINER */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col justify-center">
        {/* Language & Age Adaptive Guide Bubble */}
        <div className="mb-4 sm:mb-5 flex items-start sm:items-center gap-3 sm:gap-3.5 bg-slate-900/60 border border-white/20 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-2xl shadow-xl">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-400 via-brand-500 to-indigo-600 flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg shadow-amber-500/20 shrink-0">
            {langInfo.flag}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300">
                Initial Literacy Diagnostic &bull; {langInfo.nativeName} ({langInfo.name})
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
              Listen carefully to the voice, answer each question, and we'll unlock your personalized curriculum!
            </p>
          </div>
        </div>

        {/* Current Question Card */}
        {currentQ && (
          <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-900/85 border border-white/20 backdrop-blur-2xl shadow-2xl space-y-5 animate-fadeIn">
            {/* Question Header & Category */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/30 text-brand-200 border border-brand-400/40 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                {currentQ.skillCategory || 'Reading'} Skill
              </span>

              <button
                type="button"
                onClick={() => speakText(currentQ.passage ? `${currentQ.passage}. ${currentQ.prompt}` : currentQ.prompt, preferredLanguage)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 hover:text-white border border-white/15 text-xs font-bold transition-all cursor-pointer shadow-sm"
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
                          speakText(opt, preferredLanguage);
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
