import React, { useEffect } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FadeIn, FadeOut, default as Reanimated } from 'react-native-reanimated';
import { HomesDropDown } from '../../../ui/components/HomesDropDown';
import { useHomeStore } from '../../../store/useHomeStore';
import { TaskSummary } from '../../../ui/components/TaskSummary';

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
        <TaskSummary houseId={currentHouse.id.toString()} />
      ) : (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text>Seleccione un hogar</Text>
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
  scrollContent: {}
});
