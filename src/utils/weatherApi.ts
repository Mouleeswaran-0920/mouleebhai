const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
  console.warn('OpenWeatherMap API key not found. Please set VITE_OPENWEATHER_API_KEY in your environment variables.');
}

export const fetchWeatherData = async (
  city: string, 
  units: 'metric' | 'imperial' = 'metric',
  coords?: { lat: number; lon: number }
) => {
  if (!API_KEY) {
    throw new Error('API key not configured');
  }

  const query = coords 
    ? `lat=${coords.lat}&lon=${coords.lon}`
    : `q=${encodeURIComponent(city)}`;

  const response = await fetch(
    `${BASE_URL}/weather?${query}&appid=${API_KEY}&units=${units}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Location not found');
    }
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  
  const now = Date.now() / 1000;
  const isNight = now < data.sys.sunrise || now > data.sys.sunset;
  
  return {
    name: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    main: data.weather[0].main,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind?.speed || 0,
    windDirection: data.wind?.deg || 0,
    visibility: Math.round((data.visibility || 10000) / 1000),
    icon: data.weather[0].icon,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    isNight,
    coords: { lat: data.coord.lat, lon: data.coord.lon },
    uvIndex: data.uvi,
    dewPoint: data.main.dew_point ? Math.round(data.main.dew_point) : undefined,
    cloudCover: data.clouds?.all || 0,
  };
};

export const fetchForecastData = async (
  city: string, 
  units: 'metric' | 'imperial' = 'metric',
  coords?: { lat: number; lon: number }
) => {
  if (!API_KEY) {
    throw new Error('API key not configured');
  }

  const query = coords 
    ? `lat=${coords.lat}&lon=${coords.lon}`
    : `q=${encodeURIComponent(city)}`;

  const response = await fetch(
    `${BASE_URL}/forecast?${query}&appid=${API_KEY}&units=${units}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch forecast data');
  }

  const data = await response.json();
  
  // Group by day and get daily min/max
  const dailyForecasts = data.list.reduce((acc: any, item: any) => {
    const date = new Date(item.dt * 1000).toDateString();
    
    if (!acc[date]) {
      acc[date] = {
        date,
        temps: [],
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: item.wind?.speed || 0,
        windDirection: item.wind?.deg || 0,
        pressure: item.main.pressure,
        pop: item.pop || 0,
      };
    }
    
    acc[date].temps.push(item.main.temp);
    return acc;
  }, {});

  const forecastList = Object.values(dailyForecasts).slice(0, 5).map((day: any) => ({
    date: day.date,
    temp: {
      min: Math.round(Math.min(...day.temps)),
      max: Math.round(Math.max(...day.temps)),
    },
    main: day.main,
    description: day.description,
    icon: day.icon,
    humidity: day.humidity,
    windSpeed: day.windSpeed,
    windDirection: day.windDirection,
    pressure: day.pressure,
    pop: Math.round(day.pop * 100),
  }));

  return { list: forecastList };
};

export const fetchHourlyData = async (
  city: string,
  units: 'metric' | 'imperial' = 'metric',
  coords?: { lat: number; lon: number }
) => {
  if (!API_KEY) {
    throw new Error('API key not configured');
  }

  const query = coords 
    ? `lat=${coords.lat}&lon=${coords.lon}`
    : `q=${encodeURIComponent(city)}`;

  const response = await fetch(
    `${BASE_URL}/forecast?${query}&appid=${API_KEY}&units=${units}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch hourly data');
  }

  const data = await response.json();
  
  const hourlyList = data.list.slice(0, 24).map((item: any) => ({
    time: new Date(item.dt * 1000).toISOString(),
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    humidity: item.main.humidity,
    windSpeed: item.wind?.speed || 0,
    windDirection: item.wind?.deg || 0,
    pop: Math.round((item.pop || 0) * 100),
    pressure: item.main.pressure,
  }));

  return { list: hourlyList };
};

export const fetchAirQuality = async (
  coords?: { lat: number; lon: number },
  city?: string
) => {
  if (!API_KEY) {
    throw new Error('API key not configured');
  }

  let lat, lon;
  
  if (coords) {
    lat = coords.lat;
    lon = coords.lon;
  } else if (city) {
    // First get coordinates for the city
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    );
    
    if (!geoResponse.ok) {
      throw new Error('Failed to get location coordinates');
    }
    
    const geoData = await geoResponse.json();
    if (geoData.length === 0) {
      throw new Error('Location not found');
    }
    
    lat = geoData[0].lat;
    lon = geoData[0].lon;
  } else {
    throw new Error('Either coordinates or city name is required');
  }

  const response = await fetch(
    `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch air quality data');
  }

  const data = await response.json();
  const pollution = data.list[0];
  
  return {
    aqi: pollution.main.aqi,
    co: pollution.components.co,
    no: pollution.components.no,
    no2: pollution.components.no2,
    o3: pollution.components.o3,
    so2: pollution.components.so2,
    pm2_5: pollution.components.pm2_5,
    pm10: pollution.components.pm10,
    nh3: pollution.components.nh3,
  };
};

export const searchCities = async (query: string) => {
  if (!API_KEY || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      coords: { lat: item.lat, lon: item.lon }
    }));
  } catch (error) {
    console.error('Failed to search cities:', error);
    return [];
  }
};