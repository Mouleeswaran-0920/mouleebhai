import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <motion.div
      className="bg-red-500/10 backdrop-blur-md rounded-3xl p-8 border border-red-500/20 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
      </motion.div>
      
      <h3 className="text-2xl font-semibold text-white mb-4">Oops! Something went wrong</h3>
      <p className="text-white/80 mb-6 text-lg">{message}</p>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-white rounded-2xl transition-all duration-200 border border-red-500/30 font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="h-5 w-5" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};