import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';

interface LocationSuggestionsProps {
  suggestions: string[];
  onSelect: (city: string) => void;
  onClose: () => void;
}

export const LocationSuggestions: React.FC<LocationSuggestionsProps> = ({
  suggestions,
  onSelect,
  onClose
}) => {
  const recentSearches = JSON.parse(localStorage.getItem('recent-searches') || '[]');

  return (
    <AnimatePresence>
      <motion.div
        className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl z-50 overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {recentSearches.length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
              <Clock className="h-4 w-4" />
              <span>Recent Searches</span>
            </div>
            <div className="space-y-1">
              {recentSearches.slice(0, 5).map((city: string, index: number) => (
                <motion.button
                  key={city}
                  onClick={() => onSelect(city)}
                  className="w-full text-left px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200 flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  <MapPin className="h-4 w-4 text-white/60" />
                  <span>{city}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};