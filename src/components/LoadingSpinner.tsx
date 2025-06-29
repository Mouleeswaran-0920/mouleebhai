import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-8">
        {/* Rainbow animated weather icons */}
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sun className="h-8 w-8 text-yellow-400 drop-shadow-lg" />
          </motion.div>
          
          <motion.div
            className="absolute top-1/2 -right-8 transform -translate-y-1/2"
            animate={{ x: [-3, 3, -3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud className="h-8 w-8 text-cyan-400 drop-shadow-lg" />
          </motion.div>
          
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [3, -3, 3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <CloudRain className="h-8 w-8 text-blue-400 drop-shadow-lg" />
          </motion.div>
          
          <motion.div
            className="absolute top-1/2 -left-8 transform -translate-y-1/2"
            animate={{ x: [2, -2, 2] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud className="h-8 w-8 text-purple-400 drop-shadow-lg" />
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div
        className="text-white/90 text-xl font-medium mb-4 bg-gradient-to-r from-pink-200 via-purple-200 to-cyan-200 bg-clip-text text-transparent"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        🌈 Loading rainbow weather magic...
      </motion.div>
      
      <div className="flex space-x-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === 0 ? 'bg-red-400' :
              i === 1 ? 'bg-orange-400' :
              i === 2 ? 'bg-yellow-400' :
              i === 3 ? 'bg-green-400' :
              i === 4 ? 'bg-blue-400' :
              'bg-purple-400'
            }`}
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.5, 1, 0.5],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};