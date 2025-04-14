import { Stack, useNavigation } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeLayout() {
  //   const navigation = useNavigation();
  return (
    <Stack
    //   screnOptions={{
    //     headerLeft: () => (
    //       <FontAwesome
    //         name="arrow-left"
    //         size={20}
    //         color="#000"
    //         onPress={() => navigation.goBack()}
    //       />
    //     ),
    //   }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="manage-homes"
        options={{
          title: "Gestionar Viviendas",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
