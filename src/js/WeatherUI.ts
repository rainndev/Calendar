import { Animate } from "./Animate";
import { Weather } from "./Weather";

const timeSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="35px"  viewBox="0 0 24 24"><title xmlns="">clock</title><path fill="oklch(0.22 0.05 280/0.9)" d="M19 3H5v2H3v14h2v2h14v-2h2V5h-2zm0 2v14H5V5zm-8 2h2v6h4v2h-6z"/></svg>';

export class WeatherUI {
  weather: Weather;
  currentTempElement: HTMLHeadingElement;
  windSpeedElement: HTMLParagraphElement;
  weatherCodeElement: HTMLParagraphElement;
  hourlyForecastElement: HTMLUListElement;
  weatherIconElement: HTMLImageElement;
  humidityElement: HTMLParagraphElement;
  feelsLikeElement: HTMLParagraphElement;
  locationTitleElement: HTMLHeadingElement;
  monthTitleElement: HTMLHeadingElement;

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
    this.locationTitleElement = $("location-title");
    this.monthTitleElement = $("month-title-weather");
  }

  showMonthTitle() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString("default", { month: "long" });
    const year = currentDate.getFullYear();
    Animate.decryptionAnimation(
      this.monthTitleElement,
      `${month} ${day} ${year}`,
    );
  }

  async render() {
    Animate.decryptionAnimation(
      this.locationTitleElement,
      "Pampanga, Philippines",
    );

    this.showMonthTitle();
    const weather = await this.weather.getWeather();

    console.log("Current Weather:", weather.hourly);
    Animate.decryptionAnimation(
      this.currentTempElement,
      `${weather.current?.temperature_2m.toFixed(2)}°C`,
    );
    Animate.decryptionAnimation(
      this.windSpeedElement,
      `${weather.current?.wind_speed_10m.toFixed(0)} km/h`,
    );

    Animate.decryptionAnimation(
      this.humidityElement,
      `${weather.current?.relative_humidity_2m.toFixed(0)}%`,
    );

    Animate.decryptionAnimation(
      this.feelsLikeElement,
      `${weather.current?.apparent_temperature.toFixed(0)}°C`,
    );

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

      li.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem">
          ${timeSVG}
          <p>${time}</p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem">
          <img src="${this.weather.getWeatherIcon(
            weather.hourly?.weather_code[hourlyForecast.indexOf(entry)] || 0,
          )}" alt="Weather Icon" width="35" height="35">
          <p>${entry.temperature.toFixed(2)}°C</p>
        </div>
      `;
      li.classList.add("hourly-entry");
      this.hourlyForecastElement.appendChild(li);
    });

    Animate.animateListStagger(".hourly-entry");
  }
}
