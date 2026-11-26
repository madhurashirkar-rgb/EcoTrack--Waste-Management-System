import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Sparkles,
  BookOpen,
  BatteryCharging,
  Repeat,
  Gift,
  Ticket,
  TreePine,
  Train,
  ShoppingBag,
  AlertCircle,
  Recycle,
  Sprout,
  Box,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SpotlightCard } from '../components/MotionPrimitives';
import api from '../api/client';

const ICON_MAP = {
  recycle: Recycle,
  split: BookOpen,
  'battery-warning': BatteryCharging,
  box: Box,
  sprout: Sprout,
  sparkles: Sparkles,
};

const DEFAULT_TIPS = [
  {
    id: 'tip-1',
    title: 'Plastic & Packaging Rinse Rule',
    tag: 'Plastic & Packaging',
    Icon: Recycle,
    color: 'bg-secondary-container border-primary/25 text-primary',
    description:
      'Rinse plastic food containers before tossing them into recycling bins to prevent batch contamination.',
    points: 15,
  },
  {
    id: 'tip-2',
    title: 'Source Waste Segregation',
    tag: 'Source Segregation',
    Icon: BookOpen,
    color: 'bg-tertiary-fixed border-tertiary/25 text-tertiary',
    description:
      'Separate dry and wet waste at source. This boosts municipal composting efficiency by up to 70%.',
    points: 15,
  },
  {
    id: 'tip-3',
    title: 'Disposing Lithium Batteries Safely',
    tag: 'Hazardous & Batteries',
    Icon: BatteryCharging,
    color: 'bg-error-container border-error/25 text-on-error-container',
    description:
      'Never dispose of rechargeable or lithium-ion batteries in household trash—tape terminals and drop at an e-waste hub.',
    points: 20,
  },
];

