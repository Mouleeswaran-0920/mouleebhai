import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer } from 'lucide-react';

interface UnitToggleProps {
  units: 'metric' | 'imperial';
  onToggle: (units: 'metric' | 'imperial') => void;
}

export const UnitToggle: React.FC<UnitToggleProps> = ({ units, onToggle }) => {
  return (
    <motion.div 
      className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20"
      whileHover={{ scale: 1.02 }}
    >
      <Thermometer className="h-4 w-4 text-white/60 ml-2" />
      <motion.button
        onClick={() => onToggle('metric')}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          units === 'metric'
            ? 'bg-white/20 text-white shadow-lg'
            : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        °C
      </motion.button>
      <motion.button
        onClick={() => onToggle('imperial')}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          units === 'imperial'
            ? 'bg-white/20 text-white shadow-lg'
            : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        °F
      </motion.button>
    </motion.div>
  );
};