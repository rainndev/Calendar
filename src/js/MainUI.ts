import Typed from "typed.js";
import { message } from "../data/dialog-messages";
import { Calendar } from "./Calendar";
import { DailyChallengeUI } from "./DailyChallengeUI";
import { SoundEffect } from "./SoundEffect";
import { Weather } from "./Weather";

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
  musicButtonElement: HTMLButtonElement;
  musicIconElement: HTMLImageElement;

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
    this.musicButtonElement = $("bg-music-button");
    this.musicIconElement = $("music-icon") as HTMLImageElement;
    this.dailyChallengeElement = $("daily-challenge-element");
    this.dailyChallengeTab = $("daily-tab-btn");
    this.Weather = new Weather();
    this.DailyChallengeUI = new DailyChallengeUI(this);

    SoundEffect.initialize();

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
      SoundEffect.playClick();

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
      // Toggle mute for all sounds
      const muted = !SoundEffect["clickSoundEffect"].muted;
      console.log(`Sound muted to ${muted}`);
      SoundEffect.muteAllSoundEffect(muted);

      this.soundIconElement.src = muted
        ? "./sound-mute-solid.svg"
        : "./sound-on-solid.svg";

      this.soundIconElement.alt = muted ? "Sound Off" : "Sound On";
    });

    this.musicButtonElement.addEventListener("click", () => {
      const muted = SoundEffect["bgMusic"].muted;
      console.log(`Background music muted to ${!muted}`);

      if (!muted) {
        SoundEffect.playBgMusic();
      }

      SoundEffect.muteBgMusic(!muted);

      this.musicIconElement.src = !muted ? "./music-off.svg" : "./music-on.svg";
      this.musicIconElement.alt = !muted ? "Music Off" : "Music On";
    });

    new Typed(this.speechContentElement, {
      strings: message,
      typeSpeed: 45,
      backSpeed: 45,
      loop: true,
      cursorChar: "|",

      preStringTyped: () => {
        SoundEffect.playKeyboard();
      },

      onStringTyped: () => {
        SoundEffect.keyboardSoundEffect.pause();
        SoundEffect.keyboardSoundEffect.currentTime = 0;
      },
    });
  }

  render() {
    this.Calendar.CalendarUI.render();
    this.calendarTabBtn.classList.add("active-tab");
  }
}
