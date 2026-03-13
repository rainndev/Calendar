import { animate } from "motion";
import holidayData from "../data/holidays.json";
import type { DailyChallenge } from "../types/daily-challenge.type";
import type { HolidayType } from "../types/holiday.types";
import { Animate } from "./Animate";
import { CalendarUI } from "./CalendarUI";

export class Calendar {
  currentDate: Date;
  displayDate: Date;
  CalendarUI: CalendarUI;
  year: number;
  month: number;
  holdTimer: number | undefined;
  isTooltipVisible: boolean = false;
  dailyChallengeData: DailyChallenge[];

  constructor() {
    this.currentDate = new Date();
    this.CalendarUI = new CalendarUI(this);
    this.displayDate = new Date();
    this.year = this.displayDate.getFullYear();
    this.month = this.displayDate.getMonth();
    this.holdTimer = undefined;
    this.isTooltipVisible = false;
    this.dailyChallengeData = localStorage.getItem("dailyChallenge")
      ? JSON.parse(localStorage.getItem("dailyChallenge")!)
      : ([] as DailyChallenge[]);
  }

  getCurrentTime(): string {
    const now = new Date();

    const hours = (now.getHours() % 12 || 12).toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  showToolTipHoliday(day: HTMLElement, holiday: HolidayType): void {
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.innerHTML = `
    <p class="holiday-type">${holiday.type}</p>
    <strong>${holiday.name}</strong><br/>
    <small>${holiday.description}</small><br/>
    <img class="holiday-image" src="${holiday.image}"/>
    `;

    document.body.appendChild(tooltip);

    // show tooltip on hover
    day.addEventListener("mousedown", () => {
      this.holdTimer = setTimeout(() => {
        const rect = day.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        // Horizontal position: center but clamp within viewport
        let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        left = Math.max(
          5,
          Math.min(left, viewportWidth - tooltipRect.width - 5),
        ); // 5px padding

        // Vertical position: prefer above, if not enough space, show below
        let top = rect.top - tooltipRect.height - 10; // 10px gap
        if (top < 5) {
          top = rect.bottom + 10; // show below the day
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;

        animate(
          tooltip,
          {
            opacity: [0, 1],
            scale: [0.8, 1],
            y: [-10, 0],
          },
          {
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.3,
          },
        );

        this.isTooltipVisible = true;
      }, 500);
    });

    day.addEventListener("mouseup", () => {
      if (this.holdTimer) clearTimeout(this.holdTimer);

      if (this.isTooltipVisible) {
        animate(
          tooltip,
          {
            opacity: [1, 0],
            scale: [1, 0.8],
            y: [0, -10],
          },
          { duration: 0.2 },
        );
      }

      this.isTooltipVisible = false;
    });
  }

  addEmptySlots() {
    const firstDay = new Date(this.year, this.month, 1).getDay();

    for (let i = 0; i < firstDay; i++) {
      const slot = document.createElement("div");
      slot.classList.add("day");
      this.CalendarUI.calendarDays.appendChild(slot);
    }
  }

  addDaySlots() {
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement("div");
      day.classList.add("day");

      // Set the day number first
      day.innerText = i.toString();

      // Check for holidays
      holidayData.forEach((holiday: HolidayType) => {
        const [hMonth, hDay] = holiday.date.split("-").map(Number);
        if (hDay === i && hMonth === this.month + 1) {
          day.classList.add("holiday");
          this.showToolTipHoliday(day, holiday);
        }
      });

      // Check for daily challenge
      const dayStr = `${this.year}-${(this.month + 1)
        .toString()
        .padStart(2, "0")}-${i.toString().padStart(2, "0")}`;

      const hasChallenge = this.dailyChallengeData.some((challenge) => {
        const challengeDate = challenge.date.split("T")[0];
        return challengeDate === dayStr && challenge.proofImage;
      });

      if (hasChallenge) {
        const indicator = document.createElement("span");
        indicator.classList.add("challenge-indicator");
        day.appendChild(indicator);
      }

      // Highlight today
      if (
        i === this.currentDate.getDate() &&
        this.month === this.currentDate.getMonth() &&
        this.year === this.currentDate.getFullYear()
      ) {
        day.classList.add("today");
      }

      this.CalendarUI.calendarDays.appendChild(day);
    }

    Animate.animateListStagger(".day");
  }
  updateMonthYear() {
    this.year = this.displayDate.getFullYear();
    this.month = this.displayDate.getMonth();
  }
  displayCurrentMonthYear() {
    const monthName = this.displayDate.toLocaleString("default", {
      month: "long",
    });

    this.CalendarUI.monthTitle.innerText = `${monthName} ${this.year}`;

    Animate.decryptionAnimation(
      this.CalendarUI.monthTitle,
      `${monthName} ${this.year}`,
    );
  }

  async nextMonth() {
    await Animate.exitListStagger(".day");
    this.displayDate.setMonth(this.displayDate.getMonth() + 1);
    this.updateMonthYear();

    setTimeout(() => this.CalendarUI.render(), 200);
  }

  async prevMonth() {
    await Animate.exitListStagger(".day");
    this.displayDate.setMonth(this.displayDate.getMonth() - 1);
    this.updateMonthYear();

    setTimeout(() => this.CalendarUI.render(), 200);
  }

  addDailyChallengeEntry(challenge: string, proofImage: string) {
    const stored = localStorage.getItem("dailyChallenge");

    let dailyChallenge: DailyChallenge[];

    try {
      dailyChallenge = stored ? JSON.parse(stored) : [];
    } catch {
      throw new Error("Invalid dailyChallenge data in localStorage");
    }

    if (!challenge || challenge.trim() === "") {
      throw new Error("Challenge cannot be empty");
    }

    if (proofImage === "") {
      throw new Error("Proof image cannot be empty");
    }

    if (dailyChallenge.some((entry) => entry.challenge === challenge)) {
      throw new Error("You have already finished this challenge");
    }

    const entry: DailyChallenge = {
      date: new Date().toISOString(),
      challenge,
      proofImage,
    };

    dailyChallenge.push(entry);

    try {
      localStorage.setItem("dailyChallenge", JSON.stringify(dailyChallenge));
    } catch {
      throw new Error("Failed to save daily challenge to localStorage");
    }
  }
}
