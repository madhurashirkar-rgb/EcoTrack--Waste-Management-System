import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock,
  Leaf,
  MapPin,
  Menu,
  Moon,
  Recycle,
  ShieldCheck,
  Sprout,
  Sun,
  Truck,
  X,
} from 'lucide-react';
import EcoTrackLogo from '../components/EcoTrackLogo';
import BackgroundScrollMotion from '../components/BackgroundScrollMotion';
import {
  ScrollDownCue,
  ScrollProgressBar,
  SpotlightCard,
  TaglineReveal,
} from '../components/MotionPrimitives';
import { useTheme } from '../context/ThemeContext';
import { useSmoothScroll } from '../context/SmoothScrollContext';
import api from '../api/client';

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    q: 'How long does it take to submit a waste report?',
    a: 'Under 60 seconds. Attach a photo, pick the waste category, pin your street or GPS coordinates, and send it straight to your district sanitation queue.',
  },
  {
    q: 'How do municipal crews verify that an area is cleaned?',
    a: 'Every ticket moves through four logged stages: Reported, Assigned, In Progress, and Collected. Field teams attach resolution notes and timestamps at each step.',
  },
  {
    q: 'What can I redeem with EcoPoints?',
    a: 'Verified reports earn 25 EcoPoints and hub drop offs earn bonus credits. Points redeem for single day metro transit passes, native tree planting vouchers, and local market coupons.',
  },
  {
    q: 'Which materials require a specialized drop off hub?',
    a: 'Lithium batteries, monitors, motor oil, paints, and bulk construction scrap should go to certified electronics or hazardous waste hubs listed in the Collection Points directory.',
  },
  {
    q: 'Can I preview the platform without creating a permanent account?',
    a: 'Yes. On the sign in screen you can use the one click Citizen Demo or Sanitation Admin access to explore live workflows immediately.',
  },
  {
    q: 'Is my home address shared publicly on the community feed?',
    a: 'No. Only the incident street or landmark and waste category appear on public clearance logs; personal contact details remain private.',
  },
];

const WORKFLOW_STEPS = [
  {
    num: '01',
    title: 'Capture and pin the site',
    desc: 'Upload a photo of overflowing bins or illegal dumping, select the waste stream, and lock in street coordinates.',
    tag: 'Citizen App',
    ticketStatus: 'Reported',
    crewLabel: 'Queued for District Review',
    eta: 'Review in ~15 mins',
  },
  {
    num: '02',
    title: 'Sanitation crew dispatched',
    desc: 'District leads review incoming tickets and route the closest compactor truck or specialized handling crew.',
    tag: 'Sanitation Ops',
    ticketStatus: 'In Progress',
    crewLabel: 'EcoUnit #04 En Route',
    eta: 'Arrival in ~35 mins',
  },
  {
    num: '03',
    title: 'Cleared, audited and rewarded',
    desc: 'Once materials are collected and sorted at certified facilities, your account automatically receives 25 EcoPoints.',
    tag: 'Verified Impact',
    ticketStatus: 'Collected',
    crewLabel: 'Diverted & Verified',
    eta: '+25 EcoPoints Credited',
  },
];

