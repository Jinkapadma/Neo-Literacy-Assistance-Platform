import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useLanguage } from '../../hooks/useLanguage.js';
import { assessmentApi } from '../../api/assessmentApi.js';
import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { ProficiencyBadge, Badge } from '../../components/common/Badge.jsx';
import { BenchmarkMeter } from '../../components/assessment/BenchmarkMeter.jsx';
import { Spinner } from '../../components/common/Loader.jsx';
import { SUPPORTED_LANGUAGES, TARGET_SKILLS_OPTIONS } from '../../utils/constants.js';
import {
  User,
  Award,
  Globe,
  CheckCircle2,
  Edit3,
  Calendar,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LearnerProfile = () => {
  const { user, updateProfile } = useAuth();
  const {
    interfaceLanguage,
    setInterfaceLanguage,
    learningLanguage,
    setLearningLanguage,
    learningLangMeta,
    interfaceLangMeta,
    t,
  } = useLanguage();

  const [benchmarkData, setBenchmarkData] = useState(null);
  const [loadingBenchmark, setLoadingBenchmark] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    learningLanguage: learningLanguage || 'te',
    interfaceLanguage: interfaceLanguage || 'en',
    targetSkills: user?.targetSkills || [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        learningLanguage: user.learningLanguage || learningLanguage || 'te',
        interfaceLanguage: user.interfaceLanguage || interfaceLanguage || 'en',
        targetSkills: user.targetSkills || [],
      });
    }
  }, [user, learningLanguage, interfaceLanguage]);

  useEffect(() => {
    if (user?._id) {
      assessmentApi
        .getUserBenchmark(user._id)
        .then(res => {
          setBenchmarkData(res.data);
        })
        .catch(() => {
          // No benchmark yet
        })
        .finally(() => {
          setLoadingBenchmark(false);
        });
    }
  }, [user?._id]);

  const handleSkillToggle = skillId => {
    const current = [...formData.targetSkills];
    const idx = current.indexOf(skillId);
    if (idx > -1) {
      if (current.length > 1) current.splice(idx, 1);
    } else {
      current.push(skillId);
    }
    setFormData({ ...formData, targetSkills: current });
  };

  const handleSaveProfile = async e => {
    e.preventDefault();
    await updateProfile({
      name: formData.name,
      learningLanguage: formData.learningLanguage,
      preferredLanguage: formData.learningLanguage,
      interfaceLanguage: formData.interfaceLanguage,
      targetSkills: formData.targetSkills,
    });
    setLearningLanguage(formData.learningLanguage);
    setInterfaceLanguage(formData.interfaceLanguage);
    setIsEditing(false);
  };

  const latestBenchmark = benchmarkData?.latestBenchmark;

  return (
    <div className="space-y-8 pb-12 text-white">
      {/* Profile Header Banner */}
      <div className="bg-slate-900/65 rounded-3xl border border-white/20 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white">
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=neo'}
            alt={user?.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-brand-500/20 border-2 border-brand-400/40 shadow-xl"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{user?.name}</h1>
              <Badge variant="primary" size="sm" className="capitalize bg-brand-500/20 text-brand-300 border-brand-400/30">
                {user?.role}
              </Badge>
            </div>
            <p className="text-sm text-slate-300 font-medium">{user?.email}</p>

            <div className="flex items-center gap-2.5 pt-1 flex-wrap">
              <ProficiencyBadge level={user?.proficiencyLevel} size="md" />

              {/* Target Learning Language Badge */}
              <span className="text-xs font-bold px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full flex items-center gap-1 border border-brand-400/30 shadow-xs backdrop-blur-md">
                <Target className="w-3.5 h-3.5 text-brand-300" />
                <span>Learning: {learningLangMeta.flag} {learningLangMeta.nativeName} ({learningLangMeta.name})</span>
              </span>

              {/* Interface Language Badge */}
              <span className="text-xs font-bold px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full flex items-center gap-1 border border-indigo-400/30 shadow-xs backdrop-blur-md">
                <Globe className="w-3.5 h-3.5 text-indigo-300" />
                <span>UI: {interfaceLangMeta.nativeName}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            icon={Edit3}
            className="flex-1 md:flex-initial bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
          <Link to="/assessment" className="flex-1 md:flex-initial">
            <Button variant="primary" icon={Award}>
              Take Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Editing Modal / Inline Box */}
      {isEditing && (
        <Card className="p-6 sm:p-8 border border-white/20 bg-slate-900/80 backdrop-blur-2xl rounded-3xl text-white shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4">Edit Profile & Language Preferences</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-slate-950/60 border border-white/20 text-white rounded-xl focus:border-brand-400 focus:outline-none backdrop-blur-md"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Target Language to Learn */}
              <div>
                <label className="block text-sm font-bold text-brand-300 mb-1 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-brand-300" />
                  Language You Are Learning (Target)
                </label>
                <select
                  value={formData.learningLanguage}
                  onChange={e => setFormData({ ...formData, learningLanguage: e.target.value })}
                  className="w-full p-2.5 bg-slate-950/60 border border-white/20 text-white rounded-xl focus:border-brand-400 focus:outline-none text-sm font-semibold backdrop-blur-md"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code} className="text-slate-900">
                      {lang.flag} {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  All curriculums, word puzzles, voice drills, and stories will focus on this language.
                </p>
              </div>

              {/* Website Interface Language */}
              <div>
                <label className="block text-sm font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-indigo-300" />
                  Website Interface Language (Bhashini AI)
                </label>
                <select
                  value={formData.interfaceLanguage}
                  onChange={e => setFormData({ ...formData, interfaceLanguage: e.target.value })}
                  className="w-full p-2.5 bg-slate-950/60 border border-white/20 text-white rounded-xl focus:border-indigo-400 focus:outline-none text-sm font-semibold backdrop-blur-md"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code} className="text-slate-900">
                      {lang.flag} {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Menus, explanations, and audio instructions will be translated into this language.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Target Literacy Goals
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TARGET_SKILLS_OPTIONS.map(skill => {
                  const isChecked = formData.targetSkills.includes(skill.id);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => handleSkillToggle(skill.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-colors flex items-center justify-between cursor-pointer backdrop-blur-md ${
                        isChecked
                          ? 'border-brand-400 bg-brand-500/25 text-brand-200'
                          : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <span>{skill.label}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-300 hover:text-white">
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Benchmark Meter & Proficiency Analysis */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-300" />
              Literacy Proficiency Benchmark ({learningLangMeta.name})
            </h2>
            <p className="text-xs text-slate-300">
              Evaluated based on reading comprehension, phonetic accuracy, and writing mechanics in {learningLangMeta.nativeName}.
            </p>
          </div>
        </div>

        {loadingBenchmark ? (
          <Spinner message="Loading benchmark records..." />
        ) : latestBenchmark ? (
          <BenchmarkMeter
            score={latestBenchmark.overallScore}
            level={latestBenchmark.benchmarkLevel}
            readingScore={latestBenchmark.readingScore || 0}
            writingScore={latestBenchmark.writingScore || 0}
            comprehensionScore={latestBenchmark.comprehensionScore || 0}
          />
        ) : (
          <Card className="p-8 text-center space-y-4 border-dashed border-2 border-white/20 bg-slate-900/65 backdrop-blur-2xl rounded-3xl text-white shadow-2xl">
            <Award className="w-12 h-12 text-slate-400 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-white">No Assessment Completed Yet</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto mt-1">
                Take your first 15-minute diagnostic literacy assessment to discover your reading baseline and unlock tailored modules in {learningLangMeta.name}.
              </p>
            </div>
            <Link to="/initial-assessment">
              <Button variant="primary" icon={ArrowRight} iconPosition="right">
                Start Diagnostic Assessment
              </Button>
            </Link>
          </Card>
        )}
      </section>

      {/* Target Literacy Goals */}
      <section className="bg-slate-900/65 rounded-3xl p-6 sm:p-8 border border-white/20 backdrop-blur-2xl shadow-2xl space-y-4 text-white">
        <h3 className="text-lg font-bold text-white">Active Literacy Focus Skills</h3>
        <div className="flex flex-wrap gap-2.5">
          {user?.targetSkills?.map(skillId => {
            const skillObj = TARGET_SKILLS_OPTIONS.find(s => s.id === skillId);
            return (
              <span
                key={skillId}
                className="px-4 py-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-bold rounded-2xl flex items-center gap-2 backdrop-blur-md"
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                {skillObj ? skillObj.label : skillId}
              </span>
            );
          })}
        </div>
      </section>

      {/* Benchmark Assessment History */}
      {benchmarkData?.recentSubmissions?.length > 0 && (
        <section className="bg-slate-900/65 rounded-3xl p-6 sm:p-8 border border-white/20 backdrop-blur-2xl shadow-2xl space-y-4 text-white">
          <h3 className="text-lg font-bold text-white">Assessment History</h3>
          <div className="divide-y divide-white/10">
            {benchmarkData.recentSubmissions.map((sub, idx) => (
              <div key={sub._id || idx} className="py-4 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="font-bold text-white">
                    {sub.assessmentId?.title || 'Diagnostic Assessment'}
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(sub.createdAt).toLocaleDateString()} at{' '}
                    {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-lg font-black text-brand-300">{sub.scores?.overallScore}%</span>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Score</p>
                  </div>
                  <ProficiencyBadge level={sub.benchmarkAssigned} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
