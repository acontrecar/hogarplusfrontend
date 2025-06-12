import React, { useEffect } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FadeIn, FadeOut, default as Reanimated } from 'react-native-reanimated';
import { HomesDropDown } from '../../../ui/components/HomesDropDown';
import { useHomeStore } from '../../../store/useHomeStore';
import { TaskSummary } from '../../../ui/components/TaskSummary';
import { DebtSummary } from '../../../ui/components/DebtSummary';

export default function HomeScreen() {
  const { housesAndMembers, getHomesAndMembers } = useHomeStore();
  const [currentHouse, setCurrentHouse] = React.useState<any>(null);

  useEffect(() => {
    getHomesAndMembers();
  }, []);

  return (
    <Reanimated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.container}
    >
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <HomesDropDown
          currentHouse={currentHouse}
          setCurrentHouse={setCurrentHouse}
          getHomesAndMembers={getHomesAndMembers}
          housesAndMembers={housesAndMembers}
        />
      </View>

      {currentHouse?.id ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <TaskSummary houseId={currentHouse.id.toString()} />
          <DebtSummary houseId={currentHouse.id.toString()} />
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Seleccione un hogar...</Text>
        </View>
      )}
    </Reanimated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16
  },
  header: {
    marginBottom: 20
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 50
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center'
  }
});
