/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18181b",
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          600: "#0d9488",
          700: "#0f766e",
          900: "#134e4a"
        }
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.09)"
      }
    }
  },
  plugins: []
};
