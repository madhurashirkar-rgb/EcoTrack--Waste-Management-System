import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Shield,
  PlusCircle,
  Navigation,
  Camera,
  MapPin,
  ClipboardList,
  Recycle,
  ArrowRight,
  Zap,
  CheckCircle2,
  Truck,
  Leaf,
  TrendingUp,
  Clock,
  BarChart2,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import {
  AnimatedCounter,
  ScrollDownCue,
  SpotlightCard,
  TaglineReveal,
} from '../components/MotionPrimitives';

gsap.registerPlugin(ScrollTrigger);

export default function Dashboard({ setActiveTab, onSelectReport }) {
  const { user, isAdmin, ecoPoints } = useAuth();
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [communityReports, setCommunityReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const rootRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [statsRes, userReportsRes, allReportsRes] = await Promise.all([
          api.dashboard.getStats(),
          api.reports.getAll(),
          api.reports.getAll(null, true),
        ]);
        if (!mounted) return;
        setStats(statsRes?.data || null);
        setReports(Array.isArray(userReportsRes?.data) ? userReportsRes.data : []);
        setCommunityReports(Array.isArray(allReportsRes?.data) ? allReportsRes.data : []);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
          setTimeout(() => ScrollTrigger.refresh(), 100);
        }
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.fromTo(
        '.hero-stagger',
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );

      gsap.to('.hero-orb', {
        y: -12,
        x: 8,
        repeat: -1,
        yoyo: true,
        duration: 4.5,
        ease: 'sine.inOut',
      });

      gsap.fromTo(
        '.kpi-card',
        { y: 18 },
        {
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: '.kpi-grid',
            start: 'top 92%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.action-card',
        { y: 20 },
        {
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: '.actions-grid',
            start: 'top 92%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.stream-bar-fill',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: '.stream-breakdown',
            start: 'top 92%',
            once: true,
          },
        }
      );
    },
    { scope: rootRef }
  );

  // Derived real metrics
  const userName = user?.name ? user.name.split(' ')[0] : isAdmin ? 'Admin' : 'Alex';
  const reportsCount = stats?.reportsSubmitted ?? reports.length;
  const collectedCount =
    stats?.wasteCollected ??
    reports.filter((r) => (r.status || '').toLowerCase() === 'collected').length;
  const activeReportsCount = reports.filter((r) => {
    const st = (r.status || '').toLowerCase();
    return st !== 'collected' && st !== 'resolved';
  }).length;
  const divertedKg = collectedCount > 0 ? collectedCount * 28 : reportsCount > 0 ? reportsCount * 12 : 24;
  const goalPct = Math.min(100, Math.max(12, Math.round((divertedKg / 100) * 100)));

  useGSAP(
    () => {
      if (!progressBarRef.current) return;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const targetScale = goalPct / 100;
      if (prefersReduced) {
        gsap.set(progressBarRef.current, { scaleX: targetScale });
        return;
      }
      gsap.fromTo(
        progressBarRef.current,
        { scaleX: 0 },
        {
          scaleX: targetScale,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: progressBarRef.current,
            start: 'top 95%',
            once: true,
          },
        }
      );
    },
    { scope: rootRef, dependencies: [goalPct, isAdmin] }
  );

  const rewardHint =
    ecoPoints >= 450
      ? 'Eligible for all EcoRewards vouchers'
      : ecoPoints >= 300
      ? `${450 - ecoPoints} pts away from Market Coupon`
      : ecoPoints >= 250
      ? `${300 - ecoPoints} pts away from Transit Pass`
      : `${250 - ecoPoints} pts away from Tree Voucher`;

  const citizenLevel =
    ecoPoints >= 600 ? 'Level 4' : ecoPoints >= 300 ? 'Level 3' : ecoPoints >= 150 ? 'Level 2' : 'Level 1';

  const feedItems = (communityReports.length > 0 ? communityReports : reports).slice(0, 4);

  // Material stream shares computed from community reports
  const allForStream = communityReports.length > 0 ? communityReports : reports;
  const streamCounts = {
    plastic: allForStream.filter((r) => /plastic|bottle|dry/i.test(r.wasteType || '')).length || 2,
    organic: allForStream.filter((r) => /organic|wet|food/i.test(r.wasteType || '')).length || 1,
    ewaste: allForStream.filter((r) => /electronic|e-waste|hazard|battery/i.test(r.wasteType || '')).length || 1,
    bulky: allForStream.filter((r) => /bulky|metal|glass/i.test(r.wasteType || '')).length || 1,
  };
  const totalStream = Object.values(streamCounts).reduce((a, b) => a + b, 0) || 1;
  const streamMetrics = [
    {
      label: 'Plastics & Dry Recyclables',
      pct: Math.round((streamCounts.plastic / totalStream) * 100),
      colorClass: 'bg-primary',
    },
    {
      label: 'Organic & Compost Streams',
      pct: Math.round((streamCounts.organic / totalStream) * 100),
      colorClass: 'bg-secondary',
    },
    {
      label: 'Electronics & Batteries',
      pct: Math.round((streamCounts.ewaste / totalStream) * 100),
      colorClass: 'bg-tertiary',
    },
    {
      label: 'Glass, Metal & Bulky',
      pct: Math.max(
        5,
        100 -
          Math.round((streamCounts.plastic / totalStream) * 100) -
          Math.round((streamCounts.organic / totalStream) * 100) -
          Math.round((streamCounts.ewaste / totalStream) * 100)
      ),
      colorClass: 'bg-amber-400',
    },
  ];

  const formatRelativeDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.max(1, Math.floor(diffMs / 60000));
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div ref={rootRef} className="space-y-8">
      {/* 1. Greeting & Operations Banner */}
      <section className="relative bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 custom-shadow-card border border-surface-container-high overflow-hidden">
        <div
          aria-hidden="true"
          className="hero-orb absolute -top-24 -right-20 w-80 h-80 rounded-full bg-primary/15 blur-[90px] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="hero-orb absolute -bottom-28 left-1/3 w-72 h-72 rounded-full bg-tertiary/10 blur-[90px] pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-[680px]">
            <div className="hero-stagger inline-flex items-center gap-2.5 bg-secondary-container/80 border border-primary/30 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse dark:shadow-[0_0_8px_rgba(0,255,148,0.85)]" />
              <span>
                {isAdmin
                  ? `Municipal Command Center • ${user?.location || 'Central Sanitation Office'}`
                  : `Service Area • ${user?.location || 'Sector 7, River North'}`}
              </span>
            </div>

            <h1 className="hero-stagger heading-2 neon-text-gradient">
              {isAdmin ? (
                <>
                  Sanitation Command
                  <br />
                  Citywide Dispatch Overview
                </>
              ) : (
                <>
                  Good day, {userName}
                  <br />
                  Keep your neighborhood clean
                </>
              )}
            </h1>

            <p className="hero-stagger body-3 text-on-surface-variant max-w-xl">
              {isAdmin
                ? 'Review incoming resident waste reports, assign field sanitation units, and verify completed clearances.'
                : 'Monitor local pickup activity, locate certified drop off depots, or report overflowing waste in under 60 seconds.'}
            </p>

            <div className="hero-stagger pt-2 flex flex-wrap items-center gap-3">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('admin')}
                  className="neon-btn neon-btn-primary bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-container flex items-center gap-2 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <Shield className="w-4 h-4" />
                  <span>Review Reports &amp; Dispatch</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('report')}
                  className="neon-btn neon-btn-primary bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-container flex items-center gap-2 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Waste</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('collection-points')}
                className="neon-btn bg-surface-container-low text-on-surface border border-surface-container-high hover:border-primary/50 hover:text-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                <Navigation className="w-4 h-4 text-tertiary" />
                <span>Nearby Hubs</span>
              </button>
            </div>
          </div>

          <div className="hero-stagger flex flex-col items-start lg:items-end gap-3 shrink-0">
            <ScrollDownCue
              targetSelector="#dashboard-metrics"
              label="Scroll down for live updates"
            />
          </div>
        </div>
      </section>

      {/* 2. KPI Metric Tiles */}
      <section
        id="dashboard-metrics"
        className="kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
      >
        <SpotlightCard className="kpi-card bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-5 custom-shadow-card border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="caption-1 text-on-surface-variant">Waste Reports</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-secondary-container text-primary border border-primary/25">
              Submitted
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <AnimatedCounter
              value={reportsCount}
              className="text-3xl font-mono font-bold text-on-surface"
            />
            <span className="text-xs text-primary font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              {activeReportsCount} active
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-container-high text-xs text-on-surface-variant">
            {collectedCount} verified as collected
          </div>
        </SpotlightCard>

        <SpotlightCard className="kpi-card bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-5 custom-shadow-card border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="caption-1 text-on-surface-variant">Estimated Diverted</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-secondary-container text-primary border border-primary/25">
              Recycled
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <AnimatedCounter
              value={divertedKg}
              className="text-3xl font-mono font-bold text-on-surface"
            />
            <span className="text-sm text-on-surface-variant font-mono font-semibold">kg</span>
            <span className="text-xs text-primary font-semibold ml-1">Est.</span>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-container-high text-xs text-on-surface-variant">
            Avoided ~{Math.round(divertedKg * 1.65)} kg CO₂e emissions
          </div>
        </SpotlightCard>

        <SpotlightCard className="kpi-card bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-5 custom-shadow-card border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="caption-1 text-on-surface-variant">EcoPoints Balance</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-tertiary-fixed text-tertiary border border-tertiary/25">
              Redeemable
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <AnimatedCounter
              value={ecoPoints}
              className="text-3xl font-mono font-bold text-primary dark:drop-shadow-[0_0_12px_rgba(0,255,148,0.35)]"
            />
            <span className="text-xs text-on-surface-variant font-mono font-semibold">pts</span>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-container-high text-xs text-on-surface-variant">
            {rewardHint}
          </div>
        </SpotlightCard>

        <SpotlightCard className="kpi-card bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-5 custom-shadow-card border border-surface-container-high flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="caption-1 text-on-surface-variant">Citizen Standing</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary-container text-primary border border-primary/25">
              Verified
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface">{citizenLevel}</span>
            <span className="text-xs text-tertiary font-semibold">
              {isAdmin ? 'Sanitation Lead' : 'Eco Citizen'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-container-high text-xs text-on-surface-variant">
            {isAdmin ? 'Full dispatch clearance' : 'Active neighborhood contributor'}
          </div>
        </SpotlightCard>
      </section>

      {/* 3. Quick Operational Actions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="heading-6 text-on-surface">Quick Actions</h2>
          <span className="text-xs font-mono text-primary">3 Core Modules</span>
        </div>

        <div className="actions-grid grid grid-cols-1 sm:grid-cols-3 gap-5">
          {!isAdmin ? (
            <SpotlightCard
              as="button"
              type="button"
              onClick={() => setActiveTab('report')}
              className="action-card text-left group bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-6 border border-surface-container-high custom-shadow-card cursor-pointer hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary-container border border-primary/25 text-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="title-3 text-on-surface flex items-center justify-between">
                <span>Report Waste</span>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
              </h3>
              <p className="mt-2 text-on-surface-variant text-xs leading-relaxed">
                Spot illegal dumping or overflowing bins? Submit photo evidence and pin the street in 60 seconds.
              </p>
              <div className="mt-5 pt-3 border-t border-surface-container-high flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-primary">Earn +25 Pts</span>
                <span className="text-[11px] text-on-surface-variant">Auto GPS Pin</span>
              </div>
            </SpotlightCard>
          ) : (
            <SpotlightCard
              as="button"
              type="button"
              onClick={() => setActiveTab('admin')}
              className="action-card text-left group bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-6 border border-surface-container-high custom-shadow-card cursor-pointer hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary-container border border-primary/25 text-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="title-3 text-on-surface flex items-center justify-between">
                <span>Citywide Reports &amp; Dispatch</span>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
              </h3>
              <p className="mt-2 text-on-surface-variant text-xs leading-relaxed">
                Review incoming citizen incidents, assign collection trucks, and log completion notes.
              </p>
              <div className="mt-5 pt-3 border-t border-surface-container-high flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-primary">Command Queue</span>
                <span className="text-[11px] text-on-surface-variant">Live audit trail</span>
              </div>
            </SpotlightCard>
          )}

          <SpotlightCard
            as="button"
            type="button"
            onClick={() => setActiveTab('collection-points')}
            className="action-card text-left group bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-6 border border-surface-container-high custom-shadow-card cursor-pointer hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed border border-tertiary/25 text-tertiary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="title-3 text-on-surface flex items-center justify-between">
              <span>Collection Points</span>
              <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-tertiary group-hover:translate-x-1 transition-all duration-300" />
            </h3>
            <p className="mt-2 text-on-surface-variant text-xs leading-relaxed">
              Locate nearby recycling centers, battery and electronics depots, and organic compost drops.
            </p>
            <div className="mt-5 pt-3 border-t border-surface-container-high flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-tertiary">5 Certified Hubs</span>
              <span className="text-[11px] text-on-surface-variant">Filter by stream</span>
            </div>
          </SpotlightCard>

          {!isAdmin ? (
            <SpotlightCard
              as="button"
              type="button"
              onClick={() => setActiveTab('my-reports')}
              className="action-card text-left group bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-6 border border-surface-container-high custom-shadow-card cursor-pointer hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-container border border-surface-container-highest text-on-surface flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <h3 className="title-3 text-on-surface flex items-center justify-between">
                <span>My Reports</span>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
              </h3>
              <p className="mt-2 text-on-surface-variant text-xs leading-relaxed">
                Follow real time crew assignment and verified municipal clearance on your filed tickets.
              </p>
              <div className="mt-5 pt-3 border-t border-surface-container-high flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-primary">
                  {activeReportsCount > 0 ? `${activeReportsCount} active` : `${reportsCount} logged`}
                </span>
                <span className="text-[11px] text-on-surface-variant">4 stage stepper</span>
              </div>
            </SpotlightCard>
          ) : (
            <SpotlightCard
              as="button"
              type="button"
              onClick={() => setActiveTab('collection-points')}
              className="action-card text-left group bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-6 border border-surface-container-high custom-shadow-card cursor-pointer hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-container border border-surface-container-highest text-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                <Recycle className="w-6 h-6" />
              </div>
              <h3 className="title-3 text-on-surface flex items-center justify-between">
                <span>Municipal Depots</span>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
              </h3>
              <p className="mt-2 text-on-surface-variant text-xs leading-relaxed">
                Inspect regional drop off centers, accepted material streams, and operating hours.
              </p>
              <div className="mt-5 pt-3 border-t border-surface-container-high flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-primary">Map &amp; List</span>
                <span className="text-[11px] text-on-surface-variant">Directory sync</span>
              </div>
            </SpotlightCard>
          )}
        </div>
      </section>

      {/* 4. Waste Stream Diversion Breakdown */}
      <section className="stream-breakdown bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 custom-shadow-card border border-surface-container-high space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-container-high">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-secondary-container border border-primary/25 text-primary flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </span>
            <div>
              <h2 className="title-3 text-on-surface">District Waste Stream Breakdown</h2>
              <p className="text-[11px] text-on-surface-variant">
                Material distribution across logged municipal reports
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-primary">{allForStream.length} Total Logs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {streamMetrics.map((sm) => (
            <div key={sm.label} className="space-y-2 p-4 rounded-2xl bg-surface-container-low border border-surface-container-high">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-on-surface truncate pr-2">{sm.label}</span>
                <span className="font-mono font-bold text-primary">{sm.pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div
                  className={`stream-bar-fill h-full rounded-full origin-left ${sm.colorClass}`}
                  style={{ width: `${sm.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Scroll-Driven Tagline Reveal */}
      <TaglineReveal />

      {/* 6. Live Municipal Clearance Feed & Impact Goal */}
      <section className={`grid grid-cols-1 ${!isAdmin ? 'lg:grid-cols-3' : ''} gap-6`}>
        <div
          className={`${
            !isAdmin ? 'lg:col-span-2' : 'col-span-full'
          } bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl p-6 custom-shadow-card border border-surface-container-high`}
        >
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-surface-container-high">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-secondary-container border border-primary/25 text-primary flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </span>
              <h3 className="title-3 text-on-surface">Live Municipal Clearance Feed</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {loading ? 'Syncing...' : `${feedItems.length} recent`}
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((sk) => (
                <div
                  key={sk}
                  className="h-20 rounded-xl bg-surface-container-low border border-surface-container-high animate-pulse"
                />
              ))}
            </div>
          ) : feedItems.length === 0 ? (
            <div className="p-8 rounded-2xl bg-surface-container-low border border-surface-container-high text-center space-y-3">
              <p className="text-xs text-on-surface-variant">
                No municipal reports logged yet. Submit your first waste alert to see live crew progress here.
              </p>
              {!isAdmin && (
                <button
                  type="button"
                  onClick={() => setActiveTab('report')}
                  className="neon-btn neon-btn-primary px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold"
                >
                  Submit First Report
                </button>
              )}
            </div>
          ) : (
            <div className="feed-list space-y-3">
              {feedItems.map((item) => {
                const statusLower = (item.status || 'pending').toLowerCase();
                const isCollected = statusLower === 'collected' || statusLower === 'resolved';
                const isInProgress = statusLower === 'in progress' || statusLower === 'assigned';

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectReport && onSelectReport(item.id)}
                    className="feed-item w-full text-left flex items-start gap-4 p-4 rounded-2xl bg-surface-container-low border border-surface-container-high hover:border-primary/45 cursor-pointer transition-colors duration-300"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                        isCollected
                          ? 'bg-secondary-container border-primary/25 text-primary'
                          : isInProgress
                          ? 'bg-tertiary-fixed border-tertiary/25 text-tertiary'
                          : 'bg-surface-container border-surface-container-highest text-amber-400'
                      }`}
                    >
                      {isCollected ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isInProgress ? (
                        <Truck className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-on-surface truncate">
                            {item.wasteType || 'Waste Incident'} • {item.location}
                          </h4>
                          <StatusBadge status={item.status} size="sm" />
                        </div>
                        <span className="text-[11px] font-mono text-on-surface-variant shrink-0">
                          {formatRelativeDate(item.date)}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed line-clamp-2">
                        {item.resolutionNotes || item.description}
                      </p>
                      {item.assignedTo && (
                        <div className="text-[11px] font-mono text-tertiary mt-1">
                          Assigned: {item.assignedTo}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quarterly Impact Goal Card */}
        {!isAdmin && (
          <SpotlightCard className="bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl p-6 custom-shadow-card border border-surface-container-high flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="title-3 text-on-surface">Your Impact Goal</h3>
                <span className="w-8 h-8 rounded-lg bg-secondary-container border border-primary/25 text-primary flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {divertedKg >= 100
                  ? 'You reached your 100 kg diversion milestone for this quarter!'
                  : `You are ${100 - divertedKg} kg away from diverting 100 kg of recyclable material this quarter.`}
              </p>

              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface font-mono">{divertedKg} kg Diverted</span>
                  <span className="text-primary font-mono font-bold">{goalPct}%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    ref={progressBarRef}
                    className="bg-gradient-to-r from-primary to-tertiary h-full w-full origin-left rounded-full dark:shadow-[0_0_12px_rgba(0,255,148,0.65)]"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-secondary-container/50 rounded-2xl space-y-1.5 border border-primary/25">
                <div className="text-xs font-bold text-primary">Community Benchmark</div>
                <div className="text-xs text-on-surface-variant leading-relaxed">
                  {user?.location || 'Your sector'} diverted 4.2 tons of sorted recyclables this week across {communityReports.length || 4} active tickets.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('my-reports')}
              className="neon-btn mt-6 w-full text-center py-2.5 rounded-xl border border-primary/40 text-primary text-xs font-bold hover:bg-secondary-container/60 transition-colors"
            >
              View My Activity Log
            </button>
          </SpotlightCard>
        )}
      </section>
    </div>
  );
}
