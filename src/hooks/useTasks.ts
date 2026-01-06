import { useState, useEffect, useCallback } from 'react';
import { Task, RecurrenceType } from '@/types/task';
import { generateId, getToday, getTasksForToday, isTaskCompleted } from '@/lib/taskUtils';

const STORAGE_KEY = 'daily-tasks-app';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTasks(parsed.tasks || []);
      } catch (e) {
        console.error('Failed to parse stored tasks:', e);
        setTasks([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks }));
    }
  }, [tasks, isLoaded]);

  // Clean up old "once" tasks
  useEffect(() => {
    const today = getToday();
    setTasks(prev => prev.filter(task => {
      if (task.recurrence === 'once' && task.createdAt !== today) {
        return false;
      }
      return true;
    }));
  }, []);

  const addTask = useCallback((name: string, recurrence: RecurrenceType) => {
    const newTask: Task = {
      id: generateId(),
      name: name.trim(),
      recurrence,
      createdAt: getToday(),
      completedDates: [],
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    const today = getToday();
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      
      const isCompleted = task.completedDates.includes(today);
      return {
        ...task,
        completedDates: isCompleted
          ? task.completedDates.filter(d => d !== today)
          : [...task.completedDates, today],
      };
    }));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const todayTasks = getTasksForToday(tasks);

  return {
    tasks,
    allTasks: tasks,
    todayTasks,
    addTask,
    toggleTask,
    deleteTask,
    isLoaded,
  };
};
