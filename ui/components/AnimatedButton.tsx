import {
  StyleProp,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  ViewStyle,
} from "react-native";

import {
  default as Reanimated,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { sleep } from "../../hooks/useSleep";
import { PropsWithChildren } from "react";

interface AnimatedButtonProps extends PropsWithChildren {
  label: string;
  buttonStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  disabled?: boolean;
}

const AnimatedButton = ({
  label,
  buttonStyle,
  labelStyle,
  onPress = () => {},
  disabled,
  children,
}: AnimatedButtonProps) => {
  const scaleValue = useSharedValue(1);

  const animateButton = () => {
    scaleValue.value = withSequence(
      withTiming(0.95, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );

    sleep(400).then(() => {
      onPress();
    });
  };

  const animateScale = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  return (
    <TouchableWithoutFeedback onPress={animateButton} disabled={disabled}>
      <Reanimated.View
        style={[buttonStyle, animateScale, disabled && { opacity: 0.6 }]}
      >
        {children ?? <Text style={labelStyle}>{label}</Text>}
      </Reanimated.View>
    </TouchableWithoutFeedback>
  );
};

export default AnimatedButton;
