import mongoose from 'mongoose';

const spacedRepetitionItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    cardId: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'es', 'fr', 'bn', 'te', 'ta', 'kn', 'ml', 'mr'],
      required: true,
      index: true,
    },
    frontText: {
      type: String,
      required: true,
    },
    backText: {
      type: String,
      required: true,
    },
    phoneticGuide: {
      type: String,
    },
    exampleSentence: {
      type: String,
    },
    category: {
      type: String,
      enum: ['phonics', 'vocabulary', 'sight_words', 'functional_signs', 'sentences'],
      default: 'vocabulary',
    },
    // SuperMemo-2 (SM-2) Parameters
    repetitions: {
      type: Number,
      default: 0,
    },
    intervalDays: {
      type: Number,
      default: 1,
    },
    easeFactor: {
      type: Number,
      default: 2.5,
      min: 1.3,
    },
    lastReviewedAt: {
      type: Date,
      default: null,
    },
    nextReviewDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    masteryLevel: {
      type: String,
      enum: ['learning', 'reviewing', 'mastered'],
      default: 'learning',
    },
  },
  {
    timestamps: true,
  }
);

spacedRepetitionItemSchema.index({ userId: 1, nextReviewDate: 1 });

export const SpacedRepetitionItem = mongoose.model('SpacedRepetitionItem', spacedRepetitionItemSchema);
