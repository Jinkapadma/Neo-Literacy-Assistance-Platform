import React from 'react';
import { PROFICIENCY_LEVELS } from '../../utils/constants.js';
import { Award, BookOpen, PenTool, Brain } from 'lucide-react';

export const BenchmarkMeter = ({
  score = 0,
  level = 'beginner',
  readingScore = 0,
  writingScore = 0,
  comprehensionScore = 0,
}) => {
  const currentLevelInfo = PROFICIENCY_LEVELS[level] || PROFICIENCY_LEVELS.beginner;

  const levels = ['beginner', 'elementary', 'intermediate', 'advanced'];
  const currentIdx = levels.indexOf(level);

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Assigned Proficiency Tier
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Award className="w-8 h-8 text-brand-600" />
            {currentLevelInfo.label}
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            {currentLevelInfo.description}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-brand-50 border border-brand-100 rounded-2xl min-w-[120px]">
          <span className="text-3xl font-black text-brand-700">{score}%</span>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Overall Score
          </span>
        </div>
      </div>

      {/* Step Level Progress Track */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Level 1: Novice</span>
          <span>Level 2: Elementary</span>
          <span>Level 3: Functional</span>
          <span>Level 4: Fluent</span>
        </div>
        <div className="grid grid-cols-4 gap-2 h-3.5 rounded-full bg-slate-100 p-0.5">
          {levels.map((lvl, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div
                key={lvl}
                className={`h-full rounded-full transition-all duration-500 ${
                  isCurrent
                    ? 'bg-brand-600 shadow-sm shadow-brand-500/50'
                    : isCompleted
                    ? 'bg-brand-400'
                    : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Skill Dimension Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3.5">
          <div className="p-3 bg-white rounded-xl shadow-xs text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Reading Accuracy</p>
            <p className="text-xl font-black text-indigo-950">{readingScore}%</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3.5">
          <div className="p-3 bg-white rounded-xl shadow-xs text-emerald-600">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Writing & Spelling</p>
            <p className="text-xl font-black text-emerald-950">{writingScore}%</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center gap-3.5">
          <div className="p-3 bg-white rounded-xl shadow-xs text-amber-600">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Comprehension</p>
            <p className="text-xl font-black text-amber-950">{comprehensionScore}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
