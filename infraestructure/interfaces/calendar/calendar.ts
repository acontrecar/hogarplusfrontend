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
  status: "pending" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
};

export type AgendaSection = {
  title: string;
  data: HouseTask[];
};
