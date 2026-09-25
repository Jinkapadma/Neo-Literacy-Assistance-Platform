import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bhashiniApi } from '../../api/bhashiniApi.js';
import { useLanguage } from '../../hooks/useLanguage.js';
import { useProgress } from '../../context/ProgressContext.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import {
  Sparkles,
  Volume2,
  Trophy,
  Flame,
  Target,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Mic,
  Zap,
} from 'lucide-react';

export const AgentProgressModal = () => {
  const {
    isAgentModalOpen,
    closeAgentModal,
    interfaceLanguage,
    learningLanguage,
    interfaceLangMeta,
    learningLangMeta,
    speakInInterfaceLang,
  } = useLanguage();

  const { progress } = useProgress();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fetchAgentInsights = async () => {
    try {
      setLoading(true);
      const res = await bhashiniApi.getAgentProgress(
        learningLanguage,
        interfaceLanguage,
        progress
      );
      if (res?.data) {
        setAgentData(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAgentModalOpen) {
      fetchAgentInsights();
    }
  }, [isAgentModalOpen, learningLanguage, interfaceLanguage, progress]);

  const handleSpeakSpeech = () => {
    if (agentData?.voiceScript) {
      setIsSpeaking(true);
      speakInInterfaceLang(agentData.voiceScript);
      setTimeout(() => setIsSpeaking(false), 5000);
    }
  };

  const handleActionClick = path => {
    closeAgentModal();
    navigate(path);
  };

  if (!isAgentModalOpen) return null;

  return (
    <Modal
      isOpen={isAgentModalOpen}
      onClose={closeAgentModal}
      title=""
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* TOP AGENT HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-brand-800 to-purple-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              {/* Mascot Owl Avatar */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-brand-500 to-indigo-600 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-amber-500/30 animate-bounce">
                  🦉
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-amber-300 border border-white/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Bhashini AI Learning Tutor
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                    Active Agent
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {agentData?.agentTitle || 'AI Learning Progress Report'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  Personalized evaluation for{' '}
                  <strong className="text-amber-300">
                    {learningLangMeta.nativeName} ({learningLangMeta.name})
                  </strong>{' '}
                  in{' '}
                  <span className="underline decoration-indigo-300">
                    {interfaceLangMeta.nativeName} ({interfaceLangMeta.name})
                  </span>
                </p>
              </div>
            </div>

            {/* Listen Agent Voice Audio Button */}
            <div className="flex flex-col items-end gap-2 shrink-0 self-stretch sm:self-auto">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSpeakSpeech}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 w-full sm:w-auto"
              >
                <Volume2 className={`w-4 h-4 mr-1.5 ${isSpeaking ? 'animate-pulse text-rose-700' : ''}`} />
                <span>Listen AI Audio Report</span>
              </Button>
              <span className="text-[10px] text-amber-200 font-semibold self-center sm:self-end">
                Localized in {interfaceLangMeta.name}
              </span>
            </div>
          </div>
        </div>

        {/* DUAL LANGUAGE TRACK CONTEXT BAR */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Active Configuration:
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-brand-50 text-brand-700 font-black flex items-center gap-1 border border-brand-200">
              <span>🎯 Target to Learn:</span>
              <span>
                {learningLangMeta.flag} {learningLangMeta.nativeName} ({learningLangMeta.name})
              </span>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-black flex items-center gap-1 border border-indigo-200">
              <span>🌐 Interface & Voice:</span>
              <span>
                {interfaceLangMeta.flag} {interfaceLangMeta.nativeName} ({interfaceLangMeta.name})
              </span>
            </span>
          </div>

          <button
            onClick={fetchAgentInsights}
            disabled={loading}
            className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-evaluate Progress</span>
          </button>
        </div>

        {/* AGENT SPEECH NARRATIVE BUBBLE */}
        {agentData && (
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 border-2 border-amber-200/80 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="text-sm font-black text-amber-950 uppercase tracking-wider">
                  AI Agent Commentary
                </h3>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                Mastery Score: {agentData.overallMasteryScore}%
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              “{agentData.greeting} {agentData.statusOverview}”
            </p>
          </div>
        )}

        {/* SKILL MASTERY METERS & STATS GRID */}
        {agentData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: 4 Skill Mastery Meters */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                  <span>{learningLangMeta.name} Literacy Breakdown</span>
                </h4>
                <span className="text-xs font-bold text-emerald-600">
                  {agentData.overallMasteryScore}% Overall
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>🔤 Alphabet & Phonics Recognition</span>
                    <span className="font-bold text-slate-900">{agentData.skills.phonics}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${agentData.skills.phonics}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>👁️ Sight Words & Vocabulary Recall</span>
                    <span className="font-bold text-slate-900">{agentData.skills.vocabulary}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${agentData.skills.vocabulary}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>📖 Reading Fluency & Stories</span>
                    <span className="font-bold text-slate-900">{agentData.skills.readingFluency}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${agentData.skills.readingFluency}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>🎙️ Voice Pronunciation Accuracy</span>
                    <span className="font-bold text-slate-900">{agentData.skills.pronunciation}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${agentData.skills.pronunciation}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Key Strengths & Focus Areas */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Demonstrated Strengths</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {agentData.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5 mb-1.5">
                    <Target className="w-4 h-4 text-amber-600" />
                    <span>Target Growth Opportunities</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {agentData.focusAreas.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Next Step Recommendation Pill */}
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 font-medium">
                <strong>💡 Action Plan:</strong> {agentData.nextStepRecommendation}
              </div>
            </div>
          </div>
        )}

        {/* QUICK PRACTICE HUBS ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => handleActionClick('/curriculum')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{learningLangMeta.name} Lessons</p>
                <p className="text-[10px] text-slate-500">Structured Modules</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleActionClick('/games')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{learningLangMeta.name} Word Puzzles</p>
                <p className="text-[10px] text-slate-500">Scramble & Memory</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleActionClick('/voice-practice')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{learningLangMeta.name} Speech Drills</p>
                <p className="text-[10px] text-slate-500">Pronunciation Lab</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
