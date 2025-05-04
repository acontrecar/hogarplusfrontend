import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  TextInput,
} from "react-native";
import { Link, useRouter } from "expo-router";
import Animated, {
  FadeIn,
  FadeOut,
  FadeOutDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { AnimatedButtonCustom } from "../../../ui/components/AnimatedButtonCustom";
import colors from "../../../constants/colors";
import { useHomeStore } from "../../../store/useHomeStore";
import { set } from "react-hook-form";
import ToastService from "../../../services/ToastService";
import { sleep } from "../../../hooks/useSleep";
import { HOME_ROUTES } from "../../../constants/routes";

export default function CreateHomeModal() {
  const [homeName, setHomeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createHome } = useHomeStore();

  const router = useRouter();

  const handleCreate = async () => {
    if (!isValidInput) return;
    console.log("Nombre del hogar:", homeName);
    setIsSubmitting(true);

    const success = await createHome(homeName.trim());

    if (success) {
      ToastService.success(
        "Casa creada",
        "Tu casa ha sido creada correctamente"
      );
      setIsSubmitting(false);
      await sleep(1000);
      router.back();
    } else {
      ToastService.error(
        "Error al crear",
        "Error inesperado, intenta más tarde"
      );
    }

    setIsSubmitting(false);
  };

  const isValidInput = homeName.trim().length > 0;

  const handleBackdropPress = () => {
    router.back();
  };

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <Pressable style={styles.backdrop} onPress={handleBackdropPress} />

      <Animated.View exiting={FadeOut} style={styles.modalContent}>
        <Text style={styles.title}>Crea un nuevo hogar</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre del hogar"
          value={homeName}
          onChangeText={setHomeName}
        />

        <View style={styles.buttonRow}>
          <AnimatedButtonCustom
            customStyles={styles.closeButton}
            onPress={handleBackdropPress}
            label="Cerrar"
            labelStyle={styles.closeText}
          />
          <AnimatedButtonCustom
            customStyles={styles.acceptButton}
            onPress={handleCreate}
            label="Aceptar"
            disabled={!isValidInput || isSubmitting}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    zIndex: 1,
    ...Platform.select({
      android: { elevation: 5 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
    }),
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    // marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    width: "40%",
    padding: 10,
    backgroundColor: colors.accentRed,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },
  acceptButton: {
    width: "40%",
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
