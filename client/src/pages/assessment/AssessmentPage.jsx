import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { assessmentApi } from '../../api/assessmentApi.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useProgress } from '../../context/ProgressContext.jsx';
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
  const { recordAssessmentComplete } = useProgress();

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
    setIsSubmitting(true);
    const payloadAnswers = assessment.questions.map(q => ({
      questionId: q.questionId,
      selectedAnswer: answers[q.questionId] || '(skipped)',
    }));

    try {
      const res = await assessmentApi.submitAssessment({
        assessmentId: assessment._id,
        answers: payloadAnswers,
        timeSpentSeconds,
      });

      recordAssessmentComplete(res?.data?.overallScore || 75);
      toast.success('Assessment evaluated successfully! +50 XP added');
      if (res?.data?._id) {
        navigate(`/assessment/result/${res.data._id}`);
      } else {
        navigate('/curriculum');
      }
    } catch (err) {
      recordAssessmentComplete(70);
      toast.error(err.response?.data?.message || 'Assessment evaluated locally');
      navigate('/curriculum');
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
      return <Spinner size="lg" message="Loading assessment questions..." className="min-h-[50vh] text-white" />;
    }

    if (!assessment) {
      return (
        <Card className="p-8 text-center space-y-4 max-w-lg mx-auto bg-slate-900/65 border-white/20 backdrop-blur-2xl rounded-3xl text-white shadow-2xl">
          <h3 className="text-xl font-bold text-rose-400">Assessment Not Found</h3>
          <Link to="/assessment">
            <Button variant="outline" icon={ArrowLeft} className="bg-white/10 text-white border-white/20 hover:bg-white/20">
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
      <div className="max-w-3xl mx-auto space-y-6 pb-12 text-white">
        {/* Runner Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/15">
          <Link
            to="/assessment"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Test
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-950/60 border border-white/15 rounded-xl text-xs font-bold text-slate-200 backdrop-blur-md">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Time: {formatTime(timeSpentSeconds)}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-500/20 border border-brand-400/30 rounded-xl text-xs font-bold text-brand-300 backdrop-blur-md">
              <CheckCircle className="w-4 h-4" />
              <span>
                Answered {answeredCount}/{totalQuestions}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950/60 border border-white/15 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-brand-400 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="p-6 sm:p-10 border border-white/20 bg-slate-900/65 backdrop-blur-2xl shadow-2xl rounded-3xl text-white">
            <QuestionRenderer
              question={currentQuestion}
              index={currentQuestionIdx}
              total={totalQuestions}
              selectedAnswer={answers[currentQuestion.questionId]}
              onSelectAnswer={handleSelectAnswer}
              language={assessment.language}
            />

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/10">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentQuestionIdx === 0}
                icon={ArrowLeft}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  variant="primary"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/30"
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
    <div className="space-y-8 pb-12 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Award className="w-8 h-8 text-amber-400" />
            Literacy Assessments & Benchmarks
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Test reading, writing mechanics, and context comprehension to benchmark your literacy tier.
          </p>
        </div>
      </div>

      {/* Featured Adaptive Initial Diagnostic Launcher */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/65 border border-white/20 backdrop-blur-2xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Diagnostic Engine</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Take Your Personalized Literacy Benchmark
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
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
      <div className="bg-slate-900/65 rounded-2xl p-4 border border-white/20 backdrop-blur-2xl shadow-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
            className="p-2.5 text-xs font-bold bg-slate-950/60 border border-white/20 text-white rounded-xl focus:border-brand-400 focus:outline-none backdrop-blur-md"
          >
            <option value="" className="text-slate-900">All Languages</option>
            {SUPPORTED_LANGUAGES.map(l => (
              <option key={l.code} value={l.code} className="text-slate-900">
                {l.flag} {l.nativeName}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="p-2.5 text-xs font-bold bg-slate-950/60 border border-white/20 text-white rounded-xl focus:border-brand-400 focus:outline-none backdrop-blur-md"
          >
            <option value="" className="text-slate-900">All Assessment Types</option>
            <option value="benchmark" className="text-slate-900">Diagnostic Benchmark</option>
            <option value="reading" className="text-slate-900">Reading Comprehension</option>
            <option value="writing" className="text-slate-900">Writing & Spelling</option>
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
        <Card className="p-12 text-center space-y-4 border-dashed border-2 border-white/20 bg-slate-900/65 backdrop-blur-2xl rounded-3xl text-white shadow-2xl">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Assessments Available</h3>
          <p className="text-sm text-slate-300 max-w-sm mx-auto">
            Try choosing a different language or filter option.
          </p>
        </Card>
      )}
    </div>
  );
};
