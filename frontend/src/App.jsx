import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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

function MainLayout() {
  const { user, isAuthenticated, isAdmin } = useAuth();
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

  // MANDATORY AUTH GATE: If no user is signed in, display the Auth Portal
  if (!isAuthenticated || !user) {
    return <AuthPage />;
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
    <div className="min-h-screen bg-background text-on-surface flex flex-col pb-20 md:pb-10 selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area with Tab Panels */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
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

        {activeTab === 'eco-tips' && (
          <EcoTips />
        )}

        {activeTab === 'profile' && (
          <Profile setActiveTab={setActiveTab} />
        )}

        {activeTab === 'stitch' && (
          <StitchDashboardReference />
        )}

        {activeTab === 'admin' && (
          <AdminPanel onSelectReport={handleOpenReportDetails} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-container-high bg-surface-container-lowest/80 py-6 text-xs text-on-surface-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-base leading-none">🌿</span>
            <span>EcoTrack – Municipal Waste Management System &copy; 2026</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-secondary-container text-on-secondary-container rounded-lg border border-secondary-fixed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              {isAdmin ? 'Admin Session (admin@ecotrack.com)' : `Citizen Session (${user.name})`}
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
        <MainLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
