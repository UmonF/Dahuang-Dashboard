/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 游戏面板配色
        'dahuang': {
          'bg-deep': '#0d0f14',
          'bg-mid': '#161a23',
          'bg-surface': '#1e232e',
          'ink': '#2a2a2a',
          'paper': '#e8e0d0',
          'gold': '#c9a227',
        },
      },
      fontFamily: {
        'calligraphy': ['"Ma Shan Zheng"', '"ZCOOL XiaoWei"', 'serif'],
        'serif-cn': ['"Noto Serif SC"', 'Georgia', 'serif'],
        'sans-cn': ['"Noto Sans SC"', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
