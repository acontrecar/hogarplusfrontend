import { create } from "zustand";
import {
  deleteHome,
  exitFromHome,
  deletePersonFromHome,
  joinHome,
  getHomesAndMembersByUser,
} from "../action/home/home.action";
import {
  createHome,
  getHomeDetails,
  getHomesByUser,
} from "../action/home/home.action";
import {
  Home,
  HomeAndMembers,
  HomeDetails,
  HomesByUser,
} from "../infraestructure/interfaces/home/home.interfaces";
import { StorageAdapter } from "../config/adapters/async-storage";

interface HomeState {
  isLoading: boolean;
  homeCreated?: Home;
  homesByUser?: HomesByUser[];
  currentHome?: HomeAndMembers;
  homeDetails: Record<number, HomeDetails>;
  housesAndMembers?: HomeAndMembers[];
  homes?: Home[];
  idHomeToDelete?: number;
  errorMessage?: string;
  createHome: (homeName: string) => Promise<boolean>;
  getHomesByUser: () => Promise<boolean>;
  getHomeDetails: (homeId: number) => Promise<boolean>;
  deleteHome: (homeId: number) => Promise<boolean>;
  exitFromHome: (homeId: number) => Promise<boolean>;
  deletePersonFromHome: (homeId: number, memberId: number) => Promise<boolean>;
  joinPersonToHome: (invitationCode: string) => Promise<boolean>;
  getHomesAndMembers: () => Promise<boolean>;
  setCurrentHome: (home: HomeAndMembers) => void;
  getCurrentHome: () => Promise<HomeAndMembers | undefined>;
}

export const useHomeStore = create<HomeState>((set, get) => ({
  isLoading: false,
  homeCreated: undefined,
  homesByUser: [],
  housesAndMembers: [],
  idHomeToDelete: undefined,
  currentHome: undefined,
  homeDetails: {},
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

    const homeByUser: HomesByUser = {
      id: resp.data.home.id,
      name: resp.data.home.name,
      isAdmin: true,
      invitationCode: resp.data.home.invitationCode,
    };

    set((state) => ({
      homeCreated: resp.data.home,
      homesByUser: state.homesByUser?.concat(homeByUser),
      errorMessage: undefined,
    }));
    return true;
  },
  getCurrentHome: async () => {
    const resp = await StorageAdapter.getItem("currentHome");

    if (!resp) {
      return undefined;
    }

    const home: HomeAndMembers = JSON.parse(resp);
    set({ currentHome: home });
    return home;
  },
  setCurrentHome: (home: HomeAndMembers) => {
    // await StorageAdapter.setItem("currentHome", JSON.stringify(home));
    set({ currentHome: home });
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

    set({
      homesByUser: resp.data.homes,
      isLoading: false,
      errorMessage: undefined,
    });
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

    set((state) => ({
      homeDetails: {
        ...state.homeDetails,
        [homeId]: resp.data.home,
      },
      errorMessage: undefined,
    }));
    return true;
  },
  deleteHome: async (homeId: number) => {
    set({ isLoading: true });

    const resp = await deleteHome(homeId);

    if (!resp) {
      set({ errorMessage: "Error inesperado", isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    set((state) => ({
      homesByUser: state.homesByUser?.filter((h) => h.id !== homeId),
      homeDetails: Object.fromEntries(
        Object.entries(state.homeDetails).filter(
          ([key]) => Number(key) !== homeId
        )
      ),
      isLoading: false,
      errorMessage: undefined,
      idHomeToDelete: undefined,
    }));
    return true;
  },
  exitFromHome: async (homeId: number) => {
    set({ isLoading: true });

    const resp = await exitFromHome(homeId);

    if (!resp) {
      set({ errorMessage: "Error inesperado", isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    set((state) => ({
      homesByUser: state.homesByUser?.filter((h) => h.id !== homeId),
      homeDetails: Object.fromEntries(
        Object.entries(state.homeDetails).filter(
          ([key]) => Number(key) !== homeId
        )
      ),
      isLoading: false,
      errorMessage: undefined,
      idHomeToDelete: undefined,
    }));
    return true;
  },

  deletePersonFromHome: async (homeId: number, memberId: number) => {
    set({ isLoading: true });

    const resp = await deletePersonFromHome(homeId, memberId);

    if (!resp) {
      set({ errorMessage: "Error inesperado", isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    set((state) => ({
      homesByUser: state.homesByUser?.filter((h) => h.id !== homeId),
      homeDetails: Object.fromEntries(
        Object.entries(state.homeDetails).filter(
          ([key]) => Number(key) !== homeId
        )
      ),
      errorMessage: undefined,
      isLoading: false,
      idHomeToDelete: undefined,
    }));
    return true;
  },

  joinPersonToHome: async (invitationCode: string) => {
    set({ isLoading: true });

    const resp = await joinHome(invitationCode);

    if (!resp) {
      set({ errorMessage: "Error inesperado", isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    set((state) => ({
      errorMessage: undefined,
      isLoading: false,
      idHomeToDelete: undefined,
    }));
    return true;
  },

  getHomesAndMembers: async () => {
    set({ isLoading: true });

    const resp = await getHomesAndMembersByUser();

    console.log({ resp });

    if (!resp) {
      set({ errorMessage: "Error inesperado", isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    set((state) => ({
      housesAndMembers: resp.data.homes,
      errorMessage: undefined,
      isLoading: false,
    }));
    return true;
  },
}));
