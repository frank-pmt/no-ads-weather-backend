import './App.css';
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import axios from 'axios';

import CurrentWeather from './components/CurrentWeather';
import SmallWeatherItem from './components/SmallWeatherItem';
import DailyForecastItem from './components/DailyForecastItem';
import LocationSearchBox from './components/LocationSearchBox';
import { WeatherDataItem } from './model/WeatherDataItem';
import { WeatherResponse } from "./model/WeatherResponse";


interface Location {
  name: string;
  fullName: string;
  latitude: number;
  longitude: number;
}

function App() {

  const [loading, setLoading] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>(new Date().toLocaleDateString());
  const [location, setLocation] = useState<Location>({ name: 'Paris', fullName: 'Paris, France', latitude: 48.86, longitude: 2.35 });
  const [locationDisplayed, setLocationDisplayed] = useState<string>("");
  const [currentWeather, setCurrentWeather] = useState<WeatherDataItem | null>(null);
  const [todaysWeather, setTodaysWeather] = useState<WeatherDataItem[]>([]);
  const [dailyForecast, setDailyForecast] = useState<WeatherDataItem[]>([]);
  const [error, setError] = useState<string>("");


  const getWeather = () => {
    setLoading(true);
    setCurrentWeather(null);
    const url = `/api/weather?latitude=${location.latitude}&longitude=${location.longitude}`;
    axios.get<WeatherResponse>(url,
      {
        headers: {
          Accept: 'application/json',
        },
      }).then(({ data, status }: { data: WeatherResponse, status: number }) => {
        setLoading(false);
        setLocationDisplayed(location.fullName);
        setCurrentWeather({ time: data.currentWeather.time, temperature: data.currentWeather.temperature, type: data.currentWeather.type, windSpeed: data.currentWeather.windSpeed, windDirection: data.currentWeather.windDirection });
        setTodaysWeather(data.today);
        setDailyForecast(data.daily);
        setError("")
      }, (error: any) => {
        setLoading(false);
        setError('Unable to get weather information');
        // TODO: handle error properly
        console.log(error);
      });
  };

  const searchClicked = (event: React.SyntheticEvent<EventTarget>) => {
    event.preventDefault();
    getWeather();
  };

  const onLocationChange = (event: any) => {
    setLocation(event.target.value);
  };

  return (
    <div className="main-container">
      <div className="search-bar">
        <h1>Weather App</h1>
        <form>
          <LocationSearchBox onLocationChange={(event: any) => {
            setLocation(event.target.value);
          }} />
          <Button className="search-button" label="Search" onClick={searchClicked} />
        </form>
        {error && <div className="error">{error}</div>}
      </div>

      {currentWeather &&
        <div className="location">
          <div>
            <div>{locationDisplayed}</div>
            <div className=".date">{currentDate}</div>
          </div>
          <div className="current-weather">
            <CurrentWeather temperature={currentWeather.temperature} type={currentWeather.type} windSpeed={currentWeather.windSpeed!} windDirection={currentWeather.windDirection!} />
          </div>


          <div className="weather-by-hour">
            <div className="daily-row">
              {todaysWeather.filter((value, index, arr) => index % 3 === 0 && index < 24).map(item => {
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
      }
    </div>
  );

}

export default App;
