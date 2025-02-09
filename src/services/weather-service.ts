import axios from 'axios';
import dotenv from 'dotenv';
import { DailyWeatherResponse, DetailedWeatherResponse, WeatherResponse } from '../types/weather-response';
import { ForecastItem } from '../types/forecast-item';

dotenv.config();

const WEATHER_API_BASE_URL = 'https://api.open-meteo.com/v1';
const TIMEZONE = 'GMT';

const hourlyQueryParam = 'hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m';
const dailyQueryParam = 'daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,uv_index_max';
const currentWeatherQueryParam = 'current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&minutely_15=relative_humidity_2m';

export class WeatherService {

  public async getDailyForecast(latitude: number, longitude: number): Promise<DailyWeatherResponse> {
    const response = await axios.get<any>(`${WEATHER_API_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&lang=en&units=metric&${currentWeatherQueryParam}&${dailyQueryParam}&timezone=${TIMEZONE}`);
    return this.processDailyForecastResponse(response.data);
  }

  public async getDetailedForecast(latitude: number, longitude: number, date: Date): Promise<DetailedWeatherResponse> {
    const response = await axios.get<any>(`${WEATHER_API_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&lang=en&units=metric&${currentWeatherQueryParam}&${hourlyQueryParam}&timezone=${TIMEZONE}`);
    return this.processDetailedForecastResponse(response.data, date);
  }

  // TODO: use current time to determine precipitationProbability

  private processDailyForecastResponse(data: any): DailyWeatherResponse {
    const response: DailyWeatherResponse = {
      currentWeather: this.processCurrentWeather(data),
      dailyDetails: this.processItems(data.daily),
    }
    return response;
  }

  private processDetailedForecastResponse(data: any, date: Date): DetailedWeatherResponse {
    const response: DetailedWeatherResponse = {
      currentWeather: this.processCurrentWeather(data),
      hourlyDetails: this.filterDates(this.processItems(data.hourly), date),
    }
    return response;
  }

  private filterDates(list: ForecastItem[], day: Date): ForecastItem[] {
    let startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);
    let endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);
    return list.filter(item => item.datetime >= startOfDay && item.datetime <= endOfDay);
  }

  private processCurrentWeather(data: any): ForecastItem {
    const currentWeather: ForecastItem = {
      datetime: new Date(data.current.time),
      code: this.mapWeatherCode(data.current.weather_code),
      description: this.mapWeatherCode(data.current.weather_code),
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      precipitationProbability: data.current.precipitation,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      windGusts: data.current.wind_gusts_10m,
      uvIndex: null
    }
    return currentWeather;
  }

  private processItems(items: any): ForecastItem[] {
    let result: ForecastItem[] = [];
    return items.time.map((time: string, index: number): ForecastItem => {
      return {
        datetime: new Date(time),
        code: this.mapWeatherCode(items.weather_code?.[index]),
        description: this.mapWeatherCode(items.weather_code?.[index]),
        temperature: items.temperature_2m?.[index],
        minTemperature: items.temperature_2m_min?.[index],
        maxTemperature: items.temperature_2m_max?.[index],
        humidity: items.relative_humidity_2m?.[index],
        precipitation: items.precipitation ? items.precipitation[index] : items.precipitation_sum?.[index],
        precipitationProbability: items.precipitation_probability_max?.[index],
        windSpeed: items.wind_speed_10m ? items.wind_speed_10m[index]: items.wind_speed_10m_max?.[index],
        windDirection: items.winddirection_10m ? items.wind_direction_10m[index] : items.wind_direction_10m_dominant?.[index],
        windGusts: items.wind_gusts_10m?.[index],
        uvIndex: items.uv_index_max?.[index]
      };  
    });
  }

  public mapWeatherCode(weathercode: number): string | undefined {
    // TODO: improve on mapping
    let type = '';
    if (weathercode == null) {
      return undefined;
    }
    switch (weathercode) {
      case 0:
      case 1:
        type = 'sunny';
        break;
      case 2:
        type = 'cloudy';
        break;
      case 3:
        type = 'overcast';
        break;
      case 45:
      case 48:
        type = 'foggy';
        break;
      case 51:
      case 53:
      case 55:
        type = 'drizzly';
        break;
      case 71:
      case 73:
      case 75:
      case 85:
      case 86:
        type = 'snow';
        break;
      case 61:
      case 63:
      case 65:
      case 80:
      case 81:
      case 82:
        type = 'rainy';
        break;
      case 95:
      case 96:
      case 99:
        type = 'thunderstorm';
        break;
      default:
        console.error('Unmapped code', weathercode);
        return 'error';
    }
    return type;
  }

}