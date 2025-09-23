/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006400',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#FF0000',
          foreground: '#ffffff',
        },
      },
    },
  },
} satisfies Config;
