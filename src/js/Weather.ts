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
  private latitude: number;
  private longitude: number;
  WeatherUI: WeatherUI;

  constructor(lat: number, lon: number) {
    this.WeatherUI = new WeatherUI(this);
    this.latitude = lat;
    this.longitude = lon;
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
        return "./public/weather-icons/icon-sunny.png";

      // Partly cloudy
      case [1, 2].includes(weatherCode):
        return "./public/weather-icons/icon-partly-cloudy.png";

      // Overcast
      case weatherCode === 3:
        return "./public/weather-icons/icon-overcast.png";

      // Fog
      case [45, 48].includes(weatherCode):
        return "./public/weather-icons/icon-fog.png";

      // Drizzle (51–55)
      case weatherCode >= 51 && weatherCode <= 55:
        return "./public/weather-icons/icon-drizzle.png";

      // Rain (61–65, 80–82)
      case (weatherCode >= 61 && weatherCode <= 65) ||
        (weatherCode >= 80 && weatherCode <= 82):
        return "./public/weather-icons/icon-rain.png";

      // Snow (71–77, 85–86)
      case (weatherCode >= 71 && weatherCode <= 77) ||
        (weatherCode >= 85 && weatherCode <= 86):
        return "./public/weather-icons/icon-snow.png";

      // Thunderstorms (95–99)
      case weatherCode >= 95 && weatherCode <= 99:
        return "./public/weather-icons/icon-storm.png";

      // Default / unknown
      default:
        return "./public/weather-icons/icon-overcast.png";
    }
  }
}
