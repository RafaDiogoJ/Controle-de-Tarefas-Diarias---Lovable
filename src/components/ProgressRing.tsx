import { motion } from 'framer-motion';
import { getMotivationalMessage } from '@/lib/taskUtils';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export const ProgressRing = ({ 
  percentage, 
  size = 200, 
  strokeWidth = 12 
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const { message, emoji } = getMotivationalMessage(percentage);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--progress-track))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--progress-fill))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <motion.span 
          key={percentage}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-bold text-foreground"
        >
          {percentage}%
        </motion.span>
        <span className="text-sm text-muted-foreground">concluído</span>
      </div>
      
      {/* Motivational message */}
      <motion.div 
        key={message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        <p className="text-lg font-medium text-foreground">
          {message} <span className="text-xl">{emoji}</span>
        </p>
      </motion.div>
    </div>
  );
};
