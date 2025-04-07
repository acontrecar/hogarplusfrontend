import { create } from "zustand";
import AsyncStore from "@react-native-async-storage/async-storage";
import { AuthStatus } from "../infraestructure/interfaces/auth.status";
import { authRegister } from "../action/auth/auth";
import { User } from "../domain/entities/user";
import { StorageAdapter } from "../config/adapters/async-storage";

interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;
  // setAuth: (auth: boolean) => void;
  checkToken: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "cheking",
  token: undefined,
  user: undefined,
  // setAuth: (auth) => set({ isAuthenticated: auth }),
  checkToken: async () => {
    const token = await AsyncStore.getItem("token");
    set({ status: token ? "authenticated" : "unauthenticated" });
  },

  register: async (name: string, email: string, password: string) => {
    const resp = await authRegister(name, email, password);

    if (!resp) {
      set({ status: "unauthenticated", token: undefined, user: undefined });
      return false;
    }

    console.log({ resp });

    await StorageAdapter.setItem("token", resp.token);

    set({
      status: "authenticated",
      token: resp.token,
      user: resp.user,
    });

    return true;
  },
}));
