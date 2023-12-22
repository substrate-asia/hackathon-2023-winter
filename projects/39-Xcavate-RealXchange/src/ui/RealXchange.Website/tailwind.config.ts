import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        unbounded: ['Unbounded', 'sans-serif']
      },
      colors: {
        background: 'hsl(0, 0%, 95%)',
        foreground: 'hsl(0, 0%, 31%)',
        primary: {
          DEFAULT: 'hsl(33, 100%, 50%)',
          light: 'hsl(0, 0%, 95%)'
        },
        accent: {
          DEFAULT: 'hsl(202, 100%, 34%)',
          error: 'hsl(353, 74%, 62%)'
        }
      },
      boxShadow: {
        modal: '0px 0px 16px 0px rgba(0, 0, 0, 0.40)',
        disclosure: ' 0px 0px 8px 0px rgba(78, 78, 78, 0.24)',
        'nav-header': ' 0px -1px 4px 0px rgba(0, 0, 0, 0.42)',
        'feature-card': '0px 0.84649px 6.77189px 0px rgba(0, 0, 0, 0.10)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        carousel: 'marquee 60s linear infinite'
      }
    }
  },
  plugins: []
};
export default config;
