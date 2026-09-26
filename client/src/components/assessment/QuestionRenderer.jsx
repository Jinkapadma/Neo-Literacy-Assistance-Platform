import React from 'react';
import { Volume2, CheckCircle2, BookOpen, PenTool, Sparkles } from 'lucide-react';
import { useAccessibility } from '../../hooks/useAccessibility.js';

export const QuestionRenderer = ({
  question,
  index,
  total,
  selectedAnswer,
  onSelectAnswer,
  language = 'en',
}) => {
  const { speakText } = useAccessibility();

  const handleReadAloud = () => {
    let fullText = question.prompt;
    if (question.passage) {
      fullText = `Passage: ${question.passage}. Question: ${question.prompt}`;
    }
    speakText(fullText, language);
  };

  const getSkillIcon = skill => {
    switch (skill) {
      case 'writing':
        return <PenTool className="w-4 h-4 text-emerald-400" />;
      case 'comprehension':
      case 'reading':
        return <BookOpen className="w-4 h-4 text-indigo-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header Info */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-brand-500/25 border border-brand-400/30 text-brand-300 text-xs font-bold rounded-lg">
            Question {index + 1} of {total}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold rounded-lg capitalize">
            {getSkillIcon(question.skillCategory)}
            {question.skillCategory}
          </span>
        </div>

        {/* Audio Assistance */}
        <button
          onClick={handleReadAloud}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 rounded-xl text-xs font-bold transition-all shadow-md backdrop-blur-md"
          title="Listen to question audio narration"
        >
          <Volume2 className="w-4 h-4 text-amber-300" />
          <span>Listen Aloud</span>
        </button>
      </div>

      {/* Reading Passage if present */}
      {question.passage && (
        <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2 backdrop-blur-md">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Reading Passage
          </p>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-medium">
            "{question.passage}"
          </p>
        </div>
      )}

      {/* Main Prompt */}
      <div className="space-y-2">
        <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
          {question.prompt}
        </h4>
      </div>

      {/* Multiple Choice Options */}
      <div className="space-y-3">
        {question.options && question.options.length > 0 ? (
          question.options.map((option, optIdx) => {
            const isSelected = selectedAnswer === option;
            const letterLabel = String.fromCharCode(65 + optIdx); // A, B, C, D

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => onSelectAnswer(option)}
                className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 backdrop-blur-xl ${
                  isSelected
                    ? 'border-brand-400 bg-brand-500/25 text-white shadow-xl ring-2 ring-brand-400/30'
                    : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isSelected
                        ? 'bg-brand-500 text-slate-950'
                        : 'bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    {letterLabel}
                  </span>
                  <span className="text-base sm:text-lg font-semibold">{option}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-6 h-6 text-brand-400 flex-shrink-0" />}
              </button>
            );
          })
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={selectedAnswer || ''}
              onChange={e => onSelectAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 text-lg bg-slate-950/60 border border-white/20 text-white rounded-2xl focus:border-brand-400 focus:outline-none backdrop-blur-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};
