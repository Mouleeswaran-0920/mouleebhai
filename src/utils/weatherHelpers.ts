export const getWeatherBackground = (
  weatherMain: string, 
  isNight: boolean = false,
  theme: 'light' | 'dark' | 'auto' = 'auto'
) => {
  const baseClasses = "min-h-screen transition-all duration-1000 ease-in-out relative";
  
  // Rainbow gradients for all weather conditions
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return isNight
        ? `${baseClasses} bg-gradient-to-br from-purple-900 via-blue-800 via-indigo-700 via-purple-600 to-pink-800`
        : `${baseClasses} bg-gradient-to-br from-red-400 via-orange-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-500`;
    case 'clouds':
      return `${baseClasses} bg-gradient-to-br from-slate-600 via-blue-500 via-cyan-400 via-teal-400 via-green-400 to-emerald-500`;
    case 'rain':
    case 'drizzle':
      return `${baseClasses} bg-gradient-to-br from-blue-800 via-indigo-700 via-purple-600 via-pink-600 via-rose-500 to-red-600`;
    case 'thunderstorm':
      return `${baseClasses} bg-gradient-to-br from-gray-900 via-purple-800 via-indigo-700 via-blue-600 via-cyan-500 to-teal-600`;
    case 'snow':
      return `${baseClasses} bg-gradient-to-br from-blue-200 via-cyan-300 via-teal-200 via-green-200 via-yellow-200 to-orange-300`;
    case 'mist':
    case 'fog':
    case 'haze':
      return `${baseClasses} bg-gradient-to-br from-emerald-400 via-teal-400 via-cyan-400 via-blue-400 via-indigo-400 to-purple-500`;
    default:
      return `${baseClasses} bg-gradient-to-br from-pink-400 via-rose-400 via-red-400 via-orange-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-500`;
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
    case 1: return { level: 'Good', color: 'text-green-400', bg: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' };
    case 2: return { level: 'Fair', color: 'text-yellow-400', bg: 'bg-gradient-to-r from-yellow-500/20 to-lime-500/20' };
    case 3: return { level: 'Moderate', color: 'text-orange-400', bg: 'bg-gradient-to-r from-orange-500/20 to-amber-500/20' };
    case 4: return { level: 'Poor', color: 'text-red-400', bg: 'bg-gradient-to-r from-red-500/20 to-pink-500/20' };
    case 5: return { level: 'Very Poor', color: 'text-purple-400', bg: 'bg-gradient-to-r from-purple-500/20 to-violet-500/20' };
    default: return { level: 'Unknown', color: 'text-gray-400', bg: 'bg-gradient-to-r from-gray-500/20 to-slate-500/20' };
  }
};

export const getUVIndexLevel = (uvIndex: number) => {
  if (uvIndex <= 2) return { level: 'Low', color: 'text-green-400' };
  if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-400' };
  if (uvIndex <= 7) return { level: 'High', color: 'text-orange-400' };
  if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-400' };
  return { level: 'Extreme', color: 'text-purple-400' };
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