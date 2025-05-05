import { create } from "zustand";
import {
  createHome,
  getHomeDetails,
  getHomesByUser,
} from "../action/home/home.action";
import {
  Home,
  HomeDetails,
  HomesByUser,
} from "../infraestructure/interfaces/home/home.interfaces";

interface HomeState {
  isLoading: boolean;
  homeCreated?: Home;
  homesByUser?: HomesByUser[];
  homeDetails?: HomeDetails;
  homes?: Home[];
  errorMessage?: string;
  createHome: (homeName: string) => Promise<boolean>;
  getHomesByUser: () => Promise<boolean>;
  getHomeDetails: (homeId: number) => Promise<boolean>;
}

export const useHomeStore = create<HomeState>((set) => ({
  isLoading: false,
  homeCreated: undefined,
  homesByUser: [],
  homeDetails: undefined,
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

    set({ homesByUser: resp.data.homes, isLoading: false });
    return true;
  },
  getHomeDetails: async (homeId: number) => {
    const resp = await getHomeDetails(homeId);

    if (!resp) {
      set({ errorMessage: "Error inesperado" });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message });
      return false;
    }

    set({ homeDetails: resp.data.home });
    return true;
  },
}));
