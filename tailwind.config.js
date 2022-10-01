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
          primary: "#18b6f6",
          secondary: "#713fc2",
          accent: "#006ce9",
          neutral: "#3d4451",
          "base-100": "#ffffff",
        },
      },
      "business",
    ],
  },
};
