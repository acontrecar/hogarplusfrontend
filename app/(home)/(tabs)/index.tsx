import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "../../../store/useAuthStore";
import { MotiViewCustom } from "../../../ui/components/MotiViewCustom";
import AnimatedButton from "../../../ui/components/AnimatedButton";
import { AnimatedButtonCustom } from "../../../ui/components/AnimatedButtonCustom";
import * as Linking from "expo-linking";

export default function HomeScreen() {
  const { logOut } = useAuthStore();

  return (
    <MotiViewCustom>
      <AnimatedButtonCustom label="Log out" onPress={logOut} />
      {/* <Pressable onPress={logOut}>
        <Text>Log out</Text>
      </Pressable> */}
      <AnimatedButtonCustom
        label="Entrar a una casa"
        onPress={() => Linking.openURL("hogarplus://join-home/Z13KETm3WGEpRZP")}
      />
    </MotiViewCustom>
  );
}
