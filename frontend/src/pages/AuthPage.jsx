import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Shield,
  User,
  Lock,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import EcoTrackLogo from '../components/EcoTrackLogo';

export default function AuthPage({ initialMode = 'login', onBack }) {
  const { login, signup } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mode, setMode] = useState(initialMode);
  const containerRef = useRef(null);

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

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.6 } });
      tl.fromTo('.auth-card', { y: 18, opacity: 0 }, { y: 0, opacity: 1 })
        .fromTo('.auth-feature', { x: -12, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.08 }, '-=0.4');
    },
    { scope: containerRef }
  );

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
        location: signupLocation,
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try a different email.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setMode('login');
    setLoginEmail('admin@ecotrack.org');
    setLoginPassword('admin123');
    setError('');
  };

  const fillCitizenCredentials = () => {
    setMode('login');
    setLoginEmail('user@ecotrack.org');
    setLoginPassword('password123');
    setError('');
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden"
    >
      {/* Background Architectural Grid & Bioluminescent Orbs */}
      <div aria-hidden="true" className="fixed inset-0 eco-grid-bg pointer-events-none" />
      <div
        aria-hidden="true"
        className="auth-orb fixed top-[-120px] left-[-120px] w-[420px] h-[420px] rounded-full bg-primary/15 blur-[130px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="auth-orb fixed bottom-[-120px] right-[-120px] w-[420px] h-[420px] rounded-full bg-tertiary/15 blur-[130px] pointer-events-none"
      />

      <div className="auth-card relative z-10 bg-surface-container-lowest/95 backdrop-blur-xl max-w-5xl w-full rounded-3xl custom-shadow-modal border border-surface-container-high overflow-hidden flex flex-col md:flex-row">
        {/* LEFT PANEL: Eco-Tech Telemetry Showcase */}
        <div className="md:w-5/12 bg-surface-container-low p-6 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-surface-container-high relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-tertiary/15 blur-3xl pointer-events-none"
          />

          <div className="relative z-10 space-y-6">
            <EcoTrackLogo className="w-11 h-11" showText={true} subtitle="Waste Governance" />

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/80 border border-primary/30 text-primary text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse dark:shadow-[0_0_8px_rgba(0,255,148,0.8)]" />
              <span>Live Civic Gateway</span>
            </div>

            <div className="space-y-3 pt-1">
              <h1 className="heading-4 neon-text-gradient">
                Smart Waste Governance &amp; Citizen Rewards
              </h1>
              <p className="body-6 text-on-surface-variant">
                Sign in with a verified citizen or municipal officer account to monitor cleanups, dispatch crews, and earn EcoPoints.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-2">
              {[
                'Instant GPS sync & 60 second waste reporting',
                'Redeemable EcoPoints vouchers & transit perks',
                'Live sanitation crew dispatch & 4 stage audit trail',
              ].map((feat) => (
                <div key={feat} className="auth-feature flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary-container border border-primary/30 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{feat}</p>
                </div>
              ))}
            </div>

            {/* Mini Telemetry Strip */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high">
                <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  Clearance Rate
                </div>
                <div className="text-lg font-mono font-bold text-primary mt-0.5">99.4%</div>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high">
                <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  Avg Response
                </div>
                <div className="text-lg font-mono font-bold text-tertiary mt-0.5">&lt; 3.2h</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-surface-container-high flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>EcoTrack &copy; 2026</span>
            <span className="font-mono font-semibold text-primary">TLS 256-bit Secured</span>
          </div>
        </div>

        {/* RIGHT PANEL: Auth Forms */}
        <div className="md:w-7/12 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-surface-container-high bg-surface-container-low hover:border-primary/50 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Overview</span>
                  </button>
                )}
                <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Portal Access</span>
                </span>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-xl border border-surface-container-high bg-surface-container-low hover:border-primary/50 text-on-surface hover:text-primary transition-all duration-300 flex items-center gap-1.5 text-xs font-semibold group"
                title={isDark ? 'Switch to Bright Mode' : 'Switch to Neon Dark Mode'}
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform duration-300" />
                    <span>Bright Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-on-surface group-hover:-rotate-12 transition-transform duration-300" />
                    <span>Neon Dark</span>
                  </>
                )}
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-surface-container-low p-1 rounded-xl border border-surface-container-high mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  mode === 'login'
                    ? 'bg-surface-container-lowest text-primary border border-primary/30 shadow-card'
                    : 'text-on-surface-variant hover:text-on-surface border border-transparent'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  mode === 'signup'
                    ? 'bg-surface-container-lowest text-primary border border-primary/30 shadow-card'
                    : 'text-on-surface-variant hover:text-on-surface border border-transparent'
                }`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-error-container border border-error/40 text-on-error-container rounded-xl text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {mode === 'login' && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h2 className="heading-6 text-on-surface">Welcome Back</h2>
                  <p className="text-xs text-on-surface-variant">
                    Sign in with your registered email or test a demo role below.
                  </p>
                </div>

                {/* Quick Login Cards */}
                <div className="bg-surface-container-low p-3.5 rounded-2xl border border-surface-container-high space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
                    One Click Quick Access
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={fillAdminCredentials}
                      className="p-3 rounded-xl border border-primary/30 bg-secondary-container/40 hover:bg-secondary-container/70 hover:border-primary/60 text-left transition-all duration-300 flex flex-col"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Sanitation Admin</span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant font-mono mt-1">
                        admin@ecotrack.org
                      </span>
                      <span className="text-[10px] text-primary/80 font-mono">Pass: admin123</span>
                    </button>

                    <button
                      type="button"
                      onClick={fillCitizenCredentials}
                      className="p-3 rounded-xl border border-tertiary/30 bg-tertiary-fixed/40 hover:bg-tertiary-fixed/70 hover:border-tertiary/60 text-left transition-all duration-300 flex flex-col"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-tertiary">
                        <User className="w-3.5 h-3.5" />
                        <span>Citizen Demo</span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant font-mono mt-1">
                        user@ecotrack.org
                      </span>
                      <span className="text-[10px] text-tertiary/80 font-mono">Pass: password123</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">
                      Email Address <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-on-surface-variant" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="admin@ecotrack.org or your email"
                        required
                        className="w-full h-10 pl-10 pr-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">
                      Password <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-on-surface-variant" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        className="w-full h-10 pl-10 pr-10 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="neon-btn neon-btn-primary w-full h-11 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
                  >
                    <span>{loading ? 'Verifying Credentials...' : 'Sign In to Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="heading-6 text-on-surface">Create Your Account</h2>
                    <span className="px-2.5 py-0.5 bg-secondary-container text-primary border border-primary/30 rounded-full text-[11px] font-semibold">
                      +100 EcoPoints Bonus
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Register as a verified citizen to track reports and claim local sustainability rewards.
                  </p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Full Name <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3 text-on-surface-variant" />
                      <input
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Alex Rivera"
                        required
                        className="w-full h-10 pl-10 pr-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Email Address <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-on-surface-variant" />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="youremail@example.com"
                        required
                        className="w-full h-10 pl-10 pr-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1">
                      Sector or City Location
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-on-surface-variant" />
                      <input
                        type="text"
                        value={signupLocation}
                        onChange={(e) => setSignupLocation(e.target.value)}
                        placeholder="Sector 7, River North"
                        className="w-full h-10 pl-10 pr-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Create Password <span className="text-error">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3 text-on-surface-variant" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          required
                          className="w-full h-10 pl-10 pr-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Confirm Password <span className="text-error">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3 text-on-surface-variant" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          required
                          className="w-full h-10 pl-10 pr-3 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="neon-btn neon-btn-primary w-full h-11 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
                  >
                    <span>{loading ? 'Creating Account...' : 'Create Account & Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
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
