/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // AMOLED base
        amoled: {
          bg: '#000000',
          surface: '#0a0a0a',
          elevated: '#111111',
          border: '#1a1a1a',
          'border-strong': '#2a2a2a',
          muted: '#3a3a3a',
          text: '#ffffff',
          'text-secondary': '#a0a0a0',
          'text-muted': '#606060',
        },
        // Accent
        accent: {
          DEFAULT: '#FF4655',
          hover: '#ff5f6d',
          muted: '#ff465520',
          border: '#ff465540',
        },
        cs: {
          DEFAULT: '#E8A530',
          hover: '#f0b540',
          muted: '#E8A53020',
          border: '#E8A53040',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace']
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      transitionDuration: {
        '250': '250ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      }
    }
  },
  plugins: []
}
