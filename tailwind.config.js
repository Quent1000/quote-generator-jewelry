module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1F2937',
        'dark-card': '#374151',
        'dark-text': '#F3F4F6',
      },
      width: {
        'sidebar': '16rem', // 256px
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'shape-shift': 'shapeShift 30s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'float 8s ease-in-out infinite reverse',
        'float-slow': 'float 15s ease-in-out infinite',
        'float-medium': 'float 12s ease-in-out infinite',
        'float-fast': 'float 10s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': '0% 50%'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': '100% 50%'
          }
        },
        shapeShift: {
          '0%, 100%': { 'border-radius': '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { 'border-radius': '30% 60% 70% 40% / 50% 60% 30% 60%' }
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(15px, 15px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 0.8 },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}