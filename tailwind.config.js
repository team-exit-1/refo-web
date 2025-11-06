/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Color
        primary: {
          DEFAULT: '#AE93DF',
          light: '#C5B3E6',
          dark: '#897DC9',
        },
        // Secondary Colors
        secondary: {
          deep: '#6667B3',
          medium: '#897DC9',
          blue: '#4E56C0',
        },
        // Neutral Colors
        neutral: {
          light: '#F8F7FC',
          gray: {
            dark: '#2D2D2D',
            medium: '#757575',
          },
        },
        // Semantic Colors
        success: '#7CB342',
        warning: '#FFA726',
        error: '#E57373',
        info: '#64B5F6',
      },
      fontFamily: {
        sans: ['Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      fontSize: {
        'h1': '32px',
        'h2': '24px',
        'h3': '20px',
        'body': '16px',
        'caption': '14px',
        'small': '12px',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(110, 103, 179, 0.1)',
      },
    },
  },
  plugins: [],
}

