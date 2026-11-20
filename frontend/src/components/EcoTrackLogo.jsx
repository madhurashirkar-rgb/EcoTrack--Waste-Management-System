import React, { useState } from 'react';

export default function EcoTrackLogo({ 
  className = 'w-9 h-9', 
  showText = false, 
  subtitle = 'Waste Management System', 
  isAdmin = false 
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`${className} shrink-0 relative flex items-center justify-center`}>
        {!imgError ? (
          <img
            src="/logo.png"
            alt="EcoTrack Logo"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain rounded-xl drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
          >
            <defs>
              <linearGradient id="ecoTrackGradBg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="60%" stopColor="#059669" />
                <stop offset="100%" stopColor="#006d3a" />
              </linearGradient>
              <linearGradient id="ecoTrackLeafGrad" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ecfdf5" />
                <stop offset="60%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="ecoTrackOrbitGrad" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Rounded Shield / Tile Background */}
            <rect width="48" height="48" rx="12" fill="url(#ecoTrackGradBg)" />

            {/* Inner subtle glow ring */}
            <rect x="2" y="2" width="44" height="44" rx="10" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.5" />

            {/* Orbital tracking arc */}
            <path
              d="M 12 24 A 12 12 0 1 1 36 24"
              stroke="url(#ecoTrackOrbitGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 2"
            />

            {/* Forward Arrow on orbit representing recycling & tracking */}
            <path
              d="M 33 21 L 36.5 24.5 L 40 21"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Stylized Leaf Silhouette */}
            <path
              d="M 24 11 C 17 12 14 18 14 26 C 14 33 19 37 25 37 C 25 31 27 23 32 17 C 33 15 34 13 34 11 C 29 11 26 11 24 11 Z"
              fill="url(#ecoTrackLeafGrad)"
            />

            {/* Leaf Center Stem Vein */}
            <path
              d="M 25 36 C 25 29 27 22 33 13"
              stroke="#006d3a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.75"
            />

            {/* GPS Tracking Pin Node Accent */}
            <circle cx="24" cy="27" r="3" fill="#ffffff" />
            <circle cx="24" cy="27" r="1.5" fill="#006d3a" />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg text-primary tracking-tight">EcoTrack</span>
            {isAdmin && (
              <span className="text-[10px] uppercase font-bold tracking-wider bg-primary text-on-primary px-1.5 py-0.2 rounded shadow-2xs">
                Admin
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-outline -mt-1 hidden sm:block">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
}
