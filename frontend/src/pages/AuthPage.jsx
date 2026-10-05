import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, User, Lock, Mail, MapPin, CheckCircle2, AlertCircle, Eye, EyeOff, Sun, Moon } from 'lucide-react';

export default function AuthPage() {
  const { login, signup } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupLocation, setSignupLocation] = useState('Sector 7, River North');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!loginEmail || !loginPassword) {
        throw new Error('Both email and password are required to sign in.');
      }
      await login(loginEmail, loginPassword);
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!signupEmail || !signupPassword || !signupName) {
        throw new Error('Please fill in your name, email, and password.');
      }
      if (signupPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }
      if (signupPassword !== signupConfirmPassword) {
        throw new Error('Passwords do not match. Please re-enter your password.');
      }

      await signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        location: signupLocation
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try a different email.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setMode('login');
    setLoginEmail('admin@ecotrack.com');
    setLoginPassword('Admin@123');
    setError('');
  };

  const fillCitizenCredentials = () => {
    setMode('login');
    setLoginEmail('user@ecotrack.org');
    setLoginPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8 font-['Inter','Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-surface-container-lowest max-w-4xl w-full rounded-3xl custom-shadow-modal border border-surface-container-high overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        
        {/* LEFT PANEL: Stitch Brand Showcase */}
        <div className="md:w-5/12 bg-surface-bright p-6 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-surface-container-high relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-secondary-fixed opacity-40 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-primary-fixed opacity-30 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-surface-container-lowest p-1 shadow-xs border border-secondary-fixed flex items-center justify-center">
                <img 
                  alt="EcoTrack Logo" 
                  className="w-full h-full object-contain" 
                  src="https://lh3.googleusercontent.com/aida/AEtjO1Wfcx_85b31r1AC0gmoC8qRSugsjtIo51xZml7OPQzEu02kx4VQJgJupnm_Y-Y1_WTOXp1zFlDThrVk4A-yyAR3uYQ3rNDQKBLHjimcBVRuinkzRe9hgDKcILSxwp8xUn77AmPg8KzSLqavR6mDTL16YnxTtDaRtOLJNf4amMpFm-Gn7hIEpsADETBpuQEHQEe-yYN7saUyEEITchcaDTsN0enhFf6K_F3i6UuCP62yK0F8RH_dzM00gZI"
                />
              </div>
              <div>
                <span className="font-bold text-xl text-primary tracking-tight">EcoTrack</span>
                <span className="block text-xs font-semibold text-outline">Municipal Portal</span>
              </div>
            </div>

            {/* Live Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest border border-secondary-fixed text-primary text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Authentication Gateway</span>
            </div>

            <div className="space-y-4 pt-2">
              <h2 className="text-xl font-bold text-on-surface leading-snug">
                Smart Waste Governance & Citizen Rewards
              </h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Access is restricted to verified accounts. Sign in with your email and password, or create an account to start reporting municipal waste.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-on-surface-variant">Instant GPS Sync & 60-Second Reports</p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-on-surface-variant">EcoPoints Vouchers & Sustainable Rewards</p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-on-surface-variant">Live Sanitation Officer Dispatch & Stepper Tracking</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-surface-container-high flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>EcoTrack &copy; 2026</span>
            <span className="font-semibold text-primary">Secure SSL 256-bit</span>
          </div>
        </div>

        {/* RIGHT PANEL: Auth Forms */}
        <div className="md:w-7/12 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Top Bar with Mode indicator and Theme Toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-on-surface-variant">Portal Access</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 px-2.5 rounded-lg border border-surface-container-high bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-primary transition-all flex items-center gap-1.5 shadow-xs text-xs font-semibold group"
                title={isDark ? "Switch to Bright Mode" : "Switch to Dark Mode"}
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                    <span className="text-[11px] text-amber-300">Bright Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
                    <span className="text-[11px]">Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-surface-container-low p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'login'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'signup'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Create Account & Password
              </button>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* MODE 1: LOGIN */}
            {mode === 'login' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-on-surface">Welcome Back</h3>
                  <p className="text-xs text-on-surface-variant">
                    Enter your email and the password you created to log in.
                  </p>
                </div>

                {/* Pre-configured Quick Login Cards */}
                <div className="bg-surface-container-low p-3 rounded-2xl border border-surface-container-high space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
                    One-Click Quick Login
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={fillAdminCredentials}
                      className="p-2.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-left transition-colors flex flex-col"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Sanitation Admin</span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant font-mono mt-0.5">admin@ecotrack.com</span>
                      <span className="text-[10px] text-primary/70 font-mono">Pass: Admin@123</span>
                    </button>

                    <button
                      type="button"
                      onClick={fillCitizenCredentials}
                      className="p-2.5 rounded-xl border border-secondary-fixed-dim bg-secondary-container/30 hover:bg-secondary-container/50 text-left transition-colors flex flex-col"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-secondary">
                        <User className="w-3.5 h-3.5" />
                        <span>Citizen Demo</span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant font-mono mt-0.5">user@ecotrack.org</span>
                      <span className="text-[10px] text-secondary/70 font-mono">Pass: password123</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Email Address <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. admin@ecotrack.com or your email"
                        required
                        className="w-full h-10 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Password <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        className="w-full h-10 pl-9 pr-10 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-xs hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                  >
                    <span>{loading ? 'Verifying...' : 'Sign In to Portal →'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* MODE 2: SIGNUP / CREATE PASSWORD */}
            {mode === 'signup' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-on-surface">Create Your Account</h3>
                    <span className="px-2.5 py-0.5 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold">
                      +100 EcoPoints Bonus
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Create your password now and use it thereafter to log in to EcoTrack.
                  </p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Full Name <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
                      <input
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Alex Rivera"
                        required
                        className="w-full h-10 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Email Address <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="youremail@example.com"
                        required
                        className="w-full h-10 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Sector / City Location
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
                      <input
                        type="text"
                        value={signupLocation}
                        onChange={(e) => setSignupLocation(e.target.value)}
                        placeholder="Sector 7, River North"
                        className="w-full h-10 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Create Password <span className="text-error">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          required
                          className="w-full h-10 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Confirm Password <span className="text-error">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-on-surface-variant" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          required
                          className="w-full h-10 pl-9 pr-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-surface-container-low rounded-xl text-[11px] text-on-surface-variant">
                    💡 This password will be securely stored and used for all your future logins.
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-xs hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                  >
                    <span>{loading ? 'Creating Account...' : 'Create Account & Sign In 🌱'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
