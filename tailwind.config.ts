/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: [
      {
        dark: {
          primary: "#212638",
          "primary-content": "#b0b3b8",
          "base-100": "#1d232a",
          "base-200": "#111417",
          "base-300": "#0d0f12",
          "base-content": "#a6adbb",
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      colors: {
        // background: "hsl(var(--background))",
        // foreground: "hsl(var(--foreground))",
        // btn: {
        //   background: "hsl(var(--btn-background))",
        //   "background-hover": "hsl(var(--btn-background-hover))",
        // },
        primary: "#04090b",
        btn: {
          primary: "#000000",
        },
        // "bg-primary": "#04090b",
        // "btn-primary": "#000000",
      },
    },
  },
};
