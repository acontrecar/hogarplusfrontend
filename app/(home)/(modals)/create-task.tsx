// app/(home)/calendar/create-task.tsx
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { useHomeStore } from "../../../store/useHomeStore";
import { useHousesStore } from "../../../store/useHousesStore";
import { MemberOfHome } from "../../../infraestructure/interfaces/home/home.interfaces";
import colors from "../../../constants/colors";
import { useTaskStore } from "../../../store/useTaskStore";
import { CreateTaskDto } from "../../../infraestructure/interfaces/calendar/calendar";

interface CreateTaskParams {
  selectedDate?: string;
}

const priorityOptions = [
  { label: "🔴 Alta", value: "high", color: "#e74c3c" },
  { label: "🟡 Media", value: "medium", color: "#f39c12" },
  { label: "🟢 Baja", value: "low", color: "#2ecc71" },
];

const durationOptions = [
  { label: "15 minutos", value: "15 min" },
  { label: "30 minutos", value: "30 min" },
  { label: "45 minutos", value: "45 min" },
  { label: "1 hora", value: "60 min" },
  { label: "1.5 horas", value: "90 min" },
  { label: "2 horas", value: "120 min" },
  { label: "3 horas", value: "180 min" },
  { label: "Todo el día", value: "all day" },
];

