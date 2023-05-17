import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CurrentWeather from './components/CurrentWeather';
import SmallWeatherItem from './components/SmallWeatherItem';
import DailyForecastItem from './components/DailyForecastItem';
import { WeatherDataItem } from './model/WeatherDataItem';
import { WeatherResponse } from "./model/WeatherResponse";


function App() {

  const [loading, setLoading] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>(new Date().toLocaleDateString());
  const [location, setLocation] = useState<string>("Paris");
  const [locationDisplayed, setLocationDisplayed] = useState<string>("");
  const [currentWeather, setCurrentWeather] = useState<WeatherDataItem>({ time: "", temperature: 0, type: "cloudy" });
  const [todaysWeather, setTodaysWeather] = useState<WeatherDataItem[]>([]);
  const [dailyForecast, setDailyForecast] = useState<WeatherDataItem[]>([]);
  const [error, setError] = useState<string>("");


  useEffect(() => {
    getWeather();
  }, []);

  const getWeather = () => {
    setLoading(true);
    const url = `/api/weather?location=${location}`;
    axios.get<WeatherResponse>(url,
      {
        headers: {
          Accept: 'application/json',
        },
      }).then(({ data, status }: { data: WeatherResponse, status: number }) => {
        setLoading(false);
        setLocationDisplayed(location);
        setCurrentWeather({ time: data.currentWeather.time, temperature: data.currentWeather.temperature, type: data.currentWeather.type, windSpeed: data.currentWeather.windSpeed, windDirection: data.currentWeather.windDirection });
        setTodaysWeather(data.today);
        setDailyForecast(data.daily);
      }, (error: any) => {
        setLoading(false);
        setError('Unable to get weather information');
        // TODO: handle error properly
        console.log(error);
      });
  }

  const searchClicked = (event: React.SyntheticEvent<EventTarget>) => {
    getWeather();
  }

  const onLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  }

  return (
    <div className="main-container">
      <div className="search-bar">
        <h1>Weather App</h1>
        <form>
          <input type="text" className="location-input" value={location} placeholder="Enter location..." onChange={onLocationChange} />
          <button type="button" id="search-button" onClick={searchClicked}>Search</button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>

      <div className="location">
        <div>{locationDisplayed}</div>
        <div className=".date">{currentDate}</div>
      </div>
      <div className="current-weather">
        <CurrentWeather temperature={currentWeather.temperature} type={currentWeather.type} windSpeed={currentWeather.windSpeed!} windDirection={currentWeather.windDirection!} />
      </div>


      <div className="weather-by-hour">
        <div className="daily-row">
          {todaysWeather.filter((value, index, arr) => index % 3 == 0 && index < 24).map(item => {
            return (<SmallWeatherItem time={item.time} temperature={item.temperature} type={item.type} />);
          })}
        </div>
      </div>
      <div className="forecast-days">
        {dailyForecast.map(item => {
          return (<DailyForecastItem time={item.time} temperatureMin={item.temperatureMin!} temperatureMax={item.temperatureMax!}
            precipitationProbabilityMax={item.precipitationProbabilityMax!} type={item.type} />)
        })}
      </div>
    </div>
  );

}

export default App;
