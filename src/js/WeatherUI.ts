import { Weather } from "./Weather";

export class WeatherUI {
  weather: Weather;
  currentTempElement: HTMLHeadingElement;
  windSpeedElement: HTMLParagraphElement;
  weatherCodeElement: HTMLParagraphElement;
  hourlyForecastElement: HTMLUListElement;
  weatherIconElement: HTMLImageElement;
  humidityElement: HTMLParagraphElement;
  feelsLikeElement: HTMLParagraphElement;

  constructor(weatherService: Weather) {
    this.weather = weatherService;
    const $ = <T extends HTMLElement>(id: string) =>
      document.getElementById(id) as T;

    this.currentTempElement = $("current-temp");
    this.windSpeedElement = $("wind-speed");
    this.weatherCodeElement = $("weather-code");
    this.hourlyForecastElement = $("hourly-forecast");
    this.weatherIconElement = $("weather-icon");
    this.humidityElement = $("humidity");
    this.feelsLikeElement = $("feels-like");
  }

  async render() {
    const weather = await this.weather.getWeather();

    this.currentTempElement.innerText = `${weather.current?.temperature_2m}°C`;
    this.windSpeedElement.innerText = `Wind Speed: ${weather.current?.wind_speed_10m} km/h`;
    this.humidityElement.innerText = `Humidity: ${weather.current?.relative_humidity_2m}%`;
    this.feelsLikeElement.innerText = `Feels Like: ${weather.current?.apparent_temperature}°C`;

    this.weatherIconElement.src = this.weather.getWeatherIcon(
      weather.current?.weather_code || 0,
    );

    const hourlyForecast = this.weather.getTodayHourlyForecast(weather.hourly!);

    // Clear previous forecast
    this.hourlyForecastElement.innerHTML = "";

    // Render hourly forecast
    hourlyForecast.forEach((entry) => {
      const li = document.createElement("li");
      const time = new Date(entry.time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      li.innerText = `${time} - ${entry.temperature.toFixed(2)}°C`;
      this.hourlyForecastElement.appendChild(li);
    });
  }
}
