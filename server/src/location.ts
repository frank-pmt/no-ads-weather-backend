import * as express from "express";
import fs from 'fs';

export interface LocationResponseItem {
  name: string;
  fullName: string;
  latitude: string;
  longitude: string;
}

export class LocationApi {
  private _router: express.Router = express.Router();

  constructor() {
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this._router.get('/search', (req: any, res) => {
      const file = './static/data/cities5000.txt';
      const query = req.query.q;
      if (query && query.length >= 2) {
        let matches: LocationResponseItem[] = [];
        fs.readFile(file, 'utf8', function (err, data) {
          if (err) throw (err);
          data.toString().split(/\n/).forEach(function (line) {
            let cols = line.split(/\t/);
            if (cols && cols.length >= 1 && cols[1] && cols[1].startsWith(query)) {
              const fullName = cols[1] + ', ' + cols[8];
              matches.push({ name: cols[1], latitude: cols[4], longitude: cols[5], fullName: fullName });
            }
          });
          res.send(matches);
        });
      } else {
        // Too short query so don't read file
        res.send([]);
      }
    })
  }

  public getRouter(): express.Router {
    return this._router;
  }

}