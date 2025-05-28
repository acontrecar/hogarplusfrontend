import { create } from "zustand";
import { Task } from "../infraestructure/interfaces/calendar/calendar";
import { getTasksByHouse } from "../action/taks/task.action";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  errorMessage?: string;
  getTasksByHouse: (houseId: string) => Promise<boolean>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  errorMessage: undefined,
  getTasksByHouse: async (houseId: string) => {
    set({ isLoading: true });
    const resp = await getTasksByHouse(houseId);

    if (!resp) {
      set({ errorMessage: "Error inesperado", isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    set({ isLoading: false, errorMessage: undefined, tasks: resp.data.tasks });
    return true;
  },
}));
