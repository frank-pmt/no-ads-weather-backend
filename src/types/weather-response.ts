import { ForecastItem } from "./forecast-item";

export interface WeatherResponse {
  currentWeather: ForecastItem;
}

export interface DetailedWeatherResponse extends WeatherResponse {
  hourlyDetails: ForecastItem[]
}

export interface DailyWeatherResponse extends WeatherResponse {
  dailyDetails: ForecastItem[];
}
