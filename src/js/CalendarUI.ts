import { Animate } from "./Animate";
import { Calendar } from "./Calendar";

export class CalendarUI {
  monthTitle: HTMLHeadingElement;
  calendarDays: HTMLElement;
  prevBtn: HTMLButtonElement;
  nextBtn: HTMLButtonElement;
  timeDisplay: HTMLParagraphElement;
  calendarElement: HTMLElement;
  weatherElement: HTMLElement;
  calendarTabBtn: HTMLButtonElement;
  weatherTabBtn: HTMLButtonElement;
  Calendar: Calendar;

  constructor(calendar: Calendar) {
    // Utility to fetch element once
    const $ = <T extends HTMLElement>(id: string) =>
      document.getElementById(id) as T;

    this.monthTitle = $("monthTitle");
    this.calendarDays = $("calendarDays");
    this.prevBtn = $("prevMonth");
    this.nextBtn = $("nextMonth");
    this.timeDisplay = $("time");
    this.calendarElement = $("calendar-element");
    this.weatherElement = $("weather-element");
    this.calendarTabBtn = $("calendar-tab-btn");
    this.weatherTabBtn = $("weather-tab-btn");

    this.Calendar = calendar;

    // Navigation buttons
    this.prevBtn.addEventListener("click", () => this.Calendar.prevMonth());
    this.nextBtn.addEventListener("click", () => this.Calendar.nextMonth());

    setInterval(() => {
      this.timeDisplay.innerText = `Time: ${this.Calendar.getCurrentTime()}`;
    }, 1000);
  }

  render() {
    this.calendarDays.innerHTML = "";
    this.Calendar.displayCurrentMonthYear();
    this.Calendar.addEmptySlots();
    this.Calendar.addDaySlots();
    Animate.animateListStagger(".day");
  }
}
