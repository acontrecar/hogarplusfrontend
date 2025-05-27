import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PriorityPickerProps {
  priority: "low" | "medium" | "high";
  setPriority: (priority: "low" | "medium" | "high") => void;
}

export const PriorityPicker: React.FC<PriorityPickerProps> = ({
  priority,
  setPriority,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Prioridad:</Text>
      <View style={styles.priorityContainer}>
        {(["low", "medium", "high"] as const).map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.priorityButton,
              priority === level && styles[`${level}Active`],
            ]}
            onPress={() => setPriority(level)}
          >
            <Text style={styles.priorityText}>
              {level === "low" ? "Baja" : level === "medium" ? "Media" : "Alta"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityButton: {
    padding: 10,
    borderRadius: 5,
    width: "30%",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
  },
  priorityText: {
    fontWeight: "bold",
  },
  lowActive: {
    backgroundColor: "#2ecc71",
  },
  mediumActive: {
    backgroundColor: "#f39c12",
  },
  highActive: {
    backgroundColor: "#e74c3c",
  },
});
