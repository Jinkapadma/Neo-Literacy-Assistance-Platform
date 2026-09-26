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
import { useLanguage } from '../../hooks/useLanguage.js';

export const CurriculumList = () => {
  const { learningLanguage, interfaceLanguage, learningLangMeta, interfaceLangMeta, t } = useLanguage();
  const [curricula, setCurricula] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(learningLanguage || '');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (learningLanguage && !selectedLanguage) {
      setSelectedLanguage(learningLanguage);
    }
  }, [learningLanguage]);

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
    <div className="space-y-8 pb-12 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <GraduationCap className="w-8 h-8 text-brand-400" />
            Curriculum Framework
          </h1>
          <p className="text-sm text-slate-200 mt-1">
            Progressive literacy learning pathways organized into structured modules and lessons.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/65 rounded-3xl p-4 sm:p-5 border border-white/20 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search curriculums..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-950/60 border border-white/20 text-white placeholder:text-slate-400 rounded-xl focus:border-brand-400 focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Language selector */}
          <select
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
            className="p-2 text-xs font-bold bg-slate-950/60 border border-white/20 text-white rounded-xl focus:border-brand-400 focus:outline-none"
          >
            <option value="" className="text-slate-900">All Languages</option>
            {SUPPORTED_LANGUAGES.map(l => (
              <option key={l.code} value={l.code} className="text-slate-900">
                {l.flag} {l.nativeName}
              </option>
            ))}
          </select>

          {/* Level selector */}
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="p-2 text-xs font-bold bg-slate-950/60 border border-white/20 text-white rounded-xl focus:border-brand-400 focus:outline-none"
          >
            <option value="" className="text-slate-900">All Levels</option>
            <option value="beginner" className="text-slate-900">Level 1: Novice</option>
            <option value="elementary" className="text-slate-900">Level 2: Elementary</option>
            <option value="intermediate" className="text-slate-900">Level 3: Functional</option>
            <option value="advanced" className="text-slate-900">Level 4: Fluent</option>
          </select>

          {(selectedLanguage || selectedLevel || searchQuery) && (
            <button
              onClick={() => {
                setSelectedLanguage('');
                setSelectedLevel('');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-amber-300 hover:underline px-2 py-1"
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
                className="flex flex-col justify-between border border-white/20 hover:border-brand-400 bg-slate-900/65 backdrop-blur-2xl shadow-2xl rounded-3xl text-white transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/15 rounded-full text-xs font-bold text-slate-200">
                      <span>{langMeta.flag}</span>
                      <span>{langMeta.nativeName}</span>
                    </span>
                    <ProficiencyBadge level={curriculum.targetLevel} size="sm" />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      {curriculum.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1 leading-snug">
                      {curriculum.title}
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed font-normal">
                      {curriculum.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs font-semibold text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>{curriculum.modules?.length || 0} Modules</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span>{totalLessons} Guided Lessons</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-white/10">
                  <Link to={`/curriculum/${curriculum._id}`} className="block">
                    <Button variant="primary" className="w-full justify-between font-bold" icon={ArrowRight} iconPosition="right">
                      View Learning Roadmap
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-4 border-dashed border-2 border-white/20 bg-slate-900/65 backdrop-blur-2xl rounded-3xl text-white">
          <GraduationCap className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Curricula Found</h3>
          <p className="text-sm text-slate-300 max-w-sm mx-auto">
            Try adjusting your filters or search query to find relevant literacy curricula.
          </p>
        </Card>
      )}
    </div>
  );
};
