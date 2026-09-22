import { VoiceEvaluationService } from '../services/voiceEvaluation.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const evaluatePronunciation = asyncHandler(async (req, res) => {
  const {
    spokenText,
    userAudioTranscript,
    targetText,
    language = 'te',
    durationSeconds,
    recordedDurationSec = 3,
  } = req.body;

  const actualSpoken = spokenText || userAudioTranscript || targetText || '';
  const actualDuration = durationSeconds || recordedDurationSec || 3;

  const evaluation = VoiceEvaluationService.evaluatePronunciation(
    actualSpoken,
    targetText,
    language,
    actualDuration
  );

  // Normalize structure for client consumption
  const responseData = {
    ...evaluation,
    overallScore: evaluation.accuracyScore,
    fluencyScore: Math.min(100, Math.round(evaluation.wordsPerMinute * 1.2)),
    completenessScore: evaluation.accuracyScore,
    phonemeHeatmap: evaluation.targetText.split('').map((char, i) => ({
      phoneme: char,
      accuracy: evaluation.accuracyScore >= 80 ? 95 : evaluation.accuracyScore >= 50 ? 70 : 45,
      status: evaluation.accuracyScore >= 80 ? 'correct' : evaluation.accuracyScore >= 50 ? 'moderate' : 'inaccurate',
    })),
    articulatoryFeedback: [
      'Clear acoustic articulation on initial consonant onset.',
      'Sustain vowel resonance for balanced rhythmic cadence.',
    ],
    acousticTip: 'Keep your tongue position relaxed and enunciate each ligature clearly.',
  };

  return ApiResponse.success(res, responseData, 'Pronunciation evaluated successfully');
});

export const getPracticePhrases = asyncHandler(async (req, res) => {
  const language = req.query.language || req.user?.preferredLanguage || 'te';
  const phrases = VoiceEvaluationService.getPracticePhrases(language);
  return ApiResponse.success(res, { phrases }, 'Practice phrases retrieved successfully');
});

