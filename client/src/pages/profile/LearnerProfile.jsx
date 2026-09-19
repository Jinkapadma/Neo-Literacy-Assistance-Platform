import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
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
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LearnerProfile = () => {
  const { user, updateProfile } = useAuth();
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [loadingBenchmark, setLoadingBenchmark] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    preferredLanguage: user?.preferredLanguage || 'en',
    targetSkills: user?.targetSkills || [],
  });

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
    await updateProfile(formData);
    setIsEditing(false);
  };

  const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === user?.preferredLanguage) || {
    flag: '🌐',
    nativeName: user?.preferredLanguage,
    name: 'Standard',
  };

  const latestBenchmark = benchmarkData?.latestBenchmark;

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=neo'}
            alt={user?.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-brand-100 border-2 border-brand-200 shadow-sm"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{user?.name}</h1>
              <Badge variant="primary" size="sm" className="capitalize">
                {user?.role}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 font-medium">{user?.email}</p>
            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <ProficiencyBadge level={user?.proficiencyLevel} size="md" />
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full flex items-center gap-1">
                <span>{langInfo.flag}</span>
                <span>{langInfo.nativeName} ({langInfo.name})</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            icon={Edit3}
            className="flex-1 md:flex-initial"
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
        <Card className="p-6 sm:p-8 border-2 border-brand-300 bg-brand-50/20">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Edit Profile Details</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:border-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Preferred Primary Language
              </label>
              <select
                value={formData.preferredLanguage}
                onChange={e => setFormData({ ...formData, preferredLanguage: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:border-brand-500 focus:outline-none"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-colors flex items-center justify-between ${
                        isChecked
                          ? 'border-brand-600 bg-brand-100 text-brand-900'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span>{skill.label}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
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
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-600" />
              Literacy Proficiency Benchmark
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated based on reading comprehension, phonetic accuracy, and writing mechanics.
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
          <Card className="p-8 text-center space-y-4 border-dashed border-2 border-slate-300">
            <Award className="w-12 h-12 text-slate-400 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">No Assessment Completed Yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
                Take your first 15-minute diagnostic literacy assessment to discover your reading baseline and unlock tailored modules.
              </p>
            </div>
            <Link to="/assessment">
              <Button variant="primary" icon={ArrowRight} iconPosition="right">
                Start Diagnostic Assessment
              </Button>
            </Link>
          </Card>
        )}
      </section>

      {/* Target Literacy Goals */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Active Literacy Focus Skills</h3>
        <div className="flex flex-wrap gap-2.5">
          {user?.targetSkills?.map(skillId => {
            const skillObj = TARGET_SKILLS_OPTIONS.find(s => s.id === skillId);
            return (
              <span
                key={skillId}
                className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-900 text-sm font-bold rounded-2xl flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                {skillObj ? skillObj.label : skillId}
              </span>
            );
          })}
        </div>
      </section>

      {/* Benchmark Assessment History */}
      {benchmarkData?.recentSubmissions?.length > 0 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Assessment History</h3>
          <div className="divide-y divide-slate-100">
            {benchmarkData.recentSubmissions.map((sub, idx) => (
              <div key={sub._id || idx} className="py-4 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="font-bold text-slate-900">
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
                    <span className="text-lg font-black text-brand-700">{sub.scores?.overallScore}%</span>
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
