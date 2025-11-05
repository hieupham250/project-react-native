import {
  MD3LightTheme as LightTheme,
  MD3DarkTheme as DarkTheme,
  PaperProvider,
} from "react-native-paper";
import { useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import React from "react";

const queryClient = new QueryClient();

const customLightTheme = {
  ...LightTheme,
  colors: {
    ...LightTheme.colors,
    primary: "#007AFF",
    background: "#fff",
  },
};

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#007AFF",
    background: "#000",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? customDarkTheme : customLightTheme;

  return (
    <PaperProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </PaperProvider>
  );
}
