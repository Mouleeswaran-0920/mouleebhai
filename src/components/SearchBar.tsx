import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (city: string) => void;
  loading: boolean;
  onLocationClick: () => void;
  suggestions: string[];
  showSuggestions: boolean;
  onSuggestionsChange: (show: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  loading, 
  onLocationClick,
  suggestions,
  showSuggestions,
  onSuggestionsChange
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      onSuggestionsChange(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Show recent searches when user starts typing
    if (value.length > 0) {
      const recentSearches = JSON.parse(localStorage.getItem('recent-searches') || '[]');
      onSuggestionsChange(recentSearches.length > 0);
    } else {
      onSuggestionsChange(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="w-full max-w-2xl mx-auto"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-white/60" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for any city worldwide..."
          className="block w-full pl-12 pr-20 py-4 border border-white/20 rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 text-lg"
          disabled={loading}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <motion.button
            type="button"
            onClick={onLocationClick}
            className="p-2 text-white/60 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            <MapPin className="h-5 w-5" />
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading || !query.trim()}
            className="p-2 text-white/60 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/10 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
};