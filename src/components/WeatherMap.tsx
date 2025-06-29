import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Satellite, Cloud, CloudRain } from 'lucide-react';
import { WeatherData, LocationCoords } from '../types/weather';

interface WeatherMapProps {
  center: LocationCoords;
  weather: WeatherData;
}

export const WeatherMap: React.FC<WeatherMapProps> = ({ center, weather }) => {
  const mapUrl = `https://tile.openweathermap.org/map/precipitation_new/5/${center.lat}/${center.lon}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`;
  
  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">Weather Radar</h3>
          <div className="flex items-center gap-2">
            <Satellite className="h-5 w-5 text-white/60" />
            <span className="text-white/80 text-sm">Live Data</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <Cloud className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            <div className="text-white text-sm">Clouds</div>
            <div className="text-white/60 text-xs">Coverage</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <CloudRain className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-white text-sm">Precipitation</div>
            <div className="text-white/60 text-xs">Intensity</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <MapPin className="h-6 w-6 text-red-400 mx-auto mb-2" />
            <div className="text-white text-sm">Location</div>
            <div className="text-white/60 text-xs">{weather.name}</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">{weather.temp}°</div>
            <div className="text-white/60 text-xs">Current</div>
          </div>
        </div>
        
        {/* Placeholder for interactive map */}
        <div className="bg-white/5 rounded-2xl p-8 text-center border border-white/10 min-h-96 flex items-center justify-center">
          <div className="text-center">
            <Satellite className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Interactive Weather Map</h4>
            <p className="text-white/60 mb-4">
              Real-time weather radar and satellite imagery for {weather.name}
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white font-medium">Coordinates</div>
                <div className="text-white/70 text-sm">
                  {center.lat.toFixed(2)}°, {center.lon.toFixed(2)}°
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white font-medium">Zoom Level</div>
                <div className="text-white/70 text-sm">City View</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-white/70">Light Rain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-700 rounded"></div>
            <span className="text-white/70">Moderate Rain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-900 rounded"></div>
            <span className="text-white/70">Heavy Rain</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};