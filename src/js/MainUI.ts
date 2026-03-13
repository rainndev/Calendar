import Typed from "typed.js";
import { message } from "../data/dialog-messages";
import { Calendar } from "./Calendar";
import { DailyChallengeUI } from "./DailyChallengeUI";
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
  DailyChallengeUI: DailyChallengeUI;
  calendarTabBtn: HTMLButtonElement;
  weatherTabBtn: HTMLButtonElement;
  dailyChallengeTab: HTMLButtonElement;
  calendarElement: HTMLElement;
  weatherElement: HTMLElement;
  dailyChallengeElement: HTMLElement;
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
    this.dailyChallengeElement = $("daily-challenge-element");
    this.dailyChallengeTab = $("daily-tab-btn");
    this.Weather = new Weather();
    this.DailyChallengeUI = new DailyChallengeUI(this);

    const tabs = [
      {
        button: this.calendarTabBtn,
        element: this.calendarElement,
        render: () => this.Calendar.CalendarUI.render(),
      },
      {
        button: this.weatherTabBtn,
        element: this.weatherElement,
        render: () => this.Weather.WeatherUI.render(),
      },
      {
        button: this.dailyChallengeTab,
        element: this.dailyChallengeElement,
        render: () => this.DailyChallengeUI.render(),
      },
    ];

    // Tab switching
    const switchTab = (activeIndex: number) => {
      tabs.forEach((tab, index) => {
        const isActive = index === activeIndex;

        tab.button.classList.toggle("active-tab", isActive);
        tab.element.style.display = isActive ? "block" : "none";

        if (isActive) tab.render();
      });
    };

    this.calendarTabBtn.addEventListener("click", () => switchTab(0));
    this.weatherTabBtn.addEventListener("click", () => switchTab(1));
    this.dailyChallengeTab.addEventListener("click", () => switchTab(2));

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
