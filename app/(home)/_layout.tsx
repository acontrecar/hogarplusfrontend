import { Stack, useNavigation } from "expo-router";

export default function HomeLayout() {
  //   const navigation = useNavigation();
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)/create-home"
          options={{
            presentation: "transparentModal",
            animation: "fade",
            // presentation: "modal",
            headerShown: false,
            gestureEnabled: true,
            // animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="(modals)/confirm"
          options={{
            presentation: "transparentModal",
            animation: "fade",
            // presentation: "modal",
            headerShown: false,
            gestureEnabled: true,
            // animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="(modals)/modalOutHome"
          options={{
            presentation: "transparentModal",
            animation: "fade",
            // presentation: "modal",
            headerShown: false,
            gestureEnabled: true,
            // animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="(modals)/search-home"
          options={{
            presentation: "transparentModal",
            animation: "fade",
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="manage-homes"
          options={{
            title: "Gestionar Viviendas",
            headerShown: true,
          }}
        />
      </Stack>
    </>
  );
}
