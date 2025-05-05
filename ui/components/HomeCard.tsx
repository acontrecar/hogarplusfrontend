import React, { useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../../constants/colors";
import {
  Home,
  RolHome,
} from "../../infraestructure/interfaces/home/home.interfaces";
import { AnimatePresence, MotiView } from "moti";
import Animated, { FadeIn } from "react-native-reanimated";
import { AnimatedButtonCustom } from "./AnimatedButtonCustom";
import { useHomeStore } from "../../store/useHomeStore";
import { FontAwesome } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useAuthStore } from "../../store/useAuthStore";

interface HomeCardProps {
  home: Home;
  roll: RolHome;
}

export const HomeCard = ({ home, roll }: HomeCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { homeDetails, getHomeDetails } = useHomeStore();
  const { user } = useAuthStore();

  const toggleExpanded = async () => {
    if (!isExpanded) {
      await getHomeDetails(home.id);
    }

    setIsExpanded((prev) => !prev);
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

      {isExpanded && homeDetails && (
        <Animated.View entering={FadeIn}>
          {homeDetails.members.length > 0 && (
            <View style={styles.expandContainer}>
              {homeDetails.members.map((member) => (
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

                  <Text style={styles.memberText}>
                    {member.name}
                    {member.email === user?.email && " (Tu) "}
                  </Text>

                  {roll === "admin" ? (
                    <Feather name="trash-2" size={20} color="black" />
                  ) : (
                    <View></View>
                  )}
                </View>
              ))}
              <View style={styles.buttonRow}>
                <AnimatedButtonCustom
                  customStyles={styles.acceptButton}
                  onPress={() => {}}
                  label="Copiar enlace"
                  //   disabled={!isValidInput || isSubmitting}
                />
                <AnimatedButtonCustom
                  customStyles={styles.closeButton}
                  onPress={() => {}}
                  label="Eliminar"
                  labelStyle={styles.closeText}
                />
              </View>
            </View>
          )}
          {homeDetails.members.length === 0 && (
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
    marginTop: 20,
    width: "40%",
    padding: 5,
    backgroundColor: colors.accentRed,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },
  acceptButton: {
    width: "40%",
    marginTop: 20,
    padding: 5,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
