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
      }
    },
  },
  plugins: [],
}