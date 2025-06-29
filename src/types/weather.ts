export interface WeatherData {
  name: string;
  country: string;
  temp: number;
  feelsLike: number;
  description: string;
  main: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  icon: string;
  sunrise: number;
  sunset: number;
  isNight: boolean;
  coords?: { lat: number; lon: number };
  alerts?: WeatherAlert[];
  uvIndex?: number;
  dewPoint?: number;
  cloudCover?: number;
}

export interface WeatherAlert {
  event: string;
  description: string;
  start: number;
  end: number;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
}

export interface ForecastItem {
  date: string;
  temp: {
    min: number;
    max: number;
  };
  main: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  pop: number; // Probability of precipitation
  uvIndex?: number;
}

export interface ForecastData {
  list: ForecastItem[];
}

export interface HourlyItem {
  time: string;
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pop: number;
  pressure: number;
}

export interface HourlyData {
  list: HourlyItem[];
}

export interface AirQualityData {
  aqi: number; // Air Quality Index (1-5)
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

export interface LocationCoords {
  lat: number;
  lon: number;
}