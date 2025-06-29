import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { WeatherAlert } from '../types/weather';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'moderate': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      case 'severe': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'extreme': return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  return (
    <AnimatePresence>
      {alerts.map((alert, index) => (
        <motion.div
          key={index}
          className={`rounded-2xl p-4 border backdrop-blur-md ${getSeverityColor(alert.severity)}`}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">{alert.event}</h4>
              <p className="text-white/80 text-sm mb-2">{alert.description}</p>
              <div className="text-xs text-white/60">
                {new Date(alert.start * 1000).toLocaleString()} - {new Date(alert.end * 1000).toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};