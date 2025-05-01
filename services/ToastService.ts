import Toast from "react-native-toast-message";

class ToastService {
  static success(title: string, message?: string) {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
      position: "top",
      visibilityTime: 3000,
      topOffset: 60,
    });
  }

  static error(title: string, message?: string) {
    Toast.show({
      type: "error",
      text1: title,
      text2: message,
      position: "top",
      visibilityTime: 3000,
      topOffset: 60,
    });
  }

  static info(title: string, message?: string) {
    Toast.show({
      type: "info",
      text1: title,
      text2: message,
      position: "top",
      visibilityTime: 3000,
      topOffset: 60,
    });
  }
}

export default ToastService;
