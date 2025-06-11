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
import Loader from '../../app/loader';
import { useRouter } from 'expo-router';

interface TaskDashboardProps {
  houseId: string;
}

export const TaskSummary = ({ houseId }: TaskDashboardProps) => {
  const { summary, summaryTask, isLoading } = useTaskStore();
  const router = useRouter();

  useEffect(() => {
    if (houseId) {
      summaryTask(houseId);
    }
  }, [houseId]);

  const handleUrgencyTask = () => {
    if (summary.tasksUrgy > 0) {
      router.push({
        pathname: '/(home)/(modals)/urgency-task',
        params: { homeId: houseId?.toString() }
      });
    }
  };

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

  if (isLoading) {
    return <Loader />;
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

        <TouchableOpacity
          onPress={handleUrgencyTask}
          style={[styles.summaryCard, styles.urgentCard]}
        >
          <MaterialIcons
            name="warning"
            size={24}
            color="#EF4444"
          />
          <Text style={styles.summaryNumber}>{summary.tasksUrgy}</Text>
          <Text style={styles.summaryLabel}>Urgentes</Text>
        </TouchableOpacity>

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
          <View style={styles.taskList}>
            {summary.upcomingTasks.map(task => (
              <View
                key={task.id}
                style={styles.taskItem}
              >
                <View style={styles.taskHeader}>
                  <Text
                    numberOfLines={1}
                    style={styles.taskTitle}
                  >
                    {task.title}
                  </Text>
                  <MaterialIcons
                    name={getPriorityIcon(task.priority)}
                    size={16}
                    color={getPriorityColor(task.priority)}
                  />
                </View>
                <View style={styles.taskFooter}>
                  <Text style={styles.taskDateText}>
                    {formatDate(task.date)} - {task.time}
                  </Text>
                  {task.duration && <Text style={styles.taskDuration}>{task.duration}</Text>}
                </View>
              </View>
            ))}
          </View>
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
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
    marginRight: 8
  },
  taskDescription: {
    display: 'none'
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  taskDateText: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 4
  },
  taskDuration: {
    fontSize: 11,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  priorityBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
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
