export type RecurrenceType = 'daily' | 'weekdays' | 'weekends' | 'once';

export interface Task {
  id: string;
  name: string;
  recurrence: RecurrenceType;
  createdAt: string; // ISO date string
  completedDates: string[]; // Array of ISO date strings when task was completed
}

export interface TaskState {
  tasks: Task[];
}
