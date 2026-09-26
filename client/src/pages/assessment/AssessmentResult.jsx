import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assessmentApi } from '../../api/assessmentApi.js';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { ProficiencyBadge } from '../../components/common/Badge.jsx';
import { BenchmarkMeter } from '../../components/assessment/BenchmarkMeter.jsx';
import { Spinner } from '../../components/common/Loader.jsx';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  GraduationCap,
  RotateCcw,
  Sparkles,
  TrendingUp,
  User,
} from 'lucide-react';

export const AssessmentResult = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    assessmentApi
      .getSubmissionById(submissionId)
      .then(res => setSubmission(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load assessment results'))
      .finally(() => setLoading(false));
  }, [submissionId]);

  if (loading) {
    return <Spinner size="lg" message="Compiling proficiency benchmarks..." className="min-h-[50vh] text-white" />;
  }

  if (error || !submission) {
    return (
      <Card className="p-8 text-center space-y-4 max-w-lg mx-auto bg-slate-900/65 border-white/20 backdrop-blur-2xl rounded-3xl text-white shadow-2xl">
        <h3 className="text-xl font-bold text-rose-400">Results Not Available</h3>
        <p className="text-sm text-slate-300">{error || 'Submission not found'}</p>
        <Link to="/assessment">
          <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">Back to Assessments</Button>
        </Link>
      </Card>
    );
  }

  const { scores, benchmarkAssigned, feedback, strengths, areasForImprovement, answers, assessmentId } =
    submission;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 text-white">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto shadow-xl backdrop-blur-md">
          <Award className="w-9 h-9" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Assessment Evaluation Complete
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Your Literacy Proficiency Scorecard
        </h1>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          {assessmentId?.title || 'Comprehensive Diagnostic Benchmark'}
        </p>
      </div>

      {/* Benchmark Gauge Meter */}
      <BenchmarkMeter
        score={scores?.overallScore || 0}
        level={benchmarkAssigned}
        readingScore={scores?.readingScore || 0}
        writingScore={scores?.writingScore || 0}
        comprehensionScore={scores?.comprehensionScore || 0}
      />

      {/* Pedagogical Feedback & Diagnostic Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="p-6 sm:p-8 border border-emerald-500/30 bg-emerald-950/40 backdrop-blur-2xl rounded-3xl space-y-3 text-white shadow-xl">
          <h3 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Demonstrated Strengths
          </h3>
          <ul className="space-y-2">
            {strengths?.map((str, idx) => (
              <li key={idx} className="text-sm font-medium text-emerald-200 flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Growth Focus Areas */}
        <Card className="p-6 sm:p-8 border border-indigo-500/30 bg-indigo-950/40 backdrop-blur-2xl rounded-3xl space-y-3 text-white shadow-xl">
          <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Recommended Focus Areas
          </h3>
          <ul className="space-y-2">
            {areasForImprovement?.map((area, idx) => (
              <li key={idx} className="text-sm font-medium text-indigo-200 flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Feedback Note */}
      {feedback && (
        <div className="p-6 rounded-3xl bg-slate-900/65 border border-white/20 backdrop-blur-2xl text-slate-200 text-sm sm:text-base leading-relaxed font-medium shadow-2xl">
          <span className="font-bold text-white">Summary Diagnostic: </span>
          {feedback}
        </div>
      )}

      {/* Detailed Question Review */}
      {answers?.length > 0 && (
        <section className="bg-slate-900/65 rounded-3xl border border-white/20 backdrop-blur-2xl p-6 sm:p-8 space-y-4 shadow-2xl">
          <h3 className="text-lg font-bold text-white">Question Item Review</h3>
          <div className="divide-y divide-white/10">
            {answers.map((ans, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {ans.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                    <p className="text-sm font-semibold text-slate-200">
                      Your Answer: <span className={ans.isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>{ans.selectedAnswer}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2.5 py-1 bg-white/10 text-slate-200 rounded-lg capitalize border border-white/10">
                    {ans.skillCategory}
                  </span>
                  <span className="text-xs font-black text-amber-300">
                    +{ans.pointsEarned} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link to="/curriculum" className="w-full sm:w-auto">
          <Button variant="primary" size="lg" className="w-full sm:w-auto" icon={GraduationCap}>
            Start Recommended Curriculum
          </Button>
        </Link>
        <Link to="/profile" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20" icon={User}>
            View Learner Profile
          </Button>
        </Link>
        <Link to="/assessment" className="w-full sm:w-auto">
          <Button variant="ghost" size="lg" className="w-full sm:w-auto text-slate-300 hover:text-white" icon={RotateCcw}>
            Retake Assessment
          </Button>
        </Link>
      </div>
    </div>
  );
};
