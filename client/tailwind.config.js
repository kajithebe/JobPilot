/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Sani's Figma colour tokens — update these once Sani shares them
        primary: "#2563EB",
        secondary: "#7C3AED",
        accent: "#F59E0B",
        background: "#F9FAFB",
        surface: "#FFFFFF",
        danger: "#EF4444",
        success: "#10B981",
      },
    },
  },
  plugins: [],
};
