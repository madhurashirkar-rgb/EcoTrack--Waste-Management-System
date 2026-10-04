import React from 'react';

export default function StatusBadge({ status, size = 'md' }) {
  const norm = (status || 'pending').toLowerCase();

  let bg = 'bg-amber-50 text-amber-700 border-amber-200';
  let dot = 'bg-amber-500';
  let label = status || 'Pending';

  if (norm === 'pending' || norm === 'reported') {
    bg = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
    dot = 'bg-amber-500';
    label = 'Pending';
  } else if (norm === 'assigned') {
    bg = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60';
    dot = 'bg-blue-500';
    label = 'Assigned';
  } else if (norm === 'in progress' || norm === 'inprogress') {
    bg = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60';
    dot = 'bg-purple-500';
    label = 'In Progress';
  } else if (norm === 'collected' || norm === 'resolved') {
    bg = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
    dot = 'bg-emerald-600';
    label = 'Collected';
  }

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2.5 py-0.5' 
    : 'text-xs sm:text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${bg} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${norm === 'in progress' ? 'animate-pulse' : ''}`} />
      {label}
    </span>
  );
}
