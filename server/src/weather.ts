import * as express from 'express';
import axios from 'axios';

export class WeatherApi {
  private _router:express.Router = express.Router();

  constructor() {
    this.setupRoutes();
  }

  private setupRoutes():void {
    this._router.get('/', (req:any, res) => {
      const latitude = 48.86;
      const longitude = 2.34;
      const location = req.query.location || 'New York';
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${process.env.GEO_API_KEY}`;
      axios.get<any>(url, {
        headers: {
          Accept: 'application/json'
        }
      }).then(({ data, status }) => this.processLocationResponse({
        data,
        status,
        res
      }), (err) => this.processLocationError(err, res));
    })
  }

  private processLocationResponse({ data, status, res }: { data: any, status: number, res: any }):void {
    if (data?.results[0] && data?.results[0].geometry) {
      this.processLocation(data.results[0].geometry.lat, data.results[0].geometry.lng, res)
    } else {
      res.status(400).send(this.makeError("Cannot get location"))
    }
  }

  private processLocationError(error:any, res:any):void {
    console.error(error);
    res.status(400).send(this.makeError("Cannot get location"))
  }


  private processLocation(latitude:number, longitude:number, res:any):void {
    const hourlyPart = "hourly=temperature_2m,precipitation_probability,precipitation,weathercode,windspeed_10m,winddirection_10m";
    const dailyPart = "daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max";
    axios.get<any>(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&lang=en&units=metric&current_weather=true&${hourlyPart}&${dailyPart}&timezone=GMT`,
      {
        headers: {
          Accept: 'application/json'
        },
      }).then(({ data, status }) => this.processWeatherResponse({
      data,
      status,
      res
    }), (err) => this.processWeatherError(err, res));
  }


  private processWeatherResponse({ data, status, res }: { data: any, status: number, res: any }):void {
    const weathercode = data.current_weather.weathercode
    let todaysData: any[] = [];
    let dailyData: any[] = [];
    const weatherResponse = {
      currentWeather: {
        time: data.current_weather.time,
        type: this.mapWeatherCode(weathercode),
        temperature: data.current_weather.temperature,
        windSpeed: data.current_weather.windspeed,
        windDirection: data.current_weather.winddirection,
      },
      today: todaysData,
      daily: dailyData
    };
    for(let i = 0; i < data.hourly.time.length; i++) {
      todaysData.push({
        time: data.hourly.time[i],
        temperature: data.hourly.temperature_2m[i],
        type: this.mapWeatherCode(data.hourly.weathercode[i]),
      })
    }
    for(let i = 0; i < data.daily.time.length; i++) {
      dailyData.push({
        time: data.daily.time[i],
        temperatureMin: data.daily.temperature_2m_min[i],
        temperatureMax: data.daily.temperature_2m_max[i],
        type: this.mapWeatherCode(data.daily.weathercode[i]),
        precipitationProbabilityMax: data.daily.precipitation_probability_max[i],
      })
    }
    res.send(weatherResponse);
  }

  private mapWeatherCode(weathercode: number): string {
    // TODO: improve on mapping
    let type = "";
    switch (weathercode) {
      case 0:
      case 1:
        type = "sunny";
        break;
      case 2:
        type = "cloudy";
        break;
      case 3:
        type = "overcast";
        break;
      case 45:
      case 48:
        type = "foggy";
        break;
      case 51:
      case 53:
      case 55:
        type = "drizzly";
        break;
      case 61:
      case 63:
      case 65:
      case 80:
      case 81:
      case 82:
        type = "rainy";
        break;
      case 95:
      case 96:
      case 99:
        type = "thunderstorm";
        break;
      default:
        console.error("Unmapped code", weathercode);
        return "error";
    }
    return type;
  }

  private processWeatherError(error:any, res:any):void {
    console.log(error);
    res.status(400).send(this.makeError("Cannot get weather info"))
  }

  private makeError(error:string):any {
    return {error};
  }

  public getRouter():express.Router {
    return this._router;
  }

}