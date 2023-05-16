import './DailyForecastItem.css';
import WeatherIcon from './WeatherIcon';
import {formatDayName, formatDay, formatTemperature} from "../utils/utils";

type DailyForecastItemProps = {
    time: string;
    temperatureMin: number;
    temperatureMax: number;
    precipitationProbabilityMax: number;
    type: string;
};


function DailyForecastItem({ time, temperatureMin, temperatureMax, precipitationProbabilityMax, type }: DailyForecastItemProps) {
    return (
        <div className="daily-item">
            <div className="day">
                <div>{formatDayName(time)}</div>
                <div>{formatDay(time)}</div>
            </div>
            <div className="icon">
                <WeatherIcon type={type} size={32} />
            </div>
            <div className="low">
                <div>{formatTemperature(temperatureMin)} ℃</div>
                <div>Low</div>
            </div>
            <div className="high">
                <div>{formatTemperature(temperatureMax)} ℃</div>
                <div>High</div>
            </div>
            <div className="rain">
                <div>{precipitationProbabilityMax}%</div>
                <div>Rain</div>
            </div>
        </div>
    );
}

export default DailyForecastItem;