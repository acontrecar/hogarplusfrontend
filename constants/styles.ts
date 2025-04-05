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
});
