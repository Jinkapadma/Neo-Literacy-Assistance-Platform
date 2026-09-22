import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { curriculumApi } from '../../api/curriculumApi.js';
import { useProgress } from '../../context/ProgressContext.jsx';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { ProficiencyBadge, Badge } from '../../components/common/Badge.jsx';
import { Spinner } from '../../components/common/Loader.jsx';
import { SUPPORTED_LANGUAGES } from '../../utils/constants.js';
import {
  GraduationCap,
  ArrowLeft,
  BookOpen,
  Clock,
  Layers,
  Award,
  CheckCircle,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CurriculumDetail = () => {
  const { id } = useParams();
  const { progress, completeLesson } = useProgress();
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    curriculumApi
      .getCurriculumById(id)
      .then(res => setCurriculum(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load curriculum'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Spinner size="lg" message="Loading curriculum roadmap..." className="min-h-[50vh]" />;
  }

  if (error || !curriculum) {
    return (
      <Card className="p-8 text-center space-y-4 max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-rose-600">Error Loading Curriculum</h3>
        <p className="text-sm text-slate-600">{error || 'Curriculum not found'}</p>
        <Link to="/curriculum">
          <Button variant="outline" icon={ArrowLeft}>
            Back to Curriculums
          </Button>
        </Link>
      </Card>
    );
  }

  const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === curriculum.language) || {
    flag: '🌐',
    nativeName: curriculum.language,
  };

  // Calculate dynamic completion counts
  const allLessons = curriculum.modules?.flatMap(m => m.lessons || []) || [];
  const totalLessons = allLessons.length;
  const completedLessonsInCurriculum = allLessons.filter(l =>
    progress.completedLessons.includes(l.lessonId || l.title)
  ).length;

  const curriculumPercent =
    totalLessons > 0 ? Math.round((completedLessonsInCurriculum / totalLessons) * 100) : 0;

  const handleCompleteToggle = (lessonId, moduleId, lessonTitle) => {
    const lId = lessonId || lessonTitle;
    if (progress.completedLessons.includes(lId)) {
      toast('Lesson already mastered!', { icon: '✨' });
    } else {
      completeLesson(lId, moduleId);
      toast.success(`🎉 Completed: "${lessonTitle}"! +20 XP earned`);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Back Link */}
      <Link
        to="/curriculum"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Curriculums
      </Link>

      {/* Curriculum Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-card space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>{langMeta.flag}</span>
              <span>{langMeta.nativeName}</span>
            </span>
            <span className="text-xs font-bold px-3 py-1 bg-brand-50 text-brand-700 rounded-full border border-brand-200">
              Code: {curriculum.code}
            </span>
          </div>
          <ProficiencyBadge level={curriculum.targetLevel} size="md" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
            {curriculum.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {curriculum.description}
          </p>
        </div>

        {/* Dynamic Progress Indicator (Starts at 0% baseline) */}
        <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-brand-900">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-brand-600" />
              <span>Curriculum Completion</span>
            </span>
            <span>
              {completedLessonsInCurriculum} of {totalLessons} Lessons Done ({curriculumPercent}%)
            </span>
          </div>
          <div className="w-full bg-brand-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-600 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${curriculumPercent}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 text-sm font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600" />
            <span>{curriculum.modules?.length || 0} Comprehensive Modules</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Structured Literacy Milestone Track</span>
          </div>
        </div>
      </div>

      {/* Modules & Lessons Roadmap */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-6 h-6 text-brand-600" />
          Module Roadmap & Lesson Progression
        </h2>

        <div className="space-y-6">
          {curriculum.modules?.map((mod, modIdx) => (
            <div
              key={mod.moduleId || modIdx}
              className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm"
            >
              {/* Module Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                      {modIdx + 1}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">{mod.title}</h3>
                  </div>
                  {mod.description && (
                    <p className="text-sm text-slate-500 pl-9">{mod.description}</p>
                  )}
                </div>

                {mod.badgeReward && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold self-start sm:self-auto">
                    <Award className="w-4 h-4 text-amber-600" />
                    Badge: {mod.badgeReward}
                  </span>
                )}
              </div>

              {/* Lessons list */}
              <div className="space-y-3">
                {mod.lessons?.map((lesson, lesIdx) => {
                  const lessonKey = lesson.lessonId || lesson.title;
                  const isDone = progress.completedLessons.includes(lessonKey);

                  return (
                    <div
                      key={lessonKey || lesIdx}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isDone
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-slate-50 hover:bg-brand-50/40 border-slate-200/80'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-400">
                            Lesson {lesIdx + 1}
                          </span>
                          <h4
                            className={`text-base font-bold ${
                              isDone ? 'text-emerald-900' : 'text-slate-900'
                            }`}
                          >
                            {lesson.title}
                          </h4>
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md uppercase">
                            {lesson.type.replace('_', ' ')}
                          </span>
                          {isDone && (
                            <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Completed (+20 XP)
                            </span>
                          )}
                        </div>

                        {lesson.description && (
                          <p className="text-xs text-slate-600">{lesson.description}</p>
                        )}

                        {/* Objectives */}
                        {lesson.objectives?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {lesson.objectives.map((obj, oIdx) => (
                              <span
                                key={oIdx}
                                className="text-[11px] font-medium text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/60 flex items-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                {obj}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center flex-wrap">
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {lesson.estimatedMinutes}m
                        </span>

                        <Button
                          size="sm"
                          variant={isDone ? 'secondary' : 'outline'}
                          onClick={() =>
                            handleCompleteToggle(lesson.lessonId, mod.moduleId, lesson.title)
                          }
                          icon={isDone ? CheckCircle2 : Sparkles}
                        >
                          {isDone ? 'Completed' : 'Mark Done'}
                        </Button>

                        {lesson.contentRef ? (
                          <Link
                            to={`/content?id=${lesson.contentRef._id || lesson.contentRef}`}
                            onClick={() =>
                              handleCompleteToggle(lesson.lessonId, mod.moduleId, lesson.title)
                            }
                          >
                            <Button size="sm" variant="primary" icon={PlayCircle}>
                              Open Content
                            </Button>
                          </Link>
                        ) : (
                          <Link
                            to="/content"
                            onClick={() =>
                              handleCompleteToggle(lesson.lessonId, mod.moduleId, lesson.title)
                            }
                          >
                            <Button size="sm" variant="outline" icon={BookOpen}>
                              Explore Material
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
