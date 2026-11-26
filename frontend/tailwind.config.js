/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(${variableName}) / ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: withOpacity("--color-primary"),
        "primary-container": withOpacity("--color-primary-container"),
        "on-primary": withOpacity("--color-on-primary"),
        "on-primary-container": withOpacity("--color-on-primary-container"),
        "primary-fixed": withOpacity("--color-primary-fixed"),
        "primary-fixed-dim": withOpacity("--color-primary-fixed-dim"),
        "on-primary-fixed": withOpacity("--color-on-primary-fixed"),
        "on-primary-fixed-variant": withOpacity("--color-on-primary-fixed-variant"),

        secondary: withOpacity("--color-secondary"),
        "secondary-container": withOpacity("--color-secondary-container"),
        "on-secondary-container": withOpacity("--color-on-secondary-container"),
        "secondary-fixed": withOpacity("--color-secondary-fixed"),
        "secondary-fixed-dim": withOpacity("--color-secondary-fixed-dim"),
        "on-secondary-fixed": withOpacity("--color-on-secondary-fixed"),
        "on-secondary-fixed-variant": withOpacity("--color-on-secondary-fixed-variant"),

        tertiary: withOpacity("--color-tertiary"),
        "tertiary-container": withOpacity("--color-tertiary-container"),
        "on-tertiary-container": withOpacity("--color-on-tertiary-container"),
        "tertiary-fixed": withOpacity("--color-tertiary-fixed"),
        "tertiary-fixed-dim": withOpacity("--color-tertiary-fixed-dim"),
        "on-tertiary-fixed": withOpacity("--color-on-tertiary-fixed"),
        "on-tertiary-fixed-variant": withOpacity("--color-on-tertiary-fixed-variant"),

        background: withOpacity("--color-background"),
        "on-background": withOpacity("--color-on-background"),
        surface: withOpacity("--color-surface"),
        "surface-bright": withOpacity("--color-surface-bright"),
        "surface-dim": withOpacity("--color-surface-dim"),
        "surface-variant": withOpacity("--color-surface-variant"),
        "surface-container-lowest": withOpacity("--color-surface-container-lowest"),
        "surface-container-low": withOpacity("--color-surface-container-low"),
        "surface-container": withOpacity("--color-surface-container"),
        "surface-container-high": withOpacity("--color-surface-container-high"),
        "surface-container-highest": withOpacity("--color-surface-container-highest"),
        "on-surface": withOpacity("--color-on-surface"),
        "on-surface-variant": withOpacity("--color-on-surface-variant"),

        outline: withOpacity("--color-outline"),
        "outline-variant": withOpacity("--color-outline-variant"),

        error: withOpacity("--color-error"),
        "error-container": withOpacity("--color-error-container"),
        "on-error-container": withOpacity("--color-on-error-container"),

        eco: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#00ff94',
          600: '#00cc76',
          700: '#059669',
          800: '#065f46',
          900: '#064e3b',
          950: '#04140c',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      transitionTimingFunction: {
        'expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        'card': '0 4px 24px -4px rgba(0, 0, 0, 0.08)',
        'modal': '0 24px 48px -12px rgba(0, 0, 0, 0.35)',
        'neon': '0 0 20px rgba(0, 255, 148, 0.22), 0 0 4px rgba(0, 255, 148, 0.45)',
        'neon-strong': '0 0 32px rgba(0, 255, 148, 0.35), 0 0 8px rgba(0, 229, 255, 0.25)',
      }
    },
  },
  plugins: [],
};
