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
      className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30 relative overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {/* Rainbow background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 via-yellow-500/20 via-green-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/15 via-cyan-500/15 to-emerald-500/15 rounded-full blur-2xl translate-y-12 -translate-x-12" />
      
      {/* Header */}
      <motion.div className="flex justify-between items-start mb-6" variants={itemVariants}>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white via-pink-100 to-cyan-100 bg-clip-text">
            {weather.name}
          </h1>
          <p className="text-white/80 text-lg">
            {weather.country}
          </p>
        </div>
        <motion.button
          onClick={onAddToFavorites}
          className={`p-3 rounded-full transition-all duration-200 ${
            isFavorite 
              ? 'bg-gradient-to-r from-pink-500/20 to-red-500/20 text-pink-400' 
              : 'bg-white/10 text-white/60 hover:text-white hover:bg-gradient-to-r hover:from-white/15 hover:to-white/20'
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
            className="w-32 h-32 drop-shadow-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          />
          <div className="text-left">
            <motion.div 
              className="text-7xl font-light text-white mb-2 bg-gradient-to-r from-white via-cyan-100 to-pink-100 bg-clip-text"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {weather.temp}{tempUnit}
            </motion.div>
            <div className="text-white/90 text-xl bg-gradient-to-r from-white/90 to-white/70 bg-clip-text">
              Feels like {weather.feelsLike}{tempUnit}
            </div>
          </div>
        </div>
        <motion.p 
          className="text-2xl text-white/95 capitalize font-medium bg-gradient-to-r from-white via-yellow-100 to-green-100 bg-clip-text"
          variants={itemVariants}
        >
          {capitalizeWords(weather.description)}
        </motion.p>
      </motion.div>

      {/* Weather metrics grid */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" variants={itemVariants}>
        <motion.div 
          className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-4 text-center backdrop-blur-sm border border-cyan-300/20"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(6, 182, 212, 0.15)' }}
        >
          <Droplets className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-2xl font-semibold text-white">{weather.humidity}%</div>
          <div className="text-white/80 text-sm">Humidity</div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl p-4 text-center backdrop-blur-sm border border-emerald-300/20"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
        >
          <Wind className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl font-semibold text-white">
            {weather.windSpeed} {speedUnit}
          </div>
          <div className="text-white/80 text-sm">
            {getWindDirection(weather.windDirection)}
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl p-4 text-center backdrop-blur-sm border border-violet-300/20"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(139, 92, 246, 0.15)' }}
        >
          <Gauge className="h-6 w-6 text-violet-400 mx-auto mb-2" />
          <div className="text-2xl font-semibold text-white">{weather.pressure}</div>
          <div className="text-white/80 text-sm">hPa</div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-2xl p-4 text-center backdrop-blur-sm border border-amber-300/20"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(245, 158, 11, 0.15)' }}
        >
          <Eye className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <div className="text-2xl font-semibold text-white">{weather.visibility}</div>
          <div className="text-white/80 text-sm">km</div>
        </motion.div>
      </motion.div>

      {/* Additional metrics */}
      {(weather.uvIndex || weather.cloudCover !== undefined) && (
        <motion.div className="grid grid-cols-2 gap-4 mb-6" variants={itemVariants}>
          {weather.uvIndex && (
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-4 text-center backdrop-blur-sm border border-orange-300/20">
              <Sun className="h-6 w-6 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-semibold text-white">{weather.uvIndex}</div>
              <div className={`text-sm ${getUVIndexLevel(weather.uvIndex).color}`}>
                {getUVIndexLevel(weather.uvIndex).level}
              </div>
            </div>
          )}
          {weather.cloudCover !== undefined && (
            <div className="bg-gradient-to-br from-slate-500/10 to-gray-500/10 rounded-2xl p-4 text-center backdrop-blur-sm border border-slate-300/20">
              <Cloud className="h-6 w-6 text-slate-400 mx-auto mb-2" />
              <div className="text-2xl font-semibold text-white">{weather.cloudCover}%</div>
              <div className="text-white/80 text-sm">Cloud Cover</div>
            </div>
          )}
        </motion.div>
      )}

      {/* Sun times */}
      <motion.div 
        className="flex justify-between pt-6 border-t border-white/30"
        variants={itemVariants}
      >
        <motion.div 
          className="flex items-center gap-3 text-white/90"
          whileHover={{ scale: 1.05 }}
        >
          <div className="p-2 bg-gradient-to-br from-orange-500/20 via-yellow-500/20 to-pink-500/20 rounded-lg border border-orange-300/30">
            <Sunrise className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <div className="text-sm text-white/70">Sunrise</div>
            <div className="font-medium text-white">{formatTime(weather.sunrise)}</div>
          </div>
        </motion.div>
        <motion.div 
          className="flex items-center gap-3 text-white/90"
          whileHover={{ scale: 1.05 }}
        >
          <div className="p-2 bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-blue-500/20 rounded-lg border border-purple-300/30">
            <Sunset className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-right">
            <div className="text-sm text-white/70">Sunset</div>
            <div className="font-medium text-white">{formatTime(weather.sunset)}</div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};