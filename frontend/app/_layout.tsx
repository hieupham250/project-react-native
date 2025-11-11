import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React from "react";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="room-detail/[id]" />
        <Stack.Screen name="room-photo/[id]" />
        <Stack.Screen name="search" />
        <Stack.Screen name="filter" />
        <Stack.Screen name="booking/write-review" />
      </Stack>
    </QueryClientProvider>
  );
}
