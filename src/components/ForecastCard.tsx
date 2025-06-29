import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Wind, Droplets } from 'lucide-react';
import { ForecastData } from '../types/weather';
import { capitalizeWords } from '../utils/weatherHelpers';

interface ForecastCardProps {
  forecast: ForecastData;
  units: 'metric' | 'imperial';
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, units }) => {
  const tempUnit = units === 'metric' ? '°C' : '°F';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <motion.h2 
        className="text-2xl font-bold text-white mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        5-Day Forecast
      </motion.h2>
      
      <motion.div 
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {forecast.list.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-200 border border-white/10"
            variants={itemVariants}
            whileHover={{ scale: 1.02, x: 5 }}
          >
            <div className="flex items-center gap-4 flex-1">
              <motion.img
                src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                alt={item.description}
                className="w-12 h-12"
                whileHover={{ scale: 1.1 }}
              />
              <div>
                <div className="text-white font-medium text-lg">
                  {formatDate(item.date)}
                </div>
                <div className="text-white/70 text-sm capitalize">
                  {capitalizeWords(item.description)}
                </div>
                {item.pop > 0 && (
                  <div className="flex items-center gap-1 text-blue-400 text-xs mt-1">
                    <CloudRain className="h-3 w-3" />
                    <span>{item.pop}%</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-white font-semibold text-lg">
                <span className="text-white">{item.temp.max}{tempUnit}</span>
                <span className="text-white/60 ml-2">{item.temp.min}{tempUnit}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm mt-1">
                <Droplets className="h-3 w-3" />
                <span>{item.humidity}%</span>
                <Wind className="h-3 w-3 ml-2" />
                <span>{Math.round(item.windSpeed)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};