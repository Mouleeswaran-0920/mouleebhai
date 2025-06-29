import React from 'react';
import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';

interface FavoriteLocationsProps {
  favorites: string[];
  onSelect: (city: string) => void;
  onRemove: (city: string) => void;
}

export const FavoriteLocations: React.FC<FavoriteLocationsProps> = ({
  favorites,
  onSelect,
  onRemove
}) => {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 text-white/80 text-sm mb-3">
        <Heart className="h-4 w-4 text-red-400" />
        <span>Favorite Locations</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {favorites.map((city, index) => (
          <motion.div
            key={city}
            className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1 border border-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
          >
            <button
              onClick={() => onSelect(city)}
              className="text-white hover:text-white/80 transition-colors"
            >
              {city}
            </button>
            <button
              onClick={() => onRemove(city)}
              className="text-white/60 hover:text-red-400 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};