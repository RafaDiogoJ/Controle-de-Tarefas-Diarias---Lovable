import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import { Task } from '@/types/task';
import { isTaskCompleted, getRecurrenceLabel, getToday } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const completed = isTaskCompleted(task, getToday());

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
        completed 
          ? "bg-task-completed" 
          : "bg-task-pending hover:bg-task-hover"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300",
          completed
            ? "bg-success border-success"
            : "border-muted-foreground/40 hover:border-primary"
        )}
      >
        <motion.div
          initial={false}
          animate={{ scale: completed ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check className="w-4 h-4 text-success-foreground" />
        </motion.div>
      </button>

      {/* Task content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-base font-medium transition-all duration-300",
          completed 
            ? "text-muted-foreground line-through" 
            : "text-foreground"
        )}>
          {task.name}
        </p>
        <span className="text-xs text-muted-foreground">
          {getRecurrenceLabel(task.recurrence)}
        </span>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all duration-200"
        aria-label="Excluir tarefa"
      >
        <Trash2 className="w-4 h-4 text-destructive" />
      </button>
    </motion.div>
  );
};
