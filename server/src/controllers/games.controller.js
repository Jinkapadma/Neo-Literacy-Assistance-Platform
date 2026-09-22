import { GamesService } from '../services/games.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { User } from '../models/User.model.js';

export const getWordScramblePuzzles = asyncHandler(async (req, res) => {
  const language = req.query.language || req.user?.preferredLanguage || 'te';
  const difficulty = req.query.difficulty || 'beginner';
  const puzzles = GamesService.getWordScramblePuzzles(language, difficulty);
  return ApiResponse.success(res, { puzzles }, 'Word scramble puzzles retrieved successfully');
});

export const getMemoryMatchCards = asyncHandler(async (req, res) => {
  const language = req.query.language || req.user?.preferredLanguage || 'te';
  const cards = GamesService.getMemoryMatchCards(language);
  return ApiResponse.success(res, { cards }, 'Memory match cards retrieved successfully');
});

export const getSpeedQuizQuestions = asyncHandler(async (req, res) => {
  const language = req.query.language || req.user?.preferredLanguage || 'te';
  const questions = GamesService.getSpeedQuizQuestions(language);
  return ApiResponse.success(res, { questions }, 'Speed quiz questions retrieved successfully');
});

export const getSentenceBuilderPuzzles = asyncHandler(async (req, res) => {
  const language = req.query.language || req.user?.preferredLanguage || 'te';
  const puzzles = GamesService.getSentenceBuilderPuzzles(language);
  return ApiResponse.success(res, { puzzles }, 'Sentence builder puzzles retrieved successfully');
});

export const recordGameCompletion = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { gameType, xpEarned = 25, score = 100 } = req.body;

  if (userId) {
    await User.findByIdAndUpdate(userId, {
      $inc: { 'gamification.totalXp': xpEarned, 'gamification.streakDays': 1 },
    });
  }

  return ApiResponse.success(
    res,
    { xpEarned, score, gameType, status: 'RECORDED' },
    'Game completion recorded successfully'
  );
});
