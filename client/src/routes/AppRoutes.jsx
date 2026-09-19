import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout.jsx';
import { ProtectedRoute } from '../components/layout/ProtectedRoute.jsx';

import { Home } from '../pages/Home.jsx';
import { Login } from '../pages/auth/Login.jsx';
import { Register } from '../pages/auth/Register.jsx';
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
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/curriculum" element={<CurriculumList />} />
        <Route path="/curriculum/:id" element={<CurriculumDetail />} />
        <Route path="/content" element={<ContentLibrary />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/assessment/:id" element={<AssessmentPage />} />

        {/* Protected Learner Routes */}
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
