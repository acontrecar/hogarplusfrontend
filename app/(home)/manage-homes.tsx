import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { MotiViewCustom } from '../../ui/components/MotiViewCustom';
import { globalStyles } from '../../constants/styles';
import { AnimatedButtonCustom } from '../../ui/components/AnimatedButtonCustom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ToastService from '../../services/ToastService';
import { Link } from 'expo-router';
import { useHomeStore } from '../../store/useHomeStore';
import { HomesByUser } from '../../infraestructure/interfaces/home/home.interfaces';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import colors from '../../constants/colors';
import { HomeCard } from '../../ui/components/HomeCard';
import { HomeDisplay } from '../../ui/components/HomeDisplay';
import Entypo from '@expo/vector-icons/Entypo';
import Loader from '../loader';
import { LinearTransition, default as Reanimated } from 'react-native-reanimated';

export default function ManageHomesScreen() {
  const { isLoading, homesByUser = [], errorMessage, getHomesByUser } = useHomeStore();

  const refresh = useCallback(async () => {
    await getHomesByUser();
  }, [getHomesByUser]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (errorMessage) {
      ToastService.error('Error', errorMessage);
    }
  }, [errorMessage]);

  const homesAdmin = useMemo(() => homesByUser.filter(h => h.isAdmin), [homesByUser]);

  const homesMember = useMemo(() => homesByUser.filter(h => !h.isAdmin), [homesByUser]);

  return (
    <MotiViewCustom style={globalStyles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={async () => {
              await refresh();
            }}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        style={{
          flex: 1,
          width: '100%',
          height: '100%'
          // marginBottom: 60,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Link
            href="/(home)/(modals)/create-home"
            asChild
          >
            <AnimatedButtonCustom
              customStyles={{ width: '45%' }}
              label="Crear hogar"
              onPress={() => {}}
            />
          </Link>

          <Link
            href="/(home)/(modals)/search-home"
            asChild
          >
            <AnimatedButtonCustom
              customStyles={{
                width: '45%',
                backgroundColor: colors.infoBlue
              }}
              label="Buscar hogar"
              onPress={() => {}}
            />
          </Link>
        </View>

        {isLoading && homesByUser?.length === 0 ? (
          <Loader />
        ) : (
          <Reanimated.View
            layout={LinearTransition}
            style={{ flex: 1, width: '100%', height: '100%' }}
          >
            {homesAdmin.length > 0 && (
              <HomeDisplay
                homes={homesAdmin}
                icon={
                  <FontAwesome6
                    name="house-user"
                    size={24}
                    color="black"
                  />
                }
                title="Hogares propietario"
                roll="admin"
              />
            )}
            {homesMember.length > 0 && (
              <HomeDisplay
                homes={homesMember}
                icon={
                  <Entypo
                    name="home"
                    size={24}
                    color="black"
                  />
                }
                title="Hogares invitado"
                roll="member"
              />
            )}
          </Reanimated.View>
        )}
      </ScrollView>
    </MotiViewCustom>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
