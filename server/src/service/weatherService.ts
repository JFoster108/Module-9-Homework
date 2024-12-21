import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  city: string;
  tempF: number;
  iconDescription: string;
  date: string;
  icon: string;
  windSpeed: string;
  humidity: string;

  constructor(city: string, tempF: number, iconDescription: string, date: string, icon: string, windSpeed: string, humidity: string) {
    this.city = city;
    this.tempF = tempF;
    this.iconDescription = iconDescription;
    this.date = date;
    this.icon = icon;
    this.windSpeed = windSpeed;
    this.humidity = humidity;

  }
}

class WeatherService {
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private apiKey = process.env.API_KEY;
cityName = ""
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
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;
  }

  // Fetch weather data
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const queryURL = this.buildWeatherQuery(coordinates);
    const response = await fetch(queryURL);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    let data = await response.json()
    const currentData = this.parseCurrentWeather(data.list[0])
    return [currentData];
  }

  // Parse weather response
  private parseCurrentWeather(response: any): Weather {
    return new Weather(
      this.cityName,
      response.main.temp,
      response.weather[0].description,
      response.dt_txt,
      response.weather[0].icon,
      response.main.humidity,
      response.wind.speed
    );
  }

  // Get weather for a city
  async getWeatherForCity(city: string): Promise<Weather> {
    this.cityName = city
    const locationData = await this.fetchLocationData(city);
    const coordinates = this.destructureLocationData(locationData);
    const weatherData = await this.fetchWeatherData(coordinates);
    return weatherData ;
  }
}

export default new WeatherService();

