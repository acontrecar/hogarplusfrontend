import { create } from "zustand";
import {
  CreateTaskDto,
  Task,
} from "../infraestructure/interfaces/calendar/calendar";
import { getTasksByHouse, createTaskAction } from "../action/taks/task.action";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  errorMessage?: string;
  getTasksByHouse: (houseId: string) => Promise<boolean>;
  createTask: (createTask: CreateTaskDto) => Promise<boolean>;
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
  createTask: async (createTask: CreateTaskDto) => {
    set({ isLoading: true });
    const resp = await createTaskAction(createTask);

    if (!resp) {
      set({ errorMessage: "Error inesperado", isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    set((state) => ({
      isLoading: false,
      errorMessage: undefined,
      // tasks: [...state.tasks, resp.data.task],
    }));

    await getTasksByHouse(createTask.houseId.toString());
    return true;
  },
}));
