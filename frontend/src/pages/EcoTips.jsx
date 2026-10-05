import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function EcoTips() {
  const { user } = useAuth();
  const [points, setPoints] = useState(user?.ecoPoints ?? 340);
  const [claimedTips, setClaimedTips] = useState({});
  const [redeemedVoucher, setRedeemedVoucher] = useState(null);

  const tips = [
    {
      id: 1,
      title: 'Mastering 3-Bin Segregation',
      tag: 'Segregation Guide',
      icon: 'auto_delete',
      color: 'bg-secondary-container text-primary',
      description: 'Learn how properly rinsing milk cartons and grease-free pizza boxes doubles recycling batch purity.',
      points: 15
    },
    {
      id: 2,
      title: 'Disposing Lithium Batteries',
      tag: 'Safety Protocol',
      icon: 'battery_alert',
      color: 'bg-error-container text-on-error-container',
      description: 'Never place powerbanks or rechargeable cells in curbside bins. Taping contacts prevents transport fires.',
      points: 20
    },
    {
      id: 3,
      title: 'Say No to Single-Use: 5 Daily Swaps',
      tag: 'Zero-Waste Life',
      icon: 'swap_horiz',
      color: 'bg-surface-variant text-on-surface',
      description: 'Simple replacements for beeswax wraps, stainless canisters, and refillable detergent stations.',
      points: 10
    }
  ];

  const rewards = [
    {
      id: 'rew-1',
      title: '1-Day City Metro Transit Pass',
      subtitle: 'Saves 4.2 kg fossil transport emissions',
      cost: 300
    },
    {
      id: 'rew-2',
      title: 'Plant a Native Tree Voucher',
      subtitle: 'Municipal Urban Forest Initiative',
      cost: 250
    },
    {
      id: 'rew-3',
      title: 'Farmers Market $10 Coupon',
      subtitle: 'Local zero-packaging produce',
      cost: 450
    }
  ];

  const handleClaimTip = (tipId, rewardPts) => {
    if (claimedTips[tipId]) return;
    setPoints(prev => prev + rewardPts);
    setClaimedTips(prev => ({ ...prev, [tipId]: true }));
  };

  const handleRedeem = (reward) => {
    if (points >= reward.cost) {
      setPoints(prev => prev - reward.cost);
      setRedeemedVoucher({
        title: reward.title,
        code: `ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        date: new Date().toLocaleDateString()
      });
    } else {
      alert(`Insufficient EcoPoints. You need ${reward.cost - points} more points.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Educational Banner */}
      <div className="bg-gradient-to-r from-secondary-container to-surface-container-low rounded-xl p-6 sm:p-8 border border-secondary-fixed-dim flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-on-primary">
            EcoAcademy
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Small Habits, Massive Diversion</h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Read verified waste handling guides and earn points to redeem local sustainable perks.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-lg p-4 custom-shadow-card border border-surface-container-high shrink-0">
          <div className="text-[11px] text-on-surface-variant">Available Rewards Balance</div>
          <div className="text-2xl font-bold text-primary mt-1">{points} Points</div>
          <div className="text-[11px] text-on-surface-variant mt-1">Ready to redeem vouchers</div>
        </div>
      </div>

      {/* Engaging Tip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tips.map((tip) => {
          const isClaimed = claimedTips[tip.id];
          return (
            <div
              key={tip.id}
              className="bg-surface-container-lowest rounded-xl p-5 custom-shadow-card border border-surface-container-high flex flex-col justify-between"
            >
              <div>
                <div className={`w-10 h-10 rounded-lg ${tip.color} flex items-center justify-center mb-4`}>
                  <span className="material-symbols-outlined text-2xl">{tip.icon}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] font-semibold text-on-surface-variant">
                  {tip.tag}
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-2">{tip.title}</h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  {tip.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-surface-container-high flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">stars</span>
                  <span>+{tip.points} Pts</span>
                </span>
                <button
                  onClick={() => handleClaimTip(tip.id, tip.points)}
                  disabled={isClaimed}
                  className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
                    isClaimed
                      ? 'bg-primary text-on-primary cursor-default'
                      : 'bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary'
                  }`}
                >
                  {isClaimed ? '✓ Claimed' : 'Read & Claim'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Redeemable Rewards Catalog */}
      <div className="bg-surface-container-lowest rounded-xl p-6 custom-shadow-card border border-surface-container-high space-y-4">
        <h3 className="text-base font-bold text-on-surface">Redeemable EcoRewards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((rew) => {
            const canAfford = points >= rew.cost;
            return (
              <div
                key={rew.id}
                className="p-4 rounded-lg border border-surface-container-high bg-surface-container-low flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="font-bold text-xs text-on-surface">{rew.title}</div>
                  <div className="text-[11px] text-on-surface-variant">{rew.subtitle}</div>
                  <div className="text-xs font-bold text-primary">Cost: {rew.cost} EcoPoints</div>
                </div>

                <button
                  onClick={() => handleRedeem(rew)}
                  disabled={!canAfford}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors shrink-0 ${
                    canAfford
                      ? 'bg-primary text-on-primary hover:bg-primary-container shadow-xs'
                      : 'bg-surface-container text-on-surface-variant opacity-60 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Redeem' : `Need ${rew.cost} Pts`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voucher Confirmation Modal */}
      {redeemedVoucher && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl p-6 custom-shadow-modal border border-surface-container-high text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-secondary-container text-primary flex items-center justify-center mx-auto text-2xl">
              🎉
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">Reward Successfully Claimed!</h3>
              <p className="text-xs text-on-surface-variant mt-1">{redeemedVoucher.title}</p>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg font-mono font-bold text-sm text-primary tracking-wider border border-secondary-fixed">
              {redeemedVoucher.code}
            </div>
            <p className="text-[11px] text-on-surface-variant">
              Show this voucher code at any municipal transit kiosk or partner booth.
            </p>
            <button
              onClick={() => setRedeemedVoucher(null)}
              className="w-full py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-primary-container"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
