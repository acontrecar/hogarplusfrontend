import { create } from 'zustand';
import { HouseTask } from '../infraestructure/interfaces/calendar/calendar';
import { mockHouseTasks } from '../mocks/houseTasks';
import { HomeAndMembers } from '../infraestructure/interfaces/home/home.interfaces';
import { CreateDebtsDto, Debt } from '../infraestructure/interfaces/debts/debts.interfaces';
import {
  createDebtAction,
  deleteDebtAction,
  getDebtsByHomeAction,
  payDebtMemberAction
} from '../action/debts/debts.action';
import { get } from 'lodash';

interface DebtsState {
  isLoading: boolean;
  errorMessage?: string;
  debtsByHome: Debt[];
  createDebt: (debt: CreateDebtsDto) => Promise<boolean>;
  getDebtsByHome: (homeId: string) => Promise<boolean>;
  paisDebtMember: (debtMemberId: string) => Promise<boolean>;
  deleteDebt: (debtId: string) => Promise<boolean>;
}

export const useDebtStore = create<DebtsState>(set => ({
  isLoading: false,
  errorMessage: undefined,
  debtsByHome: [],
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
  },
  getDebtsByHome: async homeId => {
    set({ isLoading: true });
    const resp = await getDebtsByHomeAction(homeId);

    if (!resp) {
      set({ errorMessage: 'Error inesperado', isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    set({ isLoading: false, errorMessage: undefined, debtsByHome: resp.data.debts });
    return true;
  },

  paisDebtMember: async debtMemberId => {
    set({ isLoading: true });
    const resp = await payDebtMemberAction(debtMemberId);

    if (!resp) {
      set({ errorMessage: 'Error inesperado', isLoading: false });
      return false;
    }

    if (!resp.ok) {
      set({ errorMessage: resp.message, isLoading: false });
      return false;
    }

    // set({ isLoading: false, errorMessage: undefined });
    const { debtMember } = resp.data;
    console.log(JSON.stringify(debtMember, null, 2));

    set(state => ({
      isLoading: false,
      errorMessage: undefined,
      debtsByHome: state.debtsByHome.map(debt =>
        debt.id === debtMember.debt.id
          ? {
              ...debt,
              affectedMembers: debt.affectedMembers.map(member =>
                member.id === debtMember.debtor.user.id ? { ...member, isPaid: debtMember.isPaid } : member
              )
            }
          : debt
      )
    }));
    return true;
  },
  deleteDebt: async debtId => {
    set({ isLoading: true });
    const resp = await deleteDebtAction(debtId);

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
      debtsByHome: state.debtsByHome.filter(debt => debt.id.toString() !== debtId)
    }));
    return true;
  }
}));
