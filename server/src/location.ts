import * as express from "express";
import fs from 'fs';

export interface LocationResponseItem {
  name: string;
  fullName: string;
  latitude: string;
  longitude: string;
}

const processDataFromFile = (query: string, data: string): LocationResponseItem[] => {
  let matches: LocationResponseItem[] = [];
  const queryLC = query.toLowerCase();
  data.toString().split(/\n/).forEach(function (line) {
    let cols = line.split(/\t/);
    if (cols && cols.length >= 1 && cols[1]) {
      const placeName = cols[1];
      if (placeName.toLowerCase().startsWith(queryLC)) {
        const countryCode = cols[8];
        const state = cols[10];
        const fullName = countryCode === 'US' ? `${placeName}, ${state}, US` : `${placeName}, ${countryCode}`;
        matches.push({name: placeName, latitude: cols[4], longitude: cols[5], fullName: fullName});
      }
    }
  });
  return matches;
}

export class LocationApi {
  private _router: express.Router = express.Router();

  constructor() {
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this._router.get('/search', this.processLocationRequest);
  }
  
  public processLocationRequest(req: any, res: any): void {
    const file = './static/data/cities5000.txt';
    const query = req.query.q;
    if (query && query.length >= 2) {
      try {
        fs.readFile(file, 'utf8', (err, data) => {
          if (err) {
            res.json({ error: err });
          } else {
            res.json(processDataFromFile(query, data));
          }
        });
      } catch (err) {
        res.status(500).json({ error: err });
      }
    } else {
      // Too short query so don't read file
      res.json([]);
    }
  }

  public getRouter(): express.Router {
    return this._router;
  }

}