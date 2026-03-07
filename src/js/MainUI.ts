import { Calendar } from "./Calendar";
import { Weather } from "./Weather";
export class MainUI {
  Calendar: Calendar;
  Weather: Weather;
  calendarTabBtn: HTMLButtonElement;
  weatherTabBtn: HTMLButtonElement;
  calendarElement: HTMLElement;
  weatherElement: HTMLElement;

  constructor() {
    const $ = <T extends HTMLElement>(id: string) =>
      document.getElementById(id) as T;

    this.Calendar = new Calendar();
    this.calendarTabBtn = $("calendar-tab-btn");
    this.weatherTabBtn = $("weather-tab-btn");
    this.calendarElement = $("calendar-element");
    this.weatherElement = $("weather-element");
    this.Weather = new Weather(5.079409, 120.6199895);

    // Tab switching
    const switchTab = (show: HTMLElement, hide: HTMLElement) => {
      show.style.display = "block";
      hide.style.display = "none";
    };

    this.calendarTabBtn.addEventListener("click", () => {
      this.calendarTabBtn.classList.add("active-tab");
      this.weatherTabBtn.classList.remove("active-tab");
      switchTab(this.calendarElement, this.weatherElement);
    });

    this.weatherTabBtn.addEventListener("click", () => {
      this.weatherTabBtn.classList.add("active-tab");
      this.calendarTabBtn.classList.remove("active-tab");
      switchTab(this.weatherElement, this.calendarElement);
      this.Weather.WeatherUI.render();
    });
  }

  render() {
    this.Calendar.CalendarUI.render();
    this.calendarTabBtn.classList.add("active-tab");
  }
}
