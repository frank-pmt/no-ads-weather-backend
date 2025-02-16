const fs = require('fs');
const readline = require('readline');
import path from 'path';
import { LocationMatches, LocationResponse } from "../types/location-response";


const CITIES_DATA_FILE = '../static/data/cities15000.txt';

export interface LocationResponseItem {
    name: string;
    fullName: string;
    latitude: string;
    longitude: string;
}

interface CityData {
    placeName: string;
    countryCode: string;
    state: string;
    latitude: number;
    longitude: number;
}

const parseCityLine = (line: string): CityData | null => {
    const columns = line.split('\t');

    if (!columns?.[1]) return null;

    return {
        placeName: columns[1],
        countryCode: columns[8],
        state: columns[10],
        latitude: Number(columns[4]),
        longitude: Number(columns[5])
    };
}

const normalizeText = (text: string): string => {
    return text.toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
}

const createFullName = (cityData: CityData): string => {
    return cityData.countryCode === 'US'
        ? `${cityData.placeName}, ${cityData.state}, US`
        : `${cityData.placeName}, ${cityData.countryCode}`;
}

const processDataFromFile = (query: string, filePath: string): Promise<LocationMatches[]> => {
    return new Promise((resolve, reject) => {
        let matches: LocationMatches[] = [];
        const normalizedQuery = normalizeText(query);

        const fileStream = fs.createReadStream(filePath);

        const rl = readline.createInterface({
            input: fileStream,
            output: process.stdout,
            terminal: false
        });

        rl.on('line', (line: string) => {
            const cityData = parseCityLine(line);
            if (!cityData) return;
            const normalizedPlaceName = normalizeText(cityData.placeName);
            if (normalizedPlaceName.startsWith(normalizedQuery)) {
                matches.push({
                    name: cityData.placeName,
                    fullName: createFullName(cityData),
                    latitude: cityData.latitude,
                    longitude: cityData.longitude
                });
            }
        });

        rl.on('close', () => {
            resolve(matches);
        });

        rl.on('error', (err: any) => {
            reject(err);
        });
    });
}

export class LocationService {

    private readonly filePath: string;

    constructor(filePath = path.join(__dirname, CITIES_DATA_FILE)) {
        this.filePath = filePath;
    }

    public async lookupLocation(location: string): Promise<LocationResponse> {
        if (location && location.trim().length >= 2) {
            try {
                const matches = await processDataFromFile(location.trim(), this.filePath);
                return {
                    location: location,
                    matches: matches
                };
            } catch (err) {
                throw err;
            }
        } else {
            // Too short location so don't read file
            return {
                location: location,
                matches: []
            }
        }
    }
}
