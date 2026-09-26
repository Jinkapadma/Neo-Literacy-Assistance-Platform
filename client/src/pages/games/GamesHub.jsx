import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Sparkles,
  Award,
  RotateCcw,
  Volume2,
  CheckCircle2,
  HelpCircle,
  Flame,
  Zap,
  Clock,
  Layers,
  BrainCircuit,
  ArrowRight,
  Shuffle,
  Smile,
} from 'lucide-react';
import { gamesApi } from '../../api/gamesApi.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useProgress } from '../../context/ProgressContext.jsx';
import { useAccessibility } from '../../hooks/useAccessibility.js';
import { Card } from '../../components/common/Card.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Loader } from '../../components/common/Loader.jsx';
import { useLanguage } from '../../hooks/useLanguage.js';

export const GamesHub = () => {
  const { user } = useAuth();
  const { progress, recordGameWin } = useProgress();
  const { speakText } = useAccessibility();
  const { learningLanguage, interfaceLanguage, learningLangMeta, interfaceLangMeta, t } = useLanguage();

  const [activeTab, setActiveTab] = useState('scramble'); // 'scramble' | 'memory' | 'quiz' | 'builder'
  const [selectedLanguage, setSelectedLanguage] = useState(learningLanguage || 'te');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (learningLanguage) {
      setSelectedLanguage(learningLanguage);
    }
  }, [learningLanguage]);

  // 1. Word Scramble State
  const [scramblePuzzles, setScramblePuzzles] = useState([]);
  const [currentScrambleIdx, setCurrentScrambleIdx] = useState(0);
  const [scrambleSelectedLetters, setScrambleSelectedLetters] = useState([]);
  const [scrambleCompleted, setScrambleCompleted] = useState(false);

  // 2. Memory Match State
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [movesCount, setMovesCount] = useState(0);

  // 3. Speed Quiz State
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // 4. Sentence Builder State
  const [builderPuzzles, setBuilderPuzzles] = useState([]);
  const [currentBuilderIdx, setCurrentBuilderIdx] = useState(0);
  const [selectedBuilderTiles, setSelectedBuilderTiles] = useState([]);
  const [builderFeedback, setBuilderFeedback] = useState(null);

  useEffect(() => {
    loadGameData();
  }, [activeTab, selectedLanguage]);

  const loadGameData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'scramble') {
        const res = await gamesApi.getWordScramblePuzzles({ language: selectedLanguage });
        const list = res.data?.puzzles || [];
        setScramblePuzzles(list);
        setCurrentScrambleIdx(0);
        setScrambleSelectedLetters([]);
        setScrambleCompleted(false);
      } else if (activeTab === 'memory') {
        const res = await gamesApi.getMemoryMatchCards({ language: selectedLanguage });
        const cards = res.data?.cards || [];
        setMemoryCards(cards);
        setFlippedCards([]);
        setMatchedPairs([]);
        setMovesCount(0);
      } else if (activeTab === 'quiz') {
        const res = await gamesApi.getSpeedQuizQuestions({ language: selectedLanguage });
        const questions = res.data?.questions || [];
        setQuizQuestions(questions);
        setCurrentQuizIdx(0);
        setQuizScore(0);
        setQuizFinished(false);
      } else if (activeTab === 'builder') {
        const res = await gamesApi.getSentenceBuilderPuzzles({ language: selectedLanguage });
        const puzzles = res.data?.puzzles || [];
        setBuilderPuzzles(puzzles);
        setCurrentBuilderIdx(0);
        setSelectedBuilderTiles([]);
        setBuilderFeedback(null);
      }
    } catch (err) {
      console.error('Failed to load game data:', err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // SCRAMBLE LOGIC
  // ----------------------------------------------------
  const currentScramble = scramblePuzzles[currentScrambleIdx];

  const handleTileClick = letter => {
    if (scrambleSelectedLetters.includes(letter)) {
      setScrambleSelectedLetters(scrambleSelectedLetters.filter(l => l !== letter));
    } else {
      const nextArr = [...scrambleSelectedLetters, letter];
      setScrambleSelectedLetters(nextArr);

      // Check if complete
      if (nextArr.join('') === currentScramble.targetWord) {
        toast.success(`🎉 Correct! You built "${currentScramble.targetWord}" (+25 XP)`);
        recordGameWin('word_scramble', 25);
        gamesApi.recordGameCompletion({ gameType: 'word_scramble', xpEarned: 25, score: 100 });
        setScrambleCompleted(true);
      }
    }
  };

  const nextScramblePuzzle = () => {
    if (currentScrambleIdx + 1 < scramblePuzzles.length) {
      setCurrentScrambleIdx(prev => prev + 1);
      setScrambleSelectedLetters([]);
      setScrambleCompleted(false);
    } else {
      toast.success('🏆 All scramble puzzles completed!');
    }
  };

  // ----------------------------------------------------
  // MEMORY MATCH LOGIC
  // ----------------------------------------------------
  const handleMemoryCardClick = card => {
    if (flippedCards.length === 2 || flippedCards.some(c => c.id === card.id) || matchedPairs.includes(card.id)) {
      return;
    }

    if (card.audio) {
      speakText(card.audio, selectedLanguage);
    }

    const nextFlipped = [...flippedCards, card];
    setFlippedCards(nextFlipped);

    if (nextFlipped.length === 2) {
      setMovesCount(prev => prev + 1);
      const [first, second] = nextFlipped;

      if (first.pairId === second.id || second.pairId === first.id) {
        setMatchedPairs(prev => [...prev, first.id, second.id]);
        setFlippedCards([]);
        toast.success('✨ Pair Matched!');

        if (matchedPairs.length + 2 >= memoryCards.length && memoryCards.length > 0) {
          toast.success('🏆 You matched all memory pairs! (+30 XP)');
          recordGameWin('memory_match', 30);
          gamesApi.recordGameCompletion({ gameType: 'memory_match', xpEarned: 30, score: 100 });
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // ----------------------------------------------------
  // SPEED QUIZ LOGIC
  // ----------------------------------------------------
  const currentQuiz = quizQuestions[currentQuizIdx];

  const handleQuizAnswer = option => {
    const isCorrect = option === currentQuiz.correctAnswer;
    if (isCorrect) {
      setQuizScore(prev => prev + 10);
      toast.success('🎯 Correct!');
    } else {
      toast.error(`Incorrect. Correct answer was: ${currentQuiz.correctAnswer}`);
    }

    if (currentQuizIdx + 1 < quizQuestions.length) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
      const xp = (quizScore + (isCorrect ? 10 : 0)) * 2;
      recordGameWin('speed_quiz', xp);
      gamesApi.recordGameCompletion({ gameType: 'speed_quiz', xpEarned: xp, score: quizScore });
    }
  };

  // ----------------------------------------------------
  // SENTENCE BUILDER LOGIC
  // ----------------------------------------------------
  const currentBuilder = builderPuzzles[currentBuilderIdx];

  const handleBuilderTileClick = tile => {
    if (selectedBuilderTiles.includes(tile)) {
      setSelectedBuilderTiles(selectedBuilderTiles.filter(t => t !== tile));
      setBuilderFeedback(null);
    } else {
      setSelectedBuilderTiles([...selectedBuilderTiles, tile]);
      setBuilderFeedback(null);
    }
  };

  const handleCheckSentence = () => {
    const formedSentence = selectedBuilderTiles.join(' ');
    if (formedSentence === currentBuilder.correctSentence) {
      setBuilderFeedback({ correct: true, message: '🎉 Perfect Sentence Structure! (+25 XP)' });
      speakText(formedSentence, selectedLanguage);
      recordGameWin('sentence_builder', 25);
      gamesApi.recordGameCompletion({ gameType: 'sentence_builder', xpEarned: 25, score: 100 });
    } else {
      setBuilderFeedback({ correct: false, message: 'Incorrect word order. Check grammatical placement.' });
    }
  };

  return (
    <div className="space-y-8 pb-12 text-white">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/70 border border-white/20 p-8 text-white shadow-2xl backdrop-blur-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/30 border border-brand-400/30 text-brand-200 text-xs font-bold">
              <Gamepad2 className="w-4 h-4 text-brand-300" />
              <span>MULTILINGUAL LITERACY GAMES & PUZZLES</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Language Play Arena
            </h1>
            <p className="text-slate-200 max-w-2xl text-xs sm:text-sm leading-relaxed">
              Reinforce orthographic spelling, sentence syntax, and memory retention through interactive
              multilingual games across 8 Indian languages.
            </p>
          </div>

          {/* Language Selector & XP Tracker */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="text-xs font-bold px-3 py-2.5 rounded-xl bg-slate-950/80 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-400 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code} className="text-slate-900">
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-bold shadow-sm">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{progress.totalXp} XP</span>
            </div>
          </div>
        </div>

        {/* Game Mode Selector Navigation */}
        <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-white/10">
          {[
            { id: 'scramble', label: '🔤 Word Scramble', icon: Shuffle },
            { id: 'memory', label: '🃏 Memory Cards', icon: Layers },
            { id: 'quiz', label: '⚡ Speed Literacy Quiz', icon: Zap },
            { id: 'builder', label: '🧩 Sentence Builder', icon: BrainCircuit },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/30 scale-[1.02] border border-white/20'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader size="lg" />
          <p className="text-white font-bold text-sm">Loading Multilingual Game Arena...</p>
        </div>
      ) : (
        /* GAME ARENA CONTAINER */
        <div className="max-w-4xl mx-auto">
          {/* ==================================================== */}
          {/* 1. WORD SCRAMBLE / GLYPH PUZZLE */}
          {/* ==================================================== */}
          {activeTab === 'scramble' && currentScramble && (
            <Card className="p-8 border border-white/20 shadow-2xl space-y-8 text-center bg-slate-900/70 backdrop-blur-2xl rounded-3xl text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <Badge variant="primary">Word Scramble</Badge>
                <span className="text-xs font-bold text-amber-300">
                  Puzzle {currentScrambleIdx + 1} of {scramblePuzzles.length}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Target Meaning</p>
                <h3 className="text-2xl font-black text-white">{currentScramble.meaning}</h3>
                <p className="text-xs text-brand-300 font-semibold">💡 Hint: {currentScramble.hint}</p>
              </div>

              {/* Formed Word Stage */}
              <div className="p-6 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 min-h-[90px] flex items-center justify-center gap-3 flex-wrap backdrop-blur-md">
                {scrambleSelectedLetters.length > 0 ? (
                  scrambleSelectedLetters.map((char, i) => (
                    <button
                      key={i}
                      onClick={() => handleTileClick(char)}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-2xl font-black shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all border border-white/20"
                    >
                      {char}
                    </button>
                  ))
                ) : (
                  <span className="text-sm font-semibold text-slate-300">
                    Click the scrambled glyph tiles below to assemble the word in order
                  </span>
                )}
              </div>

              {/* Scrambled Character Tiles */}
              <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
                {currentScramble.scrambledLetters.map((char, i) => {
                  const isUsed = scrambleSelectedLetters.includes(char);
                  return (
                    <button
                      key={i}
                      disabled={isUsed}
                      onClick={() => handleTileClick(char)}
                      className={`px-6 py-4 rounded-2xl text-2xl font-black border transition-all cursor-pointer ${
                        isUsed
                          ? 'bg-white/5 border-white/10 text-slate-500 opacity-40 cursor-not-allowed'
                          : 'bg-white/15 hover:bg-white/25 border-white/20 text-white shadow-lg hover:border-brand-400 active:scale-95'
                      }`}
                    >
                      {char}
                    </button>
                  );
                })}
              </div>

              {/* Action Controls */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  onClick={() => speakText(currentScramble.audioText, selectedLanguage)}
                >
                  <Volume2 className="w-4 h-4 mr-1.5 text-brand-300" />
                  Listen Pronunciation
                </Button>

                {scrambleCompleted && (
                  <Button variant="primary" size="sm" onClick={nextScramblePuzzle}>
                    Next Puzzle <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* ==================================================== */}
          {/* 2. MEMORY MATCH CARDS */}
          {/* ==================================================== */}
          {activeTab === 'memory' && (
            <Card className="p-8 border border-white/20 shadow-2xl space-y-6 bg-slate-900/70 backdrop-blur-2xl rounded-3xl text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <Badge variant="primary">Memory Match</Badge>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-200">
                  <span>Moves: {movesCount}</span>
                  <span className="text-emerald-300 font-extrabold">
                    Matched: {matchedPairs.length / 2} / {memoryCards.length / 2}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {memoryCards.map(card => {
                  const isFlipped = flippedCards.some(c => c.id === card.id) || matchedPairs.includes(card.id);
                  const isMatched = matchedPairs.includes(card.id);

                  return (
                    <div
                      key={card.id}
                      onClick={() => handleMemoryCardClick(card)}
                      className={`h-32 rounded-2xl border-2 flex items-center justify-center text-center p-3 font-bold transition-all duration-300 cursor-pointer select-none backdrop-blur-md ${
                        isMatched
                          ? 'bg-emerald-600/40 border-emerald-400 text-white shadow-lg opacity-90'
                          : isFlipped
                          ? 'bg-gradient-to-r from-brand-600 to-indigo-600 border-white/40 text-white shadow-xl scale-105'
                          : 'bg-white/10 border-white/15 text-transparent hover:border-white/30 hover:bg-white/15'
                      }`}
                    >
                      {isFlipped || isMatched ? (
                        <div className="space-y-1">
                          <p className="text-base sm:text-lg font-black text-white">
                            {card.text}
                          </p>
                          {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-300 mx-auto" />}
                        </div>
                      ) : (
                        <Sparkles className="w-6 h-6 text-amber-300/60" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center pt-4">
                <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20" onClick={loadGameData}>
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  Restart Game Deck
                </Button>
              </div>
            </Card>
          )}

          {/* ==================================================== */}
          {/* 3. SPEED LITERACY QUIZ */}
          {/* ==================================================== */}
          {activeTab === 'quiz' && currentQuiz && !quizFinished && (
            <Card className="p-8 border border-white/20 shadow-2xl space-y-6 bg-slate-900/70 backdrop-blur-2xl rounded-3xl text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <Badge variant="primary">Speed Literacy Quiz</Badge>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-slate-300">Q {currentQuizIdx + 1}/{quizQuestions.length}</span>
                  <span className="text-amber-300 font-extrabold flex items-center gap-1">
                    <Flame className="w-4 h-4" /> {quizScore} pts
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-center py-4">
                <h3 className="text-2xl font-black text-white leading-snug">{currentQuiz.prompt}</h3>
                <button
                  onClick={() => speakText(currentQuiz.audioText, selectedLanguage)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-amber-300 hover:text-white border border-white/15 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-brand-300" />
                  <span>Audio Prompt</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQuiz.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(opt)}
                    className="p-4 rounded-2xl border border-white/15 bg-white/10 hover:bg-brand-600/40 hover:border-brand-400 font-bold text-base sm:text-lg text-white text-left transition-all active:scale-98 cursor-pointer flex items-center gap-3 backdrop-blur-md"
                  >
                    <span className="w-7 h-7 rounded-xl bg-white/15 text-white flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'quiz' && quizFinished && (
            <Card className="p-10 text-center space-y-6 border border-white/20 shadow-2xl max-w-lg mx-auto bg-slate-900/80 backdrop-blur-2xl rounded-3xl text-white">
              <div className="w-20 h-20 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Speed Quiz Completed!</h2>
                <p className="text-sm text-slate-200">
                  You earned <span className="font-bold text-amber-300">{quizScore * 2} XP</span> across {quizQuestions.length} vocabulary rounds.
                </p>
              </div>
              <Button variant="primary" onClick={loadGameData} className="w-full font-bold">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Another Round
              </Button>
            </Card>
          )}

          {/* ==================================================== */}
          {/* 4. SENTENCE BUILDER PUZZLE */}
          {/* ==================================================== */}
          {activeTab === 'builder' && currentBuilder && (
            <Card className="p-8 border border-white/20 shadow-2xl space-y-8 bg-slate-900/70 backdrop-blur-2xl rounded-3xl text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <Badge variant="primary">Sentence Builder</Badge>
                <span className="text-xs font-bold text-amber-300">
                  Puzzle {currentBuilderIdx + 1} of {builderPuzzles.length}
                </span>
              </div>

              <div className="space-y-2 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-300">English Translation</p>
                <h3 className="text-xl font-bold text-white">"{currentBuilder.translation}"</h3>
                <p className="text-xs text-brand-300 font-semibold">💡 Clue: {currentBuilder.hint}</p>
              </div>

              {/* Drop/Constructed Sentence Stage */}
              <div className="p-6 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 min-h-[90px] flex items-center justify-center gap-3 flex-wrap backdrop-blur-md">
                {selectedBuilderTiles.length > 0 ? (
                  selectedBuilderTiles.map((tile, i) => (
                    <button
                      key={i}
                      onClick={() => handleBuilderTileClick(tile)}
                      className="px-5 py-3 rounded-2xl bg-indigo-600 text-white text-lg font-bold shadow-md cursor-pointer hover:bg-indigo-700 transition-colors border border-white/20"
                    >
                      {tile}
                    </button>
                  ))
                ) : (
                  <span className="text-sm font-semibold text-slate-300">
                    Click word tiles below in the correct sentence order
                  </span>
                )}
              </div>

              {/* Word Tiles to Choose From */}
              <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
                {currentBuilder.tiles.map((tile, i) => {
                  const isUsed = selectedBuilderTiles.includes(tile);
                  return (
                    <button
                      key={i}
                      disabled={isUsed}
                      onClick={() => handleBuilderTileClick(tile)}
                      className={`px-5 py-3 rounded-2xl text-lg font-bold border transition-all cursor-pointer ${
                        isUsed
                          ? 'bg-white/5 border-white/10 text-slate-500 opacity-40 cursor-not-allowed'
                          : 'bg-white/15 hover:bg-white/25 border-white/20 text-white shadow-sm hover:border-brand-400 active:scale-95'
                      }`}
                    >
                      {tile}
                    </button>
                  );
                })}
              </div>

              {builderFeedback && (
                <div
                  className={`p-4 rounded-2xl text-xs font-bold text-center ${
                    builderFeedback.correct
                      ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-400/40'
                      : 'bg-rose-600/30 text-rose-200 border border-rose-400/40'
                  }`}
                >
                  {builderFeedback.message}
                </div>
              )}

              <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
                <Button variant="primary" size="md" onClick={handleCheckSentence}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Check Sentence
                </Button>

                {builderFeedback?.correct && currentBuilderIdx + 1 < builderPuzzles.length && (
                  <Button
                    variant="outline"
                    size="md"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    onClick={() => {
                      setCurrentBuilderIdx(prev => prev + 1);
                      setSelectedBuilderTiles([]);
                      setBuilderFeedback(null);
                    }}
                  >
                    Next Sentence <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
