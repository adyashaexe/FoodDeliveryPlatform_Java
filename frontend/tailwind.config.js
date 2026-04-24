/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        shell: "#f7f0e3",
        ink: "#1f2937",
        coral: "#f97360",
        turmeric: "#f4b942",
        basil: "#2c7a6b",
        berry: "#a63d40",
      },
      boxShadow: {
        floaty: "0 18px 45px rgba(54, 39, 28, 0.15)",
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        body: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
    },
  },
  plugins: [],
};
