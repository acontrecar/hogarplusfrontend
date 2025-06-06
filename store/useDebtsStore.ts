import { create } from 'zustand';
import { HouseTask } from '../infraestructure/interfaces/calendar/calendar';
import { mockHouseTasks } from '../mocks/houseTasks';
import { HomeAndMembers } from '../infraestructure/interfaces/home/home.interfaces';
import { CreateDebtsDto } from '../infraestructure/interfaces/debts/debts.interfaces';
import { createDebtAction } from '../action/debts/debts.action';

interface DebtsState {
  isLoading: boolean;
  errorMessage?: string;
  createDebt: (debt: CreateDebtsDto) => Promise<boolean>;
}

export const useDebtStore = create<DebtsState>(set => ({
  isLoading: false,
  errorMessage: undefined,
  createDebt: async debt => {
    set({ isLoading: true });
    const resp = await createDebtAction(debt);

    if (!resp) {
      set({ errorMessage: 'Error inesperado', isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    set({ isLoading: false, errorMessage: undefined });
    return true;
  }
}));
