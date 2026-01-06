import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Task, RecurrenceType } from '@/types/task';
import { TaskItem } from './TaskItem';
import { ClipboardList, Calendar, Briefcase, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getToday } from '@/lib/taskUtils';

type TabType = 'today' | 'weekdays' | 'weekends' | 'all';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'today', label: 'Hoje', icon: <Calendar className="w-4 h-4" /> },
  { id: 'weekdays', label: 'Semana', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'weekends', label: 'Fim de Semana', icon: <Sun className="w-4 h-4" /> },
  { id: 'all', label: 'Todas', icon: <ClipboardList className="w-4 h-4" /> },
];

interface TaskManagerProps {
  allTasks: Task[];
  todayTasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const filterTasksByTab = (tasks: Task[], tab: TabType, todayTasks: Task[]): Task[] => {
  switch (tab) {
    case 'today':
      return todayTasks;
    case 'weekdays':
      return tasks.filter(t => t.recurrence === 'weekdays' || t.recurrence === 'daily');
    case 'weekends':
      return tasks.filter(t => t.recurrence === 'weekends' || t.recurrence === 'daily');
    case 'all':
      return tasks;
    default:
      return todayTasks;
  }
};

const getEmptyMessage = (tab: TabType): { title: string; description: string } => {
  switch (tab) {
    case 'today':
      return {
        title: 'Nenhuma tarefa para hoje',
        description: 'Adicione suas primeiras tarefas e comece a construir sua rotina diária!',
      };
    case 'weekdays':
      return {
        title: 'Nenhuma tarefa de semana',
        description: 'Adicione tarefas que aparecem de segunda a sexta-feira.',
      };
    case 'weekends':
      return {
        title: 'Nenhuma tarefa de fim de semana',
        description: 'Adicione tarefas que aparecem aos sábados e domingos.',
      };
    case 'all':
      return {
        title: 'Nenhuma tarefa cadastrada',
        description: 'Adicione suas primeiras tarefas para começar!',
      };
    default:
      return { title: 'Nenhuma tarefa', description: '' };
  }
};

export const TaskManager = ({ allTasks, todayTasks, onToggle, onDelete }: TaskManagerProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const filteredTasks = filterTasksByTab(allTasks, activeTab, todayTasks);
  const showToggle = activeTab === 'today';
  const today = getToday();

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {getEmptyMessage(activeTab).title}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {getEmptyMessage(activeTab).description}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  showToggle={showToggle || task.completedDates.includes(today)}
                  isManageMode={!showToggle}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
