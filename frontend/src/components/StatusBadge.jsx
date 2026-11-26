import React from 'react';

export default function StatusBadge({ status, size = 'md' }) {
  const norm = (status || 'pending').toLowerCase();

  let bg = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
  let dot = 'bg-amber-500';
  let label = status || 'Pending';

  if (norm === 'pending' || norm === 'reported') {
    bg = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
    dot = 'bg-amber-400';
    label = 'Pending';
  } else if (norm === 'assigned') {
    bg = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60';
    dot = 'bg-sky-400';
    label = 'Assigned';
  } else if (norm === 'in progress' || norm === 'inprogress') {
    bg = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60';
    dot = 'bg-purple-400';
    label = 'In Progress';
  } else if (norm === 'collected' || norm === 'resolved') {
    bg = 'bg-secondary-container text-primary border-primary/30 dark:shadow-[0_0_12px_rgba(0,255,148,0.2)]';
    dot = 'bg-primary';
    label = 'Collected';
  }

  const sizeClasses =
    size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${bg} ${sizeClasses}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${dot} ${
          norm === 'in progress' ? 'animate-pulse' : ''
        }`}
      />
      <span>{label}</span>
    </span>
  );
}
