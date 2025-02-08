export interface LocationResponse {
    location: string;
    matches: LocationMatches[];
}

export interface LocationMatches {
    name: string;
    fullName: string;
    latitude: number;
    longitude: number;
}