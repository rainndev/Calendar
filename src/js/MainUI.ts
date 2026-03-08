import Typed from "typed.js";
import { getGreetingsBasedOnTime } from "../utils/greetings";
import { Calendar } from "./Calendar";
import { Weather } from "./Weather";

const typingSound = new Audio("./sounds/keyboard-sound-effect.mp3");
typingSound.muted = true;
typingSound.volume = 1;

const bgMusic = new Audio("./sounds/bg-music.mp3");
bgMusic.loop = true;
bgMusic.muted = true;
bgMusic.volume = 0.15;
bgMusic.play();

export class MainUI {
  Calendar: Calendar;
  Weather: Weather;
  calendarTabBtn: HTMLButtonElement;
  weatherTabBtn: HTMLButtonElement;
  calendarElement: HTMLElement;
  weatherElement: HTMLElement;
  speechContentElement: HTMLParagraphElement;
  soundButtonElement: HTMLButtonElement;
  soundIconElement: HTMLImageElement;

  constructor() {
    const $ = <T extends HTMLElement>(id: string) =>
      document.getElementById(id) as T;

    this.Calendar = new Calendar();
    this.calendarTabBtn = $("calendar-tab-btn");
    this.weatherTabBtn = $("weather-tab-btn");
    this.calendarElement = $("calendar-element");
    this.weatherElement = $("weather-element");
    this.speechContentElement = $("speech-content");
    this.soundButtonElement = $("sound-effect-button");
    this.soundIconElement = $("sound-icon") as HTMLImageElement;
    this.Weather = new Weather(15.0343, 120.6844);

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

    this.soundButtonElement.addEventListener("click", () => {
      typingSound.muted = !typingSound.muted;

      bgMusic.muted = !bgMusic.muted;

      if (!bgMusic.muted && bgMusic.paused) {
        bgMusic.play();
      }

      this.soundIconElement.src = typingSound.muted
        ? "./sound-mute-solid.svg"
        : "./sound-on-solid.svg";

      this.soundIconElement.alt = typingSound.muted ? "Sound Off" : "Sound On";
    });

    const message = [
      `Hello User! ${getGreetingsBasedOnTime()}`,
      "Click on the tabs to explore features!",
      "You can also hold on calendar days to see holiday details!",
      "Weather data is fetched from Open-Meteo API!",
      "This project was built with TypeScript and Motion by Rainier Sison.",
    ];

    new Typed(this.speechContentElement, {
      strings: message,
      typeSpeed: 45,
      backSpeed: 45,
      loop: true,
      cursorChar: "|",

      onStringTyped: () => {
        typingSound.pause();
        typingSound.currentTime = 0;
      },

      preStringTyped: () => {
        typingSound.loop = true;
        typingSound.play();
      },
    });
  }

  render() {
    this.Calendar.CalendarUI.render();
    this.calendarTabBtn.classList.add("active-tab");
  }
}
