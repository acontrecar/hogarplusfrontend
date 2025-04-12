import React from "react";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "../../store/auth";

export default function HomeScreen() {
  const { logOut } = useAuthStore();

  return (
    <View>
      <Pressable onPress={logOut}>
        <Text>Log out</Text>
      </Pressable>
    </View>
  );
}
