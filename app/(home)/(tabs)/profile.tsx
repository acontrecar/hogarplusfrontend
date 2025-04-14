import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MotiViewCustom } from "../../../ui/components/MotiViewCustom";
import { useAuthStore } from "../../../store/auth";
import { ButtonCustom } from "../../../ui/components/ButtonCustom";
import { globalStyles } from "../../../constants/styles";
import colors from "../../../constants/colors";
import { useScreenDimensions } from "../../../hooks/useScreenDimensions";
import { useState } from "react";
import { CameraAdapter } from "../../../config/adapters/camera-adapter";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { logOut } = useAuthStore();
  const { width } = useScreenDimensions();
  const router = useRouter();

  const handleSelectImage = () => {
    Alert.alert("Cambiar foto", "Selecciona una opción", [
      {
        text: "Cámara",
        onPress: async () => {
          const images = await CameraAdapter.takePicture();
          if (images.length > 0) setProfileImage(images[0]);
        },
      },
      {
        text: "Galería",
        onPress: async () => {
          const images = await CameraAdapter.getPicturesFromLibrary();
          if (images.length > 0) setProfileImage(images[0]);
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  return (
    <MotiViewCustom style={globalStyles.container}>
      <TouchableOpacity onPress={handleSelectImage}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <FontAwesome name="user" size={40} color="#9CA3AF" />
          </View>
        )}
      </TouchableOpacity>

      <MotiViewCustom style={globalStyles.form}>
        <TextInput
          style={[globalStyles.input, { width: width * 0.7 }]}
          placeholder="Correo electrónico"
          placeholderTextColor="#A0A0A0"
          //   onChangeText={onChange}
          //   value={value}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[globalStyles.input, { width: width * 0.7 }]}
          placeholder="Contraseña"
          placeholderTextColor="#A0A0A0"
          secureTextEntry
        />
        <TextInput
          style={[globalStyles.input, { width: width * 0.7 }]}
          placeholder="Telefono de contacto"
          placeholderTextColor="#A0A0A0"
          keyboardType="phone-pad"
          autoCapitalize="none"
        />
      </MotiViewCustom>

      <ButtonCustom
        customStyles={{ backgroundColor: colors.primaryLight }}
        label="Cambiar datos"
      />
      <ButtonCustom
        customStyles={{ backgroundColor: colors.infoBlue }}
        label="Gestionar viviendas"
        onPress={() => router.push("/(home)/manage-homes")}
      />
      <ButtonCustom
        customStyles={{ backgroundColor: colors.accentRed }}
        onPress={logOut}
        label="Salir"
      />
    </MotiViewCustom>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
  },
});
