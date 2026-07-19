import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutral dark palette. Restyle freely, nothing here is Weckr specific.
        ink: '#0A0A0A',
        panel: '#111111',
        line: '#1E1E1E',
        accent: '#F59E0B',
      },
    },
  },
  plugins: [],
};

export default config;
