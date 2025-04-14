import * as ImagePicker from "expo-image-picker";

export class CameraAdapter {
  static async takePicture(): Promise<string[]> {
    await ImagePicker.requestCameraPermissionsAsync();
    const response = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.back,
      allowsEditing: true,
      quality: 1,
    });

    if (response.canceled) return [];

    if (response.assets && response.assets[0].uri) {
      return [response.assets[0].uri];
    }

    return [];
  }

  static async getPicturesFromLibrary(): Promise<string[]> {
    await ImagePicker.requestMediaLibraryPermissionsAsync();

    const response = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      selectionLimit: 10,
    });

    if (response.canceled) return [];

    if (response.assets && response.assets.length > 0) {
      return response.assets.map((asset) => asset.uri);
    }

    return [];
  }
}
