import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      boxShadow: {
        card: '0 8px 24px rgba(108, 71, 255, 0.1)',
      },
      colors: {
        brand: {
          50: '#f0ecff',
          100: '#e8e3ff',
          200: '#d4c9ff',
          300: '#c0aeff',
          400: '#a088ff',
          500: '#8966ff',
          600: '#6c47ff',
          700: '#5a37d4',
          800: '#4527aa',
          900: '#351a7f',
        },
        starlit: {
          primary: '#6C47FF',
          accent: '#E8E3FF',
          background: '#FAFAFA',
          text: '#1A1A2E',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
