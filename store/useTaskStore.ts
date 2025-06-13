import { create } from 'zustand';
import { CreateTaskDto, DeleteTaskDto, SummaryDto, Task } from '../infraestructure/interfaces/calendar/calendar';
import {
  getTasksByHouse,
  createTaskAction,
  deleteTaskAction,
  completeTaskAction,
  summaryTaskAction,
  urgyTaskAction
} from '../action/taks/task.action';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  errorMessage?: string;
  tasksUrgy: Task[];
  summary: SummaryDto;
  getTasksByHouse: (houseId: string) => Promise<boolean>;
  createTask: (createTask: CreateTaskDto) => Promise<boolean>;
  deleteTask: (deleteTaskDto: DeleteTaskDto) => Promise<boolean>;
  compleTask: (taskId: string) => Promise<boolean>;
  summaryTask: (homeId: string) => Promise<boolean>;
  urgyTask: (homeId: string) => Promise<boolean>;
}

export const useTaskStore = create<TaskState>(set => ({
  tasks: [],
  isLoading: false,
  tasksUrgy: [],
  summary: {
    tasksPending: 0,
    tasksUrgy: 0,
    tasksCompleted: 0,
    upcomingTasks: []
  },
  errorMessage: undefined,
  getTasksByHouse: async (houseId: string) => {
    set({ isLoading: true });
    const resp = await getTasksByHouse(houseId);

    if (!resp) {
      set({ errorMessage: 'Error inesperado', isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    set({ tasks: resp.data.tasks, isLoading: false, errorMessage: undefined });
    return true;
  },
  createTask: async (createTask: CreateTaskDto) => {
    set({ isLoading: true });
    const resp = await createTaskAction(createTask);

    if (!resp) {
      set({ errorMessage: 'Error inesperado', isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    set(state => ({
      isLoading: false,
      errorMessage: undefined,
      tasks: [...state.tasks, resp.data.task]
    }));

    // await getTasksByHouse(createTask.houseId.toString());
    return true;
  },

  deleteTask: async (deleteTaskDto: DeleteTaskDto) => {
    // set({ isLoading: true });
    const resp = await deleteTaskAction(deleteTaskDto);

    if (!resp) {
      set({
        errorMessage: 'Error inesperado'
        //  isLoading: false
      });
      return false;
    }

    if (!resp.ok) {
      set({
        errorMessage: resp.message
        //  isLoading: false
      });
      return false;
    }

    set(state => ({
      // isLoading: false,
      errorMessage: undefined,
      tasks: state.tasks.filter(task => task.id !== deleteTaskDto.taskId)
    }));

    return true;
  },
  compleTask: async (taskId: string) => {
    // set({ isLoading: true });
    const resp = await completeTaskAction(taskId);

    if (!resp) {
      set({
        errorMessage: 'Error inesperado'
        //  isLoading: false
      });
      return false;
    }

    if (!resp.ok) {
      set({
        errorMessage: resp.message
        // isLoading: false
      });
      return false;
    }

    set(state => ({
      // isLoading: false,
      errorMessage: undefined,
      tasks: state.tasks.map(task => (task.id === Number(taskId) ? resp.data.task : task))
    }));

    return true;
  },
  summaryTask: async (homeId: string) => {
    set({ isLoading: true });
    const resp = await summaryTaskAction(homeId);

    if (!resp) {
      set({ errorMessage: 'Error inesperado', isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    set({ isLoading: false, errorMessage: undefined, summary: resp.data });
    return true;
  },
  urgyTask: async (homeId: string) => {
    set({ isLoading: true });
    const resp = await urgyTaskAction(homeId);

    if (!resp) {
      set({ errorMessage: 'Error inesperado', isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    set({ isLoading: false, errorMessage: undefined, tasksUrgy: resp.data.urgyTasks });
    return true;
  }
}));
