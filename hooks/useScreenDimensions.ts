import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

export const useScreenDimensions = () => {
  const [screen, setScreen] = useState(Dimensions.get("window"));

  useEffect(() => {
    const onChange = ({ window }: { window: any }) => {
      setScreen(window);
    };

    const subscription = Dimensions.addEventListener("change", onChange);

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    width: screen.width,
    height: screen.height,
    isPortrait: screen.height >= screen.width,
    isLandscape: screen.width > screen.height,
  };
};
