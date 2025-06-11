import { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { default as Reanimated } from 'react-native-reanimated';
import { useLocalSearchParams } from 'expo-router';
import { useTaskStore } from '../../../store/useTaskStore';
import Loader from '../../loader';
import colors from '../../../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function UrgenciesTaskModal() {
  const { homeId } = useLocalSearchParams<{ homeId: string }>();
  const { urgyTask, tasksUrgy, isLoading } = useTaskStore();

  useEffect(() => {
    if (homeId) urgyTask(homeId.toString());
  }, [homeId]);

  if (isLoading) {
    return <Loader />;
  }

  if (!homeId) {
    return <Text>No se encontró el hogar</Text>;
  }

  return (
    <Reanimated.View style={styles.container}>
      {tasksUrgy.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons
            name="check-circle-outline"
            size={48}
            color="#D1D5DB"
          />
          <Text style={styles.emptyText}>No hay tareas urgentes</Text>
        </View>
      ) : (
        <FlatList
          data={tasksUrgy}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <MaterialIcons
                  name="priority-high"
                  size={20}
                  color="#EF4444"
                />
              </View>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.taskDate}>
                {item.date} - {item.time}
              </Text>
              {item.duration && <Text style={styles.taskDuration}>Duración: {item.duration}</Text>}
            </View>
          )}
        />
      )}
    </Reanimated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 20
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    flexShrink: 1
  },
  taskDate: {
    fontSize: 14,
    color: '#6B7280'
  },
  taskDuration: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4
  },
  listContent: {
    paddingBottom: 40
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#9CA3AF'
  },
  description: {
    fontSize: 16,
    marginBottom: 4
  }
});
