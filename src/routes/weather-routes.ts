// backend/src/routes/weatherRoutes.ts
import { Router } from 'express';
import { WeatherService } from '../services/weather-service';

const weatherRoutes = Router();

const weatherService: WeatherService = new WeatherService();

weatherRoutes.get('/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    console.log(`Requested weather data for ${lat}, ${lng}`)
    const forecast = await weatherService.getDailyForecast(Number(lat), Number(lng));
    res.json(forecast);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
});

weatherRoutes.get('/:lat/:lng/:date', async (req, res) => {
  try {
    const { lat, lng, date } = req.params;
    console.log(`Requested weather data for ${lat}, ${lng} and ${date}`)
    const forecast = await weatherService.getDetailedForecast(Number(lat), Number(lng), new Date(date));
    res.json(forecast);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
});

export default weatherRoutes;