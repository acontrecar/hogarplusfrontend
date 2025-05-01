import { PropsWithChildren, ReactNode } from "react";
import {
  Text,
  StyleProp,
  TextStyle,
  ViewStyle,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import colors from "../../constants/colors";
import { sleep } from "../../hooks/useSleep";

interface AnimatedButtonProps extends PropsWithChildren {
  label?: string;
  onPress?: () => void;
  customStyles?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const AnimatedButtonCustom = ({
  label,
  children,
  onPress = () => {},
  customStyles,
  labelStyle,
  disabled = false,
}: AnimatedButtonProps) => {
  const scaleValue = useSharedValue(1);

  const animateButton = () => {
    scaleValue.value = withSequence(
      withTiming(0.95, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );

    sleep(400).then(() => {
      if (!disabled) onPress();
    });
  };

  const animateScale = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <TouchableWithoutFeedback onPress={animateButton} disabled={disabled}>
      <Reanimated.View
        style={[
          styles.button,
          customStyles,
          animateScale,
          disabled && { opacity: 0.6 },
        ]}
      >
        {children ?? <Text style={[styles.label, labelStyle]}>{label}</Text>}
      </Reanimated.View>
    </TouchableWithoutFeedback>
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
  label: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
});
