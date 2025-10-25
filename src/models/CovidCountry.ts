export interface CovidCountry {
  country: string;
  flag: string;
  cases: number;
  deaths: number;
  recovered: number;
  population: number;
}

export interface HistoricalData {
  country: string;
  timeline: {
    cases: { [date: string]: number };
  };
}