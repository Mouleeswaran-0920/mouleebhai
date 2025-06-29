import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { WeatherData, ForecastData } from '../types/weather';
import { getWeatherInsight } from '../utils/weatherHelpers';

interface WeatherInsightsProps {
  weather: WeatherData;
  forecast: ForecastData;
}

export const WeatherInsights: React.FC<WeatherInsightsProps> = ({ weather, forecast }) => {
  const insights = getWeatherInsight(weather, forecast);
  
  const getInsightIcon = (insight: string) => {
    if (insight.includes('warmer')) return <TrendingUp className="h-5 w-5 text-red-400" />;
    if (insight.includes('cooler')) return <TrendingDown className="h-5 w-5 text-blue-400" />;
    if (insight.includes('rain') || insight.includes('precipitation')) return <AlertCircle className="h-5 w-5 text-blue-400" />;
    if (insight.includes('wind')) return <AlertCircle className="h-5 w-5 text-green-400" />;
    return <Lightbulb className="h-5 w-5 text-yellow-400" />;
  };

  if (insights.length === 0) {
    return (
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Weather Insights</h3>
        </div>
        <p className="text-white/80">
          Weather conditions are stable with no significant changes expected.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="h-6 w-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-white">Weather Insights</h3>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02, x: 5 }}
          >
            {getInsightIcon(insight)}
            <p className="text-white/90 flex-1">{insight}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};