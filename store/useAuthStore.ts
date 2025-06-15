import { create } from 'zustand';
import AsyncStore from '@react-native-async-storage/async-storage';
import { AuthStatus } from '../infraestructure/interfaces/auth.status';
import { authCheckStatus, authLogin, authRegister } from '../action/auth/auth.action';
import { User } from '../domain/entities/user';
import { StorageAdapter } from '../config/adapters/async-storage';
import { updateUserProfile } from '../action/user/user.action';

interface AuthState {
  isLoading: boolean;
  status: AuthStatus;
  token?: string;
  user?: User;
  errorMessage?: string;
  // setAuth: (auth: boolean) => void;
  checkToken: () => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logOut: () => void;
  logIn: (email: string, password: string) => Promise<boolean>;
  updateProfile: (formData: FormData) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>(set => ({
  isLoading: false,
  status: 'checking',
  token: undefined,
  user: undefined,
  errorMessage: undefined,
  // setAuth: (auth) => set({ isAuthenticated: auth }),
  checkToken: async () => {
    const resp = await authCheckStatus();

    if (!resp || !resp.ok) {
      set({ status: 'unauthenticated', token: undefined, user: undefined });
      return false;
    }

    await StorageAdapter.setItem('token', resp.data.token);

    set({
      status: 'authenticated',
      token: resp.data.token,
      user: resp.data.user
    });
    return true;
  },

  register: async (name: string, email: string, password: string) => {
    set({ errorMessage: undefined, isLoading: true });
    const resp = await authRegister(name, email, password);

    if (!resp) {
      set({ errorMessage: 'Error inesperado', isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    await StorageAdapter.setItem('token', resp.data.token);

    set({
      status: 'authenticated',
      token: resp.data.token,
      user: resp.data.user,
      errorMessage: undefined,
      isLoading: false
    });

    return true;
  },

  logOut: async () => {
    await StorageAdapter.removeItem('token');
    set({ status: 'unauthenticated', token: undefined, user: undefined });
  },

  logIn: async (email: string, password: string) => {
    set({ errorMessage: undefined, isLoading: false });
    const resp = await authLogin(email, password);

    if (!resp) {
      set({ status: 'unauthenticated', token: undefined, user: undefined, isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    await StorageAdapter.setItem('token', resp.data.token);

    set({
      status: 'authenticated',
      token: resp.data.token,
      user: resp.data.user,
      errorMessage: undefined,
      isLoading: false
    });

    return true;
  },

  updateProfile: async (formData: FormData) => {
    const resp = await updateUserProfile(formData);

    if (!resp) {
      set({ errorMessage: 'Error inesperado' });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message });
      return false;
    }

    set({ user: resp.data, errorMessage: undefined });
    return true;
  }
}));
