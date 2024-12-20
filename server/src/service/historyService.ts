import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Define the City class
class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

class HistoryService {
  private filePath: string;

  constructor() {
    // Convert import.meta.url to file path
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.filePath = path.join(__dirname, '../../db/db.json');
  }

  // Read the JSON file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, { encoding: 'utf-8', flag: 'a+' });
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  // Write to the JSON file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing search history:', error);
    }
  }

  // Get all cities
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Add a city to the search history
  async addCity(name: string): Promise<City> {
    const cities = await this.read();
    const id = Date.now().toString(); // Generate a unique ID
    const newCity = new City(id, name);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  // Remove a city by ID
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter((city) => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();

