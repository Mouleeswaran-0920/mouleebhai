import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Snowflake, Zap, Wind } from 'lucide-react';

interface FloatingWeatherElementsProps {
  weatherCondition?: string;
  isNight?: boolean;
}

export const FloatingWeatherElements: React.FC<FloatingWeatherElementsProps> = ({ 
  weatherCondition = 'clear', 
  isNight = false 
}) => {
  const getWeatherElements = () => {
    switch (weatherCondition.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        return [
          { icon: CloudRain, color: 'text-blue-400', size: 'h-8 w-8' },
          { icon: Cloud, color: 'text-slate-400', size: 'h-6 w-6' },
          { icon: CloudRain, color: 'text-cyan-400', size: 'h-10 w-10' },
        ];
      case 'snow':
        return [
          { icon: Snowflake, color: 'text-white', size: 'h-8 w-8' },
          { icon: Cloud, color: 'text-slate-300', size: 'h-6 w-6' },
          { icon: Snowflake, color: 'text-blue-100', size: 'h-6 w-6' },
        ];
      case 'thunderstorm':
        return [
          { icon: Zap, color: 'text-yellow-400', size: 'h-10 w-10' },
          { icon: Cloud, color: 'text-gray-600', size: 'h-8 w-8' },
          { icon: CloudRain, color: 'text-blue-500', size: 'h-8 w-8' },
        ];
      case 'clouds':
        return [
          { icon: Cloud, color: 'text-gray-400', size: 'h-12 w-12' },
          { icon: Cloud, color: 'text-slate-400', size: 'h-8 w-8' },
          { icon: Cloud, color: 'text-gray-300', size: 'h-10 w-10' },
        ];
      default:
        return isNight 
          ? [
              { icon: Cloud, color: 'text-purple-400', size: 'h-8 w-8' },
              { icon: Wind, color: 'text-blue-400', size: 'h-6 w-6' },
            ]
          : [
              { icon: Sun, color: 'text-yellow-400', size: 'h-12 w-12' },
              { icon: Cloud, color: 'text-white', size: 'h-8 w-8' },
              { icon: Wind, color: 'text-cyan-400', size: 'h-6 w-6' },
            ];
    }
  };

  const elements = getWeatherElements();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating weather icons */}
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.color} ${element.size} opacity-20`}
          initial={{
            x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
            y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800,
          }}
          animate={{
            x: [
              typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
              typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
              typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
            ],
            y: [
              typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800,
              typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800,
              typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800,
            ],
            rotate: [0, 360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20 + index * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <element.icon className={element.size} />
        </motion.div>
      ))}

      {/* Rainbow floating orbs */}
      {Array.from({ length: 12 }).map((_, index) => (
        <motion.div
          key={`orb-${index}`}
          className={`absolute w-4 h-4 rounded-full opacity-30 ${
            index % 6 === 0 ? 'bg-red-400' :
            index % 6 === 1 ? 'bg-orange-400' :
            index % 6 === 2 ? 'bg-yellow-400' :
            index % 6 === 3 ? 'bg-green-400' :
            index % 6 === 4 ? 'bg-blue-400' :
            'bg-purple-400'
          }`}
          initial={{
            x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
            y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800,
          }}
          animate={{
            x: [
              typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
              typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
              typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
            ],
            y: [
              typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800,
              typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800,
              typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800,
            ],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Sparkle effects */}
      {Array.from({ length: 20 }).map((_, index) => (
        <motion.div
          key={`sparkle-${index}`}
          className="absolute w-1 h-1 bg-white rounded-full opacity-60"
          initial={{
            x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
            y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800,
          }}
          animate={{
            x: [
              typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
              typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
            ],
            y: [
              typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800,
              typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800,
            ],
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};