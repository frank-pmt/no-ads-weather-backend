export interface WeatherDataItem {

  time: string;

  temperature: number;

  temperatureMin?: number;

  temperatureMax?: number;

  precipitationProbabilityMax?: number;

  windSpeed?: number;

  windDirection?: number;

  type: string;

}