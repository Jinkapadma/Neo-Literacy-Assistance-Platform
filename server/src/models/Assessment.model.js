import mongoose from 'mongoose';

const assessmentQuestionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      'multiple_choice',
      'reading_passage',
      'word_completion',
      'sentence_reorder',
      'picture_match',
      'fill_in_blank',
    ],
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  passage: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  audioUrl: {
    type: String,
  },
  options: [{ type: String }],
  correctAnswer: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 10,
  },
  skillCategory: {
    type: String,
    enum: ['phonics', 'vocabulary', 'reading', 'writing', 'comprehension'],
    required: true,
  },
  explanation: {
    type: String,
  },
});

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assessment title is required'],
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'es', 'fr', 'bn', 'te', 'ta', 'kn', 'ml', 'mr'],
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['reading', 'writing', 'comprehension', 'benchmark'],
      required: true,
      index: true,
    },
    ageCohort: {
      type: String,
      enum: ['kids', 'teens', 'adults', 'all'],
      default: 'all',
      index: true,
    },
    isInitialDiagnostic: {
      type: Boolean,
      default: false,
      index: true,
    },
    targetLevel: {
      type: String,
      enum: ['beginner', 'elementary', 'intermediate', 'advanced'],
      default: 'beginner',
      index: true,
    },
    timeLimitMinutes: {
      type: Number,
      default: 15,
    },
    totalPoints: {
      type: Number,
      default: 100,
    },
    passingScorePercentage: {
      type: Number,
      default: 60,
    },
    questions: [assessmentQuestionSchema],
    isPublished: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const learnerAnswerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  selectedAnswer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  pointsEarned: {
    type: Number,
    required: true,
    default: 0,
  },
  skillCategory: {
    type: String,
    enum: ['phonics', 'vocabulary', 'reading', 'writing', 'comprehension'],
  },
});

const assessmentSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
      index: true,
    },
    answers: [learnerAnswerSchema],
    scores: {
      overallScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      readingScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      writingScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      comprehensionScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      totalQuestions: {
        type: Number,
        required: true,
      },
      correctCount: {
        type: Number,
        required: true,
      },
    },
    benchmarkAssigned: {
      type: String,
      enum: ['beginner', 'elementary', 'intermediate', 'advanced'],
      required: true,
    },
    feedback: {
      type: String,
    },
    strengths: [{ type: String }],
    areasForImprovement: [{ type: String }],
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

assessmentSubmissionSchema.index({ userId: 1, createdAt: -1 });

export const Assessment = mongoose.model('Assessment', assessmentSchema);
export const AssessmentSubmission = mongoose.model('AssessmentSubmission', assessmentSubmissionSchema);
