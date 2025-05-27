import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { HouseTask } from "../../../infraestructure/interfaces/calendar/calendar";
import { useHousesStore } from "../../../store/useHousesStore";
import { RectButton } from "react-native-gesture-handler";

const HouseTaskItem = ({ task }: { task: HouseTask }) => {
  //   const { users } = useUserStore();
  const { completeTask } = useHousesStore();
  const users = [
    {
      id: "user1",
      name: "Juan",
    },
  ];
  const assignedUsers = users.filter((u) => task.assignedTo.includes(u.id));

  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return "#e74c3c";
      case "medium":
        return "#f39c12";
      default:
        return "#2ecc71";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: getPriorityColor() }]}
      onPress={() => completeTask(task.id)}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{task.title}</Text>
        {task.description && (
          <Text style={styles.description}>{task.description}</Text>
        )}

        <View style={styles.details}>
          {task.time && <Text style={styles.time}>🕒 {task.time}</Text>}
          {task.duration && (
            <Text style={styles.duration}>⏳ {task.duration}</Text>
          )}
        </View>

        {assignedUsers.length > 0 && (
          <View style={styles.assignees}>
            <Text style={styles.assigneesLabel}>Asignado a:</Text>
            {assignedUsers.map((user) => (
              <Text key={user.id} style={styles.assignee}>
                {user.name}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View
        style={[
          styles.status,
          {
            backgroundColor:
              task.status === "completed" ? "#2ecc71" : "#e74c3c",
          },
        ]}
      >
        <Text style={styles.statusText}>
          {task.status === "completed" ? "✅" : "⚠️"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 10,
  },
  details: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 10,
  },
  time: {
    fontSize: 13,
    color: "#4a5568",
  },
  duration: {
    fontSize: 13,
    color: "#4a5568",
  },
  assignees: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    alignItems: "center",
  },
  assigneesLabel: {
    fontSize: 13,
    color: "#718096",
  },
  assignee: {
    fontSize: 13,
    backgroundColor: "#edf2f7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    color: "#4a5568",
  },
  status: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  statusText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default HouseTaskItem;
