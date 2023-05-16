import {WeatherDataItem} from "./WeatherDataItem";

export interface WeatherResponse {

  currentWeather: WeatherDataItem;

  today: WeatherDataItem[];

  daily: WeatherDataItem[];

}