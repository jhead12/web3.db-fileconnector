// postcss.config.mjs (in project root)
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // Or potentially just 'tailwindcss': {} if Next.js handles the wrapper, but your error indicated @tailwindcss/postcss
    'autoprefixer': {},
  },
};