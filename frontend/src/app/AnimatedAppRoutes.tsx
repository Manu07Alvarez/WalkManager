import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { AnimatedPage } from './AnimatedPage';
import { AppLayout } from './AppLayout';
import { LandingPage } from './LandingPage';
import { SearchWalkersPage } from '../features/search/pages/SearchWalkersPage';
import { BookingsPage } from '../features/bookings/pages/BookingsPage';
import { ReviewsPage } from '../features/reviews/pages/ReviewsPage';
import { ModerationPage } from '../features/moderation/pages/ModerationPage';
import { AuthPage } from '../features/auth/pages/AuthPage';
import { ProfilePage } from '../features/walker-profile/pages/ProfilePage';

export const AnimatedAppRoutes: React.FC = () => {
  const location = useLocation();

  // Root level routes (Landing and Auth) vs Nested Layout routes
  const isLayoutRoute = ['/search', '/bookings', '/profile', '/reviews', '/moderation'].includes(location.pathname);

  return (
    <AnimatePresence mode="wait">
      {!isLayoutRoute && location.pathname === '/' && (
        <AnimatedPage key="landing">
          <LandingPage />
        </AnimatedPage>
      )}

      {!isLayoutRoute && location.pathname === '/auth' && (
        <AnimatedPage key="auth">
          <AuthPage />
        </AnimatedPage>
      )}

      {isLayoutRoute && (
        <Routes key="app-layout" location={location}>
          <Route element={<AppLayout />}>
            <Route path="/search"     element={<SearchWalkersPage />} />
            <Route path="/bookings"   element={<BookingsPage />} />
            <Route path="/profile"    element={<ProfilePage />} />
            <Route path="/reviews"    element={<ReviewsPage />} />
            <Route path="/moderation" element={<ModerationPage />} />
            <Route path="/app"        element={<Navigate to="/search" replace />} />
          </Route>
        </Routes>
      )}

      {!isLayoutRoute && location.pathname !== '/' && location.pathname !== '/auth' && (
        <Routes key="fallback" location={location}>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </AnimatePresence>
  );
};
