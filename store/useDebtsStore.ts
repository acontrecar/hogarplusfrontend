import { create } from 'zustand';
import { CreateDebtsDto, Debt, SummaryDebtResponse } from '../infraestructure/interfaces/debts/debts.interfaces';
import {
  createDebtAction,
  deleteDebtAction,
  getDebtsByHomeAction,
  payDebtMemberAction,
  summaryDebtAction
} from '../action/debts/debts.action';

interface DebtsState {
  isLoading: boolean;
  errorMessage?: string;
  debtsByHome: Debt[];
  summary: SummaryDebtResponse;
  createDebt: (debt: CreateDebtsDto) => Promise<boolean>;
  getDebtsByHome: (homeId: string) => Promise<boolean>;
  paisDebtMember: (debtMemberId: string) => Promise<boolean>;
  deleteDebt: (debtId: string) => Promise<boolean>;
  summaryDebt: (homeId: string) => Promise<boolean>;
}

export const useDebtStore = create<DebtsState>(set => ({
  isLoading: false,
  errorMessage: undefined,
  debtsByHome: [],
  summary: {
    totalOwedToMe: 0,
    totalIOwe: 0,
    balance: 0,
    lastDebtIAffect: []
  },
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
  },
  summaryDebt: async homeId => {
    set({ isLoading: true });
    const resp = await summaryDebtAction(homeId);

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
  }
}));