export default function CreateTaskModal() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ selectedDate?: string }>();
  const { currentHome } = useHomeStore();
  const { createTask } = useTaskStore();

  // Estados del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    params.selectedDate ? new Date(params.selectedDate) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [duration, setDuration] = useState("30 min");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [assignedMembers, setAssignedMembers] = useState<number[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberOfHome | null>(
    null
  );

  // Estados para mostrar/ocultar selectores
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Estados de validación y carga
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Configurar header personalizado
    navigation.setOptions({
      title: "Nueva Tarea",
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "600",
      },
    });
  }, [navigation]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "El título es obligatorio";
    }

    if (!currentHome) {
      newErrors.home = "No hay hogar seleccionado";
    }

    if (assignedMembers.length === 0) {
      newErrors.assignedMembers = "Debe asignar al menos un miembro";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const formatTime = (date: Date): string => {
    return date.toTimeString().slice(0, 5);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (time) {
      setSelectedTime(time);
    }
  };

  const addMember = () => {
    if (selectedMember && !assignedMembers.includes(selectedMember.id)) {
      setAssignedMembers([...assignedMembers, selectedMember.id]);
      setSelectedMember(null);
      if (errors.assignedMembers) {
        setErrors({ ...errors, assignedMembers: "" });
      }
    }
  };

  const removeMember = (memberId: number) => {
    setAssignedMembers(assignedMembers.filter((id) => id !== memberId));
  };

  const getMemberName = (memberId: number): string => {
    const member = currentHome?.members.find((m) => m.id === memberId);
    return member?.name || "Miembro desconocido";
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Por favor corrige los errores en el formulario");
      return;
    }

    setIsLoading(true);

    const taskData: CreateTaskDto = {
      title: title.trim(),
      description: description.trim(),
      // date: formatDate(selectedDate),
      date: selectedDate,
      time: formatTime(selectedTime),
      duration,
      priority,
      assignedTo: assignedMembers,
      houseId: currentHome!.id,
    };

    const success = await createTask(taskData);

    if (success) {
      Alert.alert("Éxito", "Tarea creada correctamente", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } else {
      Alert.alert("Error", "No se pudo crear la tarea. Inténtalo de nuevo.");
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancelar",
      "¿Estás seguro de que quieres cancelar? Se perderán los cambios.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  };

  if (!currentHome) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>
            No hay hogar seleccionado. Regresa y selecciona un hogar primero.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Información del hogar */}
          <View style={styles.houseInfo}>
            <Text style={styles.houseInfoText}>
              📍 Creando tarea para:{" "}
              <Text style={styles.houseName}>{currentHome.name}</Text>
            </Text>
          </View>

          {/* Título */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Título <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="Nombre de la tarea"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              maxLength={100}
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
          </View>

          {/* Descripción */}
          <View style={styles.section}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detalles adicionales (opcional)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={500}
              textAlignVertical="top"
            />
          </View>

          {/* Fecha y Hora */}
          <View style={styles.row}>
            <View style={styles.halfSection}>
              <Text style={styles.label}>Fecha</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {selectedDate.toLocaleDateString("es-ES")}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.halfSection}>
              <Text style={styles.label}>Hora</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {formatTime(selectedTime)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Duración y Prioridad */}
          <View style={styles.row}>
            <View style={styles.halfSection}>
              <Text style={styles.label}>Duración</Text>
              <Dropdown
                style={styles.dropdown}
                data={durationOptions}
                labelField="label"
                valueField="value"
                placeholder="Seleccionar"
                value={duration}
                onChange={(item) => setDuration(item.value)}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelected}
              />
            </View>

            <View style={styles.halfSection}>
              <Text style={styles.label}>Prioridad</Text>
              <Dropdown
                style={styles.dropdown}
                data={priorityOptions}
                labelField="label"
                valueField="value"
                placeholder="Seleccionar"
                value={priority}
                onChange={(item) => setPriority(item.value)}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelected}
              />
            </View>
          </View>

          {/* Asignación de miembros */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Asignar a <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.memberAssignment}>
              <Dropdown
                style={[styles.dropdown, styles.memberDropdown]}
                data={currentHome.members}
                labelField="name"
                valueField="id"
                placeholder="Seleccionar miembro"
                value={selectedMember}
                onChange={setSelectedMember}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelected}
              />
              <TouchableOpacity
                style={[
                  styles.addButton,
                  !selectedMember && styles.addButtonDisabled,
                ]}
                onPress={addMember}
                disabled={!selectedMember}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            {errors.assignedMembers && (
              <Text style={styles.errorText}>{errors.assignedMembers}</Text>
            )}

            {/* Lista de miembros asignados */}
            {assignedMembers.length > 0 && (
              <View style={styles.assignedContainer}>
                <Text style={styles.assignedLabel}>Miembros asignados:</Text>
                <View style={styles.assignedList}>
                  {assignedMembers.map((memberId) => (
                    <View key={memberId} style={styles.assignedChip}>
                      <Text style={styles.assignedChipText}>
                        {getMemberName(memberId)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeMember(memberId)}
                        style={styles.removeButton}
                      >
                        <Text style={styles.removeButtonText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.createButton,
              isLoading && styles.createButtonDisabled,
            ]}
            onPress={handleCreate}
            disabled={isLoading}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? "Creando..." : "Crear Tarea"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  houseInfo: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4e73df",
  },
  houseInfoText: {
    fontSize: 14,
    color: "#2d3748",
  },
  houseName: {
    fontWeight: "600",
    color: "#4e73df",
  },
  section: {
    marginBottom: 20,
  },
  halfSection: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2d3748",
    marginBottom: 8,
  },
  required: {
    color: "#e53e3e",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#2d3748",
  },
  inputError: {
    borderColor: "#e53e3e",
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  dateTimeText: {
    fontSize: 16,
    color: "#2d3748",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    height: 48,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: "#a0aec0",
  },
  dropdownSelected: {
    fontSize: 16,
    color: "#2d3748",
  },
  memberAssignment: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  memberDropdown: {
    flex: 1,
  },
  addButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#cbd5e0",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  assignedContainer: {
    marginTop: 12,
  },
  assignedLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4a5568",
    marginBottom: 8,
  },
  assignedList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  assignedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6fffa",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#4e73df",
  },
  assignedChipText: {
    color: "#2d3748",
    fontSize: 14,
    marginRight: 6,
  },
  removeButton: {
    backgroundColor: "#e53e3e",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    marginBottom: 40,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4a5568",
  },
  createButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  createButtonDisabled: {
    backgroundColor: "#cbd5e0",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e53e3e",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 12,
    color: "#e53e3e",
    marginTop: 4,
  },
  errorButton: {
    backgroundColor: "#4e73df",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  errorButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});
