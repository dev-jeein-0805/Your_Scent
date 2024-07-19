/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        loginColor: "#E08857",
        loginBgColor: "#D9D9D9",
      },
      width: {
        100: "420px",
        120: "480px",
        130: "500px",
        150: "600px",
        200: "750px",
        300: "1000px",
        350: "1200px",
      },
      height: {
        120: "480px",
        130: "500px",
        200: "600px",
      },
    },
  },
  plugins: [],
};
