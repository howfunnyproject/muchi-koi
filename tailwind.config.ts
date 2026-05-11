import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          DEFAULT: "#4A3428",
          dark: "#3A2418",
          light: "#6B5040",
        },
        beige: {
          DEFAULT: "#F5EBDD",
          dark: "#E0D0BC",
          light: "#FAF8F5",
        },
        gold: {
          DEFAULT: "#d4952a",
          light: "#f0b84a",
        },
        "muted-green": "#66785F",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Hind Siliguri", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
