type WeatherIconProps = {
  type: string;
  size: number;
};

function WeatherIcon({ type, size }: WeatherIconProps) {
  return (
    <span>
      {
        {
          'sunny': <img className="icon" src={"images/sun-" + size + ".png"} alt="Sunny" title="Sunny"/>,
          'cloudy': <img className="icon" src={"images/cloudy-" + size + ".png"} alt="Cloudy" title="Cloudy"/>,
          'drizzly': <img className="icon" src={"images/drizzle-" + size + ".png"} alt="Drizzle" title="Drizzle"/>,
          'rainy': <img className="icon" src={"images/rain-" + size + ".png"} alt="Rainy" title="Rainy"/>,
          'snow': <img className="icon" src={"images/snow-" + size + ".png"} alt="Snow" title="Snow"/>,
          'foggy': <img className="icon" src={"images/fog-" + size + ".png"} alt="Foggy" title="Foggy"/>,
          'overcast': <img className="icon" src={"images/overcast-" + size + ".png"} alt="Overcast" title="Overcast"/>,
          'thunderstorm': <img className="icon" src={"images/thunderstorm-" + size + ".png"} alt="Thunderstorm" title="Thunderstorm"/>
        }[type]
      }
    </span>
  );
}

export default WeatherIcon;