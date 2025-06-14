import React, { useCallback, useEffect, useState } from 'react';
import { Slot, Stack } from 'expo-router';
import { AuthProvider } from '../providers/AuthProvider';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../config/toastConfig';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import { QueryProvider } from '../providers/QueryProviders';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true
});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Simulación de precarga
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider>
            {/* <QueryProvider> */}
            {/* <SafeAreaView
          style={{
            flex: 1,
            }}
            > */}
            {/* <Stack screenOptions={{ headerShown: false }}></Stack> */}
            <Slot />
            <Toast config={toastConfig} />
            {/* </SafeAreaView> */}
            {/* </QueryProvider> */}
          </PaperProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
