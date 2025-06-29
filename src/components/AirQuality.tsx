import React from 'react';
import { motion } from 'framer-motion';
import { Wind, AlertTriangle, CheckCircle } from 'lucide-react';
import { AirQualityData } from '../types/weather';
import { getAirQualityLevel } from '../utils/weatherHelpers';

interface AirQualityProps {
  data: AirQualityData;
  detailed?: boolean;
}

export const AirQuality: React.FC<AirQualityProps> = ({ data, detailed = false }) => {
  const { level, color, bg } = getAirQualityLevel(data.aqi);
  
  const pollutants = [
    { name: 'CO', value: data.co, unit: 'μg/m³', description: 'Carbon Monoxide' },
    { name: 'NO₂', value: data.no2, unit: 'μg/m³', description: 'Nitrogen Dioxide' },
    { name: 'O₃', value: data.o3, unit: 'μg/m³', description: 'Ozone' },
    { name: 'SO₂', value: data.so2, unit: 'μg/m³', description: 'Sulfur Dioxide' },
    { name: 'PM2.5', value: data.pm2_5, unit: 'μg/m³', description: 'Fine Particles' },
    { name: 'PM10', value: data.pm10, unit: 'μg/m³', description: 'Coarse Particles' },
  ];

  const getHealthAdvice = (aqi: number) => {
    switch (aqi) {
      case 1: return "Air quality is excellent. Perfect for outdoor activities.";
      case 2: return "Air quality is good. Enjoy your outdoor activities.";
      case 3: return "Air quality is moderate. Sensitive individuals should limit outdoor exposure.";
      case 4: return "Air quality is poor. Consider reducing outdoor activities.";
      case 5: return "Air quality is very poor. Avoid outdoor activities if possible.";
      default: return "Air quality data unavailable.";
    }
  };

  if (!detailed) {
    return (
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Wind className="h-6 w-6 text-white/80" />
          <h3 className="text-xl font-bold text-white">Air Quality</h3>
        </div>
        
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${bg} mb-3`}>
            {data.aqi <= 2 ? (
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            )}
            <span className={`font-semibold ${color}`}>{level}</span>
          </div>
          
          <div className="text-3xl font-bold text-white mb-2">
            AQI {data.aqi}
          </div>
          
          <p className="text-white/70 text-sm">
            {getHealthAdvice(data.aqi)}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main AQI Display */}
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wind className="h-8 w-8 text-white/80" />
            <h2 className="text-3xl font-bold text-white">Air Quality Index</h2>
          </div>
          
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${bg} mb-4`}>
            {data.aqi <= 2 ? (
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            )}
            <span className={`text-xl font-bold ${color}`}>{level}</span>
          </div>
          
          <div className="text-6xl font-light text-white mb-4">
            {data.aqi}
          </div>
          
          <p className="text-white/80 text-lg max-w-md mx-auto">
            {getHealthAdvice(data.aqi)}
          </p>
        </div>

        {/* AQI Scale */}
        <div className="bg-white/5 rounded-2xl p-4">
          <h4 className="text-white font-semibold mb-3">Air Quality Scale</h4>
          <div className="grid grid-cols-5 gap-2 text-xs">
            {[
              { level: 1, label: 'Good', color: 'bg-emerald-500' },
              { level: 2, label: 'Fair', color: 'bg-lime-500' },
              { level: 3, label: 'Moderate', color: 'bg-amber-500' },
              { level: 4, label: 'Poor', color: 'bg-orange-500' },
              { level: 5, label: 'Very Poor', color: 'bg-red-500' },
            ].map((item) => (
              <div key={item.level} className="text-center">
                <div className={`h-2 rounded-full ${item.color} ${data.aqi === item.level ? 'ring-2 ring-white' : ''}`}></div>
                <div className="text-white/70 mt-1">{item.label}</div>
                <div className="text-white/50">{item.level}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Pollutant Details */}
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-2xl font-bold text-white mb-6">Pollutant Levels</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pollutants.map((pollutant, index) => (
            <motion.div
              key={pollutant.name}
              className="bg-white/5 rounded-2xl p-4 border border-white/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {pollutant.value.toFixed(1)}
                </div>
                <div className="text-white/60 text-sm mb-2">
                  {pollutant.unit}
                </div>
                <div className="text-white font-medium mb-1">
                  {pollutant.name}
                </div>
                <div className="text-white/70 text-xs">
                  {pollutant.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};