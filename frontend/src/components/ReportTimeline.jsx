import React from 'react';
import { Check, Clock, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ReportTimeline({ statusProgression = [], currentStatus }) {
  const steps = [
    { key: 'Reported', label: 'Reported', icon: AlertCircle, desc: 'Citizen report logged' },
    { key: 'Assigned', label: 'Assigned', icon: Truck, desc: 'Clean-up team dispatched' },
    { key: 'In Progress', label: 'In Progress', icon: Clock, desc: 'Active on-site removal' },
    { key: 'Collected', label: 'Collected', icon: CheckCircle2, desc: 'Disposed & verified' },
  ];

  // Derive current step index
  const normCurrent = (currentStatus || 'Pending').toLowerCase();
  let activeIndex = 0;
  if (normCurrent === 'pending' || normCurrent === 'reported') activeIndex = 0;
  else if (normCurrent === 'assigned') activeIndex = 1;
  else if (normCurrent === 'in progress' || normCurrent === 'inprogress') activeIndex = 2;
  else if (normCurrent === 'collected' || normCurrent === 'resolved') activeIndex = 3;

  return (
    <div className="py-4">
      <div className="relative">
        {/* Mobile / Vertical view */}
        <div className="md:hidden space-y-6 relative pl-6 border-l-2 border-secondary-container ml-4">
          {steps.map((step, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;
            const historyItem = statusProgression.find(
              (p) => (p.name || '').toLowerCase() === step.key.toLowerCase() ||
                     (step.key === 'Reported' && (p.name || '').toLowerCase() === 'pending') ||
                     (step.key === 'Collected' && (p.name || '').toLowerCase() === 'resolved')
            );

            return (
              <div key={step.key} className="relative">
                <div
                  className={`absolute -left-[33px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                    isCurrent
                      ? 'bg-primary text-on-primary ring-4 ring-primary/20 ring-offset-1'
                      : isCompleted
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low border-2 border-outline-variant text-on-surface-variant'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-semibold ${isCompleted ? 'text-on-surface' : 'text-on-surface-variant opacity-60'}`}>
                      {step.label}
                    </h4>
                    {historyItem?.timestamp && (
                      <span className="text-xs text-on-surface-variant">
                        {new Date(historyItem.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {historyItem?.note || step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop / Horizontal View */}
        <div className="hidden md:flex items-center justify-between w-full">
          {steps.map((step, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;
            const historyItem = statusProgression.find(
              (p) => (p.name || '').toLowerCase() === step.key.toLowerCase() ||
                     (step.key === 'Reported' && (p.name || '').toLowerCase() === 'pending') ||
                     (step.key === 'Collected' && (p.name || '').toLowerCase() === 'resolved')
            );

            return (
              <div key={step.key} className="flex-1 relative flex flex-col items-center group">
                {/* Connecting Line */}
                {idx > 0 && (
                  <div
                    className={`absolute top-5 -left-1/2 w-full h-1 transition-colors duration-300 ${
                      idx <= activeIndex ? 'bg-primary' : 'bg-surface-container-high'
                    }`}
                    style={{ zIndex: 0 }}
                  />
                )}

                {/* Node Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold relative z-10 transition-all shadow-sm ${
                    isCurrent
                      ? 'bg-primary text-on-primary ring-4 ring-primary/20 shadow-md scale-110'
                      : isCompleted
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low border-2 border-outline-variant text-on-surface-variant'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
                </div>

                {/* Text Info */}
                <div className="text-center mt-3 max-w-[120px]">
                  <p className={`text-xs font-bold ${isCompleted ? 'text-on-surface' : 'text-on-surface-variant opacity-60'}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 line-clamp-1">
                    {step.desc}
                  </p>
                  {historyItem?.timestamp && (
                    <span className="text-[10px] text-primary block mt-1 font-medium bg-secondary-container px-1.5 py-0.5 rounded-full">
                      {new Date(historyItem.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
