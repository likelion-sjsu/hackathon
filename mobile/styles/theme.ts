export const theme = {
  colors: {
    light: {
      primary: "#836AAD",
      secondary: "#A6A6A6",
      background: "#fff",
      text: "#333333",
      white: "#FFFFFF",
    },
    dark: {},
  },
  fonts: {
    regular: "Montserrat_400Regular",
    medium: "Montserrat_500Medium",
    bold: "Montserrat_700Bold",
  },
  fontSize: {
    large: "1.8rem",
    medium: "1.5rem",
    small: "1.2rem",
    smaller: "1rem",
  },
};

export type ThemeType = typeof theme;
