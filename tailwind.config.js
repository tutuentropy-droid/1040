/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // 主色调：深邃藏青
        'maze-bg': '#0f1624',
        'maze-bg-deep': '#070b14',
        'maze-bg-light': '#1a2336',
        // 暗金
        'gold': '#c9a962',
        'gold-light': '#e0c68a',
        'gold-dark': '#a08542',
        'gold-glow': 'rgba(201,169,98,0.15)',
        // 迷雾紫
        'mist-purple': '#6b5b95',
        'mist-purple-light': '#8b7bb5',
        // 月白（文字色）
        'moon-white': '#e8e4d9',
        'moon-dim': '#a8a294',
        // 分类色系
        'cat-ancient': '#E67E22',
        'cat-rationalism': '#3498DB',
        'cat-empiricism': '#27AE60',
        'cat-german': '#9B59B6',
        'cat-modern': '#E74C3C',
        // 关系色
        'rel-inherit': '#27AE60',
        'rel-critique': '#E74C3C',
        'rel-develop': '#3498DB',
        'rel-influence': '#9B59B6',
      },
      fontFamily: {
        'serif-sc': ['"Noto Serif SC"', 'Source Han Serif SC', 'SimSun', 'serif'],
        'kai': ['"LXGW WenKai"', '"KaiTi"', '"STKaiti"', 'serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        'gold-glow': '0 0 24px rgba(201,169,98,0.25), 0 0 48px rgba(201,169,98,0.1)',
        'gold-glow-lg': '0 0 36px rgba(201,169,98,0.35), 0 0 72px rgba(201,169,98,0.15)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'parchment': 'linear-gradient(135deg, #f5f0e0 0%, #ebe4ce 50%, #ddd3b5 100%)',
        'starfield': 'radial-gradient(circle at 20% 30%, rgba(201,169,98,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(107,91,149,0.08) 0%, transparent 50%)',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,169,98,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(201,169,98,0)' },
        },
        breath: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        flow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'breath': 'breath 3s ease-in-out infinite',
        'twinkle': 'twinkle 2.5s ease-in-out infinite',
        'flow': 'flow 8s ease infinite',
      },
    },
  },
  plugins: [],
};
