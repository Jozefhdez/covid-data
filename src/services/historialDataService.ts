import axios from 'axios';

const API_BASE_URL = 'https://disease.sh/v3/covid-19';

export interface HistoricalData {
  country: string;
  province?: string[];
  timeline: {
    cases: { [date: string]: number };
    deaths: { [date: string]: number };
    recovered: { [date: string]: number };
  };
}

export class HistoricalDataService {
  static async getHistoricalData(country: string, days: string | number = 'all'): Promise<HistoricalData> {
    const response = await axios.get(
      `${API_BASE_URL}/historical/${encodeURIComponent(country)}?lastdays=${days}`
    );
    return response.data;
  }
}