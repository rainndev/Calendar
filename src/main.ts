import { animate, stagger } from "motion";
import holidayData from "./data/holidays.json";
import { decryptText } from "./utils/decrypted";

const monthTitle = document.getElementById("monthTitle") as HTMLElement;
const calendarDays = document.getElementById("calendarDays") as HTMLElement;
const prevBtn = document.getElementById("prevMonth") as HTMLButtonElement;
const nextBtn = document.getElementById("nextMonth") as HTMLButtonElement;
const timeDisplay = document.getElementById("time") as HTMLParagraphElement;

setInterval(() => {
  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  timeDisplay.innerText = `Time: ${hours}:${minutes}:${seconds} ${ampm}`;
}, 1000);

let displayDate: Date = new Date();

const animateDays = () => {
  animate(
    ".day",
    {
      scale: [0, 1],
      y: [20, 0],
      opacity: [0, 1],
    },
    {
      type: "spring",
      stiffness: 300,
      damping: 15,
      delay: stagger(0.02),
    },
  );
};

const exitDays = async () => {
  await animate(
    ".day",
    {
      scale: [1, 0.5],
      y: [0, -20],
      opacity: [1, 0],
    },
    {
      duration: 0.3,
      delay: stagger(0.02),
    },
  ).finished;
};

const render = (): void => {
  calendarDays.innerHTML = "";

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const monthName = displayDate.toLocaleString("default", { month: "long" });
  monthTitle.innerText = `${monthName} ${year}`;
  decryptText(monthTitle, `${monthName} ${year}`);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const slot = document.createElement("div");
    slot.classList.add("day");
    calendarDays.appendChild(slot);
  }

  const today = new Date();

  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement("div");
    day.classList.add("day");
    holidayData.forEach((holiday) => {
      const [hMonth, hDay] = holiday.date.split("-").map(Number);

      if (hDay === i && hMonth === month + 1) {
        day.classList.add("holiday");
        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.innerText = holiday.name;
        day.appendChild(tooltip);
      }
    });

    day.innerText = i.toString();

    if (
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      day.classList.add("today");
    }

    calendarDays.appendChild(day);
  }

  animateDays();
};

prevBtn.onclick = async () => {
  await exitDays();
  displayDate.setMonth(displayDate.getMonth() - 1);
  setTimeout(render, 200);
};

nextBtn.onclick = async () => {
  await exitDays();
  displayDate.setMonth(displayDate.getMonth() + 1);
  setTimeout(render, 200);
};

render();
animateDays();
