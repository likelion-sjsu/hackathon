export const theme = {
  colors: {
    light: {
      primary: "#836AAD",
      secondary: "#A6A6A6",
      background: "#fff",
      text: "#333333",
      white: "#FFFFFF",
      gray: "#666666",
    },
    dark: {},
  },
  fonts: {
    regular: "Montserrat_400Regular",
    medium: "Montserrat_500Medium",
    bold: "Montserrat_700Bold",
  },
  fontSize: {
    larger: "40px",
    large: "28px",
    medium: "24px",
    small: "20px",
    smaller: "16px",
    smallest: "14px",
  },
};

export type ThemeType = typeof theme;
