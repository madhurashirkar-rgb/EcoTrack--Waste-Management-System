import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven organic topographic & bioluminescent background motion layer.
 * Uses GPU transforms only (translate3d, rotate, scale) scrubbed to Lenis/ScrollTrigger.
 */
export default function BackgroundScrollMotion() {
  const bgRef = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || !bgRef.current) return;

      // 1. Subtle architectural grid parallax shift on scroll
      gsap.to('.bg-grid-layer', {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });

      // 2. Topographic orbital SVG rings rotate & expand smoothly on scroll down
      gsap.to('.bg-topo-ring-outer', {
        rotation: 55,
        scale: 1.16,
        y: 90,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.9,
        },
      });

      gsap.to('.bg-topo-ring-inner', {
        rotation: -42,
        scale: 0.92,
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.9,
        },
      });

      // 3. Bioluminescent ambient orbs travel diagonally as user scrolls down
      gsap.to('.bg-orb-emerald', {
        y: 220,
        x: -90,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      gsap.to('.bg-orb-cyan', {
        y: -180,
        x: 110,
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      // 4. Vertical kinetic rail pulse bars on viewport edges
      gsap.to('.bg-rail-marker-left', {
        y: '68vh',
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.35,
        },
      });

      gsap.to('.bg-rail-marker-right', {
        y: '-62vh',
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.35,
        },
      });
    },
    { scope: bgRef }
  );

  return (
    <div
      ref={bgRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* Parallax Architectural Grid */}
      <div className="bg-grid-layer absolute -inset-24 eco-grid-bg opacity-80 will-change-transform" />

      {/* Topographic Contour / Orbital Vector Rings */}
      <svg
        className="bg-topo-ring-outer absolute -top-32 -right-32 w-[680px] h-[680px] text-primary/[0.07] dark:text-primary/[0.09] will-change-transform"
        viewBox="0 0 600 600"
        fill="none"
      >
        <circle cx="300" cy="300" r="270" stroke="currentColor" strokeWidth="1" strokeDasharray="8 8" />
        <circle cx="300" cy="300" r="220" stroke="currentColor" strokeWidth="1" />
        <path
          d="M 110 300 A 190 190 0 0 1 490 300"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="16 10"
        />
        <circle cx="300" cy="30" r="4" fill="currentColor" />
        <circle cx="490" cy="300" r="3" fill="currentColor" />
      </svg>

      <svg
        className="bg-topo-ring-inner absolute -bottom-40 -left-40 w-[560px] h-[560px] text-tertiary/[0.08] dark:text-tertiary/[0.1] will-change-transform"
        viewBox="0 0 500 500"
        fill="none"
      >
        <circle cx="250" cy="250" r="220" stroke="currentColor" strokeWidth="1" strokeDasharray="6 10" />
        <circle cx="250" cy="250" r="165" stroke="currentColor" strokeWidth="1" />
        <circle cx="250" cy="250" r="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
      </svg>

      {/* Scroll-Reactive Ambient Orbs */}
      <div className="bg-orb-emerald absolute -top-28 right-[12%] w-[440px] h-[440px] rounded-full bg-primary/15 dark:bg-primary/[0.12] blur-[120px] will-change-transform" />
      <div className="bg-orb-cyan absolute bottom-[-140px] left-[8%] w-[420px] h-[420px] rounded-full bg-tertiary/15 dark:bg-tertiary/[0.10] blur-[130px] will-change-transform" />

      {/* Subtle Side Scroll Rails */}
      <div className="hidden xl:block absolute top-24 left-6 w-[1px] h-[72vh] bg-gradient-to-b from-transparent via-outline-variant/30 to-transparent">
        <div className="bg-rail-marker-left w-1 h-10 -ml-[1.5px] rounded-full bg-primary/60 dark:shadow-[0_0_10px_rgba(0,255,148,0.7)] will-change-transform" />
      </div>
      <div className="hidden xl:block absolute bottom-24 right-6 w-[1px] h-[72vh] bg-gradient-to-b from-transparent via-outline-variant/30 to-transparent">
        <div className="bg-rail-marker-right w-1 h-10 -ml-[1.5px] mt-[60vh] rounded-full bg-tertiary/60 dark:shadow-[0_0_10px_rgba(0,229,255,0.7)] will-change-transform" />
      </div>
    </div>
  );
}
