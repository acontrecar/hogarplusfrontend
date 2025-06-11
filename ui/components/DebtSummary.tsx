import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTaskStore } from '../../store/useTaskStore';
import {
  FadeIn,
  FadeOut,
  LinearTransition,
  default as Reanimated,
  SlideInLeft,
  SlideInRight
} from 'react-native-reanimated';
import { useDebtStore } from '../../store/useDebtsStore';
import Loader from '../../app/loader';

interface DebtSummaryProps {
  houseId: string;
}

export const DebtSummary = ({ houseId }: DebtSummaryProps) => {
  const { summary, summaryDebt, isLoading } = useDebtStore();

  useEffect(() => {
    if (houseId) {
      summaryDebt(houseId);
    }
  }, [houseId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return '#10B981';
    if (balance < 0) return '#EF4444';
    return '#6B7280';
  };

  const getBalanceIcon = (balance: number) => {
    if (balance > 0) return 'trending-up';
    if (balance < 0) return 'trending-down';
    return 'remove';
  };

  const renderDebtItem = ({ item }: { item: any }) => (
    <View style={styles.debtItem}>
      <View style={styles.debtContent}>
        <View style={styles.debtHeader}>
          <View style={styles.debtInfo}>
            <Text
              style={styles.debtCreditor}
              numberOfLines={1}
            >
              {item.creditor.name}
            </Text>
            <Text
              style={styles.debtDescription}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.debtAmount}>{formatCurrency(item.amount)}</Text>
            <MaterialIcons
              name="account-balance-wallet"
              size={16}
              color="#6B7280"
            />
          </View>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Resumen de deudas</Text>
      </View>

      <View style={[styles.balanceCard, { borderColor: getBalanceColor(summary.balance) }]}>
        <View style={styles.balanceHeader}>
          <MaterialIcons
            name={getBalanceIcon(summary.balance)}
            size={32}
            color={getBalanceColor(summary.balance)}
          />
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Balance General</Text>
            <Text style={[styles.balanceAmount, { color: getBalanceColor(summary.balance) }]}>
              {formatCurrency(summary.balance)}
            </Text>
          </View>
        </View>
        {summary.balance < 0 && <Text style={styles.balanceNote}>Debes más de lo que te deben</Text>}
        {summary.balance > 0 && <Text style={styles.balanceNote}>Te deben más de lo que debes</Text>}
        {summary.balance === 0 && <Text style={styles.balanceNote}>Estás al día con tus deudas</Text>}
      </View>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, styles.owedToMeCard]}>
          <MaterialIcons
            name="call-received"
            size={24}
            color="#10B981"
          />
          <Text style={styles.summaryNumber}>{formatCurrency(summary.totalOwedToMe)}</Text>
          <Text style={styles.summaryLabel}>Me deben</Text>
        </View>

        <View style={[styles.summaryCard, styles.iOweCard]}>
          <MaterialIcons
            name="call-made"
            size={24}
            color="#EF4444"
          />
          <Text style={styles.summaryNumber}>{formatCurrency(summary.totalIOwe)}</Text>
          <Text style={styles.summaryLabel}>Debo</Text>
        </View>
      </View>

      <View style={styles.debtListContainer}>
        <Text style={styles.sectionTitle}>Deudas Recientes</Text>

        {summary.lastDebtIAffect?.length > 0 ? (
          //   <FlatList
          //     data={summary.lastDebtIAffect}
          //     renderItem={renderDebtItem}
          //     keyExtractor={item => item.id.toString()}
          //     showsVerticalScrollIndicator={false}
          //     style={styles.debtList}
          //   />
          <View style={styles.debtList}>
            {summary.lastDebtIAffect.map(debt => (
              <View
                key={debt.id}
                style={styles.debtItem}
              >
                <View style={styles.debtContent}>
                  <View style={styles.debtHeader}>
                    <View style={styles.debtInfo}>
                      <Text
                        style={styles.debtCreditor}
                        numberOfLines={1}
                      >
                        {debt.creditor.name}
                      </Text>
                      <Text
                        style={styles.debtDescription}
                        numberOfLines={2}
                      >
                        {debt.description}
                      </Text>
                    </View>
                    <View style={styles.amountContainer}>
                      <Text style={styles.debtAmount}>{formatCurrency(debt.amount)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="account-balance"
              size={48}
              color="#D1D5DB"
            />
            <Text style={styles.emptyText}>No hay deudas recientes</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  balanceInfo: {
    marginLeft: 16,
    flex: 1
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  balanceNote: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic'
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  owedToMeCard: {
    backgroundColor: '#F0FDF4'
  },
  iOweCard: {
    backgroundColor: '#FEF2F2'
  },
  summaryNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center'
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center'
  },
  debtListContainer: {
    flex: 1
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16
  },
  debtList: {
    flex: 1
  },
  debtItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  debtContent: {
    padding: 16
  },
  debtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  debtInfo: {
    flex: 1,
    marginRight: 12
  },
  debtCreditor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4
  },
  debtDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20
  },
  amountContainer: {
    alignItems: 'center'
  },
  debtAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 4
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16
  }
});
