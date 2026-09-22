import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';

const ProgressContext = createContext(null);

const STORAGE_KEY = 'neoread_learner_progress_v2';

const initialProgressState = {
  totalXp: 0,
  streakDays: 0,
  completedLessons: [], // array of lesson IDs
  completedLessonsCount: 0,
  totalLessonsCount: 20,
  completedModules: [],
  completedGamesCount: 0,
  completedReviewsCount: 0,
  assessmentsCompletedCount: 0,
  lastActiveDate: null,
};

export const ProgressProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return initialProgressState;
  });

  // Sync state changes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  // Sync with user account if available
  useEffect(() => {
    if (user?.gamification) {
      setProgress(prev => ({
        ...prev,
        totalXp: user.gamification.totalXp ?? prev.totalXp,
        streakDays: user.gamification.streakDays ?? prev.streakDays,
      }));
    }
  }, [user]);

  const completeLesson = (lessonId, moduleId) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const updatedLessons = [...prev.completedLessons, lessonId];
      const xpGained = 20;
      const updatedXp = prev.totalXp + xpGained;
      const updatedStreak = prev.streakDays === 0 ? 1 : prev.streakDays;

      return {
        ...prev,
        completedLessons: updatedLessons,
        completedLessonsCount: updatedLessons.length,
        totalXp: updatedXp,
        streakDays: updatedStreak,
        lastActiveDate: new Date().toISOString(),
      };
    });
  };

  const recordGameWin = (gameType, xpEarned = 25) => {
    setProgress(prev => {
      const updatedXp = prev.totalXp + xpEarned;
      const updatedGames = prev.completedGamesCount + 1;
      const updatedStreak = prev.streakDays === 0 ? 1 : prev.streakDays;

      return {
        ...prev,
        totalXp: updatedXp,
        completedGamesCount: updatedGames,
        streakDays: updatedStreak,
        lastActiveDate: new Date().toISOString(),
      };
    });
  };

  const recordSpacedReview = (count = 1) => {
    setProgress(prev => ({
      ...prev,
      totalXp: prev.totalXp + count * 5,
      completedReviewsCount: prev.completedReviewsCount + count,
      streakDays: prev.streakDays === 0 ? 1 : prev.streakDays,
      lastActiveDate: new Date().toISOString(),
    }));
  };

  const recordAssessmentComplete = (score = 80) => {
    setProgress(prev => ({
      ...prev,
      totalXp: prev.totalXp + 50,
      assessmentsCompletedCount: prev.assessmentsCompletedCount + 1,
      streakDays: prev.streakDays === 0 ? 1 : prev.streakDays,
      lastActiveDate: new Date().toISOString(),
    }));
  };

  const resetProgress = () => {
    setProgress(initialProgressState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const curriculumPercentage = Math.min(
    100,
    Math.round((progress.completedLessonsCount / Math.max(1, progress.totalLessonsCount)) * 100)
  );

  return (
    <ProgressContext.Provider
      value={{
        progress,
        curriculumPercentage,
        completeLesson,
        recordGameWin,
        recordSpacedReview,
        recordAssessmentComplete,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    // Provide safe defaults starting at zero
    return {
      progress: initialProgressState,
      curriculumPercentage: 0,
      completeLesson: () => {},
      recordGameWin: () => {},
      recordSpacedReview: () => {},
      recordAssessmentComplete: () => {},
      resetProgress: () => {},
    };
  }
  return context;
};
