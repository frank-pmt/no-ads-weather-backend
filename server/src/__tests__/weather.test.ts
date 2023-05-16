import {describe, expect, test} from '@jest/globals';
import { WeatherApi } from '../weather';


describe('Weather API tests', () => {
    test('Test', () => {
        // TODO: support fine-grained codes as in https://open-meteo.com/en/docs and fail-safe icon mapping on the client
        const weatherApi = new WeatherApi();
        expect(weatherApi.mapWeatherCode(0)).toBe('sunny');
        expect(weatherApi.mapWeatherCode(1)).toBe('sunny');

        expect(weatherApi.mapWeatherCode(2)).toBe('cloudy');
    });
});