import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { Text, TextInput, Pressable, View } from "react-native";
import { MotiViewCustom } from "../../ui/components/MotiViewCustom";
import { authStyles } from "../../ui/styles/auth.styles";
import { useAuthStore } from "../../store/auth";
import { AUTH_ROUTES } from "../../constants/routes";
import { globalStyles } from "../../constants/styles";

type RegisterFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
};

export default function RegisterScreen() {
  const router = useRouter();
  // const { login } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    // const success = await login(data.email, data.password);
    // if (success) {
    //   router.replace("/home");
    // } else {
    //   alert("Credenciales incorrectas.");
    // }
  };

  const handleToLogin = () => {
    router.replace(AUTH_ROUTES.login);
  };

  return (
    <MotiViewCustom style={globalStyles.container}>
      <MotiViewCustom style={authStyles.header}>
        <Text style={authStyles.title}>HOGAR+</Text>
        <Text style={authStyles.subtitle}>
          Organización y armonía, todo en un solo lugar.
        </Text>
      </MotiViewCustom>

      <MotiViewCustom style={authStyles.toggleContainer}>
        <Pressable style={authStyles.toggleButton}>
          <Text style={authStyles.toggleText} onPress={handleToLogin}>
            Inicio
          </Text>
        </Pressable>
        <Pressable
          style={[authStyles.toggleButton, authStyles.toggleButtonActive]}
        >
          <Text style={[authStyles.toggleText, authStyles.toggleTextActive]}>
            Registro
          </Text>
        </Pressable>
      </MotiViewCustom>

      <MotiViewCustom style={authStyles.form}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "El correo es obligatorio.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Correo inválido.",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={authStyles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#A0A0A0"
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        <MotiViewCustom>
          {errors.email && (
            <Text style={{ color: "red" }}>{errors.email.message}</Text>
          )}
        </MotiViewCustom>

        <Controller
          control={control}
          name="password"
          rules={{
            required: "La contraseña es obligatoria.",
            minLength: {
              value: 6,
              message: "Mínimo 6 caracteres.",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={authStyles.input}
              placeholder="Contraseña"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <MotiViewCustom>
          {errors.password && (
            <Text style={{ color: "red" }}>{errors.password.message}</Text>
          )}
        </MotiViewCustom>

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "La contraseña es obligatoria.",
            minLength: {
              value: 6,
              message: "Mínimo 6 caracteres.",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={authStyles.input}
              placeholder="Cconfirmar contraseña"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <MotiViewCustom transition={{ type: "timing", duration: 1000 }}>
          {errors.confirmPassword && (
            <Text style={{ color: "red" }}>
              {errors.confirmPassword.message}
            </Text>
          )}
        </MotiViewCustom>

        <Controller
          control={control}
          name="name"
          rules={{
            required: "El nombre es obligatorio.",
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={authStyles.input}
              placeholder="Contraseña"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <MotiViewCustom transition={{ type: "timing", duration: 1000 }}>
          {errors.name && (
            <Text style={{ color: "red" }}>{errors.name.message}</Text>
          )}
        </MotiViewCustom>
      </MotiViewCustom>

      <MotiViewCustom style={authStyles.buttonContainer}>
        <Pressable
          style={authStyles.formButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={authStyles.formButtonText}>Iniciar sesión</Text>
        </Pressable>
      </MotiViewCustom>
    </MotiViewCustom>
  );
}
