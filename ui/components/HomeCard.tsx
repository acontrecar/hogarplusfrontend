import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../../constants/colors";
import {
  Home,
  RolHome,
} from "../../infraestructure/interfaces/home/home.interfaces";
import Animated, { FadeIn } from "react-native-reanimated";
import { AnimatedButtonCustom } from "./AnimatedButtonCustom";
import { useHomeStore } from "../../store/useHomeStore";
import { FontAwesome } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useAuthStore } from "../../store/useAuthStore";
import * as Clipboard from "expo-clipboard";
import ToastService from "../../services/ToastService";
import { Link, useRouter } from "expo-router";

interface HomeCardProps {
  home: Home;
  roll: RolHome;
}

export const HomeCard = ({ home, roll }: HomeCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const {
    homeDetails,
    isLoading,
    getHomeDetails,
    deleteHome,
    exitFromHome,
    deletePersonFromHome,
  } = useHomeStore();
  const { user } = useAuthStore();
  const details = homeDetails[home.id];

  const copyInvitationCode = () => {
    if (home.invitationCode) {
      Clipboard.setStringAsync(home.invitationCode);
      ToastService.success(
        "Código copiado",
        "El código de invitación copiado."
      );
    }
  };

  const onExitHome = () => {
    Alert.alert("¿Salir del hogar?", "¿Estás seguro de que quieres salir?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Aceptar",
        style: "destructive",
        onPress: async () => {
          await exitHome(details.id);
        },
      },
    ]);
  };

  const onDeletePerson = (memberId: number) => {
    Alert.alert(
      "¿Eliminar al usuario?",
      "¿Estás seguro de que quieres eliminar?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Aceptar",
          style: "destructive",
          onPress: async () => {
            await deletePerson(details.id, memberId);
          },
        },
      ]
    );
  };

  const exitHome = async (homeId: number) => {
    const success = await exitFromHome(homeId);

    if (success) {
      ToastService.success(
        "Salida realizada",
        "Has salido del hogar correctamente"
      );
    } else {
      ToastService.error("Error al salir", "No se ha podido salir del hogar");
    }
  };

  const deletePerson = async (homeId: number, memberId: number) => {
    console.log({ homeId, memberId });
    const success = await deletePersonFromHome(homeId, memberId);

    if (success) {
      ToastService.success(
        "Usuario eliminado",
        "Has eliminado al usuario correctamente"
      );
    } else {
      ToastService.error(
        "Error al eliminar",
        "No se ha podido eliminar al usuario"
      );
    }
  };

  useEffect(() => {
    return () => {
      useHomeStore.setState({ homeDetails: {}, homesByUser: [] });
    };
  }, []);

  const toggleExpanded = async () => {
    if (!isExpanded && !details) {
      await getHomeDetails(home.id);
    }

    setIsExpanded((prev) => !prev);
  };

  const deleteButton = async () => {
    if (home.id) {
      await deleteHome(home.id);
    }
  };

  const handleDelete = () => {
    router.push({
      pathname: "/(home)/(modals)/confirm",
      params: {
        title: home.name,
        homeId: home.id.toString(),
      },
    });
  };

  return (
    <AnimatedButtonCustom
      customStyles={{
        width: "100%",
        alignItems: "center",
        padding: 10,
        marginBottom: 10,
        borderWidth: 3,
        borderRadius: 29,
        borderColor: colors.background,
        backgroundColor: colors.light,
      }}
      onPress={toggleExpanded}
    >
      <View>
        <Text style={styles.title}>{home.name}</Text>
      </View>

      {isExpanded && details && (
        <Animated.View entering={FadeIn}>
          {details.members.length > 0 && (
            <View style={styles.expandContainer}>
              {details.members.map((member) => (
                <View key={member.userId} style={styles.memberItem}>
                  <View>
                    {member.avatar ? (
                      <Image
                        source={{ uri: member.avatar }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <FontAwesome name="user" size={20} color="#9CA3AF" />
                      </View>
                    )}
                  </View>

                  <Text numberOfLines={1} style={styles.memberText}>
                    {member.name}
                    {member.email === user?.email && " (Tú) "}
                  </Text>

                  {roll === "admin" && member.email !== user?.email ? (
                    <Pressable onPress={() => onDeletePerson(member.memberId)}>
                      <Feather name="trash-2" size={20} color="black" />
                    </Pressable>
                  ) : (
                    <View></View>
                  )}
                </View>
              ))}
              <View style={[styles.buttonRow]}>
                <AnimatedButtonCustom
                  customStyles={styles.acceptButton}
                  onPress={copyInvitationCode}
                  label="Copiar enlace"
                  disabled={isLoading}
                />
                {roll === "admin" && (
                  // <Link href="/(home)/(modals)/confirm" asChild>
                  <AnimatedButtonCustom
                    customStyles={styles.closeButton}
                    // onPress={deleteButton}
                    onPress={handleDelete}
                    label="Eliminar"
                    labelStyle={styles.closeText}
                  />
                  // </Link>
                )}
                {roll === "member" && (
                  <AnimatedButtonCustom
                    customStyles={styles.closeButton}
                    // onPress={deleteButton}
                    onPress={onExitHome}
                    label="Salir"
                    labelStyle={styles.closeText}
                  />
                )}
              </View>
            </View>
          )}
          {details.members.length === 0 && (
            <Text style={styles.noMembers}>No hay miembros en este hogar</Text>
          )}
        </Animated.View>
      )}
    </AnimatedButtonCustom>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  closeButton: {
    width: "50%",
    backgroundColor: colors.accentRed,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeText: {
    fontWeight: "bold",
  },
  acceptButton: {
    width: "50%",
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 60,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  container: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    padding: 15,
    borderWidth: 2,
    borderColor: colors.background,
    borderRadius: 100,
    backgroundColor: colors.light,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  expandContainer: {
    overflow: "hidden",
    marginTop: 5,
    padding: 10,
    width: "100%",
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  memberText: {
    fontSize: 16,
  },
  memberSubtext: {
    fontSize: 14,
    color: "gray",
  },
  noMembers: {
    fontStyle: "italic",
    color: "gray",
  },
});
