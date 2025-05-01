import { Dimensions, StyleSheet } from "react-native";
import colors from "../../constants/colors";

const { width } = Dimensions.get("window");

export const authStyles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: "15%",
  },
  title: {
    fontSize: 48,
    // fontWeight: "bold",
    color: colors.dark,
  },
  subtitle: {
    textAlign: "center",
    color: colors.dark,
    marginTop: "15%",
    fontSize: 18,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: colors.light,
    borderColor: colors.primaryLight,
    borderWidth: 1,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 24,
    width: width * 0.8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  toggleButtonActive: {
    borderRadius: 999,
    backgroundColor: "#8EFAC8",
  },
  toggleText: {
    color: "#51B285",
    fontWeight: "500",
  },
  toggleTextActive: {
    color: colors.dark,
  },
  form: {
    width: "100%",
    gap: 16,
    alignItems: "center",
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderColor: colors.dark,
    borderWidth: 1,
    fontSize: 16,
    width: width * 0.7,
  },
  inputError: {
    borderColor: colors.accentRed,
    borderWidth: 2,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 24,
    alignItems: "center",
  },
  formButton: {
    backgroundColor: "#8EFAC8",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    width: width * 0.5,
  },
  formButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
  errorContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  errorText: {
    color: colors.accentRed,
    fontSize: 16,
  },
});
