import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  city: string;
  temperature: number;
  description: string;

  constructor(city: string, temperature: number, description: string) {
    this.city = city;
    this.temperature = temperature;
    this.description = description;
  }
}

class WeatherService {
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private apiKey = process.env.OPENWEATHER_API_KEY;

  // Fetch location data
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    return await response.json();
  }

  // Extract coordinates from location data
  private destructureLocationData(locationData: any[]): Coordinates {
    if (!locationData || locationData.length === 0) {
      throw new Error('Location not found');
    }
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

  // Build weather query URL
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;
  }

  // Fetch weather data
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const queryURL = this.buildWeatherQuery(coordinates);
    const response = await fetch(queryURL);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return await response.json();
  }

  // Parse weather response
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      response.name,
      response.main.temp,
      response.weather[0].description
    );
  }

  // Get weather for a city
  async getWeatherForCity(city: string): Promise<Weather> {
    const locationData = await this.fetchLocationData(city);
    const coordinates = this.destructureLocationData(locationData);
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();

