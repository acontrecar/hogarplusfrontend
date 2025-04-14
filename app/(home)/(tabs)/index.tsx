import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "../../../store/auth";
import { MotiViewCustom } from "../../../ui/components/MotiViewCustom";

export default function HomeScreen() {
  const { logOut } = useAuthStore();

  return (
    <MotiViewCustom>
      <Pressable onPress={logOut}>
        <Text>Log out</Text>
      </Pressable>
    </MotiViewCustom>
  );
}
