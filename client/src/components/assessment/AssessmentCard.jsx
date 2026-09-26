import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card.jsx';
import { Button } from '../common/Button.jsx';
import { ProficiencyBadge } from '../common/Badge.jsx';
import { Clock, HelpCircle, Award, ArrowRight, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../utils/constants.js';

export const AssessmentCard = ({ assessment }) => {
  const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === assessment.language) || {
    flag: '🌐',
    nativeName: assessment.language,
  };

  return (
    <Card className="flex flex-col justify-between h-full bg-slate-900/65 border border-white/20 backdrop-blur-2xl shadow-2xl hover:border-brand-400 hover:shadow-brand-500/10 rounded-3xl text-white transition-all">
      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-bold text-slate-200 backdrop-blur-md">
            <span>{langMeta.flag}</span>
            <span>{langMeta.nativeName}</span>
          </span>
          <ProficiencyBadge level={assessment.targetLevel} size="sm" />
        </div>

        {/* Title and description */}
        <div>
          <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug">
            {assessment.title}
          </h3>
          <p className="text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
            {assessment.description || 'Test your literacy skills with targeted reading, spelling, and comprehension questions.'}
          </p>
        </div>

        {/* Metadata stats */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{assessment.timeLimitMinutes || 15} Mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-brand-300" />
            <span>{assessment.questions?.length || 0} Questions</span>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-4 border-t border-white/10">
        <Link to={`/assessment/${assessment._id}`} className="block">
          <Button variant="primary" className="w-full justify-between" icon={ArrowRight} iconPosition="right">
            Start Assessment
          </Button>
        </Link>
      </div>
    </Card>
  );
};
