import { create } from "zustand";
import { HouseTask } from "../infraestructure/interfaces/calendar/calendar";
import { mockHouseTasks } from "../mocks/houseTasks";
import { HomeAndMembers } from "../infraestructure/interfaces/home/home.interfaces";

interface HousesState {
  currentHouse: { id: string; name: string } | null;
  tasks: HouseTask[];

  addTask: (task: Omit<HouseTask, "id">) => void;
  updateTask: (id: string, updates: Partial<HouseTask>) => void;
  completeTask: (id: string) => void;
}

export const useHousesStore = create<HousesState>((set) => ({
  currentHouse: { id: "house1", name: "Piso Principal" },
  tasks: mockHouseTasks,
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: Date.now().toString() }],
    })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  completeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status: "completed" } : t
      ),
    })),
}));
