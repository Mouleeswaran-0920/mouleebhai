export const getWeatherBackground = (
  weatherMain: string, 
  isNight: boolean = false,
  theme: 'light' | 'dark' | 'auto' = 'auto'
) => {
  const baseClasses = "min-h-screen transition-all duration-1000 ease-in-out relative";
  
  // Determine if we should use dark theme
  const isDark = theme === 'dark' || (theme === 'auto' && isNight);
  
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return isDark || isNight
        ? `${baseClasses} bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900`
        : `${baseClasses} bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600`;
    case 'clouds':
      return isDark
        ? `${baseClasses} bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900`
        : `${baseClasses} bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600`;
    case 'rain':
    case 'drizzle':
      return `${baseClasses} bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-900`;
    case 'thunderstorm':
      return `${baseClasses} bg-gradient-to-br from-purple-900 via-indigo-900 to-black`;
    case 'snow':
      return isDark
        ? `${baseClasses} bg-gradient-to-br from-cyan-900 via-blue-800 to-purple-900`
        : `${baseClasses} bg-gradient-to-br from-cyan-100 via-blue-200 to-purple-300`;
    case 'mist':
    case 'fog':
    case 'haze':
      return isDark
        ? `${baseClasses} bg-gradient-to-br from-emerald-700 via-teal-800 to-cyan-900`
        : `${baseClasses} bg-gradient-to-br from-emerald-300 via-teal-400 to-cyan-500`;
    default:
      return isDark
        ? `${baseClasses} bg-gradient-to-br from-violet-800 via-purple-900 to-indigo-900`
        : `${baseClasses} bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600`;
  }
};

export const formatTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatHourTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString([], {
    hour: 'numeric',
    hour12: true
  });
};

export const getWindDirection = (degrees: number) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getAirQualityLevel = (aqi: number) => {
  switch (aqi) {
    case 1: return { level: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    case 2: return { level: 'Fair', color: 'text-lime-400', bg: 'bg-lime-500/20' };
    case 3: return { level: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/20' };
    case 4: return { level: 'Poor', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    case 5: return { level: 'Very Poor', color: 'text-red-400', bg: 'bg-red-500/20' };
    default: return { level: 'Unknown', color: 'text-gray-400', bg: 'bg-gray-500/20' };
  }
};

export const getUVIndexLevel = (uvIndex: number) => {
  if (uvIndex <= 2) return { level: 'Low', color: 'text-emerald-400' };
  if (uvIndex <= 5) return { level: 'Moderate', color: 'text-lime-400' };
  if (uvIndex <= 7) return { level: 'High', color: 'text-amber-400' };
  if (uvIndex <= 10) return { level: 'Very High', color: 'text-orange-400' };
  return { level: 'Extreme', color: 'text-red-400' };
};

export const getCurrentLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        reject(new Error('Unable to retrieve your location'));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

export const getWeatherInsight = (weather: any, forecast: any) => {
  const insights = [];
  
  // Temperature trend
  const todayTemp = weather.temp;
  const tomorrowTemp = forecast.list[1]?.temp.max;
  if (tomorrowTemp && Math.abs(todayTemp - tomorrowTemp) > 5) {
    const trend = tomorrowTemp > todayTemp ? 'warmer' : 'cooler';
    insights.push(`Tomorrow will be significantly ${trend} than today`);
  }
  
  // Precipitation
  const rainChance = forecast.list[0]?.pop;
  if (rainChance > 70) {
    insights.push('High chance of precipitation today - consider bringing an umbrella');
  }
  
  // Wind conditions
  if (weather.windSpeed > 10) {
    insights.push('Windy conditions expected - secure loose outdoor items');
  }
  
  // Humidity
  if (weather.humidity > 80) {
    insights.push('High humidity levels - it may feel more uncomfortable than the temperature suggests');
  }
  
  // Visibility
  if (weather.visibility < 5) {
    insights.push('Reduced visibility conditions - drive carefully');
  }
  
  return insights;
};