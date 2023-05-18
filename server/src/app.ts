import express from 'express';
import path from 'path';
import { WeatherApi } from './weather';
import dotenv from 'dotenv';
import {LocationApi} from "./location";

class App {

  private _app: express.Application;
  private _weatherApi: WeatherApi;
  private _locationApi: LocationApi;


  constructor() {
    this._app = express();
    this._weatherApi = new WeatherApi();
    this._locationApi = new LocationApi();
    this.initApp();
  }

  private initApp(): void {
    dotenv.config();
    this._app.use(express.static(path.join(__dirname, '../../client/build')));
    this._app.use('/api/weather', this._weatherApi.getRouter());
    this._app.use('/api/location', this._locationApi.getRouter());
  }

  public start() {
    const port = process.env.PORT || 3000;
    this._app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }

}

export default App;