export default function LandingPage({ onOpenAuth, onEnterPortal, isAuthenticated }) {
  const { isDark, toggleTheme } = useTheme();
  const { scrollTo, lenis } = useSmoothScroll();
  const [hubs, setHubs] = useState([]);
  const [openFaq, setOpenFaq] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [legalModal, setLegalModal] = useState(null); // 'privacy' | 'terms' | null
  const pageRef = useRef(null);

  useEffect(() => {
    api.collectionPoints
      .getAll()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          setHubs(res.data.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (mobileMenuOpen || legalModal) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [mobileMenuOpen, legalModal, lenis]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.fromTo(
        '.lp-hero-stagger',
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );

      gsap.fromTo(
        '.lp-benefit-card',
        { y: 20 },
        {
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: '.lp-benefits-grid',
            start: 'top 88%',
            once: true,
          },
        }
      );

      // Sync sticky workflow preview step as user scrolls through steps
      WORKFLOW_STEPS.forEach((_, idx) => {
        ScrollTrigger.create({
          trigger: `#workflow-step-${idx}`,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => setActiveStep(idx),
          onEnterBack: () => setActiveStep(idx),
        });
      });
    },
    { scope: pageRef }
  );

  const primaryAction = () => {
    if (isAuthenticated && onEnterPortal) {
      onEnterPortal();
    } else {
      onOpenAuth('login');
    }
  };

  const navLinks = [
    { label: 'Benefits', href: '#benefits' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Drop Off Hubs', href: '#hubs' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleMobileNav = (href) => {
    setMobileMenuOpen(false);
    setTimeout(() => scrollTo(href), 120);
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-background text-on-surface relative selection:bg-primary/25 selection:text-primary"
    >
      {/* Skip to content accessibility link (landing-page-design B10) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-primary focus:text-on-primary focus:text-xs focus:font-bold"
      >
        Skip to content
      </a>

      <ScrollProgressBar />
      <BackgroundScrollMotion />

      {/* Floating Translucent Navigation */}
      <div className="sticky top-3 z-40 px-4 sm:px-6 pointer-events-none">
        <header className="pointer-events-auto max-w-7xl mx-auto rounded-2xl bg-surface-container-lowest/80 backdrop-blur-xl border border-surface-container-high custom-shadow-card">
          <div className="flex items-center justify-between px-4 sm:px-6 py-2.5">
            <button
              type="button"
              onClick={() => scrollTo('#main-content')}
              className="flex items-center gap-3 text-left rounded-xl"
            >
              <EcoTrackLogo className="w-9 h-9" showText={true} subtitle="Municipal Waste Network" />
            </button>

            <nav
              aria-label="Landing Navigation"
              className="hidden md:flex items-center gap-1 bg-surface-container-low/70 p-1 rounded-xl border border-surface-container-high"
            >
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => scrollTo(link.href)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-surface-container-high bg-surface-container-low hover:border-primary/50 text-on-surface hover:text-primary transition-all duration-300"
                title={isDark ? 'Switch to Bright Mode' : 'Switch to Neon Dark Mode'}
                aria-label="Toggle color theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-300" />
                ) : (
                  <Moon className="w-4 h-4 text-on-surface" />
                )}
              </button>

              {!isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => onOpenAuth('login')}
                    className="hidden sm:inline-flex px-3.5 py-2 rounded-xl border border-surface-container-high bg-surface-container-low hover:border-primary/40 text-xs font-semibold text-on-surface transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAuth('signup')}
                    className="hidden sm:inline-flex neon-btn neon-btn-primary px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container items-center gap-1.5"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onEnterPortal}
                  className="hidden sm:inline-flex neon-btn neon-btn-primary px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container items-center gap-1.5"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-2 rounded-xl border border-surface-container-high bg-surface-container-low text-on-surface hover:text-primary transition-colors"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Full-Height Mobile Navigation Drawer (landing-page-design B7) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-background/95 backdrop-blur-2xl flex flex-col justify-between p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <EcoTrackLogo className="w-9 h-9" showText={true} subtitle="Municipal Waste Network" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl border border-surface-container-high bg-surface-container-low text-on-surface"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-3 my-auto">
            {navLinks.map((link, idx) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleMobileNav(link.href)}
                style={{ animationDelay: `${idx * 60}ms` }}
                className="w-full text-left px-4 py-3.5 rounded-2xl border border-surface-container-high bg-surface-container-lowest text-base font-semibold text-on-surface hover:border-primary/50 hover:text-primary transition-all flex items-center justify-between animate-in slide-in-from-bottom-4 duration-300"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </button>
            ))}
          </nav>

          <div className="space-y-3 pt-4 border-t border-surface-container-high">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                primaryAction();
              }}
              className="neon-btn neon-btn-primary w-full py-3 rounded-xl bg-primary text-on-primary text-sm font-bold flex items-center justify-center gap-2"
            >
              <span>{isAuthenticated ? 'Open Citizen Portal' : 'Report an Issue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main id="main-content" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-20 space-y-16 sm:space-y-24">
        {/* 1. HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 max-w-[680px]">
            <div className="lp-hero-stagger inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/80 border border-primary/30 text-xs font-semibold text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse dark:shadow-[0_0_8px_rgba(0,255,148,0.85)]" />
              <span>Sector 7 Civic Sanitation Network • Active</span>
            </div>

            <h1 className="lp-hero-stagger heading-1 neon-text-gradient">
              Cleaner streets
              <br />
              without the wait
            </h1>

            <p className="lp-hero-stagger body-3 text-on-surface-variant max-w-xl leading-relaxed">
              Snap a photo of overflowing bins or illegal dumping, pin the street location, and follow municipal cleanup crews from dispatch to verified clearance.
            </p>

            <div className="lp-hero-stagger flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={primaryAction}
                className="neon-btn neon-btn-primary px-6 py-3 rounded-xl bg-primary text-on-primary text-sm font-bold hover:bg-primary-container flex items-center gap-2 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>{isAuthenticated ? 'Open Citizen Portal' : 'Report an Issue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <ScrollDownCue
                targetSelector="#how-it-works"
                label="See how dispatch works"
              />
            </div>

            {/* Proof Metrics Row */}
            <div className="lp-hero-stagger grid grid-cols-3 gap-4 pt-4 border-t border-surface-container-high max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-primary">99.4%</div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">Verified clearance</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-tertiary">&lt; 3.2 hrs</div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">Avg crew dispatch</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-on-surface">5 Hubs</div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">Certified drop points</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Live Ticket Dispatch Preview Card */}
          <div className="lg:col-span-5 lp-hero-stagger">
            <SpotlightCard className="bg-surface-container-lowest/95 backdrop-blur-xl rounded-3xl p-6 custom-shadow-modal border border-surface-container-high space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-secondary-container border border-primary/25 text-primary flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-mono font-bold text-primary">#REP-2026-418</div>
                    <div className="text-xs font-semibold text-on-surface">5th St Alley &amp; River Walk</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-secondary-container text-primary border border-primary/30">
                  In Progress
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: '01',
                    title: 'Citizen Report Logged',
                    detail: 'Plastic crates photographed and pinned',
                    done: true,
                  },
                  {
                    step: '02',
                    title: 'Assigned to EcoUnit #04',
                    detail: 'District sanitation compactor dispatched',
                    done: true,
                  },
                  {
                    step: '03',
                    title: 'Crew On Site',
                    detail: 'Estimated clearance within 35 mins',
                    active: true,
                  },
                  {
                    step: '04',
                    title: 'Cleaned & EcoPoints Credited',
                    detail: '+25 EcoPoints awarded on completion',
                    done: false,
                  },
                ].map((row) => (
                  <div
                    key={row.step}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                      row.active
                        ? 'bg-secondary-container/70 border-primary/40'
                        : 'bg-surface-container-low border-surface-container-high'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shrink-0 ${
                        row.active
                          ? 'bg-primary text-on-primary animate-pulse'
                          : row.done
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {row.done ? '✓' : row.step}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface">{row.title}</div>
                      <div className="text-[11px] text-on-surface-variant mt-0.5">{row.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                <span>Reward: +25 EcoPoints</span>
                <button
                  type="button"
                  onClick={primaryAction}
                  className="text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <span>Try Live Portal</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* 2. BENEFITS SECTION */}
        <section id="benefits" className="space-y-8">
          <div className="max-w-[680px] space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              Built For Residents &amp; City Crews
            </span>
            <h2 className="heading-3 text-on-surface">
              Every tool needed to keep streets clean and materials sorted
            </h2>
          </div>

          <div className="lp-benefits-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                Icon: Camera,
                title: '60 Second Photo Reports',
                desc: 'Capture dumping sites or overflowing public bins with automatic street coordinate tagging.',
                accent: 'text-primary bg-secondary-container border-primary/25',
              },
              {
                Icon: ShieldCheck,
                title: 'Live 4 Stage Tracking',
                desc: 'Follow your report from submission through sanitation crew assignment to verified clearance.',
                accent: 'text-tertiary bg-tertiary-fixed border-tertiary/25',
              },
              {
                Icon: MapPin,
                title: 'Drop Off Hub Locator',
                desc: 'Filter nearby recycling centers by plastics, cardboard, lithium batteries, or organic compost.',
                accent: 'text-primary bg-secondary-container border-primary/25',
              },
              {
                Icon: Sprout,
                title: 'Local Civic Rewards',
                desc: 'Redeem verified EcoPoints for city metro transit passes, native tree plantings, and market coupons.',
                accent: 'text-tertiary bg-tertiary-fixed border-tertiary/25',
              },
            ].map((b) => {
              const Icon = b.Icon;
              return (
                <SpotlightCard
                  key={b.title}
                  className="lp-benefit-card bg-surface-container-lowest/90 backdrop-blur-md rounded-3xl p-6 border border-surface-container-high custom-shadow-card flex flex-col justify-between space-y-4"
                >
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${b.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="title-3 text-on-surface">{b.title}</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{b.desc}</p>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </section>

        {/* 3. STICKY SCROLL-DRIVEN STORYTELLING WORKFLOW */}
        <section id="how-it-works" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Sticky Left Preview Panel (Lenis-safe native sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-tertiary">
                Three Step Civic Workflow
              </span>
              <h2 className="heading-3 text-on-surface">
                From street alert to verified diversion
              </h2>
              <p className="body-6 text-on-surface-variant">
                Scroll through each stage to see how reports travel from your phone to municipal clearance.
              </p>
            </div>

            <div className="bg-surface-container-lowest/95 backdrop-blur-xl rounded-3xl p-6 border border-surface-container-high custom-shadow-card space-y-4 transition-all duration-500 ease-expo">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                <span className="text-xs font-mono font-bold text-primary">
                  Stage {WORKFLOW_STEPS[activeStep].num} Preview
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-secondary-container text-primary border border-primary/30">
                  {WORKFLOW_STEPS[activeStep].ticketStatus}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm font-bold text-on-surface">
                  {WORKFLOW_STEPS[activeStep].crewLabel}
                </div>
                <div className="text-xs font-mono text-tertiary">
                  {WORKFLOW_STEPS[activeStep].eta}
                </div>
              </div>

              {/* 3-segment live progress bar */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {WORKFLOW_STEPS.map((st, idx) => (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      idx <= activeStep
                        ? 'bg-primary dark:shadow-[0_0_8px_rgba(0,255,148,0.6)]'
                        : 'bg-surface-container-high'
                    }`}
                    aria-label={`Preview stage ${st.num}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Scrolling Step Cards */}
          <div className="lg:col-span-7 space-y-6">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.num}
                  id={`workflow-step-${idx}`}
                  onMouseEnter={() => setActiveStep(idx)}
                  className={`rounded-3xl p-6 sm:p-8 border transition-all duration-500 ease-expo custom-shadow-card space-y-3 ${
                    isActive
                      ? 'bg-surface-container-lowest border-primary/50 dark:shadow-[0_0_24px_-4px_rgba(0,255,148,0.18)]'
                      : 'bg-surface-container-lowest/80 border-surface-container-high'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono font-bold text-primary">{step.num}</span>
                    <span className="px-3 py-1 rounded-xl bg-surface-container-low border border-surface-container-high text-[11px] font-mono font-semibold text-on-surface-variant">
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="title-2 text-on-surface">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. MANDATORY SCROLL-DRIVEN TAGLINE REVEAL */}
        <TaglineReveal />

        {/* 5. COLLECTION HUBS NETWORK PREVIEW */}
        <section id="hubs" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-[680px]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                Certified Drop Off Directory
              </span>
              <h2 className="heading-3 text-on-surface">Active municipal collection hubs</h2>
            </div>
            <button
              type="button"
              onClick={primaryAction}
              className="self-start sm:self-auto px-4 py-2 rounded-xl border border-primary/40 text-primary text-xs font-bold hover:bg-secondary-container/60 transition-colors flex items-center gap-1.5"
            >
              <span>View All Hubs in Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(hubs.length > 0
              ? hubs
              : [
                  {
                    id: 'cp-1',
                    name: 'GreenCircle Eco Hub',
                    distance: '0.8 km',
                    address: '42 Eco Boulevard, Sector 4',
                    operatingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
                    types: ['Plastic', 'Paper', 'Cardboard', 'Metal Cans'],
                  },
                  {
                    id: 'cp-2',
                    name: 'Metro Electronics & Battery Depot',
                    distance: '1.4 km',
                    address: '109 Tech Park Way, Building C',
                    operatingHours: 'Daily: 9:00 AM - 8:00 PM',
                    types: ['Electronic', 'Batteries', 'Cables'],
                  },
                  {
                    id: 'cp-3',
                    name: 'BioClean Organic Composting Facility',
                    distance: '2.1 km',
                    address: '77 Greenway Lane, East Gardens',
                    operatingHours: 'Mon - Fri: 7:00 AM - 5:00 PM',
                    types: ['Organic', 'Food Scraps', 'Garden Trimmings'],
                  },
                ]
            ).map((hub) => (
              <SpotlightCard
                key={hub.id}
                className="bg-surface-container-lowest/90 backdrop-blur-md rounded-3xl p-6 border border-surface-container-high custom-shadow-card flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-secondary-container text-primary text-[11px] font-semibold border border-primary/25">
                      {hub.distance}
                    </span>
                    <Recycle className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="title-3 text-on-surface pt-1">{hub.name}</h3>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{hub.address}</span>
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-surface-container-high">
                  <div className="flex flex-wrap gap-1.5">
                    {(hub.types || []).slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-lg bg-surface-container-low border border-surface-container-high text-[11px] text-on-surface"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] font-mono text-on-surface-variant flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-tertiary shrink-0" />
                    <span>{hub.operatingHours}</span>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* 6. FAQ ACCORDION */}
        <section id="faq" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              Common Questions
            </span>
            <h2 className="heading-3 text-on-surface">
              How reporting and rewards work in your district
            </h2>
            <p className="body-6 text-on-surface-variant">
              Clear answers on dispatch timelines, accepted drop off items, and neighborhood privacy.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className="bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl border border-surface-container-high overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left gap-4"
                  >
                    <span className="text-sm font-semibold text-on-surface">{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-primary shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-on-surface-variant leading-relaxed border-t border-surface-container-high/60 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. FINAL CTA */}
        <section className="bg-surface-container-lowest/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-surface-container-high custom-shadow-modal text-center space-y-5 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full bg-primary/15 blur-[90px] pointer-events-none"
          />
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="heading-3 neon-text-gradient">
              Ready to report an issue in your neighborhood?
            </h2>
            <p className="body-6 text-on-surface-variant">
              Create your citizen account in seconds or explore the live demo workspace as a resident or sanitation officer.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => (isAuthenticated ? onEnterPortal() : onOpenAuth('signup'))}
                className="neon-btn neon-btn-primary px-6 py-3 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-primary-container flex items-center gap-2"
              >
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Create Citizen Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-6 py-3 rounded-xl border border-surface-container-high bg-surface-container-low hover:border-primary/50 text-xs sm:text-sm font-semibold text-on-surface transition-colors"
                >
                  Sign In / Demo Access
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-surface-container-high bg-surface-container-lowest/80 backdrop-blur-md py-8 text-xs text-on-surface-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-medium">
            <span className="w-7 h-7 rounded-lg bg-secondary-container border border-primary/25 text-primary flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5" />
            </span>
            <span>EcoTrack Municipal Waste Management System &copy; 2026</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button type="button" onClick={() => scrollTo('#benefits')} className="hover:text-primary transition-colors">
              Capabilities
            </button>
            <button type="button" onClick={() => scrollTo('#hubs')} className="hover:text-primary transition-colors">
              Collection Hubs
            </button>
            <button type="button" onClick={() => setLegalModal('privacy')} className="hover:text-primary transition-colors">
              Privacy Policy
            </button>
            <button type="button" onClick={() => setLegalModal('terms')} className="hover:text-primary transition-colors">
              Terms of Service
            </button>
            <button type="button" onClick={() => onOpenAuth('login')} className="text-primary font-semibold hover:underline">
              Portal Access
            </button>
          </div>
        </div>
      </footer>

      {/* Privacy & Terms Modal */}
      {legalModal && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-surface-container-lowest max-w-md w-full rounded-3xl p-6 sm:p-7 custom-shadow-modal border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <h3 className="title-2 text-on-surface">
                {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {legalModal === 'privacy'
                ? 'EcoTrack collects only the street location, waste category, and photo evidence needed to route municipal sanitation teams. Personal email addresses and account details are never shown on public neighborhood clearance logs.'
                : 'EcoTrack is a civic waste reporting and recycling coordination portal. Citizens earn EcoPoints for accurate waste submissions and verified hub drop offs, redeemable exclusively for municipal partner vouchers.'}
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="neon-btn neon-btn-primary px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
