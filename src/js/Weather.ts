import type { NominatimReverseResponse } from "../types/location";
import { getUserLocation } from "../utils/location";
import { WeatherUI } from "./WeatherUI";
type CurrentWeather = {
  temperature_2m: number;
  wind_speed_10m: number;
  weather_code: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  time: string;
};

type HourlyForecast = {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
};

export class Weather {
  private latitude: number = 15.0343;
  private longitude: number = 120.6844;
  private city: string = "Unknown";
  private country: string = "Unknown";
  WeatherUI: WeatherUI;

  constructor() {
    this.WeatherUI = new WeatherUI(this);

    getUserLocation().then(async ({ lat, lon }) => {
      this.latitude = lat;
      this.longitude = lon;
      await this.getLocationName();

      this.WeatherUI.render();
    });
  }

  async getWeather() {
    const today = new Date().toISOString().split("T")[0];

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${this.latitude}` +
      `&longitude=${this.longitude}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m` +
      `&hourly=temperature_2m,weather_code` +
      `&start_date=${today}` +
      `&end_date=${today}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch weather");
    }

    const data = await response.json();

    return {
      current: data.current as CurrentWeather | undefined,
      hourly: data.hourly as HourlyForecast | undefined,
    };
  }

  private async getLocationName() {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?lat=${this.latitude}` +
      `&lon=${this.longitude}` +
      `&format=json`;

    const response = await fetch(url, {
      headers: {
        "Accept-Language": "en",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch location");
    }

    const data: NominatimReverseResponse = await response.json();

    const address = data.address;

    this.city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.state ||
      "Pampanga";

    this.country = address.country || "Philippines";
  }

  getCity() {
    return this.city;
  }

  getCountry() {
    return this.country;
  }

  getTodayHourlyForecast(hourly: HourlyForecast) {
    const result = [];

    for (let i = 0; i < hourly.time.length; i++) {
      result.push({
        time: hourly.time[i],
        temperature: hourly.temperature_2m[i],
      });
    }

    return result;
  }

  getWeatherIcon(weatherCode: number) {
    switch (true) {
      // Clear sky
      case weatherCode === 0:
        return "./weather-icons/icon-sunny.png";

      // Partly cloudy
      case [1, 2].includes(weatherCode):
        return "./weather-icons/icon-partly-cloudy.png";

      // Overcast
      case weatherCode === 3:
        return "./weather-icons/icon-overcast.png";

      // Fog
      case [45, 48].includes(weatherCode):
        return "./weather-icons/icon-fog.png";

      // Drizzle (51–55)
      case weatherCode >= 51 && weatherCode <= 55:
        return "./weather-icons/icon-drizzle.png";

      // Rain (61–65, 80–82)
      case (weatherCode >= 61 && weatherCode <= 65) ||
        (weatherCode >= 80 && weatherCode <= 82):
        return "./weather-icons/icon-rain.png";

      // Snow (71–77, 85–86)
      case (weatherCode >= 71 && weatherCode <= 77) ||
        (weatherCode >= 85 && weatherCode <= 86):
        return "./weather-icons/icon-snow.png";

      // Thunderstorms (95–99)
      case weatherCode >= 95 && weatherCode <= 99:
        return "./weather-icons/icon-storm.png";

      // Default / unknown
      default:
        return "./weather-icons/icon-overcast.png";
    }
  }
}
