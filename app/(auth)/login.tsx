import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { Text, TextInput, Pressable, View } from 'react-native';
import { MotiViewCustom } from '../../ui/components/MotiViewCustom';
import { authStyles } from '../../ui/styles/auth.styles';
import { useAuthStore } from '../../store/useAuthStore';
import { APP_ROUTES, AUTH_ROUTES } from '../../constants/routes';
import { globalStyles } from '../../constants/styles';
import { useState } from 'react';

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const router = useRouter();
  const [errorApi, setErrorApi] = useState('');
  const { logIn, errorMessage } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: 'antonio@example.com',
      // email: 'juan.perez@ejemplo.com',
      // email: 'antonio@example4kfng.com',
      password: 'supersegura123'
      // password: 'strongpassword123'
    },
    mode: 'onChange'
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setErrorApi('');
    const { email, password } = data;

    if (email.trim().length === 0 || password.trim().length < 6) {
      setErrorApi('El correo o la contraseña no puede estar vacío.');
      return;
    }

    const success = await logIn(email, password);

    if (!success) {
      setErrorApi('Error al logear.');
    } else {
      router.replace(APP_ROUTES.home);
    }
  };

  const handleToRegister = () => {
    router.replace(AUTH_ROUTES.register);
  };

  return (
    <MotiViewCustom style={globalStyles.container}>
      <MotiViewCustom style={authStyles.header}>
        <Text style={authStyles.title}>HOGAR+</Text>
        <Text style={authStyles.subtitle}>Organización y armonía, todo en un solo lugar.</Text>
      </MotiViewCustom>

      {errorMessage && (
        <MotiViewCustom style={authStyles.errorContainer}>
          <Text style={authStyles.errorText}>{errorMessage}</Text>
        </MotiViewCustom>
      )}

      <MotiViewCustom style={authStyles.toggleContainer}>
        <Pressable style={[authStyles.toggleButton, authStyles.toggleButtonActive]}>
          <Text style={[authStyles.toggleText, authStyles.toggleTextActive]}>Inicio</Text>
        </Pressable>
        <Pressable
          style={authStyles.toggleButton}
          onPress={handleToRegister}
        >
          <Text style={authStyles.toggleText}>Registro</Text>
        </Pressable>
      </MotiViewCustom>

      <MotiViewCustom style={authStyles.form}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'El correo es obligatorio.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Correo inválido.'
            }
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
        <MotiViewCustom>{errors.email && <Text style={{ color: 'red' }}>{errors.email.message}</Text>}</MotiViewCustom>

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'La contraseña es obligatoria.',
            minLength: {
              value: 6,
              message: 'Mínimo 6 caracteres.'
            }
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
        <MotiViewCustom transition={{ type: 'timing', duration: 1000 }}>
          {errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}
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
