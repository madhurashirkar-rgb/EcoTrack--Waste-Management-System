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
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'modal': '0 10px 25px -3px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
}
