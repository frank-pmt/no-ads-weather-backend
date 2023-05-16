import express from 'express';
import path from 'path';
import { WeatherApi } from './weather';
import dotenv from 'dotenv';

class App {

  private _app: express.Application;
  private _weatherApi: WeatherApi;


  constructor() {
    this._app = express();
    this._weatherApi = new WeatherApi();
    this.initApp();
  }

  private initApp(): void {
    dotenv.config();
    this._app.use(express.static(path.join(__dirname, '../../client/build')));
    this._app.use('/api/weather', this._weatherApi.getRouter());
  }

  public start() {
    const port = process.env.PORT || 3000;
    this._app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
    });
  }

}

export default App;





