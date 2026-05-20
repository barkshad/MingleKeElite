import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/Landing';
import { AuthPage } from './pages/Auth';
import { ActivationPage } from './pages/Activation';
import { BottomNav } from './components/layout/BottomNav';
import { AnimatePresence } from 'framer-motion';
import { SmoothScroll } from './components/layout/SmoothScroll';

import { DiscoverPage } from './pages/Discover';
import { MatchesPage } from './pages/Matches';
import { ChatPage } from './pages/Chat';
import { ProfilePage } from './pages/Profile';
import { ReferralPage } from './pages/Referral';
import { OnboardingPage } from './pages/Onboarding';

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05000a]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/discover" /> : <LandingPage />} />
          <Route path="/auth" element={user ? <Navigate to="/discover" /> : <AuthPage />} />
          
          {/* Core App Routes (Protected) */}
          {user ? (
            <>
              <Route 
                path="/activation" 
                element={profile?.isActivated ? <Navigate to="/onboarding" /> : <ActivationPage />} 
              />

              <Route 
                path="/onboarding" 
                element={
                  !profile?.isActivated ? <Navigate to="/activation" /> : 
                  profile?.onboardingCompleted ? <Navigate to="/discover" /> : 
                  <OnboardingPage />
                } 
              />
              
              <Route 
                path="/discover" 
                element={
                  !profile?.isActivated ? <Navigate to="/activation" /> : 
                  !profile?.onboardingCompleted ? <Navigate to="/onboarding" /> : (
                    <div className="pb-24">
                      <DiscoverPage />
                      <footer className="fixed bottom-24 left-6 right-6 h-12 bg-gradient-to-r from-primary/10 to-secondary/10 border border-white/10 rounded-2xl flex items-center px-6 overflow-hidden z-20 pointer-events-none backdrop-blur-md">
                        <div className="flex items-center gap-3 whitespace-nowrap animate-pulse">
                          <div className="w-2 h-2 rounded-full bg-primary shadow-neon" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Premium Activation Live view • Nairobi Region Hot</span>
                          <span className="mx-4 text-white/20">•</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Elite User@291 matched recently</span>
                        </div>
                      </footer>
                      <BottomNav />
                    </div>
                  )
                } 
              />
              
              <Route 
                path="/matches" 
                element={
                  !profile?.isActivated ? <Navigate to="/activation" /> : 
                  !profile?.onboardingCompleted ? <Navigate to="/onboarding" /> : (
                    <div className="pb-24">
                      <MatchesPage />
                      <BottomNav />
                    </div>
                  )
                } 
              />

              <Route 
                path="/chat/:matchId" 
                element={
                  !profile?.isActivated ? <Navigate to="/activation" /> : 
                  !profile?.onboardingCompleted ? <Navigate to="/onboarding" /> : (
                      <ChatPage />
                  )
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <div className="pb-24">
                    <ProfilePage />
                    <BottomNav />
                  </div>
                } 
              />

              <Route 
                path="/referral" 
                element={
                  <div className="pb-24">
                    <ReferralPage />
                    <BottomNav />
                  </div>
                } 
              />

              <Route path="*" element={<Navigate to="/discover" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SmoothScroll>
          <AppRoutes />
        </SmoothScroll>
      </AuthProvider>
    </Router>
  );
}

