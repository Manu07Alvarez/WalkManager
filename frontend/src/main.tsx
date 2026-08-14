import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './app/AppShell';
import { AppLayout } from './app/AppLayout';
import { LandingPage } from './app/LandingPage';
import { SearchWalkersPage } from './features/search/pages/SearchWalkersPage';
import { BookingsPage } from './features/bookings/pages/BookingsPage';
import { ReviewsPage } from './features/reviews/pages/ReviewsPage';
import { ModerationPage } from './features/moderation/pages/ModerationPage';
import { AuthPage } from './features/auth/pages/AuthPage';
import { ProfilePage } from './features/walker-profile/pages/ProfilePage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppShell>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/auth" element={<AuthPage />} />

        {/* App with shared layout */}
        <Route element={<AppLayout />}>
          <Route path="/search"      element={<SearchWalkersPage />} />
          <Route path="/bookings"    element={<BookingsPage />} />
          <Route path="/profile"     element={<ProfilePage />} />
          <Route path="/reviews"     element={<ReviewsPage />} />
          <Route path="/moderation"  element={<ModerationPage />} />
          <Route path="/app"         element={<Navigate to="/search" replace />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  </React.StrictMode>
);
