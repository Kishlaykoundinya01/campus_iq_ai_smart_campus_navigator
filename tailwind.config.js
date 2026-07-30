/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        
          navy: {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
  950: '#020617'
},
        
        amber: {
          400: '#FFB84D',
          500: '#F5A623',
          600: '#DB8C0F'
        },
        teal: {
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6'
        },
        coral: {
          400: '#FB8181',
          500: '#FB6B6B',
          600: '#E24D4D'
        },
        slate2: {
          50: '#F7F8FC',
          100: '#EEF0F8',
          200: '#DFE3F0'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        glass: '0 8px 32px rgba(10, 14, 31, 0.35)',
        glow: '0 0 0 1px rgba(245, 166, 35, 0.4), 0 0 24px rgba(245, 166, 35, 0.35)'
      },
      backgroundImage: {
        'grid-glow': 'radial-gradient(circle at 20% 10%, rgba(245,166,35,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(45,212,191,0.12), transparent 40%)'
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem'
      }
    }
  },
  plugins: []
}
