/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        "quick-theme": {
          primary: "#006ce9",
          secondary: "#713fc2",
          accent: "#18b6f6",
          neutral: "#f1f1f1",
          "base-100": "#ffffff",
        },
      },
      "light",
    ],
  },
};
