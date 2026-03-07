import { Animate } from "./Animate";
import { Calendar } from "./Calendar";
export class UI {
  monthTitle: HTMLHeadingElement;
  calendarDays: HTMLElement;
  prevBtn: HTMLButtonElement;
  nextBtn: HTMLButtonElement;
  timeDisplay: HTMLParagraphElement;
  Calendar: Calendar;

  constructor(calendar: Calendar) {
    this.monthTitle = document.getElementById(
      "monthTitle",
    ) as HTMLHeadingElement;
    this.calendarDays = document.getElementById("calendarDays") as HTMLElement;
    this.prevBtn = document.getElementById("prevMonth") as HTMLButtonElement;
    this.nextBtn = document.getElementById("nextMonth") as HTMLButtonElement;
    this.timeDisplay = document.getElementById("time") as HTMLParagraphElement;
    this.Calendar = calendar;

    this.prevBtn.addEventListener("click", () => this.Calendar.prevMonth());
    this.nextBtn.addEventListener("click", () => this.Calendar.nextMonth());

    setInterval(() => {
      const currentTimeFormatted = this.Calendar.getCurrentTime();

      this.timeDisplay.innerText = `Time: ${currentTimeFormatted}`;
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
