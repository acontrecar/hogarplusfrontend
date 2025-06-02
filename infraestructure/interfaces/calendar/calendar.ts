export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  color?: string;
  isCompleted?: boolean;
};

export type AgendaItems = {
  [date: string]: CalendarEvent[];
};

export type HouseTask = {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  duration?: string;
  assignedTo: string[];
  houseId: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
};

export interface CreateTaskDto {
  title: string;
  description?: string;
  date: Date;
  time?: string;
  duration?: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: number[];
  houseId: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  house: House;
  assignedTo: CreatedBy[];
  createdBy: CreatedBy;
  completedBy: CreatedBy[];
  createdAt: Date;
}

export interface GetTasksResponse {
  tasks: Task[];
}

export interface CreateTaskResponse {
  task: Task;
}

export interface CompleteTaskResponse {
  task: Task;
}

export interface CreatedBy {
  id: number;
  role: string;
  userId: number;
  createdAt: Date;
  name: string;
}

export interface DeleteTaskDto {
  houseId: number;
  taskId: number;
}

export interface House {
  id: number;
  name: string;
  invitationCode: string;
}

export type AgendaSection = {
  title: string;
  data: Task[];
};
