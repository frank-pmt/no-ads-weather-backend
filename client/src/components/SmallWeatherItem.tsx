import './SmallWeatherItem.css';
import WeatherIcon from './WeatherIcon';
import { formatTime } from "../utils/utils";

type SmallWeatherItemProps = {
    time: string;
    temperature: number;
    type: string;
};

function SmallWeatherItem({ time, temperature, type }: SmallWeatherItemProps) {
    return (
        <div className="small-item">
            <h5>{formatTime(time)}</h5>
            <WeatherIcon type={type} size={32} />
            <p>{temperature} ℃</p>
        </div>
    );
}

export default SmallWeatherItem;