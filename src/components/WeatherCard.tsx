import React from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset,
  Heart,
  CloudRain,
  Sun,
  Cloud
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { formatTime, getWindDirection, capitalizeWords, getUVIndexLevel } from '../utils/weatherHelpers';

interface WeatherCardProps {
  weather: WeatherData;
  units: 'metric' | 'imperial';
  onAddToFavorites: () => void;
  isFavorite: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ 
  weather, 
  units, 
  onAddToFavorites, 
  isFavorite 
}) => {
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const speedUnit = units === 'metric' ? 'm/s' : 'mph';

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-16 translate-x-16" />
      
      {/* Header */}
      <motion.div className="flex justify-between items-start mb-6" variants={itemVariants}>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {weather.name}
          </h1>
          <p className="text-white/70 text-lg">
            {weather.country}
          </p>
        </div>
        <motion.button
          onClick={onAddToFavorites}
          className={`p-3 rounded-full transition-all duration-200 ${
            isFavorite 
              ? 'bg-pink-500/20 text-pink-400' 
              : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </motion.button>
      </motion.div>

      {/* Main weather display */}
      <motion.div className="text-center mb-8" variants={itemVariants}>
        <div className="flex items-center justify-center gap-6 mb-4">
          <motion.img
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
            alt={weather.description}
            className="w-32 h-32"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          />
          <div className="text-left">
            <motion.div 
              className="text-7xl font-light text-white mb-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {weather.temp}{tempUnit}
            </motion.div>
            <div className="text-white/80 text-xl">
              Feels like {weather.feelsLike}{tempUnit}
            </div>
          </div>
        </div>
        <motion.p 
          className="text-2xl text-white/90 capitalize font-medium"
          variants={itemVariants}
        >
          {capitalizeWords(weather.description)}
        </motion.p>
      </motion.div>

      {/* Weather metrics grid */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" variants={itemVariants}>
        <motion.div 
          className="bg-white/5 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/10"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <Droplets className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-2xl font-semibold text-white">{weather.humidity}%</div>
          <div className="text-white/70 text-sm">Humidity</div>
        </motion.div>

        <motion.div 
          className="bg-white/5 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/10"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <Wind className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl font-semibold text-white">
            {weather.windSpeed} {speedUnit}
          </div>
          <div className="text-white/70 text-sm">
            {getWindDirection(weather.windDirection)}
          </div>
        </motion.div>

        <motion.div 
          className="bg-white/5 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/10"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <Gauge className="h-6 w-6 text-violet-400 mx-auto mb-2" />
          <div className="text-2xl font-semibold text-white">{weather.pressure}</div>
          <div className="text-white/70 text-sm">hPa</div>
        </motion.div>

        <motion.div 
          className="bg-white/5 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/10"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <Eye className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <div className="text-2xl font-semibold text-white">{weather.visibility}</div>
          <div className="text-white/70 text-sm">km</div>
        </motion.div>
      </motion.div>

      {/* Additional metrics */}
      {(weather.uvIndex || weather.cloudCover !== undefined) && (
        <motion.div className="grid grid-cols-2 gap-4 mb-6" variants={itemVariants}>
          {weather.uvIndex && (
            <div className="bg-white/5 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/10">
              <Sun className="h-6 w-6 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-semibold text-white">{weather.uvIndex}</div>
              <div className={`text-sm ${getUVIndexLevel(weather.uvIndex).color}`}>
                {getUVIndexLevel(weather.uvIndex).level}
              </div>
            </div>
          )}
          {weather.cloudCover !== undefined && (
            <div className="bg-white/5 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/10">
              <Cloud className="h-6 w-6 text-slate-400 mx-auto mb-2" />
              <div className="text-2xl font-semibold text-white">{weather.cloudCover}%</div>
              <div className="text-white/70 text-sm">Cloud Cover</div>
            </div>
          )}
        </motion.div>
      )}

      {/* Sun times */}
      <motion.div 
        className="flex justify-between pt-6 border-t border-white/20"
        variants={itemVariants}
      >
        <motion.div 
          className="flex items-center gap-3 text-white/80"
          whileHover={{ scale: 1.05 }}
        >
          <div className="p-2 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-lg">
            <Sunrise className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <div className="text-sm text-white/60">Sunrise</div>
            <div className="font-medium">{formatTime(weather.sunrise)}</div>
          </div>
        </motion.div>
        <motion.div 
          className="flex items-center gap-3 text-white/80"
          whileHover={{ scale: 1.05 }}
        >
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg">
            <Sunset className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-right">
            <div className="text-sm text-white/60">Sunset</div>
            <div className="font-medium">{formatTime(weather.sunset)}</div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};