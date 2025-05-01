import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../providers/AuthProvider";
import Toast from "react-native-toast-message";
import { toastConfig } from "../config/toastConfig";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}></Stack>
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}
