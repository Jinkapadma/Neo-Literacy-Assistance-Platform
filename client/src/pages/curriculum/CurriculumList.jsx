import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { curriculumApi } from '../../api/curriculumApi.js';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { ProficiencyBadge, Badge } from '../../components/common/Badge.jsx';
import { Spinner, CardSkeleton } from '../../components/common/Loader.jsx';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher.jsx';
import { SUPPORTED_LANGUAGES } from '../../utils/constants.js';
import {
  GraduationCap,
  BookOpen,
  Layers,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const CurriculumList = () => {
  const [curricula, setCurricula] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCurricula = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedLanguage) params.language = selectedLanguage;
      if (selectedLevel) params.targetLevel = selectedLevel;
      if (searchQuery) params.search = searchQuery;

      const res = await curriculumApi.getAllCurricula(params);
      setCurricula(res.data?.curricula || res.curricula || (Array.isArray(res.data) ? res.data : []));
    } catch {
      setCurricula([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurricula();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, selectedLevel]);

  const handleSearchSubmit = e => {
    e.preventDefault();
    fetchCurricula();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <GraduationCap className="w-8 h-8 text-brand-600" />
            Curriculum Framework
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Progressive literacy learning pathways organized into structured modules and lessons.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search curriculums..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Language selector */}
          <select
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
            className="p-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:outline-none"
          >
            <option value="">All Languages</option>
            {SUPPORTED_LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.nativeName}
              </option>
            ))}
          </select>

          {/* Level selector */}
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="p-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-500 focus:outline-none"
          >
            <option value="">All Levels</option>
            <option value="beginner">Level 1: Novice</option>
            <option value="elementary">Level 2: Elementary</option>
            <option value="intermediate">Level 3: Functional</option>
            <option value="advanced">Level 4: Fluent</option>
          </select>

          {(selectedLanguage || selectedLevel || searchQuery) && (
            <button
              onClick={() => {
                setSelectedLanguage('');
                setSelectedLevel('');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-rose-600 hover:underline px-2 py-1"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Curriculum Grid */}
      {loading ? (
        <CardSkeleton count={3} />
      ) : curricula.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curricula.map(curriculum => {
            const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === curriculum.language) || {
              flag: '🌐',
              nativeName: curriculum.language,
            };

            const totalLessons = curriculum.modules?.reduce(
              (acc, mod) => acc + (mod.lessons?.length || 0),
              0
            );

            return (
              <Card
                key={curriculum._id}
                className="flex flex-col justify-between border-2 border-slate-200/80 hover:border-brand-500"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-800">
                      <span>{langMeta.flag}</span>
                      <span>{langMeta.nativeName}</span>
                    </span>
                    <ProficiencyBadge level={curriculum.targetLevel} size="sm" />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                      {curriculum.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1 leading-snug">
                      {curriculum.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {curriculum.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-purple-600" />
                      <span>{curriculum.modules?.length || 0} Modules</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>{totalLessons} Guided Lessons</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Link to={`/curriculum/${curriculum._id}`} className="block">
                    <Button variant="primary" className="w-full justify-between" icon={ArrowRight} iconPosition="right">
                      View Learning Roadmap
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-4 border-dashed border-2 border-slate-300">
          <GraduationCap className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Curricula Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your filters or search query to find relevant literacy curricula.
          </p>
        </Card>
      )}
    </div>
  );
};
