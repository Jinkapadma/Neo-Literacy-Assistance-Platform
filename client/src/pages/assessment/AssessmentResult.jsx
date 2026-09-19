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
    return <Spinner size="lg" message="Compiling proficiency benchmarks..." className="min-h-[50vh]" />;
  }

  if (error || !submission) {
    return (
      <Card className="p-8 text-center space-y-4 max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-rose-600">Results Not Available</h3>
        <p className="text-sm text-slate-600">{error || 'Submission not found'}</p>
        <Link to="/assessment">
          <Button variant="outline">Back to Assessments</Button>
        </Link>
      </Card>
    );
  }

  const { scores, benchmarkAssigned, feedback, strengths, areasForImprovement, answers, assessmentId } =
    submission;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
          <Award className="w-9 h-9" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Assessment Evaluation Complete
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          Your Literacy Proficiency Scorecard
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
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
        <Card className="p-6 sm:p-8 border-2 border-emerald-200 bg-emerald-50/30 space-y-3">
          <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Demonstrated Strengths
          </h3>
          <ul className="space-y-2">
            {strengths?.map((str, idx) => (
              <li key={idx} className="text-sm font-medium text-emerald-900 flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Growth Focus Areas */}
        <Card className="p-6 sm:p-8 border-2 border-indigo-200 bg-indigo-50/30 space-y-3">
          <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Recommended Focus Areas
          </h3>
          <ul className="space-y-2">
            {areasForImprovement?.map((area, idx) => (
              <li key={idx} className="text-sm font-medium text-indigo-900 flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Feedback Note */}
      {feedback && (
        <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
          <span className="font-bold text-slate-900">Summary Diagnostic: </span>
          {feedback}
        </div>
      )}

      {/* Detailed Question Review */}
      {answers?.length > 0 && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Question Item Review</h3>
          <div className="divide-y divide-slate-100">
            {answers.map((ans, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {ans.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                    <p className="text-sm font-semibold text-slate-800">
                      Your Answer: <span className={ans.isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>{ans.selectedAnswer}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg capitalize">
                    {ans.skillCategory}
                  </span>
                  <span className="text-xs font-black text-slate-900">
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
          <Button variant="outline" size="lg" className="w-full sm:w-auto" icon={User}>
            View Learner Profile
          </Button>
        </Link>
        <Link to="/assessment" className="w-full sm:w-auto">
          <Button variant="ghost" size="lg" className="w-full sm:w-auto" icon={RotateCcw}>
            Retake Assessment
          </Button>
        </Link>
      </div>
    </div>
  );
};
