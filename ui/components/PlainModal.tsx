import { useLocalSearchParams, useRouter } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { Pressable, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { AnimatedButtonCustom } from "./AnimatedButtonCustom";
import colors from "../../constants/colors";

export const PlanModal = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      <Animated.View exiting={FadeOut} style={styles.modalContent}>
        <Text style={styles.title}>
          ¿Eliminar {params.title || "este elemento"}?
        </Text>

        <View style={styles.buttonRow}>
          <AnimatedButtonCustom
            customStyles={styles.acceptButton}
            onPress={() => router.back()}
            label="Cerrar"
          />
          <AnimatedButtonCustom
            customStyles={styles.closeButton}
            onPress={handleConfirm}
            label="Aceptar"
            labelStyle={styles.closeText}
            // disabled={!isValidInput || isSubmitting}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

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
