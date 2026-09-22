import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { assessmentApi } from '../../api/assessmentApi.js';
import { useAuth } from '../../hooks/useAuth.js';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { AssessmentCard } from '../../components/assessment/AssessmentCard.jsx';
import { QuestionRenderer } from '../../components/assessment/QuestionRenderer.jsx';
import { Spinner, CardSkeleton } from '../../components/common/Loader.jsx';
import { SUPPORTED_LANGUAGES } from '../../utils/constants.js';
import {
  Award,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AssessmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Mode A: Assessment Runner
  const [assessment, setAssessment] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qId]: answer }
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mode B: Assessment List
  const [assessmentsList, setAssessmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Fetch single assessment if ID present
  useEffect(() => {
    if (id) {
      setLoading(true);
      assessmentApi
        .getAssessmentById(id)
        .then(res => {
          setAssessment(res.data);
          setCurrentQuestionIdx(0);
          setAnswers({});
          setTimeSpentSeconds(0);
        })
        .catch(err => {
          toast.error(err.response?.data?.message || 'Failed to load assessment');
        })
        .finally(() => setLoading(false));
    } else {
      // Fetch assessment list
      setLoading(true);
      const params = {};
      if (selectedLanguage) params.language = selectedLanguage;
      if (selectedType) params.type = selectedType;

      assessmentApi
        .getAllAssessments(params)
        .then(res => setAssessmentsList(res.data?.assessments || res.assessments || (Array.isArray(res.data) ? res.data : [])))
        .catch(() => setAssessmentsList([]))
        .finally(() => setLoading(false));
    }
  }, [id, selectedLanguage, selectedType]);

  // Timer for active test taking
  useEffect(() => {
    if (!id || !assessment) return;
    const timer = setInterval(() => {
      setTimeSpentSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [id, assessment]);

  const handleSelectAnswer = answer => {
    if (!assessment) return;
    const currentQ = assessment.questions[currentQuestionIdx];
    setAnswers(prev => ({
      ...prev,
      [currentQ.questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < (assessment?.questions?.length || 0) - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to submit your assessment and record your benchmark.');
      navigate('/login');
      return;
    }

    const payloadAnswers = assessment.questions.map(q => ({
      questionId: q.questionId,
      selectedAnswer: answers[q.questionId] || '',
    }));

    const unansweredCount = payloadAnswers.filter(a => !a.selectedAnswer).length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    try {
      const res = await assessmentApi.submitAssessment({
        assessmentId: assessment._id,
        answers: payloadAnswers,
        timeSpentSeconds,
      });

      toast.success('Assessment evaluated successfully!');
      navigate(`/assessment/result/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format timer
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------
  // RENDER TEST RUNNER
  // ----------------------------------------------------
  if (id) {
    if (loading) {
      return <Spinner size="lg" message="Loading assessment questions..." className="min-h-[50vh]" />;
    }

    if (!assessment) {
      return (
        <Card className="p-8 text-center space-y-4 max-w-lg mx-auto">
          <h3 className="text-xl font-bold text-rose-600">Assessment Not Found</h3>
          <Link to="/assessment">
            <Button variant="outline" icon={ArrowLeft}>
              Back to Assessments
            </Button>
          </Link>
        </Card>
      );
    }

    const totalQuestions = assessment.questions?.length || 0;
    const currentQuestion = assessment.questions?.[currentQuestionIdx];
    const isLastQuestion = currentQuestionIdx === totalQuestions - 1;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        {/* Runner Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200">
          <Link
            to="/assessment"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Test
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Time: {formatTime(timeSpentSeconds)}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 border border-brand-200 rounded-xl text-xs font-bold text-brand-700">
              <CheckCircle className="w-4 h-4" />
              <span>
                Answered {answeredCount}/{totalQuestions}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-brand-600 h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="p-6 sm:p-10 border-2 border-slate-200/90 shadow-md">
            <QuestionRenderer
              question={currentQuestion}
              index={currentQuestionIdx}
              total={totalQuestions}
              selectedAnswer={answers[currentQuestion.questionId]}
              onSelectAnswer={handleSelectAnswer}
              language={assessment.language}
            />

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentQuestionIdx === 0}
                icon={ArrowLeft}
              >
                Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  variant="primary"
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  icon={CheckCircle}
                  iconPosition="right"
                >
                  Submit Assessment
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Next Question
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER ASSESSMENT LIST
  // ----------------------------------------------------
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Award className="w-8 h-8 text-amber-600" />
            Literacy Assessments & Benchmarks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Test reading, writing mechanics, and context comprehension to benchmark your literacy tier.
          </p>
        </div>
      </div>

      {/* Featured Adaptive Initial Diagnostic Launcher */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-700 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Diagnostic Engine</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Take Your Personalized Literacy Benchmark
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
            Adaptive test dynamically calibrated for your language and age cohort to generate a personalized learning roadmap.
          </p>
        </div>

        <Link to="/initial-assessment" className="shrink-0 w-full sm:w-auto">
          <Button variant="primary" size="lg" className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-400/30" icon={ArrowRight} iconPosition="right">
            Start Diagnostic Test
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
            className="p-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
          >
            <option value="">All Languages</option>
            {SUPPORTED_LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.nativeName}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="p-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none"
          >
            <option value="">All Assessment Types</option>
            <option value="benchmark">Diagnostic Benchmark</option>
            <option value="reading">Reading Comprehension</option>
            <option value="writing">Writing & Spelling</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <CardSkeleton count={3} />
      ) : assessmentsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessmentsList.map(assess => (
            <AssessmentCard key={assess._id} assessment={assess} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-4 border-dashed border-2 border-slate-300">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Assessments Available</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try choosing a different language or filter option.
          </p>
        </Card>
      )}
    </div>
  );
};
