import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark' | 'auto';
  onToggle: (theme: 'light' | 'dark' | 'auto') => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  const themes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'auto', icon: Monitor, label: 'Auto' }
  ];

  return (
    <motion.div 
      className="flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20"
      whileHover={{ scale: 1.02 }}
    >
      {themes.map(({ id, icon: Icon }) => (
        <motion.button
          key={id}
          onClick={() => onToggle(id as any)}
          className={`p-2 rounded-xl transition-all duration-200 ${
            theme === id
              ? 'bg-white/20 text-white shadow-lg'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className="h-4 w-4" />
        </motion.button>
      ))}
    </motion.div>
  );
};