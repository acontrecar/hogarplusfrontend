import { create } from "zustand";
import { createHome, getHomesByUser } from "../action/home/home.action";
import {
  Home,
  HomesByUser,
} from "../infraestructure/interfaces/home/home.interfaces";

interface HomeState {
  isLoading: boolean;
  homeCreated?: Home;
  homesByUser?: HomesByUser[];
  homes?: Home[];
  errorMessage?: string;
  createHome: (homeName: string) => Promise<boolean>;
  getHomesByUser: () => Promise<boolean>;
}

export const useHomeStore = create<HomeState>((set) => ({
  isLoading: false,
  homeCreated: undefined,
  homesByUser: undefined,
  homes: [],
  createHome: async (homeName: string) => {
    const resp = await createHome(homeName);

    if (!resp) {
      set({ errorMessage: "Error inesperado" });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message });
      return false;
    }

    set({ homeCreated: resp.data.home });
    return true;
  },
  getHomesByUser: async () => {
    set({ isLoading: true });
    const resp = await getHomesByUser();

    if (!resp) {
      set({ errorMessage: "Error inesperado", isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    set({ homesByUser: [resp.data.home], isLoading: false });
    return true;
  },
}));
