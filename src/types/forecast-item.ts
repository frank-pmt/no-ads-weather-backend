export interface ForecastItem {
  datetime: Date;
  code: string | null;
  description: string | null;
  temperature: number | null;
  minTemperature?: number;
  maxTemperature?: number;
  humidity: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  windDirection: string;
  windGusts: number;
  uvIndex: number;
}
