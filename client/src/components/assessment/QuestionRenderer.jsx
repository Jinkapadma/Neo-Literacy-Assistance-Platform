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
        return <PenTool className="w-4 h-4 text-emerald-600" />;
      case 'comprehension':
      case 'reading':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-brand-100 text-brand-800 text-xs font-bold rounded-lg">
            Question {index + 1} of {total}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg capitalize">
            {getSkillIcon(question.skillCategory)}
            {question.skillCategory}
          </span>
        </div>

        {/* Audio Assistance */}
        <button
          onClick={handleReadAloud}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-colors"
          title="Listen to question audio narration"
        >
          <Volume2 className="w-4 h-4 text-amber-600" />
          <span>Listen Aloud</span>
        </button>
      </div>

      {/* Reading Passage if present */}
      {question.passage && (
        <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Reading Passage
          </p>
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
            "{question.passage}"
          </p>
        </div>
      )}

      {/* Main Prompt */}
      <div className="space-y-2">
        <h4 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
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
                className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl text-left border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/80 text-brand-950 shadow-md ring-2 ring-brand-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {letterLabel}
                  </span>
                  <span className="text-base sm:text-lg font-semibold">{option}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-6 h-6 text-brand-600 flex-shrink-0" />}
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
              className="w-full p-4 text-lg border-2 border-slate-300 rounded-2xl focus:border-brand-500 focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
