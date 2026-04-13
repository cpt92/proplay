/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#050a1a',
          secondary: '#0b1a3a',
          tertiary: '#11234a',
        },
        card: '#0b1a3a',
        accent: {
          primary: '#e63946',
          secondary: '#ff4d5a',
          tertiary: '#b71c2a',
          hover: '#ff4d5a',
        },
        info: {
          DEFAULT: '#4a7dff',
          soft: 'rgba(74, 125, 255, 0.12)',
        },
        ok: '#34d399',
        warn: '#fbbf24',
        err: '#ff5a67',
        ink: {
          primary: '#eaf0ff',
          secondary: '#8892b0',
          muted: '#5c6784',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(ellipse 700px 380px at 85% -10%, rgba(230,57,70,0.18) 0%, transparent 60%), radial-gradient(ellipse 800px 500px at 10% 110%, rgba(74,125,255,0.14) 0%, transparent 60%), linear-gradient(180deg, #050a1a 0%, #07112a 100%)',
        'accent-gradient': 'linear-gradient(135deg, #e63946 0%, #ff6b78 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease',
        'slide-up': 'slideUp 0.5s ease',
        'pop-in': 'popIn 0.4s ease',
        'gradient-drift': 'gradientDrift 20s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        gradientDrift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
