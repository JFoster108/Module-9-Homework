import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Fetch weather data
    const weatherData = await WeatherService.getWeather(city);

    // Save city to search history
    await HistoryService.saveSearch(city);

    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Unable to fetch weather data' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await HistoryService.getHistory();

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Unable to fetch search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'City ID is required' });
    }

    await HistoryService.deleteSearch(id);

    res.status(200).json({ message: 'City deleted from history' });
  } catch (error) {
    console.error('Error deleting city from history:', error);
    res.status(500).json({ error: 'Unable to delete city from history' });
  }
});

export default router;
