import { View, Text, StyleSheet } from "react-native";
import { MotiViewCustom } from "../../ui/components/MotiViewCustom";
import { ButtonCustom } from "../../ui/components/ButtonCustom";
import { globalStyles } from "../../constants/styles";

export default function ManageHomesScreen() {
  return (
    <MotiViewCustom style={globalStyles.container}>
      <ButtonCustom label="Crear hogar" />
    </MotiViewCustom>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
