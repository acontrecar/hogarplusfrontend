import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  Pressable,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import ToastService from "../../../services/ToastService";
import { AnimatedButtonCustom } from "../../../ui/components/AnimatedButtonCustom";
import colors from "../../../constants/colors";
import { useRouter } from "expo-router";
import { useHomeStore } from "../../../store/useHomeStore";
import { sleep } from "../../../hooks/useSleep";

export default function SearchHomeModal() {
  const [searchCode, setSearchCode] = useState("4ZSbJ4ZTL8pYKyV");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { joinPersonToHome, getHomesByUser } = useHomeStore();

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      ToastService.info("Código vacío", "Ingresa un código válido");
      return;
    }
    setIsLoading(true);
    try {
      const success = await joinPersonToHome(searchCode.trim());
      if (success) {
        ToastService.success("¡Éxito!", "Te has unido al hogar correctamente");
        await getHomesByUser();
        sleep(1000).then(() => router.back());
      } else {
        ToastService.error("Error", "Código inválido o hogar no encontrado");
      }
    } catch (error) {
      ToastService.error("Error", "Ocurrió un problema al unirse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    >
      <Pressable style={styles.backdrop} onPress={() => router.back()} />
      <View style={styles.modalContent}>
        <Text style={styles.title}>Unirse a un hogar existente</Text>

        <TextInput
          style={styles.input}
          placeholder="Ingresa el código de invitación"
          placeholderTextColor="#999"
          value={searchCode}
          onChangeText={setSearchCode}
          autoFocus={true}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={{ alignItems: "center" }}>
          <AnimatedButtonCustom
            label={isLoading ? "Buscando..." : "Unirse"}
            onPress={handleSearch}
            disabled={isLoading}
            customStyles={styles.button}
            labelStyle={styles.buttonText}
          />
        </View>

        {isLoading && (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={styles.loader}
          />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  loader: {
    marginTop: 15,
  },
});
