import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SmoothScrollProvider, useSmoothScroll } from './context/SmoothScrollContext';
import { ScrollProgressBar, TabTransition } from './components/MotionPrimitives';
import BackgroundScrollMotion from './components/BackgroundScrollMotion';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import ReportWaste from './pages/ReportWaste';
import CollectionPoints from './pages/CollectionPoints';
import History from './pages/History';
import EcoTips from './pages/EcoTips';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import StitchDashboardReference from './components/StitchReference';
import ReportModal from './components/ReportModal';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf } from 'lucide-react';

function MainLayout() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { lenis } = useSmoothScroll();
  const [publicView, setPublicView] = useState('landing'); // 'landing' | 'auth'
  const [authInitialMode, setAuthInitialMode] = useState('login');
  const [showLandingWhenAuthed, setShowLandingWhenAuthed] = useState(false);

  const [activeTab, setActiveTab] = useState(isAdmin ? 'admin' : 'dashboard');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Set default tab when user changes or guard admin from citizen-only tabs
  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'report' || activeTab === 'my-reports') {
        setActiveTab('admin');
      } else if (!activeTab) {
        setActiveTab('admin');
      }
    } else if (activeTab === 'admin') {
      setActiveTab('dashboard');
    }
  }, [isAdmin, user, activeTab]);

  // Reset public landing toggle on sign out
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLandingWhenAuthed(false);
    }
  }, [isAuthenticated]);

  // Reset scroll smoothly & refresh ScrollTrigger markers on view/tab switch
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab, publicView, isAuthenticated, showLandingWhenAuthed, lenis]);

  // Lock/unlock Lenis when ReportModal is open
  useEffect(() => {
    if (!lenis) return;
    if (isReportModalOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isReportModalOpen, lenis]);

  // Public views (Landing Page or Auth Gateway)
  if (!isAuthenticated || !user) {
    if (publicView === 'auth') {
      return (
        <AuthPage
          initialMode={authInitialMode}
          onBack={() => setPublicView('landing')}
        />
      );
    }
    return (
      <LandingPage
        isAuthenticated={false}
        onOpenAuth={(mode = 'login') => {
          setAuthInitialMode(mode);
          setPublicView('auth');
        }}
      />
    );
  }

  // Optional public overview toggle while signed in
  if (showLandingWhenAuthed) {
    return (
      <LandingPage
        isAuthenticated={true}
        onOpenAuth={() => setShowLandingWhenAuthed(false)}
        onEnterPortal={() => setShowLandingWhenAuthed(false)}
      />
    );
  }

  const handleOpenReportDetails = (id) => {
    setSelectedReportId(id);
    setIsReportModalOpen(true);
  };

  const handleCloseReportDetails = () => {
    setIsReportModalOpen(false);
    setSelectedReportId(null);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col pb-24 md:pb-10 relative selection:bg-primary/25 selection:text-primary">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-primary focus:text-on-primary focus:text-xs focus:font-bold"
      >
        Skip to content
      </a>

      {/* Global Scroll Progress Laser & Scroll-Driven Background */}
      <ScrollProgressBar />
      <BackgroundScrollMotion />

      {/* Top Floating Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenOverview={() => setShowLandingWhenAuthed(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-8">
        <TabTransition tabKey={activeTab}>
          <div className="space-y-8">
            {activeTab === 'dashboard' && (
              <Dashboard
                setActiveTab={setActiveTab}
                onSelectReport={handleOpenReportDetails}
              />
            )}

            {activeTab === 'report' && !isAdmin && (
              <ReportWaste
                setActiveTab={setActiveTab}
                onReportCreated={() => {
                  setActiveTab('my-reports');
                }}
              />
            )}

            {(activeTab === 'collection-points' || activeTab === 'map') && (
              <CollectionPoints />
            )}

            {(activeTab === 'my-reports' || activeTab === 'history') && (
              <History
                setActiveTab={setActiveTab}
                onSelectReport={handleOpenReportDetails}
              />
            )}

            {activeTab === 'eco-tips' && <EcoTips />}

            {activeTab === 'profile' && <Profile setActiveTab={setActiveTab} />}

            {activeTab === 'stitch' && <StitchDashboardReference />}

            {activeTab === 'admin' && (
              <AdminPanel onSelectReport={handleOpenReportDetails} />
            )}
          </div>
        </TabTransition>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto border-t border-surface-container-high bg-surface-container-lowest/75 backdrop-blur-md py-6 text-xs text-on-surface-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-medium">
            <span className="w-7 h-7 rounded-lg bg-secondary-container border border-primary/25 text-primary flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5" />
            </span>
            <span>EcoTrack Municipal Waste Management System &copy; 2026</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setShowLandingWhenAuthed(true)}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              Landing Overview
            </button>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary-container/70 text-on-secondary-container rounded-full border border-primary/25">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse dark:shadow-[0_0_8px_rgba(0,255,148,0.85)]" />
              {isAdmin
                ? `Admin Session (${user?.email || 'admin@ecotrack.org'})`
                : `Citizen Session (${user?.name || 'Citizen'})`}
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Modals */}
      <ReportModal
        reportId={selectedReportId}
        isOpen={isReportModalOpen}
        onClose={handleCloseReportDetails}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SmoothScrollProvider>
          <MainLayout />
        </SmoothScrollProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
