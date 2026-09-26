import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  GitBranch,
  TrendingUp,
  BrainCircuit,
  Lightbulb,
  CheckCircle2,
  Lock,
  ArrowRight,
  Flame,
  Target,
  RefreshCw,
  Volume2,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { aiApi } from '../../api/aiApi.js';
import { useAuth } from '../../hooks/useAuth.js';
import { Card } from '../../components/common/Card.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Loader } from '../../components/common/Loader.jsx';

export const AdaptiveLearningPath = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pathData, setPathData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(null);
  
  // Smart Hint Playground state
  const [hintErrorType, setHintErrorType] = useState('phoneme_mispronunciation');
  const [hintLanguage, setHintLanguage] = useState(user?.nativeLanguage || 'te');
  const [generatedHint, setGeneratedHint] = useState(null);
  const [generatingHint, setGeneratingHint] = useState(false);

  useEffect(() => {
    fetchAdaptiveData();
  }, []);

  const fetchAdaptiveData = async () => {
    try {
      setLoading(true);
      const [pathRes, recRes] = await Promise.all([
        aiApi.getPersonalizedPath().catch(() => null),
        aiApi.getRecommendations().catch(() => null),
      ]);

      if (pathRes?.data) {
        setPathData(pathRes.data);
        if (pathRes.data.knowledgeGraph && pathRes.data.knowledgeGraph.length > 0) {
          setSelectedConcept(pathRes.data.knowledgeGraph[0]);
        }
      }
      if (recRes?.data?.recommendations) {
        setRecommendations(recRes.data.recommendations);
      }
    } catch (err) {
      console.error('Failed to load adaptive learning path:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSmartHint = async () => {
    try {
      setGeneratingHint(true);
      const res = await aiApi.getSmartHint({
        questionId: selectedConcept?.id || 'sample_concept',
        userLanguage: hintLanguage,
        errorType: hintErrorType,
        currentStreak: pathData?.dda?.currentStreak || 3,
        failedAttempts: 2,
      });
      if (res?.data) {
        setGeneratedHint(res.data);
      }
    } catch (err) {
      console.error('Failed to generate smart hint:', err);
    } finally {
      setGeneratingHint(false);
    }
  };

  const speakText = text => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader size="lg" />
        <p className="text-slate-600 font-semibold animate-pulse">
          Synthesizing AI Knowledge Graph & Dynamic Difficulty Adjustments...
        </p>
      </div>
    );
  }

  const kg = pathData?.knowledgeGraph || [
    {
      id: 'vowels_basic',
      name: 'Vowel Foundations (అచ్చులు / स्वर)',
      category: 'Phonology',
      mastery: 92,
      status: 'Mastered',
      prerequisites: [],
      description: 'Mastery of fundamental vowels and initial acoustic resonance.',
    },
    {
      id: 'consonants_basic',
      name: 'Primary Consonants (హల్లులు / व्यंजन)',
      category: 'Orthography',
      mastery: 84,
      status: 'Mastered',
      prerequisites: ['vowels_basic'],
      description: 'Velar, palatal, and retroflex consonant articulation.',
    },
    {
      id: 'blends_syllables',
      name: 'Vowel Diacritics & Guninthalu (గుణింతాలు)',
      category: 'Morphology',
      mastery: 68,
      status: 'In-Progress',
      prerequisites: ['consonants_basic'],
      description: 'Compound syllable formation combining consonant bases with vowel signs.',
    },
    {
      id: 'word_formation',
      name: 'Polysyllabic Word Synthesis (పద నిర్మాణం)',
      category: 'Lexicon',
      mastery: 45,
      status: 'Next-Up',
      prerequisites: ['blends_syllables'],
      description: 'Connecting multi-character glyphs to create high-frequency vocabulary.',
    },
    {
      id: 'sentence_fluency',
      name: 'Sentence Articulation & Prosody (వాక్య పఠనం)',
      category: 'Syntax',
      mastery: 15,
      status: 'Locked',
      prerequisites: ['word_formation'],
      description: 'Full sentence flow, rhythm, pause markers, and intonation.',
    },
  ];

  const dda = pathData?.dda || {
    currentTier: 'Intermediate',
    recommendedAction: 'Consolidate Guninthalu blends before progressing to multisyllabic reading',
    accuracyScore: 78,
    currentStreak: 4,
    stabilityFactor: 1.85,
  };

  return (
    <div className="space-y-8 pb-12 text-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/70 border border-white/20 p-8 text-white shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/30 border border-brand-400/30 text-brand-200 text-xs font-bold tracking-wide">
              <BrainCircuit className="w-4 h-4 text-brand-300" />
              <span>PHASE 2: AI ADAPTIVE ENGINE</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Personalized Knowledge Graph
            </h1>
            <p className="text-slate-200 max-w-2xl text-sm sm:text-base leading-relaxed">
              Real-time dynamic difficulty adjustment (DDA) sequences your curriculum based on
              individual phonetic retention curves and cognitive load factors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/spaced-repetition">
              <Button variant="primary" className="shadow-lg hover:shadow-brand-500/25 font-bold">
                <Sparkles className="w-4 h-4 mr-2" />
                Spaced Repetition Lab
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={fetchAdaptiveData}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Real-time DDA Metric Ribbon */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-2.5 rounded-2xl bg-brand-500/20 border border-brand-400/30 text-brand-300">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-300 font-medium">Difficulty Tier</p>
              <p className="text-base font-bold text-white">{dda.currentTier}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-300 font-medium">Accuracy Streak</p>
              <p className="text-base font-bold text-white">{dda.currentStreak} Concepts</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-300 font-medium">Mastery Retention</p>
              <p className="text-base font-bold text-white">{dda.accuracyScore}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-300 font-medium">Adaptivity Factor</p>
              <p className="text-base font-bold text-white">SM-2 ({dda.stabilityFactor}x)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Knowledge Graph + Adaptive Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Interactive Dependency Graph */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-brand-400" />
              <h2 className="text-xl font-bold text-white">Concept Prerequisite Pathway</h2>
            </div>
            <span className="text-xs font-semibold text-slate-200 bg-white/10 border border-white/15 px-3 py-1 rounded-full">
              Ordered by Cognitive Dependency
            </span>
          </div>

          <div className="relative space-y-4">
            {kg.map((node, index) => {
              const isSelected = selectedConcept?.id === node.id;
              const isMastered = node.status === 'Mastered' || node.mastery >= 80;
              const isLocked = node.status === 'Locked';

              return (
                <div
                  key={node.id}
                  onClick={() => !isLocked && setSelectedConcept(node)}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-2xl shadow-xl ${
                    isSelected
                      ? 'bg-brand-600/30 border-brand-400 ring-2 ring-brand-400/50'
                      : isLocked
                      ? 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                      : 'bg-slate-900/65 border-white/20 hover:border-brand-400 hover:bg-slate-900/80'
                  }`}
                >
                  {/* Step Connector Line */}
                  {index < kg.length - 1 && (
                    <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-white/10 group-hover:bg-brand-400 transition-colors z-0" />
                  )}

                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md transition-colors ${
                          isMastered
                            ? 'bg-emerald-500 text-white'
                            : isLocked
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-brand-600 text-white'
                        }`}
                      >
                        {isMastered ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : isLocked ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-white text-base">{node.name}</h3>
                          <Badge
                            variant={
                              isMastered
                                ? 'success'
                                : node.status === 'In-Progress'
                                ? 'primary'
                                : isLocked
                                ? 'outline'
                                : 'warning'
                            }
                            size="sm"
                          >
                            {node.status}
                          </Badge>
                          <span className="text-[11px] font-medium text-slate-300 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                            {node.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 max-w-xl">{node.description}</p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                        <span>{node.mastery}%</span>
                      </div>
                      <div className="w-20 bg-slate-950/60 h-2 rounded-full overflow-hidden border border-white/10">
                        <div
                          className={`h-full rounded-full ${
                            node.mastery >= 80
                              ? 'bg-emerald-400'
                              : node.mastery >= 50
                              ? 'bg-brand-400'
                              : 'bg-amber-400'
                          }`}
                          style={{ width: `${node.mastery}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Concept Detail & AI Smart Hint Generator */}
        <div className="space-y-6">
          {/* Selected Concept Card */}
          <Card className="p-6 border border-white/20 shadow-2xl space-y-5 bg-slate-900/65 backdrop-blur-2xl rounded-3xl text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-white">Concept Deep-Dive</h3>
              </div>
              <Badge variant="primary">Adaptive AI</Badge>
            </div>

            {selectedConcept ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Focus</p>
                  <h4 className="text-lg font-bold text-white mt-1">{selectedConcept.name}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedConcept.description}</p>
                </div>

                <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-200">
                    <span>Acoustic Mastery</span>
                    <span className="text-amber-300 font-bold">{selectedConcept.mastery}%</span>
                  </div>
                  <div className="w-full bg-slate-950/60 h-2 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${selectedConcept.mastery}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link to="/content" className="flex-1">
                    <Button variant="primary" className="w-full text-xs font-bold">
                      Practice Drills
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                  <Link to="/voice-practice" className="flex-1">
                    <Button variant="outline" className="w-full text-xs bg-white/10 text-white border-white/20 hover:bg-white/20">
                      Voice Lab
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-300">Select any node on the graph to view AI metrics.</p>
            )}
          </Card>

          {/* AI Smart Hint & Diagnostic Assistant */}
          <Card className="p-6 border border-white/20 shadow-2xl space-y-4 bg-slate-900/65 backdrop-blur-2xl rounded-3xl text-white">
            <div className="flex items-center gap-2 text-purple-300">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-white">AI Contextual Hint Engine</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Test how the AI dynamically formulates scaffolded pedagogical hints based on language
              and error classification.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Target Language</label>
                <select
                  value={hintLanguage}
                  onChange={e => setHintLanguage(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-white/20 bg-slate-950/80 text-white focus:ring-2 focus:ring-brand-400 focus:outline-none cursor-pointer"
                >
                  <option value="te" className="text-slate-900">Telugu (తెలుగు)</option>
                  <option value="ta" className="text-slate-900">Tamil (தமிழ்)</option>
                  <option value="kn" className="text-slate-900">Kannada (ಕನ್ನಡ)</option>
                  <option value="ml" className="text-slate-900">Malayalam (മലയാളം)</option>
                  <option value="hi" className="text-slate-900">Hindi (हिन्दी)</option>
                  <option value="en" className="text-slate-900">English</option>
                  <option value="bn" className="text-slate-900">Bengali (বাংলা)</option>
                  <option value="mr" className="text-slate-900">Marathi (मराठी)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Simulated Error Type</label>
                <select
                  value={hintErrorType}
                  onChange={e => setHintErrorType(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-white/20 bg-slate-950/80 text-white focus:ring-2 focus:ring-brand-400 focus:outline-none cursor-pointer"
                >
                  <option value="phoneme_mispronunciation" className="text-slate-900">Acoustic Mispronunciation</option>
                  <option value="glyph_confusion" className="text-slate-900">Similar Glyph Confusion</option>
                  <option value="syllable_omission" className="text-slate-900">Syllable Omission</option>
                  <option value="vowel_length_error" className="text-slate-900">Short vs Long Vowel Lengthening</option>
                </select>
              </div>

              <Button
                variant="primary"
                onClick={handleGenerateSmartHint}
                loading={generatingHint}
                className="w-full text-xs bg-purple-600 hover:bg-purple-700 font-bold"
              >
                <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                Generate Adaptive Smart Hint
              </Button>

              {generatedHint && (
                <div className="p-4 rounded-2xl bg-purple-950/50 border border-purple-500/40 text-white space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                      Scaffolded Guidance
                    </span>
                    <button
                      onClick={() => speakText(generatedHint.hintText)}
                      className="p-1 text-purple-300 hover:text-white cursor-pointer"
                      title="Listen to hint"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs font-medium leading-relaxed">{generatedHint.hintText}</p>
                  {generatedHint.mnemonic && (
                    <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-[11px] text-amber-200 font-semibold">
                      💡 Mnemonic: {generatedHint.mnemonic}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
