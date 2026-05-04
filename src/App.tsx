import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';

// --- AUTH PAGES ---
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { VerifyEmailPage } from './features/auth/pages/VerifyEmailPage';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/pages/ResetPasswordPage';

// --- LAYOUTS & GUARDS ---
import { AppLayout } from './components/layout/AppLayout';
import { AuthGuard } from './components/layout/AuthGuard'; 

// --- FEATURE PAGES ---
import { ExplorePage } from './features/explore/pages/ExplorePage';
import { Questionnaire } from './features/assessment/pages/questionnaire/Questionnaire';
import { ResultsPage } from './features/assessment/pages/results/ResultsPage';
import { ProfilePage } from './features/profile/pages/ProfilePage';
import { EditProfilePage } from './features/profile/pages/EditProfilePage';

// --- NEW COMMUNITIES PAGES (Moved from Explore) ---
import { CommunityFeedPage } from './features/communities/pages/CommunityFeedPage';
import  { PostDetailsModal } from './features/communities/components/PostDetailsModal'; // NEW: Post Detail Page
import { HomePage } from './features/home/pages/HomePage'; // NEW: Home Page
import { SearchResultsPage } from './features/search/pages/SearchResultsPage'; // NEW: Search Results Page


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          
          {/* ==========================================
              ZONE 1: PUBLIC ROUTES 
              ========================================== */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ==========================================
              ZONE 2: FOCUS MODE (Protected, NO Sidebar)
              ========================================== */}
          <Route element={<AuthGuard />}>
            <Route path="/assessment" element={<Questionnaire />} />
            <Route path="/assessment/results/:id" element={<ResultsPage />} />
          </Route>

          {/* ==========================================
              ZONE 3: DASHBOARD (Protected, HAS Sidebar)
              ========================================== */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/explore" replace />} />
            <Route path="/explore" element={<ExplorePage />} />
            
            {/* NEW COMMUNITIES ROUTES */}
            <Route path="/community/:id" element={<CommunityFeedPage />} />
            <Route path="/post/:postId" element={<PostDetailsModal postId={''} onClose={function (): void {
              throw new Error('Function not implemented.');
            } } isJoined={false} />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />

            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;