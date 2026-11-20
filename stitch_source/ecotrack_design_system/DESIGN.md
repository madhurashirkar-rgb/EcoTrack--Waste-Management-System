---
name: EcoTrack Design System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3e4a3d'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6e7b6c'
  outline-variant: '#bdcaba'
  surface-tint: '#006e2d'
  primary: '#006b2c'
  on-primary: '#ffffff'
  primary-container: '#00873a'
  on-primary-container: '#f7fff2'
  inverse-primary: '#62df7d'
  secondary: '#486554'
  on-secondary: '#ffffff'
  secondary-container: '#caead6'
  on-secondary-container: '#4e6b5a'
  tertiary: '#006194'
  on-tertiary: '#ffffff'
  tertiary-container: '#007bb9'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#7ffc97'
  primary-fixed-dim: '#62df7d'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005320'
  secondary-fixed: '#caead6'
  secondary-fixed-dim: '#afceba'
  on-secondary-fixed: '#042014'
  on-secondary-fixed-variant: '#314d3e'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.005em
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system projects clarity, environmental accountability, and operational precision. Designed for modern municipal operators, facility sustainability leads, and corporate waste auditors, the interface strips away ecological clichés (rough burlap textures, literal leaf graphics) in favor of a crisp, metric-driven digital workspace.

The emotional baseline is transparent, proactive, and calm. Operational complexity—such as route logistics, disposal diversion ratios, and hazardous materials tracking—is mediated through generous whitespace, high legibility, and a deliberate rhythm of soft organic surfaces paired with sharp data visualizations.

The design movement is **Modern Clean Minimalist** infused with tactical environmental color-coding:
- Crisp white canvas grounded by deep slate typography to eliminate cognitive fatigue during extended operational monitoring.
- Strategic vivid emerald accents that highlight critical paths, diversion success metrics, and positive actions.
- Tonal sage and mint containers that structure information cleanly without the heavy visual noise of harsh structural borders.

## Colors

The palette is rooted in functional environmental governance. It separates active operational triggers from ambient administrative views through light, high-luminance surfaces and deep, legible neutrals.

### Palette Architecture
- **Primary (`#16a34a` / Emerald 600):** Represents vital operational health, successful diversion, recycling milestones, and primary user interactions (e.g., dispatching routes, logging diversion events).
- **Secondary (`#dcfce7` / Mint 100):** Forms low-strain surface containers, active tab highlights, and badge backdrops, signaling ecological compliance without demanding primary attention.
- **Tertiary (`#0284c7` / Sky 600):** Assigned to logistics, telemetry data, transfer stations, and route optimization metrics to prevent operational confusion with pure ecological status indicators.
- **Neutral (`#0f172a` / Slate 900):** High-density text neutral paired with slate supporting tones (`#334155` Slate 700 for secondary copy, `#64748b` Slate 500 for captions).

### Functional Accents & Status Roles
- **Alert / Warning (`#f59e0b` / Amber 500):** Overflow warnings, pickup delays, and threshold variances.
- **Critical / Danger (`#ef4444` / Red 500):** Hazardous contamination flags, missed routes, and regulatory infractions.
- **Surface Canvas (`#f8fafc` / Slate 50), Card Base (`#ffffff`), and Container Fill (`#f0fdf4` / Mint 50):** Provide tiered depth while maintaining maximum contrast against dark slate text.

## Typography

The design system implements a single, high-performance typographic engine using **Inter**. This unifies numerical telemetry, operational tabular data, and editorial system messages into a cohesive voice.

### Hierarchy & Usage
- **Display & Large Headlines:** Reserved for high-level ecological metrics (e.g., net diversion rate percentages, monthly landfill totals). Tighter tracking (`-0.02em`) creates an authoritative and modern stance.
- **Titles & Subheadings:** Used across card headers, table segments, and drawer dialogs. Rendered in semi-bold (`600`) to anchor scanning eyes.
- **Body:** Standardized at `14px` (`body-md`) for optimal density in operational tables, form controls, and live operational updates.
- **Data & Numeric Displays:** Numerical tabular figures (`font-variant-numeric: tabular-nums`) must be applied across waste tonnage, sensor fill rates, and route GPS timings to guarantee optical column alignment.

## Layout & Spacing

The layout is built upon an 8pt architectural rhythm, translating smoothly from single-column mobile field inspections to a multi-pane responsive desktop command center.

### Screen Adaptations & Layout Model
- **Desktop (1024px+):** Fixed 260px collapsible sidebar navigation containing core domain modules (Fleet, Routes, Facility Sensors, ESG Reporting), paired with a fluid main workspace bounded by a max-width container (`1440px`). Grid layouts utilize a 12-column structure with `1.5rem` (`24px`) gutters.
- **Tablet (768px - 1023px):** Collapsed icon-rail navigation sidebar (72px). Content grids transition from 12 to 8 columns with sticky filter action bars.
- **Mobile (< 768px):** Single-column stack governed by a fixed top utility bar (location selector, profile, notifications) and a persistent 5-item bottom destination bar. Gutter drops to `1rem` (`16px`) to maximize data readability.

