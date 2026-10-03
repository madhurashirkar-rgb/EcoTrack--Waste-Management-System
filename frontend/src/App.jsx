import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import ReportWaste from './pages/ReportWaste';
import CollectionPoints from './pages/CollectionPoints';
import History from './pages/History';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import ReportModal from './components/ReportModal';
import LoginModal from './components/LoginModal';
import { Leaf, Code, ExternalLink } from 'lucide-react';

function MainLayout() {
  const { isAuthModalOpen, setIsAuthModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleOpenReportDetails = (id) => {
    setSelectedReportId(id);
    setIsReportModalOpen(true);
  };

  const handleCloseReportDetails = () => {
    setIsReportModalOpen(false);
    setSelectedReportId(null);
  };

  return (
    <div className="min-h-screen bg-[#f6fbf7] text-gray-800 flex flex-col selection:bg-emerald-100 selection:text-emerald-900 pb-20 md:pb-8">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            onSelectReport={handleOpenReportDetails}
          />
        )}

        {activeTab === 'report' && (
          <ReportWaste
            setActiveTab={setActiveTab}
            onReportCreated={(rep) => {
              // Option to directly view or switch
            }}
          />
        )}

        {activeTab === 'map' && <CollectionPoints />}

        {activeTab === 'history' && (
          <History
            setActiveTab={setActiveTab}
            onSelectReport={handleOpenReportDetails}
          />
        )}

        {activeTab === 'profile' && <Profile setActiveTab={setActiveTab} />}

        {activeTab === 'admin' && (
          <AdminPanel onSelectReport={handleOpenReportDetails} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-emerald-100 bg-white/60 py-6 text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>EcoTrack – Waste Management System &copy; 2026</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              <Code className="w-3.5 h-3.5" />
              Stitch API Ready (CORS Enabled)
            </span>
            <a
              href="http://localhost:5000/api"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:underline flex items-center gap-1"
            >
              REST Docs <ExternalLink className="w-3 h-3" />
            </a>
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

      <LoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
