import React, { useRef, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowDown } from 'lucide-react';
import { useSmoothScroll } from '../context/SmoothScrollContext';

gsap.registerPlugin(ScrollTrigger);

/**
 * Top laser scroll-progress bar driven by ScrollTrigger + GSAP (GPU scaleX only)
 */
export function ScrollProgressBar() {
  const barRef = useRef(null);

  useGSAP(() => {
    if (!barRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.15,
        },
      }
    );
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[60] pointer-events-none bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-primary via-secondary to-tertiary dark:shadow-[0_0_12px_rgba(0,255,148,0.85)]"
      />
    </div>
  );
}

/**
 * Tactile cursor-spotlight card container (zero scroll-callback layout reads)
 */
export function SpotlightCard({ children, className = '', onClick, as = 'div', ...props }) {
  const handlePointerMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = `${e.clientX - rect.left}px`;
    const y = `${e.clientY - rect.top}px`;
    e.currentTarget.style.setProperty('--mx', x);
    e.currentTarget.style.setProperty('--my', y);
  }, []);

  const Tag = as;
  return (
    <Tag
      onPointerMove={handlePointerMove}
      onClick={onClick}
      className={`spotlight-card neon-card ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

/**
 * Smooth entrance wrapper for route/tab content switches
 */
export function TabTransition({ tabKey, children }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || !ref.current) return;

      gsap.fromTo(
        ref.current,
        { y: 10, opacity: 0.4 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }
      );
    },
    { scope: ref, dependencies: [tabKey] }
  );

  return <div ref={ref}>{children}</div>;
}

/**
 * Animated scroll-down button with floating indicator
 */
export function ScrollDownCue({ targetSelector = '#scroll-target', label = 'Scroll down' }) {
  const { scrollTo } = useSmoothScroll();
  const cueRef = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.to('.scroll-chevron', {
        y: 4,
        repeat: -1,
        yoyo: true,
        duration: 0.85,
        ease: 'power1.inOut',
      });
    },
    { scope: cueRef }
  );

  return (
    <button
      ref={cueRef}
      type="button"
      onClick={() => scrollTo(targetSelector)}
      className="group inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-surface-container-high bg-surface-container-low/90 hover:border-primary/60 text-xs font-semibold text-on-surface-variant hover:text-primary transition-all duration-300 backdrop-blur-md"
    >
      <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center">
        <ArrowDown className="w-3 h-3 scroll-chevron" />
      </span>
      <span>{label}</span>
    </button>
  );
}

/**
 * Animated numeric counter using GSAP
 */
export function AnimatedCounter({ value, suffix = '', decimals = 0, className = '' }) {
  const numRef = useRef(null);
  const numericValue = Number.isFinite(parseFloat(value)) ? parseFloat(value) : 0;

  useGSAP(() => {
    if (!numRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      numRef.current.textContent = `${numericValue.toFixed(decimals)}${suffix}`;
      return;
    }

    const counter = { val: 0 };
    gsap.to(counter, {
      val: numericValue,
      duration: 1.0,
      ease: 'power3.out',
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = `${counter.val.toFixed(decimals)}${suffix}`;
        }
      },
      onComplete: () => {
        if (numRef.current) {
          numRef.current.textContent = `${numericValue.toFixed(decimals)}${suffix}`;
        }
      },
    });
  }, [numericValue, suffix, decimals]);

  return (
    <span ref={numRef} className={className}>
      {numericValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/**
 * TaglineReveal section (landing-page-design B11):
 * Words transition individually from muted opacity to full luminance as the user scrolls into view.
 */
export function TaglineReveal({
  text = 'Every kilogram recycled keeps waste out of local landfills and builds cleaner neighborhoods across every district.',
  highlights = ['recycled', 'landfills', 'cleaner', 'neighborhoods'],
  eyebrow = 'Community Impact',
}) {
  const containerRef = useRef(null);
  const words = useMemo(() => text.split(' '), [text]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const wordEls = gsap.utils.toArray('.reveal-word', containerRef.current);

      if (prefersReduced) {
        gsap.set(wordEls, { opacity: 1 });
        return;
      }

      gsap.fromTo(
        wordEls,
        { opacity: 0.25 },
        {
          opacity: 1,
          stagger: 0.06,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'top 42%',
            scrub: 0.4,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative py-12 sm:py-16 px-6 sm:px-10 rounded-3xl border border-surface-container-high bg-surface-container-lowest/90 backdrop-blur-md overflow-hidden custom-shadow-card"
    >
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-tertiary/10 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-[680px] space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/80 border border-primary/25 text-xs font-semibold text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>{eyebrow}</span>
        </div>

        <h2 className="heading-3 text-on-surface flex flex-wrap gap-x-2.5 gap-y-1.5">
          {words.map((word, idx) => {
            const clean = word.toLowerCase().replace(/[.,!?]/g, '');
            const isHighlight = highlights.includes(clean);
            return (
              <span
                key={`${word}-${idx}`}
                className={`reveal-word inline-block transition-colors ${
                  isHighlight
                    ? 'text-primary dark:drop-shadow-[0_0_12px_rgba(0,255,148,0.35)]'
                    : 'text-on-surface'
                }`}
              >
                {word}
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}
