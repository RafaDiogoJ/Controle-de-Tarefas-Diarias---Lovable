import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { RecurrenceType } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AddTaskFormProps {
  onAdd: (name: string, recurrence: RecurrenceType) => void;
}

const recurrenceOptions: { value: RecurrenceType; label: string }[] = [
  { value: 'daily', label: 'Todos os dias' },
  { value: 'weekdays', label: 'Dias de semana' },
  { value: 'weekends', label: 'Fins de semana' },
  { value: 'once', label: 'Somente hoje' },
];

export const AddTaskForm = ({ onAdd }: AddTaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name, recurrence);
      setName('');
      setRecurrence('daily');
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setName('');
    setRecurrence('daily');
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button 
              onClick={() => setIsOpen(true)}
              variant="add"
              size="lg"
              className="w-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar tarefa
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl p-5 shadow-soft border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Nova tarefa</h3>
              <button
                type="button"
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome da tarefa..."
              className="mb-4"
              autoFocus
            />

            <div className="mb-5">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Recorrência
              </label>
              <div className="grid grid-cols-2 gap-2">
                {recurrenceOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRecurrence(option.value)}
                    className={cn(
                      "px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      recurrence === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={!name.trim()}
                className="flex-1"
              >
                Adicionar
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
