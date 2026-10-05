import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const { login, signup, switchDemoRole } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('user@ecotrack.org');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Sector 7, River North');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup({ name, email, password, location });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setRole = (role) => {
    if (role === 'citizen') {
      setEmail('user@ecotrack.org');
      setPassword('password123');
    } else {
      setEmail('admin@ecotrack.com');
      setPassword('Admin@123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest max-w-4xl w-full rounded-2xl custom-shadow-modal border border-surface-container-high overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
        
        {/* Left Panel: Stitch Brand Showcase */}
        <div className="md:w-5/12 bg-surface-bright p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-surface-container-high relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-secondary-fixed opacity-40 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-primary-fixed opacity-30 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container-lowest p-1 shadow-xs border border-secondary-fixed flex items-center justify-center">
                <img 
                  alt="EcoTrack Logo" 
                  className="w-full h-full object-contain" 
                  src="https://lh3.googleusercontent.com/aida/AEtjO1Wfcx_85b31r1AC0gmoC8qRSugsjtIo51xZml7OPQzEu02kx4VQJgJupnm_Y-Y1_WTOXp1zFlDThrVk4A-yyAR3uYQ3rNDQKBLHjimcBVRuinkzRe9hgDKcILSxwp8xUn77AmPg8KzSLqavR6mDTL16YnxTtDaRtOLJNf4amMpFm-Gn7hIEpsADETBpuQEHQEe-yYN7saUyEEITchcaDTsN0enhFf6K_F3i6UuCP62yK0F8RH_dzM00gZI"
                />
              </div>
              <div>
                <span className="font-bold text-lg text-primary tracking-tight">EcoTrack</span>
                <span className="block text-[11px] text-outline">Municipal Portal</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest border border-secondary-fixed text-primary text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Live Sensor Grid Connected</span>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-base">verified</span>
                <p className="text-xs text-on-surface-variant">Real-time Telemetry & GPS Verification</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-base">stars</span>
                <p className="text-xs text-on-surface-variant">Automated Citizen EcoPoints & Rewards</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-base">local_shipping</span>
                <p className="text-xs text-on-surface-variant">Audited Municipal Cleanup Dispatch</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-surface-container-high text-[11px] text-on-surface-variant">
            EcoTrack Waste Governance System &copy; 2026
          </div>
        </div>

        {/* Right Panel: Authentication Form */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 p-1 bg-surface-container rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  mode === 'login' ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold' : 'text-on-surface-variant'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  mode === 'signup' ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold' : 'text-on-surface-variant'
                }`}
              >
                Register
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-xs">
              {error}
            </div>
          )}

          {/* Demo account quick switch */}
          {mode === 'login' && (
            <div className="mb-4 p-3 bg-surface-container-low rounded-xl border border-surface-container-high">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                Quick Demo Role
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRole('citizen')}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold border text-center transition-all ${
                    email === 'user@ecotrack.org'
                      ? 'bg-secondary-container border-primary text-on-secondary-container'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant'
                  }`}
                >
                  🌱 Citizen
                </button>
                <button
                  type="button"
                  onClick={() => setRole('officer')}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold border text-center transition-all ${
                    email === 'admin@ecotrack.com' || email === 'admin@ecotrack.org'
                      ? 'bg-primary text-on-primary border-primary'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant'
                  }`}
                >
                  🛡️ Sanitation Officer
                </button>
              </div>

              <div className="mt-2.5 pt-2 border-t border-surface-container-high/60 flex flex-col gap-1 text-[11px] text-on-surface-variant">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-on-surface">Officer (Admin):</span>
                  <span className="font-mono bg-surface-container px-1.5 py-0.5 rounded text-primary">admin@ecotrack.com / Admin@123</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-on-surface">Citizen:</span>
                  <span className="font-mono bg-surface-container px-1.5 py-0.5 rounded text-primary">user@ecotrack.org / password123</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    required
                    className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant rounded-md text-xs text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Sector / Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Sector 7, River North"
                    required
                    className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant rounded-md text-xs text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@ecotrack.org"
                required
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant rounded-md text-xs text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-10 px-3 bg-surface-container-low border border-outline-variant rounded-md text-xs text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Portal' : 'Create EcoTrack Account'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
