import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weather-routes';
import locationRoutes from './routes/location-routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const origins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:3000', 'http://localhost:3080', 'http://host.docker.internal:3000/', 'http://host.docker.internal:3080/'];

app.use(cors({
  origin: origins,
  credentials: true,
}));

app.use(express.json());
app.use('/api/weather', weatherRoutes);
app.use('/api/location', locationRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
