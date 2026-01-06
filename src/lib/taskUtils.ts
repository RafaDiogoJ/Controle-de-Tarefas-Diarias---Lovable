import { Task, RecurrenceType } from '@/types/task';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const isWeekend = (date: Date = new Date()): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const isWeekday = (date: Date = new Date()): boolean => {
  return !isWeekend(date);
};

export const shouldShowTask = (task: Task, date: string = getToday()): boolean => {
  const targetDate = new Date(date + 'T12:00:00');
  
  switch (task.recurrence) {
    case 'daily':
      return true;
    case 'weekdays':
      return isWeekday(targetDate);
    case 'weekends':
      return isWeekend(targetDate);
    case 'once':
      return task.createdAt === date;
    default:
      return false;
  }
};

export const isTaskCompleted = (task: Task, date: string = getToday()): boolean => {
  return task.completedDates.includes(date);
};

export const getTasksForToday = (tasks: Task[]): Task[] => {
  const today = getToday();
  return tasks.filter(task => shouldShowTask(task, today));
};

export const getCompletedTasksCount = (tasks: Task[]): number => {
  const today = getToday();
  return tasks.filter(task => isTaskCompleted(task, today)).length;
};

export const getProgressPercentage = (tasks: Task[]): number => {
  const todayTasks = getTasksForToday(tasks);
  if (todayTasks.length === 0) return 0;
  
  const completed = getCompletedTasksCount(todayTasks);
  return Math.round((completed / todayTasks.length) * 100);
};

export const getMotivationalMessage = (percentage: number): { message: string; emoji: string } => {
  if (percentage === 0) {
    return { message: 'Vamos começar!', emoji: '💪' };
  } else if (percentage <= 25) {
    return { message: 'Bom começo, continue!', emoji: '🌱' };
  } else if (percentage <= 50) {
    return { message: 'Bom ritmo, continue!', emoji: '🔥' };
  } else if (percentage <= 75) {
    return { message: 'Você está indo muito bem!', emoji: '⭐' };
  } else if (percentage < 100) {
    return { message: 'Quase lá, não desista!', emoji: '🚀' };
  } else {
    return { message: 'Parabéns! Dia concluído com sucesso', emoji: '🎉' };
  }
};

export const getRecurrenceLabel = (recurrence: RecurrenceType): string => {
  switch (recurrence) {
    case 'daily':
      return 'Todos os dias';
    case 'weekdays':
      return 'Dias de semana';
    case 'weekends':
      return 'Fins de semana';
    case 'once':
      return 'Somente hoje';
    default:
      return '';
  }
};

export const formatDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};
