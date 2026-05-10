import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // WriFe brand palette
        wrife: {
          green: '#27AE60',
          'green-dark': '#1E8449',
          'green-light': '#A9DFBF',
          cream: '#FBF8F1',
          'cream-dark': '#F0EAD6',
          blue: '#2E86C1',
          'blue-light': '#AED6F1',
          orange: '#E8922B',
          'orange-light': '#FAD7A0',
          text: '#2C3E50',
          muted: '#7F8C8D',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#27AE60',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#F0EAD6',
          foreground: '#2C3E50',
        },
        muted: {
          DEFAULT: '#f4f4f5',
          foreground: '#71717a',
        },
        accent: {
          DEFAULT: '#E8922B',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#2C3E50',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#2C3E50',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      fontFamily: {
        sans:    ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Baloo 2', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(39,174,96,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(39,174,96,0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
