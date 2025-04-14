import { StyleSheet } from "react-native";
import colors from "./colors";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
    alignItems: "center",
    padding: "5%",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderColor: colors.dark,
    borderWidth: 1,
    fontSize: 16,
    // width: width * 0.7,
  },
  form: {
    width: "100%",
    gap: 16,
    alignItems: "center",
    margin: 16,
  },
});
