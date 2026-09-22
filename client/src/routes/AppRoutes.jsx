import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout.jsx';
import { ProtectedRoute } from '../components/layout/ProtectedRoute.jsx';

import { LandingPage } from '../pages/landing/LandingPage.jsx';
import { OnboardingFlow } from '../pages/onboarding/OnboardingFlow.jsx';
import { InitialAssessment } from '../pages/assessment/InitialAssessment.jsx';
import { Login } from '../pages/auth/Login.jsx';
import { Register } from '../pages/auth/Register.jsx';
import { LearnerDashboard } from '../pages/dashboard/LearnerDashboard.jsx';
import { LearnerProfile } from '../pages/profile/LearnerProfile.jsx';
import { CurriculumList } from '../pages/curriculum/CurriculumList.jsx';
import { CurriculumDetail } from '../pages/curriculum/CurriculumDetail.jsx';
import { ContentLibrary } from '../pages/content/ContentLibrary.jsx';
import { AssessmentPage } from '../pages/assessment/AssessmentPage.jsx';
import { AssessmentResult } from '../pages/assessment/AssessmentResult.jsx';
import { NotFound } from '../pages/NotFound.jsx';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Marketing Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Interactive Duolingo-style Onboarding Questionnaire */}
      <Route path="/onboarding" element={<OnboardingFlow />} />
      <Route path="/get-started" element={<OnboardingFlow />} />

      {/* Age- and Language-Adaptive Initial Diagnostic Assessment */}
      <Route path="/initial-assessment" element={<InitialAssessment />} />

      {/* Standalone Auth Pages (Clean form without left sidebar or top navbar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Internal Application Routes with Layout (Left Sidebar + Header) */}
      <Route element={<Layout />}>
        {/* Main Learner Dashboard with Left Sidebar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LearnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/curriculum" element={<CurriculumList />} />
        <Route path="/curriculum/:id" element={<CurriculumDetail />} />
        <Route path="/content" element={<ContentLibrary />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/assessment/:id" element={<AssessmentPage />} />

        {/* Protected Learner Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <LearnerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment/result/:submissionId"
          element={
            <ProtectedRoute>
              <AssessmentResult />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
