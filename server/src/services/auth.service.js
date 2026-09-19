import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.js';

export class AuthService {
  static async register({ name, email, password, preferredLanguage, role, targetSkills }) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists.');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      preferredLanguage: preferredLanguage || 'en',
      role: role || 'learner',
      targetSkills: targetSkills || ['reading', 'writing', 'comprehension', 'phonics', 'vocabulary'],
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        role: user.role,
        proficiencyLevel: user.proficiencyLevel,
        targetSkills: user.targetSkills,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshToken');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account is currently disabled. Please contact support.');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        role: user.role,
        proficiencyLevel: user.proficiencyLevel,
        targetSkills: user.targetSkills,
        avatar: user.avatar,
        benchmarkHistory: user.benchmarkHistory,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshAccessToken(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw ApiError.unauthorized('Refresh token is required.');
    }

    try {
      const decoded = jwt.verify(incomingRefreshToken, env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded._id).select('+refreshToken');

      if (!user) {
        throw ApiError.unauthorized('Invalid refresh token.');
      }

      if (user.refreshToken !== incomingRefreshToken) {
        throw ApiError.unauthorized('Refresh token has been revoked or reused.');
      }

      const newAccessToken = user.generateAccessToken();
      const newRefreshToken = user.generateRefreshToken();

      user.refreshToken = newRefreshToken;
      await user.save({ validateBeforeSave: false });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          role: user.role,
          proficiencyLevel: user.proficiencyLevel,
        },
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw ApiError.unauthorized('Invalid or expired refresh token.');
    }
  }

  static async logout(userId) {
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: { refreshToken: 1 },
      },
      { new: true }
    );
    return true;
  }

  static async getProfile(userId) {
    const user = await User.findById(userId).populate({
      path: 'benchmarkHistory.assessmentId',
      select: 'title code type language targetLevel',
    });

    if (!user) {
      throw ApiError.notFound('User profile not found.');
    }

    return user;
  }

  static async updateProfile(userId, updateData) {
    const allowedFields = ['name', 'preferredLanguage', 'targetSkills', 'avatar', 'proficiencyLevel'];
    const filteredUpdate = {};

    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        filteredUpdate[key] = updateData[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: filteredUpdate }, { new: true, runValidators: true });

    if (!updatedUser) {
      throw ApiError.notFound('User not found.');
    }

    return updatedUser;
  }
}
