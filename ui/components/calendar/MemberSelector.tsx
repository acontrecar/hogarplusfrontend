import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

interface MemberSelectorProps {
  members: Array<{ id: number; name: string }>;
  assignedTo: number[];
  setAssignedTo: (ids: number[]) => void;
}

export const MemberSelector: React.FC<MemberSelectorProps> = ({
  members,
  assignedTo,
  setAssignedTo,
}) => {
  const toggleMember = (id: number) => {
    if (assignedTo.includes(id)) {
      setAssignedTo(assignedTo.filter((memberId) => memberId !== id));
    } else {
      setAssignedTo([...assignedTo, id]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Asignar a:</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.memberButton,
              assignedTo.includes(item.id) && styles.memberSelected,
            ]}
            onPress={() => toggleMember(item.id)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        numColumns={2}
        contentContainerStyle={styles.memberList}
      />
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
  memberList: {
    justifyContent: "space-between",
  },
  memberButton: {
    width: "48%",
    padding: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
  },
  memberSelected: {
    backgroundColor: "#4e73df",
    borderColor: "#4e73df",
  },
});
