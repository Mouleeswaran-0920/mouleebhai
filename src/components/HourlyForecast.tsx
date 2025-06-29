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
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
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
        className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-2xl font-bold text-white mb-6">24-Hour Temperature Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#06B6D4" 
                strokeWidth={3}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#06B6D4', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="feelsLike" 
                stroke="#10B981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Hourly Details */}
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-2xl font-bold text-white mb-6">Hourly Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {data.list.slice(0, 12).map((item, index) => (
            <motion.div
              key={index}
              className="bg-white/5 rounded-2xl p-4 border border-white/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">
                  {formatHourTime(item.time)}
                </span>
                <img
                  src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                  alt={item.description}
                  className="w-8 h-8"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Temperature</span>
                  <span className="text-white font-medium">{item.temp}{tempUnit}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Feels like</span>
                  <span className="text-white/80">{item.feelsLike}{tempUnit}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-white/70">
                    <Droplets className="h-3 w-3" />
                    <span>Humidity</span>
                  </div>
                  <span className="text-cyan-400">{item.humidity}%</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-white/70">
                    <Wind className="h-3 w-3" />
                    <span>Wind</span>
                  </div>
                  <span className="text-emerald-400">{Math.round(item.windSpeed)} {units === 'metric' ? 'm/s' : 'mph'}</span>
                </div>
                
                {item.pop > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-white/70">
                      <CloudRain className="h-3 w-3" />
                      <span>Rain</span>
                    </div>
                    <span className="text-blue-400">{item.pop}%</span>
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