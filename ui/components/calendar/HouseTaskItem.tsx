import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { DeleteTaskDto, HouseTask, Task } from '../../../infraestructure/interfaces/calendar/calendar';
import { useHousesStore } from '../../../store/useHousesStore';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useAnimatedStyle, interpolate, runOnJS, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import colors from '../../../constants/colors';
import { useAuthStore } from '../../../store/useAuthStore';
import { useTaskStore } from '../../../store/useTaskStore';
import ToastService from '../../../services/ToastService';

const HouseTaskItem = ({ task }: { task: Task }) => {
  const { completeTask } = useHousesStore();
  const { user } = useAuthStore();
  const { deleteTask, compleTask } = useTaskStore();

  const isAssignedToMe = task.assignedTo.some(u => u.userId === user?.id);
  const isCreatedByMe = task.createdBy.userId === user?.id;

  const assignedUsers = task.assignedTo.map(u => ({
    id: u.id,
    name: u.name
  }));

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      default:
        return '#2ecc71';
    }
  };

  const onPressCompleteTask = async (taskId: string) => {
    const success = await compleTask(taskId);

    if (success) {
      ToastService.success('Tarea completada correctamente');
    } else {
      ToastService.error('Error al completada la tarea');
    }
  };

  const handleCompleteTask = () => {
    // completeTask(task.id.toString());
    if (!isAssignedToMe) return;

    Alert.alert('Completar Tarea', '¿Estás seguro de que quieres marcar esta tarea como completada?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Completar',
        style: 'default',
        onPress: () => {
          onPressCompleteTask(task.id.toString());
        }
      }
    ]);
  };

  const onPressDeleteTask = async (deleteTaskDto: DeleteTaskDto) => {
    const success = await deleteTask(deleteTaskDto);

    if (success) {
      ToastService.success('Tarea eliminada correctamente');
    } else {
      ToastService.error('Error al eliminar tarea');
    }
  };

  const handleDeleteTask = () => {
    // Aquí iría tu función de desasignar
    if (!isCreatedByMe) return;
    Alert.alert('Eliminar Tarea', '¿Estás seguro de que quieres eliminar esta tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'default',
        onPress: () => {
          const deleteTaskDto: DeleteTaskDto = { houseId: task.house.id, taskId: task.id };
          onPressDeleteTask(deleteTaskDto);
        }
      }
    ]);
  };

  const renderRightActions = (progressAnimatedValue: SharedValue<number>, dragAnimatedValue: SharedValue<number>) => {
    const actions = [];

    if (isAssignedToMe && task.status !== 'completed') {
      actions.push(
        <RightAction
          key="complete"
          text="Completar"
          icon="✓"
          color="#27ae60"
          dragAnimatedValue={dragAnimatedValue}
          onPress={handleCompleteTask}
          actionIndex={0}
        />
      );
    }

    if (isCreatedByMe) {
      actions.push(
        <RightAction
          key="delete"
          text="Eliminar"
          icon="×"
          color="#e67e22"
          dragAnimatedValue={dragAnimatedValue}
          onPress={handleDeleteTask}
          actionIndex={actions.length}
        />
      );
    }

    if (actions.length === 0) {
      return null;
    }

    return <View style={styles.rightActionsContainer}>{actions}</View>;
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      rightThreshold={40}
      friction={2}
      enableTrackpadTwoFingerGesture
      containerStyle={styles.swipeableContainer}
    >
      <View
        style={[
          styles.container,
          { borderLeftColor: getPriorityColor() },
          task.status === 'completed' && { opacity: 0.8 }
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{task.title}</Text>
          {task.description && <Text style={styles.description}>{task.description}</Text>}

          <View style={styles.details}>
            {task.time && <Text style={styles.time}>🕒 {task.time.slice(0, 5)}</Text>}
            {task.duration && <Text style={styles.duration}>⏳ {task.duration}</Text>}
          </View>

          {assignedUsers.length > 0 && (
            <View style={styles.assignees}>
              <Text style={styles.assigneesLabel}>Asignado a:</Text>
              {assignedUsers.map(user => (
                <Text
                  key={user.id}
                  style={styles.assignee}
                >
                  {user.name}
                </Text>
              ))}
            </View>
          )}

          {task.completedBy?.length > 0 && (
            <View style={styles.assignees}>
              <Text style={styles.assigneesLabel}>Completado por:</Text>
              {task.completedBy.map(user => (
                <Text
                  key={user.id}
                  style={styles.assignee}
                >
                  {user.name}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.assignees}>
            <Text style={styles.assigneesLabel}>Creado por:</Text>
            <Text style={styles.assignee}>{task.createdBy.name}</Text>
          </View>
        </View>

        <View style={[styles.status]}>
          {task.status === 'completed' ? (
            <MaterialCommunityIcons
              name="check-circle"
              size={50}
              color={colors.primary}
            />
          ) : (
            <MaterialCommunityIcons
              name="alert-circle"
              size={50}
              color={colors.warningYellow}
            />
          )}
        </View>
      </View>
    </Swipeable>
  );
};

const RightAction = ({
  text,
  icon,
  color,
  dragAnimatedValue,
  onPress,
  actionIndex
}: {
  text: string;
  icon: string;
  color: string;
  dragAnimatedValue: SharedValue<number>;
  onPress: () => void;
  actionIndex: number;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const progress = interpolate(dragAnimatedValue.value, [-160, -80, 0], [1, 0.8, 0], 'clamp');

    const scale = interpolate(dragAnimatedValue.value, [-160, -80 * (actionIndex + 1), 0], [1, 0.9, 0], 'clamp');

    const opacity = interpolate(dragAnimatedValue.value, [-160, -40, 0], [1, 0.7, 0], 'clamp');

    const translateX = interpolate(
      dragAnimatedValue.value,
      [-160, -80, 0],
      [0, actionIndex * 10, actionIndex * 40],
      'clamp'
    );

    return {
      transform: [{ scale }, { translateX }],
      opacity
    };
  });

  return (
    <Animated.View style={[styles.actionButton, { backgroundColor: color }, animatedStyle]}>
      <TouchableOpacity
        style={styles.actionTouchable}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.actionIconContainer}>
          <Text style={styles.actionIcon}>{icon}</Text>
        </View>
        <Text style={styles.actionText}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  swipeableContainer: {
    marginHorizontal: 10,
    marginVertical: 5
  },

  // Estilos para las acciones de swipe
  rightActionsContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingLeft: 10
  },
  actionButton: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4
  },
  actionTouchable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8
  },
  actionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6
  },
  actionIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  actionText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 13
  },

  // Estilos principales del componente (sin cambios)
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  content: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 6,
    lineHeight: 22
  },
  description: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 12,
    lineHeight: 20
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12
  },
  time: {
    fontSize: 13,
    color: '#4a5568',
    fontWeight: '500'
  },
  duration: {
    fontSize: 13,
    color: '#4a5568',
    fontWeight: '500'
  },
  assignees: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
    marginBottom: 8
  },
  assigneesLabel: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '500'
  },
  assignee: {
    fontSize: 12,
    backgroundColor: '#f7fafc',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    color: '#4a5568',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  status: {
    // width: 36,
    // height: 36,
    // borderRadius: 18,
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignSelf: 'flex-start',
    // marginTop: 4,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2
  },
  statusText: {
    fontSize: 18
  }
});

export default HouseTaskItem;
