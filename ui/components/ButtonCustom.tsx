import { PropsWithChildren, useEffect } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import colors from "../../constants/colors";

interface ButtonCustomProps extends PropsWithChildren {
  onPress?: () => void;
  label: string;
  customStyles?: StyleProp<ViewStyle>;
}

export const ButtonCustom = ({
  label,
  customStyles,
  onPress,
}: ButtonCustomProps) => {
  return (
    <Pressable style={[styles.button, customStyles]} onPress={onPress}>
      <Text>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: "60%",
    margin: 5,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#1E90FF",
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    shadowOpacity: 0.3,
  },
});
