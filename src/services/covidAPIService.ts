import axios from 'axios';
import { CovidCountry } from '../models/CovidCountry';

const API_BASE_URL = 'https://disease.sh/v3/covid-19'

export class covidAPIService {
    static async getAllCountries(): Promise<CovidCountry[]> {
        const response = await axios.get(`${API_BASE_URL}/countries`)

        const countries : CovidCountry[] = response.data.map((item: any) => ({
            country: item.country,
            flag: item.countryInfo.flag,
            cases: item.cases,
            deaths: item.deaths,
            recovered: item.recovered,
            population: item.population
        }))
        return countries
    }
}