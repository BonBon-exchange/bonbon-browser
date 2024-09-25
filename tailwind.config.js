// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,scss}'], // Ensure all relevant files are included
  theme: {
    extend: {
      colors: {
        'background-tertiary': 'var(--color-background-tertiary)',
        'text-primary': 'var(--color-text-primary)',
        'background-primary': 'var(--color-background-primary)',
        'background-5': 'var(--color-background-5)',
      },
    },
  },
  plugins: [],
};
