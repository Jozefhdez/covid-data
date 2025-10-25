import { covidAPIService } from "../services/covidAPIService";
import { HistoricalDataService } from "../services/historialDataService";

export class CovidController {
  static async getAllCountries() {
    return await covidAPIService.getAllCountries();
  }

  static async getHistoricalData(country: string, days: string | number = 'all') {
    return await HistoricalDataService.getHistoricalData(country, days);
  }
}