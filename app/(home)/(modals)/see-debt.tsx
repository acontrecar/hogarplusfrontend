import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearTransition, default as Reanimated, FadeIn, FadeOut } from 'react-native-reanimated';
import { useDebtStore } from '../../../store/useDebtsStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { FontAwesome } from '@expo/vector-icons';
import { AnimatedButtonCustom } from '../../../ui/components/AnimatedButtonCustom';
import colors from '../../../constants/colors';
import ToastService from '../../../services/ToastService';
import Loader from '../../loader';
import { sleep } from '../../../hooks/useSleep';

export default function CreateDebtModal() {
  const params = useLocalSearchParams<{ homeId?: string }>();

  const { debtsByHome, isLoading, getDebtsByHome, paisDebtMember, deleteDebt } = useDebtStore();
  const { user } = useAuthStore();

  const [homeId, setHomeId] = useState(params.homeId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCreditor, setIsCreditor] = useState(false);
  const [isAffected, setIsAffected] = useState(false);

  const currentDebt = debtsByHome[currentIndex];

  const fetchDebts = async () => {
    await getDebtsByHome(homeId!);
  };

  useEffect(() => {
    if (homeId) {
      fetchDebts().then(() => {
        setCurrentIndex(0);
      });
    }
  }, [homeId]);

  useEffect(() => {
    if (currentDebt) {
      setIsCreditor(currentDebt.creditor.id === user.id);
      setIsAffected(currentDebt.affectedMembers.some(m => m.id === user.id && !m.isPaid));
      console.log(JSON.stringify(currentDebt, null, 2));
    }
  }, [currentDebt]);

  const handleNext = () => {
    if (currentIndex < debtsByHome.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!currentDebt) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No hay deudas</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    const success = await deleteDebt(currentDebt.id.toString());

    if (!success) {
      ToastService.error('Error', 'No se pudo eliminar la deuda');
      return;
    }
    ToastService.success('Deuda eliminada', 'Deuda eliminada correctamente');
  };
  const handlePay = async () => {
    const membetToPay = currentDebt.affectedMembers.find(m => m.id === user.id && !m.isPaid);
    if (!membetToPay) return;

    const success = await paisDebtMember(membetToPay.debtMemberId.toString());

    if (success) {
      ToastService.success('Deuda pagada', 'Deuda pagada correctamente');
    } else {
      ToastService.error('Error', 'No se pudo pagar la deuda');
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Reanimated.View
          entering={FadeIn}
          exiting={FadeOut}
          layout={LinearTransition}
          style={styles.container}
        >
          <View style={styles.navigation}>
            <TouchableOpacity
              onPress={handlePrevious}
              disabled={currentIndex === 0}
            >
              <Text style={[styles.arrow, currentIndex === 0 && styles.disabledArrow]}>{'‹'}</Text>
            </TouchableOpacity>
            <Text style={styles.indexText}>{`${currentIndex + 1} / ${debtsByHome.length}`}</Text>
            <TouchableOpacity
              onPress={handleNext}
              disabled={currentIndex === debtsByHome.length - 1}
            >
              <Text style={[styles.arrow, currentIndex === debtsByHome.length - 1 && styles.disabledArrow]}>{'›'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>{currentDebt.description}</Text>
              <Text style={styles.subTitle}>
                {' '}
                {new Date(currentDebt.createdAt || Date.now()).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
            </View>

            <View style={{ marginTop: 20 }}>
              <Text style={styles.creditor}>Pagado por:</Text>
              <View style={styles.card}>
                <View>
                  {currentDebt.creditor.avatar ? (
                    <Image
                      source={{ uri: currentDebt.creditor.avatar }}
                      style={styles.avatar}
                    />
                  ) : (
                    <FontAwesome
                      name="user"
                      size={40}
                      color="#9CA3AF"
                    />
                  )}
                </View>

                <View style={styles.cardView}>
                  <Text style={styles.cardText}>{currentDebt.creditor.name}</Text>
                </View>

                <View>
                  <Text style={styles.cardText}>{currentDebt.amount}€</Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 20 }}>
              <Text style={styles.creditor}>Para {currentDebt.affectedMembers.length} participantes:</Text>

              <Reanimated.View
                layout={LinearTransition}
                entering={FadeIn}
                exiting={FadeOut}
              >
                <FlatList
                  data={currentDebt.affectedMembers}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.card}>
                      <View>
                        {item.avatar ? (
                          <Image
                            source={{ uri: item.avatar }}
                            style={styles.avatar}
                          />
                        ) : (
                          <View style={styles.avatarPlaceholder}>
                            <FontAwesome
                              name="user"
                              size={40}
                              color="#9CA3AF"
                            />
                          </View>
                        )}
                      </View>

                      <View style={styles.cardView}>
                        <Text style={styles.cardText}>{item.name}</Text>
                      </View>

                      <View>
                        <Text style={styles.cardText}>{item.amount}€</Text>
                      </View>
                    </View>
                  )}
                />
              </Reanimated.View>
            </View>

            <View style={{ marginTop: 20, alignItems: 'center' }}>
              {isAffected && (
                <AnimatedButtonCustom
                  customStyles={{
                    backgroundColor: colors.primaryLight,
                    width: '100%'
                  }}
                  label={'Pagar'}
                  onPress={handlePay}
                />
              )}

              {isCreditor && (
                <AnimatedButtonCustom
                  customStyles={{
                    backgroundColor: colors.accentRed,
                    width: '100%'
                  }}
                  label={'Eliminar'}
                  onPress={handleDelete}
                />
              )}
            </View>
          </View>
        </Reanimated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  content: {},
  header: {
    alignItems: 'center'
  },
  cardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ccc'
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc'
  },
  arrow: {
    fontSize: 40,
    paddingHorizontal: 20,
    color: '#333'
  },
  disabledArrow: {
    color: '#ccc'
  },
  indexText: {
    fontSize: 16,
    fontWeight: '500'
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    gap: 10
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 4
  },
  creditor: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555'
  },
  bold: {
    fontWeight: '600'
  },
  membersTitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 6,
    fontWeight: '600'
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd'
  },
  memberName: {
    flex: 1,
    fontSize: 14
  },

  paid: {
    color: 'green',
    fontSize: 14
  },

  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888'
  }
});
