import './CurrentWeather.css';
import React, { useState, useEffect } from 'react';
import WeatherIcon from './WeatherIcon';
import { formatWindSpeed } from "../utils/utils";

type CurrentWeatherProps = {
    temperature: number;
    type: string;
    windSpeed: number;
    windDirection: number;
};

function CurrentWeather({ temperature, type, windSpeed, windDirection }: CurrentWeatherProps) {
    const typeStr = type.substring(0, 1).toUpperCase() + type.substring(1);
    return (
        <div className="current-weather-container">
            <div className="temperature-container">
                <div className="temperature">{temperature}&nbsp;℃</div>
                <div className="type">{typeStr}</div>
            </div>
            <div className="icon">
                <WeatherIcon type={type} size={128} />
            </div>
            <div className="wind">
                <div>Wind</div>
                <div className="speed">{formatWindSpeed(windSpeed)} km/h</div>
            </div>
        </div>
    );
}

export default CurrentWeather;