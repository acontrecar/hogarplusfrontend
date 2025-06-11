import { User } from '../../../domain/entities/user';

export interface CreateDebtsDto {
  description: string;
  amount: number;
  affectedMemberIds: number[];
  homeId: number;
}

export interface CreateDebtsResponse {
  message: string;
}

export interface GetDebtsByHome {
  debts: Debt[];
}

export interface Debt {
  id: number;
  index: number;
  description: string;
  homeName: string;
  amount: string;
  status: DebtStatus;
  createdAt: Date;
  creditor: Creditor;
  affectedMembers: AffectedMember[];
}

export interface AffectedMember {
  id: number;
  name: string;
  debtMemberId: string;
  avatar: string | undefined;
  amount: string;
  isPaid: boolean;
}

export interface Creditor {
  id: number;
  name: string;
  avatar: string | undefined;
}

export interface PaidDebtMember {
  debtMember: DebtMember;
}

export interface DebtMember {
  id: number;
  debt: DebtPaid;
  debtor: Tor;
  amount: string;
  isPaid: boolean;
}

export interface DebtPaid {
  id: number;
  amount: string;
  description: string;
  status: DebtStatus;
  creditor: Tor;
  createdAt: Date;
}

export interface Tor {
  id: number;
  role: string;
  createdAt: Date;
  user?: User;
}

export interface DeleteDebtResponse {
  debtIdDelete: number;
}

export enum DebtStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}

export interface SummaryDebtResponse {
  totalOwedToMe: number;
  totalIOwe: number;
  balance: number;
  lastDebtIAffect: LastDebtIAffect[];
}

export interface LastDebtIAffect {
  id: number;
  description: string;
  amount: number;
  creditor: Creditor;
}

export interface Creditor {
  id: number;
  name: string;
}
