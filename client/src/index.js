import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";

const queryClient = new QueryClient();
const root = createRoot(document.getElementById("root"));

const theme = {
  fontBody: {
    fontSize: "17px",
    fontWeight: "400",
  },
  fontBtn: {
    fontSize: "16px",
    fontWeight: "600",
  },
  fontTitle: {
    fontSize: "24px",
    fontWeight: "700",
  },
  fontBigTitle: {
    fontSize: "34px",
    fontWeight: "700",
  },
  mainFont: "#333333",
  secondaryFont: "#A6A6A6",
  white: "#FFFFFF",
  brandColor: "#836AAD",
  soloBackground: "#E1CDF4",
  food: "#FF9090",
  travel: "#56B398",
  hangout: "#7E518E",
  groupCreate: "#BB648D",
  groupJoin: "#6B5D9E",
};

root.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </RecoilRoot>
);
