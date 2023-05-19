type WeatherIconProps = {
  type: string;
  size: number;
};

function WeatherIcon({ type, size }: WeatherIconProps) {
  return (
    <span>
      {
        {
          'sunny': <img className="icon" src={"images/sun-" + size + ".png"} alt="Sunny" />,
          'cloudy': <img className="icon" src={"images/cloudy-" + size + ".png"} alt="Cloudy" />,
          'drizzly': <img className="icon" src={"images/drizzle-" + size + ".png"} alt="Drizzle" />,
          'rainy': <img className="icon" src={"images/rain-" + size + ".png"} alt="Rainy" />,
          'snow': <img className="icon" src={"images/snow-" + size + ".png"} alt="Snow" />,
          'foggy': <img className="icon" src={"images/fog-" + size + ".png"} alt="Foggy" />,
          'overcast': <img className="icon" src={"images/overcast-" + size + ".png"} alt="Overcast" />,
          'thunderstorm': <img className="icon" src={"images/thunderstorm-" + size + ".png"} alt="Thunderstorm" />
        }[type]
      }
    </span>
  );
}

export default WeatherIcon;