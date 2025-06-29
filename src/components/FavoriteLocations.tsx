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
      className="bg-gradient-to-r from-white/15 via-white/10 to-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 text-white/90 text-sm mb-3">
        <Heart className="h-4 w-4 text-pink-400" />
        <span className="bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent font-medium">
          💖 Favorite Rainbow Locations
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {favorites.map((city, index) => (
          <motion.div
            key={city}
            className="flex items-center gap-2 bg-gradient-to-r from-white/15 to-white/10 rounded-lg px-3 py-1 border border-white/30 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <button
              onClick={() => onSelect(city)}
              className="text-white hover:text-cyan-200 transition-colors font-medium"
            >
              {city}
            </button>
            <button
              onClick={() => onRemove(city)}
              className="text-white/60 hover:text-pink-400 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};