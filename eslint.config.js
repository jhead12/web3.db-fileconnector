// eslint.config.js or eslint.config.mjs

import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ["**/*.js", "**/*.mjs"], // Target JavaScript files
    languageOptions: {
      sourceType: 'module', // If you're using ES modules
      ecmaVersion: 'latest',
    },
    rules: {
      'comma-dangle': ['warn', 'always-multiline'], // Or 'always', 'never', etc.
    },
  },
]);