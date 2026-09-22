import mongoose from 'mongoose';
import { Assessment, AssessmentSubmission } from '../models/Assessment.model.js';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/apiError.js';
import { getDiagnosticAssessmentData } from './diagnosticQuestionBank.js';

export class BenchmarkService {
  /**
   * Calculates scores and assigns proficiency benchmarks based on learner submission answers.
   */
  static async evaluateAssessmentSubmission(userId, assessmentId, answers, timeSpentSeconds = 0) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    let assessment = null;
    if (mongoose.Types.ObjectId.isValid(assessmentId)) {
      assessment = await Assessment.findById(assessmentId);
    }

    // Fallback to dynamic diagnostic question bank if not in MongoDB
    if (!assessment) {
      const diagData = getDiagnosticAssessmentData(user.preferredLanguage, user.age || 20);
      // Ensure it is saved in DB so submission can reference it
      assessment = await Assessment.findOneAndUpdate(
        { code: diagData.code },
        { $setOnInsert: diagData },
        { upsert: true, new: true }
      );
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
    const phonicsScore = calculateSkillPercent('phonics');
    const vocabularyScore = calculateSkillPercent('vocabulary');

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
    else areasForImprovement.push('Reading Speed & Word Recognition');

    if (writingScore >= 70) strengths.push('Sentence Construction & Spelling');
    else areasForImprovement.push('Letter Formation & Spelling');

    if (comprehensionScore >= 70) strengths.push('Story Understanding & Context Clues');
    else areasForImprovement.push('Context Clues & Question Answering');

    if (phonicsScore >= 70) strengths.push('Phonetic Sound & Letter Matching');
    else areasForImprovement.push('Script Phonics & Acoustic Pronunciation');

    if (strengths.length === 0) strengths.push('Active participation and diagnostic completion');
    if (areasForImprovement.length === 0) areasForImprovement.push('Keep challenging yourself with advanced reading modules');

    // Generate AI Personalized Learning Plan
    const age = user.age || 20;
    const ageCohort = age < 12 ? 'kids' : age < 18 ? 'teens' : 'adults';

    const moduleSequenceMap = {
      beginner: {
        moduleId: 'mod_1_foundations',
        title: 'Module 1: Script & Phonics Foundations',
        subtitle: 'Alphabet recognition, letter acoustic sounds, and foundational sight words',
        icon: '🔤',
        unlockedLessonsCount: 4,
      },
      elementary: {
        moduleId: 'mod_2_words',
        title: 'Module 2: Word Construction & Everyday Objects',
        subtitle: 'Two-letter blending, high-frequency sight vocabulary, and picture matching',
        icon: '🌿',
        unlockedLessonsCount: 5,
      },
      intermediate: {
        moduleId: 'mod_3_sentences',
        title: 'Module 3: Sentence Reading & Short Stories',
        subtitle: 'Sentence structure, punctuation, dialogue reading, and story comprehension',
        icon: '⚡',
        unlockedLessonsCount: 6,
      },
      advanced: {
        moduleId: 'mod_4_real_world',
        title: 'Module 4: Real-World Reading & Document Fluency',
        subtitle: 'Public sign boards, news articles, utility notices, and practical reading',
        icon: '🏆',
        unlockedLessonsCount: 8,
      },
    };

    const personalizedPlan = {
      assignedLevel: benchmarkAssigned,
      ageCohort,
      language: user.preferredLanguage,
      overallScore,
      startingModule: moduleSequenceMap[benchmarkAssigned] || moduleSequenceMap.beginner,
      recommendedDailyMinutes: overallScore < 50 ? 20 : 15,
      dailyXpTarget: 50,
      prioritySkills: areasForImprovement.slice(0, 3),
      strengths: strengths.slice(0, 3),
      milestone14Days:
        benchmarkAssigned === 'beginner'
          ? 'Read basic 3-letter words and common public signs independently'
          : benchmarkAssigned === 'elementary'
            ? 'Read complete sentences and short illustrated paragraphs with confidence'
            : 'Read everyday notices, newspapers, and stories with high fluency',
      skillScores: {
        reading: readingScore,
        writing: writingScore,
        comprehension: comprehensionScore,
        phonics: phonicsScore,
        vocabulary: vocabularyScore,
      },
    };

    // Create submission record
    const submission = await AssessmentSubmission.create({
      userId,
      assessmentId: assessment._id,
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

    // Update User Profile with benchmark history, current proficiency level, and priority target skills
    await User.findByIdAndUpdate(userId, {
      $set: {
        proficiencyLevel: benchmarkAssigned,
        targetSkills: areasForImprovement.length > 0 ? areasForImprovement : user.targetSkills,
      },
      $push: {
        benchmarkHistory: {
          assessmentId: assessment._id,
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

    const result = submission.toObject();
    result.personalizedPlan = personalizedPlan;
    return result;
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
