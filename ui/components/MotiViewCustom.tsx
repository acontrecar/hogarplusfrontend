import { MotiView } from "moti";
import { PropsWithChildren } from "react";
import { StyleProp, ViewStyle } from "react-native";

interface MotiViewCustomProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  from?: object;
  animate?: object;
  transition?: object;
}

export const MotiViewCustom = ({
  style,
  children,
  from = { opacity: 0, translateY: 20 },
  animate = { opacity: 1, translateY: 0 },
  transition = { type: "timing", duration: 500 },
}: MotiViewCustomProps) => {
  return (
    <MotiView
      from={from}
      animate={animate}
      transition={transition}
      style={style}
    >
      {children}
    </MotiView>
  );
};
