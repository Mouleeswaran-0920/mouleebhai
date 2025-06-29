import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { CloudRain, Wind, Droplets } from 'lucide-react';
import { HourlyData } from '../types/weather';
import { formatHourTime } from '../utils/weatherHelpers';

interface HourlyForecastProps {
  data: HourlyData;
  units: 'metric' | 'imperial';
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, units }) => {
  const tempUnit = units === 'metric' ? '°C' : '°F';
  
  const chartData = data.list.map(item => ({
    time: formatHourTime(item.time),
    temp: item.temp,
    feelsLike: item.feelsLike,
    humidity: item.humidity,
    pop: item.pop
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-lg p-3 border border-white/30">
          <p className="text-white font-medium">{label}</p>
          <p className="text-cyan-400">
            Temperature: {payload[0].value}{tempUnit}
          </p>
          <p className="text-emerald-400">
            Feels like: {payload[1].value}{tempUnit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Temperature Chart */}
      <motion.div
        className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-white via-cyan-100 to-pink-100 bg-clip-text">
          🌈 24-Hour Temperature Rainbow
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="16.66%" stopColor="#f97316" />
                  <stop offset="33.33%" stopColor="#eab308" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="66.66%" stopColor="#3b82f6" />
                  <stop offset="83.33%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="url(#rainbowGradient)" 
                strokeWidth={4}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: '#06B6D4', strokeWidth: 3, fill: '#ffffff' }}
              />
              <Line 
                type="monotone" 
                dataKey="feelsLike" 
                stroke="#10B981" 
                strokeWidth={3}
                strokeDasharray="8 8"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Hourly Details */}
      <motion.div
        className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-white via-purple-100 to-cyan-100 bg-clip-text">
          ⏰ Hourly Rainbow Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {data.list.slice(0, 12).map((item, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 border border-white/20 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium bg-gradient-to-r from-white to-cyan-100 bg-clip-text">
                  {formatHourTime(item.time)}
                </span>
                <img
                  src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                  alt={item.description}
                  className="w-8 h-8 drop-shadow-lg"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Temperature</span>
                  <span className="text-white font-medium bg-gradient-to-r from-white to-pink-100 bg-clip-text">{item.temp}{tempUnit}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Feels like</span>
                  <span className="text-white/90">{item.feelsLike}{tempUnit}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-white/80">
                    <Droplets className="h-3 w-3" />
                    <span>Humidity</span>
                  </div>
                  <span className="text-cyan-400 font-medium">{item.humidity}%</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-white/80">
                    <Wind className="h-3 w-3" />
                    <span>Wind</span>
                  </div>
                  <span className="text-emerald-400 font-medium">{Math.round(item.windSpeed)} {units === 'metric' ? 'm/s' : 'mph'}</span>
                </div>
                
                {item.pop > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-white/80">
                      <CloudRain className="h-3 w-3" />
                      <span>Rain</span>
                    </div>
                    <span className="text-blue-400 font-medium">{item.pop}%</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};