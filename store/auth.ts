import { create } from "zustand";
import AsyncStore from "@react-native-async-storage/async-storage";
import { AuthStatus } from "../infraestructure/interfaces/auth.status";

interface AuthState {
  status: AuthStatus;
  // setAuth: (auth: boolean) => void;
  checkToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "cheking",
  // setAuth: (auth) => set({ isAuthenticated: auth }),
  checkToken: async () => {
    const token = await AsyncStore.getItem("token");
    set({ status: token ? "authenticated" : "unauthenticated" });
  },
}));
