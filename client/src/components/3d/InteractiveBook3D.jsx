import React, { useState } from 'react';
import { Card3DTilt } from './Card3DTilt.jsx';
import {
  Volume2,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  Play,
  Languages,
} from 'lucide-react';

export const InteractiveBook3D = ({ onPlaySound, activeWord, activeLang = 'en' }) => {
  const [activeTab, setActiveTab] = useState(0);

  const samples = {
    en: [
      { letter: 'A a', word: 'Apple', sound: 'A as in Apple', meaning: 'A sweet round fruit', phonetics: '/ˈæp.əl/', icon: '🍎', color: 'from-rose-500/20 to-amber-500/20' },
      { letter: 'B b', word: 'Bird', sound: 'B as in Bird', meaning: 'A feathered flying creature', phonetics: '/bɜːrd/', icon: '🐦', color: 'from-blue-500/20 to-indigo-500/20' },
      { letter: 'S s', word: 'Sun', sound: 'S as in Sun', meaning: 'The morning light & warmth', phonetics: '/sʌn/', icon: '☀️', color: 'from-amber-500/20 to-orange-500/20' },
    ],
    hi: [
      { letter: 'अ', word: 'अनार', sound: 'अ से अनार', meaning: 'एक मीठा दानेदार फल', phonetics: 'Anaar', icon: '🍇', color: 'from-rose-500/20 to-red-500/20' },
      { letter: 'आ', word: 'आम', sound: 'आ से आम', meaning: 'फलों का राजा (मीठा फल)', phonetics: 'Aam', icon: '🥭', color: 'from-amber-500/20 to-yellow-500/20' },
      { letter: 'क', word: 'कमल', sound: 'क से कमल', meaning: 'सुंदर राष्ट्रीय पुष्प', phonetics: 'Kamal', icon: '🪷', color: 'from-pink-500/20 to-purple-500/20' },
    ],
    es: [
      { letter: 'A a', word: 'Auto', sound: 'A de Auto', meaning: 'Vehículo para transportarse', phonetics: '/ˈaw.to/', icon: '🚗', color: 'from-blue-500/20 to-cyan-500/20' },
      { letter: 'E e', word: 'Estrella', sound: 'E de Estrella', meaning: 'Brilla en el cielo nocturno', phonetics: '/esˈtɾe.ʝa/', icon: '⭐', color: 'from-amber-500/20 to-yellow-500/20' },
      { letter: 'O o', word: 'Oso', sound: 'O de Oso', meaning: 'Animal noble del bosque', phonetics: '/ˈo.so/', icon: '🐻', color: 'from-orange-500/20 to-amber-500/20' },
    ],
  };

  const currentList = samples[activeLang] || samples.en;
  const currentItem = currentList[activeTab] || currentList[0];

  const handleTrigger = (item, idx) => {
    setActiveTab(idx);
    if (onPlaySound) {
      onPlaySound(item.sound, activeLang);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto py-6">
      {/* 3D Floating Orbit Badge 1 (Top Left) */}
      <div className="absolute -top-4 -left-4 z-20 animate-bounce duration-1000 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl text-slate-800 text-xs font-bold transform -rotate-6">
        <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
        <span>Phonetics & Sound Waves</span>
      </div>

      {/* 3D Floating Orbit Badge 2 (Bottom Right) */}
      <div className="absolute -bottom-4 -right-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl text-xs font-bold transform rotate-3 border border-white/20">
        <Award className="w-4 h-4 text-amber-300" />
        <span>Assisted AI Pronunciation</span>
      </div>

      {/* Main 3D Card Display */}
      <Card3DTilt
        maxTilt={15}
        scale={1.03}
        className="rounded-3xl bg-slate-900/80 backdrop-blur-2xl border-2 border-white/20 shadow-2xl p-6 sm:p-8 text-white overflow-hidden"
      >
        {/* Glowing background ambient gradient */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${currentItem.color} blur-2xl opacity-70 transition-all duration-700 pointer-events-none`} />

        <div className="relative z-10 space-y-6">
          {/* Card Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Interactive Touch Phonics
              </span>
            </div>
            <span className="px-2.5 py-1 bg-white/10 rounded-full text-[11px] font-bold text-amber-300 border border-white/10">
              Live Sound Card
            </span>
          </div>

          {/* Central 3D Display Unit */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                {currentItem.letter}
              </span>
              <h4 className="text-2xl font-black text-white">{currentItem.word}</h4>
              <p className="text-xs font-semibold text-brand-300">{currentItem.phonetics}</p>
              <p className="text-xs text-slate-400 max-w-[200px] pt-1">{currentItem.meaning}</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-5xl shadow-2xl shadow-brand-500/50 border border-white/20 transform hover:scale-105 transition-transform">
                {currentItem.icon}
              </div>

              {/* Instant Audio Action Button */}
              <button
                type="button"
                onClick={() => handleTrigger(currentItem, activeTab)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold shadow-lg shadow-amber-500/30 transition-all transform active:scale-95"
              >
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>Hear Sound</span>
              </button>
            </div>
          </div>

          {/* Selectable Phonics Letter Tabs */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Select Letter Sound:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {currentList.map((item, idx) => {
                const isCurrent = activeTab === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTrigger(item, idx)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-white text-slate-900 border-amber-400 font-black shadow-lg ring-2 ring-amber-400/40'
                        : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20 font-bold'
                    }`}
                  >
                    <span className="text-xl block">{item.icon}</span>
                    <span className="text-xs block mt-1">{item.letter}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card3DTilt>
    </div>
  );
};
