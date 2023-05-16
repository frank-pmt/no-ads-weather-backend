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
          'overcast': <img className="icon" src={"images/overcast-" + size + ".png"} alt="Overcast" />,
          'thunderstorm': <img className="icon" src={"images/thunderstorm-" + size + ".png"} alt="Thunderstorm" />
        }[type]
      }
    </span>
  );
}

export default WeatherIcon;