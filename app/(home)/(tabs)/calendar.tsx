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
} from "react-native-calendars";
import {
  AgendaSection,
  CalendarEvent,
  HouseTask,
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
  const { tasks } = useHousesStore();
  const { housesAndMembers, getHomesAndMembers } = useHomeStore();
  const calendarRef = useRef<any>(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const [currentHouse, setCurrentHouse] = useState<HomeAndMembers | null>(null);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  // Generar secciones para AgendaList
  const getSections = (): AgendaSection[] => {
    const grouped: { [key: string]: HouseTask[] } = {};

    tasks.forEach((task) => {
      if (!grouped[task.date]) grouped[task.date] = [];
      grouped[task.date].push(task);
    });

    return Object.keys(grouped).map((date) => ({
      title: date,
      data: grouped[date],
    }));
  };

  // Marcar fechas con tareas
  const getMarkedDates = () => {
    const marked: any = {};
    tasks.forEach((task) => {
      marked[task.date] = {
        marked: true,
        dotColor:
          task.priority === "high"
            ? "#e74c3c"
            : task.priority === "medium"
            ? "#f39c12"
            : "#2ecc71",
      };
    });
    return marked;
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
    setCurrentDate(date);
  };

  const renderHeader = (date?: XDate) => {
    const rotate = rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
    });

    return (
      <TouchableOpacity style={styles.header} onPress={toggleCalendar}>
        {/* <Text style={styles.houseName}>{currentHouse?.name}</Text> */}
        <Text style={styles.headerDate}>{date?.toString("MMMM yyyy")}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Text style={styles.arrow}>▼</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: HouseTask }) => (
    <HouseTaskItem task={item} />
  );

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
          router.push("/(home)/(modals)/create-task");
        }}
        customStyles={styles.buttonStyle}
        labelStyle={styles.labelStyle}
      />

      {currentHouse ? (
        <CalendarProvider
          date={currentDate}
          onDateChanged={(date) => onDateChanged(date)}
        >
          <ExpandableCalendar
            ref={calendarRef}
            // renderHeader={renderHeader}
            markedDates={getMarkedDates()}
            theme={{
              calendarBackground: "#fff",
              selectedDayBackgroundColor: "#4e73df",
              selectedDayTextColor: "#fff",
              todayTextColor: "#4e73df",
              dayTextColor: "#2d3748",
              monthTextColor: "#2d3748",
              arrowColor: "#4e73df",
            }}
            firstDay={1} // Lunes como primer día
          />
          <AgendaList
            sections={getSections()}
            renderItem={renderItem}
            sectionStyle={styles.section}
            dayFormat={"dd/MM/yyyy"}
          />
        </CalendarProvider>
      ) : (
        <Text>Seleccione un hogar...</Text>
      )}
      {/* {currentHouse && (
        <CreateTaskModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={(taskData) => {
            // Aquí llama a tu función para crear la tarea
            console.log("Nueva tarea:", taskData);
            // Ejemplo: createTask(taskData);
          }}
          houseId={currentHouse.id}
          members={currentHouse.members.map((m) => ({
            id: m.id,
            name: "POPO",
          }))}
        />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
    justifyContent: "center",
    alignItems: "center",
    // height: "80%",
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
    backgroundColor: "#4e73df",
    color: "#fff",
    paddingVertical: 5,
    paddingLeft: 15,
  },
  buttonStyle: {
    alignItems: "center",
    backgroundColor: "#0093D0",
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
});
