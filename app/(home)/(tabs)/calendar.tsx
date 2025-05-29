import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MotiViewCustom } from "../../../ui/components/MotiViewCustom";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Agenda,
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
  LocaleConfig,
  WeekCalendar,
  // Importar XDate si está disponible
  // XDate,
} from "react-native-calendars";
import {
  AgendaSection,
  CalendarEvent,
  HouseTask,
  Task,
} from "../../../infraestructure/interfaces/calendar/calendar";
import { agendaItems, getMarkedDates } from "../../../mocks/agendaTiems";
import { getTheme, lightThemeColor, themeColor } from "../../../mocks/theme";
import AgendaItem from "../../../mocks/AgendaItem";
import HouseTaskItem from "../../../ui/components/calendar/HouseTaskItem";
import { useHousesStore } from "../../../store/useHousesStore";
import { useHomeStore } from "../../../store/useHomeStore";
import { HomesDropDown } from "../../../ui/components/HomesDropDown";
import { HomeAndMembers } from "../../../infraestructure/interfaces/home/home.interfaces";
import { AnimatedButtonCustom } from "../../../ui/components/AnimatedButtonCustom";
import { useRouter } from "expo-router";
import { useTaskStore } from "../../../store/useTaskStore";
import ToastService from "../../../services/ToastService";
import Loader from "../../loader";
import { useCalendarTasks } from "../../../hooks/useCalendarTasks";
import colors from "../../../constants/colors";

LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
};
LocaleConfig.defaultLocale = "es";

export default function CalendarScreen() {
  const { isLoading, errorMessage, tasks, getTasksByHouse } = useTaskStore();
  const { housesAndMembers, getHomesAndMembers } = useHomeStore();
  const calendarRef = useRef<any>(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const [currentHouse, setCurrentHouse] = useState<HomeAndMembers | null>(null);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const router = useRouter();
  const { tasksByDate, markedDates } = useCalendarTasks(tasks);
  useEffect(() => {
    if (errorMessage) {
      ToastService.error("Error", errorMessage);
    }
  }, [errorMessage]);

  const getTasks = async (houseId: string) => {
    const success = await getTasksByHouse(houseId);

    if (success) {
      ToastService.success("Tareas actualizadas", "Tareas actualizadas");
    } else {
      ToastService.error("Error", "Error al actualizar tareas");
    }
  };

  useEffect(() => {
    if (currentHouse) {
      getTasks(currentHouse.id.toString());
    }
  }, [currentHouse]);

  useEffect(() => {
    console.log("Tasks loaded:", JSON.stringify(tasks, null, 2));
  }, [tasks]);

  // Generar secciones para AgendaList
  const getSections = (): AgendaSection[] => {
    if (!tasksByDate || Object.keys(tasksByDate).length === 0) {
      return [];
    }

    return Object.keys(tasksByDate)
      .sort() // Ordenar fechas
      .map((date) => ({
        title: date,
        data: tasksByDate[date],
      }));
  };

  const toggleCalendar = useCallback(() => {
    const isOpen = calendarRef.current?.toggleCalendarPosition();
    Animated.timing(rotation, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const onDateChanged = (date: string) => {
    console.log("Date changed to:", date);
    setCurrentDate(date);
  };

  const renderHeader = (date?: any) => {
    const rotate = rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
    });

    return (
      <TouchableOpacity style={styles.header} onPress={toggleCalendar}>
        <Text style={styles.headerDate}>
          {date?.toString ? date.toString("MMMM yyyy") : "Calendario"}
        </Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Text style={styles.arrow}>▼</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Cambiar el tipo para que sea compatible con Task
  const renderItem = ({ item }: { item: Task }) => (
    <HouseTaskItem task={item} />
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <HomesDropDown
        currentHouse={currentHouse}
        setCurrentHouse={setCurrentHouse}
        getHomesAndMembers={getHomesAndMembers}
        housesAndMembers={housesAndMembers}
      />

      <AnimatedButtonCustom
        label={"+"}
        onPress={() => {
          router.push({
            pathname: "/(home)/(modals)/create-task",
            params: {
              selectedDate: currentDate,
            },
          });
        }}
        customStyles={styles.buttonStyle}
        labelStyle={styles.labelStyle}
      />

      {currentHouse ? (
        <CalendarProvider
          date={currentDate}
          // showTodayButton
          disabledOpacity={0.6}
          onDateChanged={(date) => onDateChanged(date)}
        >
          <ExpandableCalendar
            // ref={calendarRef}
            markedDates={markedDates}
            theme={{
              calendarBackground: "#fff",
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: "#fff",
              todayTextColor: "#4e73df",
              dayTextColor: "#2d3748",
              monthTextColor: "#2d3748",
              arrowColor: "#4e73df",
            }}
            firstDay={1} // Lunes como primer día
          />
          {Object.keys(tasksByDate).length > 0 ? (
            <AgendaList
              sections={getSections()}
              renderItem={renderItem}
              sectionStyle={styles.section}
              dayFormat={"dd/MM/yyyy"}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay tareas programadas</Text>
            </View>
          )}
        </CalendarProvider>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Seleccione un hogar...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 70,
  },
  header: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
    alignItems: "center",
  },
  houseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
  },
  headerDate: {
    fontSize: 16,
    color: "#718096",
    marginVertical: 5,
  },
  arrow: {
    fontSize: 20,
    color: "#4e73df",
  },
  section: {
    backgroundColor: "#83a679",
    color: "#fff",
    paddingVertical: 5,
    paddingLeft: 15,
  },
  buttonStyle: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 100,
    bottom: 0,
    height: 75,
    justifyContent: "center",
    marginRight: 10,
    marginVertical: 5,
    position: "absolute",
    right: 0,
    zIndex: 1,
    width: 75,
  },
  labelStyle: {
    color: "white",
    fontSize: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
  },
});
