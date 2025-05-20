import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { useHomeStore } from "../../store/useHomeStore";

export default function JoinHomeScreen() {
  const { code } = useLocalSearchParams();
  const { joinPersonToHome } = useHomeStore();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!code || typeof code !== "string") {
      setStatus("error");
      setMessage("Código inválido");
      return;
    }

    const joinHome = async () => {
      const res = await joinPersonToHome(code);

      if (res) {
        setStatus("success");
        setMessage("¡Te has unido a la casa correctamente!");

        setTimeout(() => {
          router.replace("/(home)");
        }, 2000);
      } else {
        setStatus("error");
        setMessage("Error al unirse a la casa");
      }
    };

    joinHome();
  }, [code]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      {status === "loading" && (
        <>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 20 }}>Uniéndote a la casa...</Text>
        </>
      )}

      {status === "success" && (
        <Text style={{ fontSize: 18, color: "green", textAlign: "center" }}>
          {message}
        </Text>
      )}

      {status === "error" && (
        <Text style={{ fontSize: 18, color: "red", textAlign: "center" }}>
          {message}
        </Text>
      )}
    </View>
  );
}
