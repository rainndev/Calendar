import { Weather } from "./Weather";

export class WeatherUI {
  weather: Weather;
  currentTempElement: HTMLHeadingElement;
  windSpeedElement: HTMLParagraphElement;
  weatherCodeElement: HTMLParagraphElement;
  hourlyForecastElement: HTMLUListElement;
  weatherIconElement: HTMLImageElement;

  constructor(weatherService: Weather) {
    this.weather = weatherService;
    const $ = <T extends HTMLElement>(id: string) =>
      document.getElementById(id) as T;

    this.currentTempElement = $("current-temp");
    this.windSpeedElement = $("wind-speed");
    this.weatherCodeElement = $("weather-code");
    this.hourlyForecastElement = $("hourly-forecast");
    this.weatherIconElement = $("weather-icon");
  }

  async render() {
    const weather = await this.weather.getWeather();
    this.currentTempElement.innerText = `Summary Weather: ${weather.current.temperature}°C`;
    this.windSpeedElement.innerText = `Wind Speed: ${weather.current.windspeed} km/h`;
    this.weatherCodeElement.innerText = `Weather Code: ${weather.current.weathercode}`;

    this.weatherIconElement.src = this.weather.getWeatherIcon(
      weather.current.weathercode,
    );

    const hourlyForecast = this.weather.getTodayHourlyForecast(weather.hourly);

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

      li.innerText = `${time} - ${entry.temperature}°C`;
      this.hourlyForecastElement.appendChild(li);
    });
  }
}
