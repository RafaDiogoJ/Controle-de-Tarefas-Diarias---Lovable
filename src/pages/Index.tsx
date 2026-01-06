import { useTasks } from '@/hooks/useTasks';
import { ProgressRing } from '@/components/ProgressRing';
import { TaskList } from '@/components/TaskList';
import { AddTaskForm } from '@/components/AddTaskForm';
import { getProgressPercentage, formatDate } from '@/lib/taskUtils';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';

const Index = () => {
  const { todayTasks, addTask, toggleTask, deleteTask, isLoaded } = useTasks();
  const progress = getProgressPercentage(todayTasks);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <CalendarDays className="w-4 h-4" />
            <span className="text-sm font-medium capitalize">
              {formatDate()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Minhas Tarefas
          </h1>
        </motion.header>

        {/* Progress Ring */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-16"
        >
          <ProgressRing percentage={progress} />
        </motion.section>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-8 mb-8"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {todayTasks.filter(t => t.completedDates.includes(new Date().toISOString().split('T')[0])).length}
            </p>
            <p className="text-sm text-muted-foreground">Concluídas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {todayTasks.length}
            </p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {todayTasks.filter(t => !t.completedDates.includes(new Date().toISOString().split('T')[0])).length}
            </p>
            <p className="text-sm text-muted-foreground">Restantes</p>
          </div>
        </motion.div>

        {/* Task List */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Tarefas de hoje
            </h2>
            {todayTasks.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {progress}% concluído
              </span>
            )}
          </div>
          <TaskList 
            tasks={todayTasks} 
            onToggle={toggleTask} 
            onDelete={deleteTask} 
          />
        </motion.section>

        {/* Add Task Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AddTaskForm onAdd={addTask} />
        </motion.section>
      </div>
    </div>
  );
};

export default Index;
