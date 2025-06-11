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

interface TaskDashboardProps {
  houseId: string;
}

export const TaskSummary = ({ houseId }: TaskDashboardProps) => {
  const { summary, summaryTask, isLoading } = useTaskStore();

  useEffect(() => {
    if (houseId) {
      summaryTask(houseId);
    }
  }, [houseId]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'remove';
      case 'low':
        return 'keyboard-arrow-down';
      default:
        return 'help';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const renderTaskItem = ({ item }: { item: any }) => (
    <Reanimated.View
      entering={SlideInRight}
      exiting={SlideInLeft}
      layout={LinearTransition}
      style={styles.taskItem}
    >
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <Text
            style={styles.taskTitle}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <MaterialIcons
              name={getPriorityIcon(item.priority)}
              size={12}
              color="white"
            />
          </View>
        </View>

        <Text
          style={styles.taskDescription}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View style={styles.taskFooter}>
          <View style={styles.taskDate}>
            <MaterialIcons
              name="schedule"
              size={14}
              color="#6B7280"
            />
            <Text style={styles.taskDateText}>
              {formatDate(item.date)} - {item.time}
            </Text>
          </View>
          {item.duration && <Text style={styles.taskDuration}>{item.duration}</Text>}
        </View>
      </View>
    </Reanimated.View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando tareas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Text
          // style={styles.sectionTitle}
          style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}
        >
          Resumen de tareas
        </Text>
      </View>
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, styles.pendingCard]}>
          <MaterialIcons
            name="pending-actions"
            size={24}
            color="#3B82F6"
          />
          <Text style={styles.summaryNumber}>{summary.tasksPending}</Text>
          <Text style={styles.summaryLabel}>Pendientes</Text>
        </View>

        <View style={[styles.summaryCard, styles.urgentCard]}>
          <MaterialIcons
            name="warning"
            size={24}
            color="#EF4444"
          />
          <Text style={styles.summaryNumber}>{summary.tasksUrgy}</Text>
          <Text style={styles.summaryLabel}>Urgentes</Text>
        </View>

        <View style={[styles.summaryCard, styles.completedCard]}>
          <MaterialIcons
            name="check-circle"
            size={24}
            color="#10B981"
          />
          <Text style={styles.summaryNumber}>{summary.tasksCompleted}</Text>
          <Text style={styles.summaryLabel}>Completadas</Text>
        </View>
      </View>

      <View style={styles.taskListContainer}>
        <Text style={styles.sectionTitle}>Próximas Tareas</Text>

        {summary.upcomingTasks.length > 0 ? (
          <FlatList
            data={summary.upcomingTasks}
            renderItem={renderTaskItem}
            // horizontal
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            style={styles.taskList}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="task-alt"
              size={48}
              color="#D1D5DB"
            />
            <Text style={styles.emptyText}>No hay tareas próximas</Text>
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
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  pendingCard: {
    backgroundColor: '#EBF4FF'
  },
  urgentCard: {
    backgroundColor: '#FEF2F2'
  },
  completedCard: {
    backgroundColor: '#F0FDF4'
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center'
  },
  taskListContainer: {
    flex: 1
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16
  },
  taskList: {
    flex: 1
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  taskContent: {
    padding: 16
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8
  },
  priorityBadge: {
    borderRadius: 12,
    padding: 4,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  taskDate: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  taskDateText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4
  },
  taskDuration: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
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
