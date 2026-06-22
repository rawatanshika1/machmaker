import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      boxShadow: {
        card: '0 20px 45px rgba(15, 23, 42, 0.08)',
      },
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#dbeafe',
          500: '#2563eb',
          600: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
};

export default config;
