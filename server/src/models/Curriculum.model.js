import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  lessonId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['phonics', 'vocabulary', 'sentence_structure', 'story_reading', 'comprehension', 'practical_usage'],
    default: 'vocabulary',
  },
  description: {
    type: String,
    trim: true,
  },
  contentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
  },
  order: {
    type: Number,
    required: true,
    default: 1,
  },
  objectives: [{ type: String }],
  estimatedMinutes: {
    type: Number,
    default: 10,
  },
});

const moduleSchema = new mongoose.Schema({
  moduleId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    required: true,
    default: 1,
  },
  lessons: [lessonSchema],
  badgeReward: {
    type: String,
  },
});

const curriculumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Curriculum title is required'],
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: [true, 'Curriculum code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'es', 'fr', 'bn', 'te', 'ta', 'mr'],
      required: [true, 'Language is required'],
      index: true,
    },
    targetLevel: {
      type: String,
      enum: ['beginner', 'elementary', 'intermediate', 'advanced'],
      default: 'beginner',
      index: true,
    },
    category: {
      type: String,
      enum: [
        'Alphabet & Phonics',
        'Sight Words & Vocabulary',
        'Sentence Building',
        'Reading Comprehension',
        'Daily Life & Functional Literacy',
      ],
      default: 'Alphabet & Phonics',
    },
    sequence: {
      type: Number,
      default: 1,
      index: true,
    },
    icon: {
      type: String,
      default: 'BookOpen',
    },
    modules: [moduleSchema],
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

curriculumSchema.index({ language: 1, targetLevel: 1, sequence: 1 });

export const Curriculum = mongoose.model('Curriculum', curriculumSchema);