### Component Spacing Rhythm
- **Internal Card Padding:** Standardized to `space-lg` (24px) for desktop summary widgets; condensed to `space-md` (16px) on mobile viewports.
- **Data Density:** Sensor readouts, vehicle manifests, and audit lists utilize a compact row spacing of `space-sm` (8px) vertical gap with `space-md` (16px) horizontal gutters.

## Elevation & Depth

Visual hierarchy uses ambient diffusion rather than aggressive physical drops, maintaining an airy, modern, eco-conscious aesthetic.

### Layering Principles
- **Canvas Base:** Flat slate background (`#f8fafc`) serves as the foundation.
- **Level 1 (Card & Module Layer):** Pure white surfaces (`#ffffff`) resting over the canvas. Elevation is rendered using an ambient soft-drop shadow: `0 4px 20px -2px rgba(15, 23, 42, 0.05)`. This creates separation without sharp boundaries.
- **Level 2 (Interactive Floating Elements):** Dropdown menus, tooltips, popovers, and sticky tab headers use `0 10px 25px -3px rgba(15, 23, 42, 0.08)`.
- **Level 3 (Modal Dialogs & Slide-out Drawers):** Backdrop overlay uses Slate 900 tinted to 30% opacity (`rgba(15, 23, 42, 0.3)`) paired with a `4px` blur filter, creating a soft transition that highlights active audit or dispatch dialogs.
- **Outlines:** Flat borders are strictly limited to `#e2e8f0` (Slate 200) at 1px thickness on card headers and tabular divides.

## Shapes

The design system applies a refined rounded language (Level 2) that softens operational data interfaces while preserving technical discipline.

### Geometry Hierarchy
- **Standard UI Elements (`0.5rem` / 8px):** Checkboxes, form text inputs, small badges, and action tooltips.
- **Cards & Content Panels (`1rem` / 16px):** Metric scorecards, bin status trackers, data visualization modules, and desktop tables.
- **Prominent Interactive Containers (`1.5rem` / 24px):** Quick-action banners, route preview overlays, and high-level summary cards.
- **Pills / Circular (`9999px`):** Status indicator tags, fleet dispatch chips, and floating action triggers.

## Components

### Buttons
- **Primary:** Solid `#16a34a` (Emerald 600) with white text, font weight 600, height 40px (desktop) / 44px (mobile), rounded to 8px (`rounded-md`). Subtle micro-interaction: `transform: translateY(-1px)` and box-shadow expansion on hover.
- **Secondary:** Surface fill `#f0fdf4` (Mint 50), text `#16a34a` (Emerald 600), border 1px solid `#bbf7d0` (Mint 200).
- **Destructive:** Surface fill `#fee2e2` (Red 100), text `#dc2626` (Red 600), hover background `#fecaca`.
- **Ghost:** Transparent background with `#334155` (Slate 700) text, turning into `#f1f5f9` (Slate 100) on hover.

### Metric & Sensor Cards
- Container built with `#ffffff`, rounded-xl (`16px`), padded with `24px` (`space-lg`), and ambient shadow.
- Header row contains the category label (`label-md` in `#64748b`) paired with a pill status chip on the top-right.
- Value section renders metric statistics in `display-mobile` (`36px`, weight 700, `#0f172a`), followed by inline contextual trend chips (e.g., `+12.4% vs last week` in green/mint badge).

### Status Chips & Badges
- Strict height of 24px with horizontal padding of 10px, font size `12px` (`label-md`), full pill curvature (`rounded-full`).
- **Optimal / Diverted:** Background `#dcfce7`, text `#15803d`.
- **In Transit / Routing:** Background `#e0f2fe`, text `#0369a1`.
- **Capacity Warning:** Background `#fef3c7`, text `#b45309`.
- **Contaminated / Overflow:** Background `#fee2e2`, text `#b91c1c`.

### Form Inputs & Selectors
- Height 40px, background `#ffffff`, border 1px solid `#cbd5e1` (Slate 300), corner radius 8px (`rounded-md`), text 14px (`body-md`).
- Focus state: border color `#16a34a` with a 3px outer halo in `rgba(22, 163, 74, 0.15)`.
- Input labels use `label-md` in `#334155` positioned 6px above the field.

### Tabbed Navigation
- Segmented pill style: Contained within a `#f1f5f9` (Slate 100) rounded track with `4px` padding.
- Active tab features a `#ffffff` pill background, ambient card shadow, and `#0f172a` weight 600 text. Inactive tabs display `#64748b` text with smooth color transition on hover.

### Checkboxes & Radios
- Size 18px × 18px with a 4px corner radius for checkboxes, full circle for radios.
- Unchecked: 1.5px border `#94a3b8` (Slate 400).
- Checked: `#16a34a` solid background with a centered crisp white checkmark SVG.