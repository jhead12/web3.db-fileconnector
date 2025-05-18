// tailwind.config.cjs (in project root)
/** @type {import('tailwindcss').Config} */
module.exports = { // Assuming .cjs means CommonJS
  content: [
    "./client/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./client/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./client/context/**/*.{js,ts,jsx,tsx,mdx}",
    // Add any other paths within client/ that use Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};