import Header from "@/components/Header";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { Stack } from "expo-router";
import { ThemeProvider } from "styled-components/native";
import { theme } from "@/styles/theme";
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";
import { StyledView } from "../styles/GlobalStyle";

export default function RootLayout() {
  // load font
  const [_] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  return (
    <ThemeProvider theme={theme}>
      <StyledView style={styles.content}>
        <Stack
          screenOptions={{
            header: () => <Header />,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </StyledView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: theme.colors.light.background,
    fontFamily: "Montserrat_400Regular",
  },
});
