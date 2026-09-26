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
    <div className="bg-slate-900/65 rounded-3xl border border-white/20 backdrop-blur-2xl p-6 sm:p-8 space-y-6 shadow-2xl text-white">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Assigned Proficiency Tier
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-2">
            <Award className="w-8 h-8 text-amber-400" />
            {currentLevelInfo.label}
          </h3>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {currentLevelInfo.description}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-white/10 border border-white/15 rounded-2xl min-w-[120px] backdrop-blur-md">
          <span className="text-3xl font-black text-amber-300">{score}%</span>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Overall Score
          </span>
        </div>
      </div>

      {/* Step Level Progress Track */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
          <span>Level 1: Novice</span>
          <span>Level 2: Elementary</span>
          <span>Level 3: Functional</span>
          <span>Level 4: Fluent</span>
        </div>
        <div className="grid grid-cols-4 gap-2 h-3.5 rounded-full bg-slate-950/60 border border-white/10 p-0.5">
          {levels.map((lvl, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div
                key={lvl}
                className={`h-full rounded-full transition-all duration-500 ${
                  isCurrent
                    ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                    : isCompleted
                    ? 'bg-emerald-400'
                    : 'bg-white/10'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Skill Dimension Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 backdrop-blur-md flex items-center gap-3.5">
          <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-300 border border-indigo-400/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-300 uppercase">Reading Accuracy</p>
            <p className="text-xl font-black text-white">{readingScore}%</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-md flex items-center gap-3.5">
          <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-300 border border-emerald-400/30">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-300 uppercase">Writing & Spelling</p>
            <p className="text-xl font-black text-white">{writingScore}%</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 backdrop-blur-md flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/20 rounded-xl text-amber-300 border border-amber-400/30">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-300 uppercase">Comprehension</p>
            <p className="text-xl font-black text-white">{comprehensionScore}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
