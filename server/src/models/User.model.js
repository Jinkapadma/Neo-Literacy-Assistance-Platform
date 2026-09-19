import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const benchmarkHistorySchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
  },
  benchmarkLevel: {
    type: String,
    enum: ['unassessed', 'beginner', 'elementary', 'intermediate', 'advanced'],
    required: true,
  },
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  readingScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  writingScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  comprehensionScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  feedback: {
    type: String,
  },
  assessedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must not exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'hi', 'es', 'fr', 'bn', 'te', 'ta', 'mr'],
      default: 'en',
      index: true,
    },
    role: {
      type: String,
      enum: ['learner', 'educator', 'admin'],
      default: 'learner',
    },
    proficiencyLevel: {
      type: String,
      enum: ['unassessed', 'beginner', 'elementary', 'intermediate', 'advanced'],
      default: 'unassessed',
      index: true,
    },
    targetSkills: {
      type: [String],
      default: ['reading', 'writing', 'comprehension', 'phonics', 'vocabulary'],
    },
    benchmarkHistory: [benchmarkHistorySchema],
    refreshToken: {
      type: String,
      select: false,
    },
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/bottts/svg?seed=neo-learner',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-save password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password verification method
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
      name: this.name,
      preferredLanguage: this.preferredLanguage,
      proficiencyLevel: this.proficiencyLevel,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    }
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    }
  );
};

export const User = mongoose.model('User', userSchema);
