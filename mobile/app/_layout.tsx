import Header from "@/components/Header";
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components/native";
import { theme } from "@/styles/theme";
import { useFonts } from "expo-font";
import styled from "styled-components";
import { View } from "react-native";
import React from "react";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const StyledView = styled(View)`
  flex: 1;
  font-family: "Montserrat_400Regular";
  background-color: white;
`;

export default function RootLayout() {
  // load font
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <StyledView>
            <Stack
              screenOptions={{
                header: () => <Header />,
              }}
            />
          </StyledView>
        </ThemeProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
