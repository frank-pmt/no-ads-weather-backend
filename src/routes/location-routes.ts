import { Router } from 'express';
import { LocationService } from '../services/location-service';

const locationRoutes = Router();

const locationService: LocationService = new LocationService();

locationRoutes.get('/:location', async (req, res) => {
  try {
    const { location } = req.params;
    console.log(`Requested location ${location}`)
    const response = await locationService.lookupLocation(location);
    res.json(response);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
});

export default locationRoutes;