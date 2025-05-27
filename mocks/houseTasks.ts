import { HouseTask } from "../infraestructure/interfaces/calendar/calendar";

export const mockHouseTasks: HouseTask[] = [
  {
    id: "1",
    title: "Limpiar cocina",
    description: "Limpiar nevera y encimera",
    date: new Date().toISOString().split("T")[0],
    time: "19:00",
    duration: "30 min",
    assignedTo: ["user1", "user2"],
    houseId: "house1",
    status: "pending",
    priority: "medium",
  },
  {
    id: "2",
    title: "Comprar suministros",
    description: "Papel higiénico y lavavajillas",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Mañana
    time: "10:00",
    duration: "1h",
    assignedTo: ["user3"],
    houseId: "house1",
    status: "pending",
    priority: "high",
  },
  // Más tareas...
];
