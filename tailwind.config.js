/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        teal: {
          DEFAULT: 'rgb(var(--teal) / <alpha-value>)',
          deep: 'rgb(var(--teal-deep) / <alpha-value>)',
          soft: 'rgb(var(--teal-soft) / <alpha-value>)',
        },
        amber: 'rgb(var(--amber) / <alpha-value>)',
        coral: 'rgb(var(--coral) / <alpha-value>)',
        moss: 'rgb(var(--moss) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Grandstander', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 0 0 rgba(23,42,42,0.12), 0 10px 24px -12px rgba(23,42,42,0.35)',
        stamp: '0 1px 0 0 rgba(23,42,42,0.20)',
      },
      borderRadius: {
        chunk: '1.4rem',
      },
    },
  },
  plugins: [],
}
