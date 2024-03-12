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
        black10: "#01081B",
        bg: "#061536",
        bg2: "#061536",
        blue10: "#2088b8",
        blue20: "#053d56"
      },
    },
  },
  plugins: [],
};
export default config;
