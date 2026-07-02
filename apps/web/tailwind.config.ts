import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        diorama: {
          bg: "#F4F1EA",
          blue: "#1A365D",
          dark: "#111111",
        },
      },
    },
  },
  plugins: [],
};

export default config;