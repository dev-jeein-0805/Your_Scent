/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        loginColor: "#E08857",
      },
      width: {
        130: "500px",
      },
    },
  },
  plugins: [],
};
