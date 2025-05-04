import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MotiViewCustom } from "../../ui/components/MotiViewCustom";
import { globalStyles } from "../../constants/styles";
import { AnimatedButtonCustom } from "../../ui/components/AnimatedButtonCustom";
import { useEffect, useState } from "react";
import ToastService from "../../services/ToastService";
import { Link } from "expo-router";
import { useHomeStore } from "../../store/useHomeStore";
import { HomesByUser } from "../../infraestructure/interfaces/home/home.interfaces";

export default function ManageHomesScreen() {
  const [visibleModal, setVisibleModal] = useState(true);
  const [homesMember, setHomesMember] = useState<HomesByUser[]>([]);
  const [homesAdmin, setHomesAdmin] = useState<HomesByUser[]>([]);

  const { isLoading, homesByUser, getHomesByUser } = useHomeStore();

  const initialize = async () => {
    await getHomesByUser();
    if (homesByUser?.length === 0) return;
    console.log({ homesByUser });
    const adminHomes = homesByUser?.filter((h) => h.isAdmin);
    const memberHomes = homesByUser?.filter((h) => !h.isAdmin);

    setHomesAdmin(adminHomes ?? []);
    setHomesMember(memberHomes ?? []);
  };

  useEffect(() => {
    getHomesByUser();
    initialize();
  }, []);

  const handleCreateHome = (homeName: string) => {
    console.log("Nombre del hogar:", homeName);
    ToastService.success("Hogar creado", `Has creado: ${homeName}`);
  };

  return (
    <>
      <MotiViewCustom style={globalStyles.container}>
        <ScrollView
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: "blue",
          }}
        >
          <Link href="/(home)/(modals)/create-home" push asChild>
            <AnimatedButtonCustom label="Crear hogar" onPress={() => {}} />
          </Link>
        </ScrollView>
      </MotiViewCustom>
    </>
  );
}

const styles = StyleSheet.create({});