export default function EcoTips() {
  const { ecoPoints, addEcoPoints } = useAuth();
  const [tips, setTips] = useState(DEFAULT_TIPS);
  const [claimedTips, setClaimedTips] = useState(() => {
    try {
      const saved = localStorage.getItem('ecotrack_claimed_tips');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [redeemedVoucher, setRedeemedVoucher] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    api.ecoTips
      .getAll()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          const mapped = res.data.map((t, idx) => ({
            id: t.id || `tip-${idx}`,
            title: t.category || 'Eco Handling Guide',
            tag: t.category || 'Guide',
            Icon: ICON_MAP[t.icon] || Repeat,
            color:
              t.icon === 'battery-warning'
                ? 'bg-error-container border-error/25 text-on-error-container'
                : idx % 2 === 0
                ? 'bg-secondary-container border-primary/25 text-primary'
                : 'bg-tertiary-fixed border-tertiary/25 text-tertiary',
            description: t.tip,
            points: 15 + (idx % 2) * 5,
          }));
          setTips(mapped);
        }
      })
      .catch(() => {});
  }, []);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.fromTo(
        '.tip-card',
        { y: 14 },
        {
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power3.out',
        }
      );
    },
    { scope: containerRef }
  );

  const rewards = [
    {
      id: 'rew-1',
      title: 'Single Day City Metro Transit Pass',
      subtitle: 'Saves 4.2 kg fossil transport emissions',
      cost: 300,
      Icon: Train,
    },
    {
      id: 'rew-2',
      title: 'Plant a Native Tree Voucher',
      subtitle: 'Municipal Urban Forest Initiative',
      cost: 250,
      Icon: TreePine,
    },
    {
      id: 'rew-3',
      title: 'Farmers Market $10 Coupon',
      subtitle: 'Local zero packaging organic produce',
      cost: 450,
      Icon: ShoppingBag,
    },
  ];

  const points = ecoPoints;

  const handleClaimTip = (tipId, rewardPts) => {
    if (claimedTips[tipId]) return;
    setErrorMsg('');
    const nextClaimed = { ...claimedTips, [tipId]: true };
    setClaimedTips(nextClaimed);
    localStorage.setItem('ecotrack_claimed_tips', JSON.stringify(nextClaimed));
    addEcoPoints(rewardPts);
  };

  const handleRedeem = (reward) => {
    setErrorMsg('');
    if (points >= reward.cost) {
      addEcoPoints(-reward.cost);
      setRedeemedVoucher({
        title: reward.title,
        code: `ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        date: new Date().toLocaleDateString(),
      });
    } else {
      setErrorMsg(`Insufficient EcoPoints for "${reward.title}". You need ${reward.cost - points} more points.`);
    }
  };

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Educational Banner */}
      <div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl p-6 sm:p-9 custom-shadow-card border border-surface-container-high flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-[80px] pointer-events-none"
        />

        <div className="space-y-3 max-w-xl relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary-container border border-primary/30 text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EcoAcademy</span>
          </span>
          <h1 className="heading-3 neon-text-gradient">Small Habits, Massive Diversion</h1>
          <p className="body-3 text-on-surface-variant">
            Read verified waste handling guides and earn points to redeem local sustainable perks and transit vouchers.
          </p>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container-high shrink-0 relative z-10 custom-shadow-card">
          <div className="text-[11px] font-mono text-on-surface-variant uppercase">Available Balance</div>
          <div className="text-3xl font-mono font-bold text-primary mt-1 dark:drop-shadow-[0_0_12px_rgba(0,255,148,0.4)]">
            {points} pts
          </div>
          <div className="text-[11px] text-on-surface-variant mt-1">Ready to redeem vouchers</div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-error-container border border-error/30 text-on-error-container text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Engaging Tip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tips.map((tip) => {
          const isClaimed = claimedTips[tip.id];
          const TipIcon = tip.Icon;
          return (
            <SpotlightCard
              key={tip.id}
              className="tip-card bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl p-6 custom-shadow-card border border-surface-container-high flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl border ${tip.color} flex items-center justify-center mb-5`}>
                  <TipIcon className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-surface-container-low text-[11px] font-mono font-semibold text-on-surface-variant border border-surface-container-high">
                  {tip.tag}
                </span>
                <h2 className="title-2 text-on-surface mt-3">{tip.title}</h2>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  {tip.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-container-high flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{tip.points} Pts</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleClaimTip(tip.id, tip.points)}
                  disabled={isClaimed}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-300 ${
                    isClaimed
                      ? 'bg-secondary-container text-primary border border-primary/25 cursor-default'
                      : 'neon-btn neon-btn-primary bg-primary text-on-primary hover:bg-primary-container'
                  }`}
                >
                  {isClaimed ? '✓ Claimed' : 'Read & Claim'}
                </button>
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      {/* Redeemable Rewards Catalog */}
      <div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 custom-shadow-card border border-surface-container-high space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="heading-6 text-on-surface flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span>Redeemable EcoRewards</span>
          </h2>
          <span className="text-xs font-mono text-on-surface-variant">Instant digital voucher</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rewards.map((rew) => {
            const canAfford = points >= rew.cost;
            const RewardIcon = rew.Icon;
            return (
              <div
                key={rew.id}
                className="p-5 rounded-2xl border border-surface-container-high bg-surface-container-low flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest border border-surface-container-high text-primary flex items-center justify-center">
                    <RewardIcon className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-sm text-on-surface">{rew.title}</div>
                  <div className="text-xs text-on-surface-variant leading-relaxed">{rew.subtitle}</div>
                  <div className="text-xs font-mono font-bold text-primary pt-1">
                    Cost: {rew.cost} EcoPoints
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRedeem(rew)}
                  disabled={!canAfford}
                  className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                    canAfford
                      ? 'neon-btn neon-btn-primary bg-primary text-on-primary hover:bg-primary-container'
                      : 'bg-surface-container text-on-surface-variant opacity-60 cursor-not-allowed border border-surface-container-high'
                  }`}
                >
                  {canAfford ? 'Redeem Voucher' : `Need ${rew.cost - points} more pts`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voucher Confirmation Modal */}
      {redeemedVoucher && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-3xl p-6 sm:p-7 custom-shadow-modal border border-surface-container-high text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-secondary-container border border-primary/30 text-primary flex items-center justify-center mx-auto">
              <Ticket className="w-7 h-7" />
            </div>
            <div>
              <h3 className="title-2 text-on-surface">Reward Successfully Claimed!</h3>
              <p className="text-xs text-on-surface-variant mt-1">{redeemedVoucher.title}</p>
            </div>
            <div className="p-3.5 bg-surface-container-low rounded-2xl font-mono font-bold text-base text-primary tracking-widest border border-primary/30 dark:shadow-[0_0_14px_rgba(0,255,148,0.2)]">
              {redeemedVoucher.code}
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Show this digital voucher code at any municipal transit kiosk or participating vendor.
            </p>
            <button
              type="button"
              onClick={() => setRedeemedVoucher(null)}
              className="neon-btn neon-btn-primary w-full py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl hover:bg-primary-container"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
