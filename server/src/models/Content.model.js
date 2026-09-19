import mongoose from 'mongoose';

const vocabularyItemSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
  },
  meaning: {
    type: String,
    required: true,
    trim: true,
  },
  phonetics: {
    type: String,
    trim: true,
  },
  exampleSentence: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
  },
  audioUrl: {
    type: String,
  },
});

const contentTranslationSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ['en', 'hi', 'es', 'fr', 'bn', 'te', 'ta', 'mr'],
    required: true,
  },
  translatedTitle: {
    type: String,
    required: true,
  },
  translatedText: {
    type: String,
    required: true,
  },
  phoneticGuide: {
    type: String,
  },
});

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [{ type: String, required: true }],
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
  },
});

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Content title is required'],
      trim: true,
      index: true,
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'es', 'fr', 'bn', 'te', 'ta', 'mr'],
      required: [true, 'Language is required'],
      index: true,
    },
    difficultyLevel: {
      type: String,
      enum: ['beginner', 'elementary', 'intermediate', 'advanced'],
      default: 'beginner',
      index: true,
    },
    contentType: {
      type: String,
      enum: ['letter_phonics', 'sight_words', 'sentence_builder', 'short_story', 'dialogue', 'functional_text'],
      default: 'short_story',
      index: true,
    },
    textContent: {
      type: String,
      required: [true, 'Text content is required'],
    },
    phoneticGuide: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    audioUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    translations: [contentTranslationSchema],
    vocabulary: [vocabularyItemSchema],
    comprehensionQuestions: [questionSchema],
    tags: [{ type: String, trim: true }],
    estimatedReadTimeMinutes: {
      type: Number,
      default: 3,
    },
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

contentSchema.index({ language: 1, difficultyLevel: 1, contentType: 1 });
contentSchema.index(
  { title: 'text', textContent: 'text', tags: 'text' },
  { default_language: 'none', language_override: 'none' }
);

export const Content = mongoose.model('Content', contentSchema);
