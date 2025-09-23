// constants/colors.js
const coffeeTheme = {
  primary: "#8B593E",
  background: "#FFF8F3",
  text: "#4A3428",
  border: "#E5D3B7",
  white: "#FFFFFF",
  textLight: "#9A8478",
  expense: "#E74C3C",
  income: "#2ECC71",
  card: "#FFFFFF",
  shadow: "#000000",
};

const forestTheme = {
  primary: "#2E7D32",
  background: "#E8F5E9",
  text: "#1B5E20",
  border: "#C8E6C9",
  white: "#FFFFFF",
  textLight: "#66BB6A",
  expense: "#C62828",
  income: "#388E3C",
  card: "#FFFFFF",
  shadow: "#000000",
};

const purpleTheme = {
  primary: "#6A1B9A",
  background: "#F3E5F5",
  text: "#4A148C",
  border: "#D1C4E9",
  white: "#FFFFFF",
  textLight: "#BA68C8",
  expense: "#D32F2F",
  income: "#388E3C",
  card: "#FFFFFF",
  shadow: "#000000",
};

const oceanTheme = {
  primary: "#0277BD",
  background: "#E1F5FE",
  text: "#01579B",
  border: "#B3E5FC",
  white: "#FFFFFF",
  textLight: "#4FC3F7",
  expense: "#EF5350",
  income: "#26A69A",
  card: "#FFFFFF",
  shadow: "#000000",
};

const amoledDarkTheme = {
  primary: "#4E9EFF",      // Bright but soft blue for buttons/links
  background: "#000000",   // AMOLED black
  text: "#EAEAEA",         // Slightly off-white for good contrast
  border: "#1F1F1F",       // Subtle border, not too harsh
  white: "#FFFFFF",
  textLight: "#A6A6A6",    // Muted gray for secondary text
  expense: "#FF4D4F",      // Professional red for errors/expenses
  income: "#4CAF50",       // Balanced green for income/success
  card: "#111111",         // Dark gray cards to stand out from background
  shadow: "#000000",       // Keep shadows dark
};


export const THEMES = {
  coffee: coffeeTheme,
  forest: forestTheme,
  purple: purpleTheme,
  ocean: oceanTheme,
  dark: amoledDarkTheme,
};



// 👇 change this to switch theme
export const COLORS = THEMES.coffee;
