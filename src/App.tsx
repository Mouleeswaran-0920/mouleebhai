import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { HourlyForecast } from './components/HourlyForecast';
import { WeatherMap } from './components/WeatherMap';
import { AirQuality } from './components/AirQuality';
import { WeatherAlerts } from './components/WeatherAlerts';
import { LocationSuggestions } from './components/LocationSuggestions';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { UnitToggle } from './components/UnitToggle';
import { ThemeToggle } from './components/ThemeToggle';
import { FavoriteLocations } from './components/FavoriteLocations';
import { WeatherInsights } from './components/WeatherInsights';
import { ParticleBackground } from './components/ParticleBackground';
import { FloatingWeatherElements } from './components/FloatingWeatherElements';
import { WeatherData, ForecastData, HourlyData, AirQualityData } from './types/weather';
import { fetchWeatherData, fetchForecastData, fetchHourlyData, fetchAirQuality } from './utils/weatherApi';
import { getWeatherBackground, getCurrentLocation } from './utils/weatherHelpers';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGeolocation } from './hooks/useGeolocation';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useLocalStorage<'metric' | 'imperial'>('weather-units', 'metric');
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'auto'>('weather-theme', 'auto');
  const [favorites, setFavorites] = useLocalStorage<string[]>('weather-favorites', []);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'hourly' | 'map' | 'air'>('overview');
  
  const { location, error: geoError, getCurrentPosition } = useGeolocation();

  const handleSearch = async (city: string, coords?: { lat: number; lon: number }) => {
    setLoading(true);
    setError(null);
    setShowSuggestions(false);
    
    try {
      const [weatherData, forecastData, hourlyForecast, airQualityData] = await Promise.all([
        coords 
          ? fetchWeatherData('', units, coords)
          : fetchWeatherData(city, units),
        coords
          ? fetchForecastData('', units, coords)
          : fetchForecastData(city, units),
        coords
          ? fetchHourlyData('', units, coords)
          : fetchHourlyData(city, units),
        coords
          ? fetchAirQuality(coords)
          : fetchAirQuality(undefined, city)
      ]);
      
      setWeather(weatherData);
      setForecast(forecastData);
      setHourlyData(hourlyForecast);
      setAirQuality(airQualityData);
      
      // Add to recent searches
      if (city && !favorites.includes(city)) {
        const recentSearches = JSON.parse(localStorage.getItem('recent-searches') || '[]');
        const updated = [city, ...recentSearches.filter((s: string) => s !== city)].slice(0, 5);
        localStorage.setItem('recent-searches', JSON.stringify(updated));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setWeather(null);
      setForecast(null);
      setHourlyData(null);
      setAirQuality(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUnitChange = async (newUnits: 'metric' | 'imperial') => {
    setUnits(newUnits);
    
    if (weather) {
      setLoading(true);
      try {
        const [weatherData, forecastData, hourlyForecast] = await Promise.all([
          fetchWeatherData(weather.name, newUnits),
          fetchForecastData(weather.name, newUnits),
          fetchHourlyData(weather.name, newUnits)
        ]);
        
        setWeather(weatherData);
        setForecast(forecastData);
        setHourlyData(hourlyForecast);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update units');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLocationClick = async () => {
    if (location) {
      await handleSearch('', { lat: location.latitude, lon: location.longitude });
    } else {
      getCurrentPosition();
    }
  };

  const addToFavorites = (city: string) => {
    if (!favorites.includes(city)) {
      setFavorites([...favorites, city]);
    }
  };

  const removeFromFavorites = (city: string) => {
    setFavorites(favorites.filter(f => f !== city));
  };

  // Load default location on mount
  useEffect(() => {
    const loadDefaultLocation = async () => {
      if (location) {
        await handleSearch('', { lat: location.latitude, lon: location.longitude });
      } else {
        await handleSearch('New York');
      }
    };
    
    loadDefaultLocation();
  }, []);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    if (!weather) return;
    
    const interval = setInterval(() => {
      if (weather.coords) {
        handleSearch('', weather.coords);
      } else {
        handleSearch(weather.name);
      }
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, [weather]);

  const backgroundClass = weather 
    ? getWeatherBackground(weather.main, weather.isNight, theme)
    : 'min-h-screen bg-gradient-to-br from-red-400 via-orange-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-500';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className={`${backgroundClass} relative overflow-hidden`}>
      {/* Particle Background */}
      <ParticleBackground 
        weatherCondition={weather?.main || 'clear'} 
        isNight={weather?.isNight || false} 
      />
      
      {/* Floating Weather Elements */}
      <FloatingWeatherElements 
        weatherCondition={weather?.main || 'clear'} 
        isNight={weather?.isNight || false} 
      />

      {/* Rainbow animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-500/10 via-yellow-500/10 via-green-500/10 to-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-pink-500/10 via-orange-500/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 via-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-red-200 via-yellow-200 via-green-200 via-blue-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              🌈 RainbowWeather ✨
            </motion.h1>
            <p className="text-white/90 text-lg bg-gradient-to-r from-pink-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">
              Experience weather in full spectrum colors with magical particles
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-4 mb-8 w-full max-w-4xl"
            variants={itemVariants}
          >
            <div className="flex-1 w-full relative">
              <SearchBar 
                onSearch={handleSearch} 
                loading={loading}
                onLocationClick={handleLocationClick}
                suggestions={searchSuggestions}
                showSuggestions={showSuggestions}
                onSuggestionsChange={setShowSuggestions}
              />
              <AnimatePresence>
                {showSuggestions && (
                  <LocationSuggestions
                    suggestions={searchSuggestions}
                    onSelect={(city) => {
                      handleSearch(city);
                      setShowSuggestions(false);
                    }}
                    onClose={() => setShowSuggestions(false)}
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2">
              <UnitToggle units={units} onToggle={handleUnitChange} />
              <ThemeToggle theme={theme} onToggle={setTheme} />
            </div>
          </motion.div>

          {/* Favorites */}
          {favorites.length > 0 && (
            <motion.div className="w-full max-w-6xl mb-6" variants={itemVariants}>
              <FavoriteLocations
                favorites={favorites}
                onSelect={handleSearch}
                onRemove={removeFromFavorites}
              />
            </motion.div>
          )}

          {/* Weather Alerts */}
          {weather && weather.alerts && weather.alerts.length > 0 && (
            <motion.div className="w-full max-w-6xl mb-6" variants={itemVariants}>
              <WeatherAlerts alerts={weather.alerts} />
            </motion.div>
          )}

          {/* Content */}
          <div className="w-full max-w-7xl">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingSpinner />
                </motion.div>
              )}
              
              {error && !loading && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ErrorMessage 
                    message={error} 
                    onRetry={() => weather && handleSearch(weather.name)}
                  />
                </motion.div>
              )}

              {weather && forecast && hourlyData && !loading && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Navigation Tabs */}
                  <motion.div 
                    className="flex justify-center mb-6"
                    variants={itemVariants}
                  >
                    <div className="bg-gradient-to-r from-white/10 via-white/15 to-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20">
                      {[
                        { id: 'overview', label: '🌟 Overview' },
                        { id: 'hourly', label: '⏰ Hourly' },
                        { id: 'map', label: '🗺️ Radar' },
                        { id: 'air', label: '💨 Air Quality' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 text-white shadow-lg'
                              : 'text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                      >
                        <div className="lg:col-span-2 space-y-6">
                          <WeatherCard 
                            weather={weather} 
                            units={units}
                            onAddToFavorites={() => addToFavorites(weather.name)}
                            isFavorite={favorites.includes(weather.name)}
                          />
                          <WeatherInsights weather={weather} forecast={forecast} />
                        </div>
                        <div className="space-y-6">
                          <ForecastCard forecast={forecast} units={units} />
                          {airQuality && (
                            <AirQuality data={airQuality} />
                          )}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'hourly' && (
                      <motion.div
                        key="hourly"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <HourlyForecast data={hourlyData} units={units} />
                      </motion.div>
                    )}

                    {activeTab === 'map' && (
                      <motion.div
                        key="map"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <WeatherMap 
                          center={weather.coords || { lat: 40.7128, lon: -74.0060 }}
                          weather={weather}
                        />
                      </motion.div>
                    )}

                    {activeTab === 'air' && (
                      <motion.div
                        key="air"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        {airQuality ? (
                          <AirQuality data={airQuality} detailed />
                        ) : (
                          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 text-center text-white border border-white/20">
                            <p>Air quality data not available for this location</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {!weather && !loading && !error && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-white/80"
                >
                  <p className="text-xl">🌈 Search for a city to see rainbow weather magic! ✨</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <motion.div 
            className="mt-16 text-center text-white/70"
            variants={itemVariants}
          >
            <p className="bg-gradient-to-r from-pink-200 via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              🌈 Powered by OpenWeatherMap API • Built with rainbow love and magical particles 🌈
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;