import React from "react";
import { Slot, Stack } from "expo-router";
import { AuthProvider } from "../providers/AuthProvider";
import Toast from "react-native-toast-message";
import { toastConfig } from "../config/toastConfig";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { QueryProvider } from "../providers/QueryProviders";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        {/* <QueryProvider> */}
        <SafeAreaProvider>
          {/* <SafeAreaView
          style={{
            flex: 1,
            }}
            > */}
          {/* <Stack screenOptions={{ headerShown: false }}></Stack> */}
          <Slot />
          <Toast config={toastConfig} />
          {/* </SafeAreaView> */}
        </SafeAreaProvider>
        {/* </QueryProvider> */}
      </PaperProvider>
    </AuthProvider>
  );
}
