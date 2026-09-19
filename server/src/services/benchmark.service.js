import { Assessment, AssessmentSubmission } from '../models/Assessment.model.js';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/apiError.js';

export class BenchmarkService {
  /**
   * Calculates scores and assigns proficiency benchmarks based on learner submission answers.
   */
  static async evaluateAssessmentSubmission(userId, assessmentId, answers, timeSpentSeconds = 0) {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      throw ApiError.notFound('Assessment not found');
    }

    const questionMap = new Map();
    assessment.questions.forEach(q => {
      questionMap.set(q.questionId, q);
    });

    let totalPointsPossible = 0;
    let totalPointsEarned = 0;
    let correctCount = 0;

    const skillScores = {
      reading: { earned: 0, possible: 0 },
      writing: { earned: 0, possible: 0 },
      comprehension: { earned: 0, possible: 0 },
      phonics: { earned: 0, possible: 0 },
      vocabulary: { earned: 0, possible: 0 },
    };

    const gradedAnswers = answers.map(ans => {
      const q = questionMap.get(ans.questionId);
      if (!q) {
        return {
          questionId: ans.questionId,
          selectedAnswer: ans.selectedAnswer,
          isCorrect: false,
          pointsEarned: 0,
          skillCategory: 'reading',
        };
      }

      totalPointsPossible += q.points;
      const isCorrect = ans.selectedAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      const pointsEarned = isCorrect ? q.points : 0;

      if (isCorrect) correctCount += 1;
      totalPointsEarned += pointsEarned;

      const skill = q.skillCategory || 'reading';
      if (skillScores[skill]) {
        skillScores[skill].earned += pointsEarned;
        skillScores[skill].possible += q.points;
      }

      return {
        questionId: ans.questionId,
        selectedAnswer: ans.selectedAnswer,
        isCorrect,
        pointsEarned,
        skillCategory: skill,
      };
    });

    // Calculate percentages
    const overallScore = totalPointsPossible > 0 ? Math.round((totalPointsEarned / totalPointsPossible) * 100) : 0;

    const calculateSkillPercent = skill => {
      const s = skillScores[skill];
      if (!s || s.possible === 0) return overallScore;
      return Math.round((s.earned / s.possible) * 100);
    };

    const readingScore = calculateSkillPercent('reading');
    const writingScore = calculateSkillPercent('writing');
    const comprehensionScore = calculateSkillPercent('comprehension');

    // Assign benchmark level
    let benchmarkAssigned = 'beginner';
    let feedback = '';
    const strengths = [];
    const areasForImprovement = [];

    if (overallScore >= 85) {
      benchmarkAssigned = 'advanced';
      feedback = 'Outstanding performance! You have demonstrated strong reading fluency, precise spelling, and deep comprehension.';
    } else if (overallScore >= 70) {
      benchmarkAssigned = 'intermediate';
      feedback = 'Great job! You have good grasp over foundational literacy, sentence reading, and vocabulary.';
    } else if (overallScore >= 45) {
      benchmarkAssigned = 'elementary';
      feedback = 'Good foundation! Continue practicing word construction, phonetics, and short reading passages.';
    } else {
      benchmarkAssigned = 'beginner';
      feedback = 'Welcome to your literacy journey! We recommend starting with alphabet recognition, phonics sounds, and basic sight words.';
    }

    // Determine strengths & areas for improvement
    if (readingScore >= 70) strengths.push('Reading Fluency & Passage Comprehension');
    else areasForImprovement.push('Reading Speed and Word Recognition');

    if (writingScore >= 70) strengths.push('Sentence Construction & Spelling');
    else areasForImprovement.push('Letter Formation & Word Spelling');

    if (comprehensionScore >= 70) strengths.push('Story Understanding & Context Extraction');
    else areasForImprovement.push('Context Clues & Question Answering');

    if (strengths.length === 0) strengths.push('Eagerness to learn and complete the assessment');
    if (areasForImprovement.length === 0) areasForImprovement.push('Keep challenging yourself with advanced texts');

    // Create submission record
    const submission = await AssessmentSubmission.create({
      userId,
      assessmentId,
      answers: gradedAnswers,
      scores: {
        overallScore,
        readingScore,
        writingScore,
        comprehensionScore,
        totalQuestions: gradedAnswers.length,
        correctCount,
      },
      benchmarkAssigned,
      feedback,
      strengths,
      areasForImprovement,
      timeSpentSeconds,
    });

    // Update User Profile with benchmark history and current proficiency level
    await User.findByIdAndUpdate(userId, {
      $set: { proficiencyLevel: benchmarkAssigned },
      $push: {
        benchmarkHistory: {
          assessmentId,
          benchmarkLevel: benchmarkAssigned,
          overallScore,
          readingScore,
          writingScore,
          comprehensionScore,
          feedback,
          assessedAt: new Date(),
        },
      },
    });

    return submission;
  }

  /**
   * Retrieves benchmark profile and history for a given user.
   */
  static async getUserBenchmark(userId) {
    const user = await User.findById(userId).select('name email preferredLanguage proficiencyLevel benchmarkHistory');
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const latestSubmissions = await AssessmentSubmission.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('assessmentId', 'title code type language targetLevel');

    const latestBenchmark = user.benchmarkHistory.length > 0 ? user.benchmarkHistory[user.benchmarkHistory.length - 1] : null;

    return {
      userId: user._id,
      name: user.name,
      preferredLanguage: user.preferredLanguage,
      currentProficiencyLevel: user.proficiencyLevel,
      latestBenchmark,
      benchmarkHistory: user.benchmarkHistory,
      recentSubmissions: latestSubmissions,
    };
  }
}
