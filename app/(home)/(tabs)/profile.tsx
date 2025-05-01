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
import { AnimatedButtonCustom } from "../../../ui/components/AnimatedButtonCustom";
import { Controller, useForm } from "react-hook-form";
import ToastService from "../../../services/ToastService";

type ProfileFormInputs = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export default function ProfileScreen() {
  const { logOut, updateProfile, user, errorMessage } = useAuthStore();
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.avatar ?? null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormInputs>({
    defaultValues: {
      email: user?.email || "",
      password: "",
      name: user?.name || "",
      phone: user?.phone || "",
    },
    mode: "onChange",
  });

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

  const onSubmit = async (data: ProfileFormInputs) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("updateUserDto", JSON.stringify(data));

    if (profileImage) {
      const fileName = profileImage.split("/").pop();
      formData.append("image", {
        uri: profileImage,
        type: "image/jpeg",
        name: fileName,
      } as any);
    }

    const success = await updateProfile(formData);

    if (success) {
      ToastService.success(
        "Perfil actualizado",
        "Tus cambios fueron guardados correctamente"
      );
    } else {
      ToastService.error(
        "Error al actualizar",
        "Verifica tus datos o intenta más tarde."
      );
    }

    setIsSubmitting(false);
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

      {errorMessage && (
        <MotiViewCustom style={globalStyles.errorContainer}>
          <Text style={globalStyles.errorText}>{errorMessage}</Text>
        </MotiViewCustom>
      )}

      <MotiViewCustom style={globalStyles.form}>
        <Controller
          control={control}
          name="email"
          rules={{
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Correo inválido.",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[globalStyles.input, { width: width * 0.7 }]}
              placeholder="Correo electrónico"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && (
          <MotiViewCustom>
            <Text style={{ color: "red" }}>{errors.email.message}</Text>
          </MotiViewCustom>
        )}

        <Controller
          control={control}
          name="password"
          rules={{
            minLength: {
              value: 6,
              message: "Mínimo 6 caracteres.",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[globalStyles.input, { width: width * 0.7 }]}
              placeholder="Contraseña"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password && (
          <MotiViewCustom>
            <Text style={{ color: "red" }}>{errors.password.message}</Text>
          </MotiViewCustom>
        )}

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[globalStyles.input, { width: width * 0.7 }]}
              placeholder="Nombre"
              placeholderTextColor="#A0A0A0"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          rules={{
            pattern: {
              value: /^\+?[0-9]{7,15}$/,
              message: "Teléfono inválido.",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[globalStyles.input, { width: width * 0.7 }]}
              placeholder="Teléfono de contacto"
              placeholderTextColor="#A0A0A0"
              keyboardType="phone-pad"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.phone && (
          <MotiViewCustom>
            <Text style={{ color: "red" }}>{errors.phone.message}</Text>
          </MotiViewCustom>
        )}
      </MotiViewCustom>

      <AnimatedButtonCustom
        customStyles={{ backgroundColor: colors.primaryLight }}
        label={isSubmitting ? "Actualizando..." : "Cambiar datos"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />
      <AnimatedButtonCustom
        customStyles={{ backgroundColor: colors.infoBlue }}
        label="Gestionar viviendas"
        onPress={() => router.push("/(home)/manage-homes")}
      />
      <AnimatedButtonCustom
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
