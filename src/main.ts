import { animate, stagger } from "motion";
import { decryptText } from "./utils/decrypted";

const monthTitle = document.getElementById("monthTitle") as HTMLElement;
const calendarDays = document.getElementById("calendarDays") as HTMLElement;
const prevBtn = document.getElementById("prevMonth") as HTMLButtonElement;
const nextBtn = document.getElementById("nextMonth") as HTMLButtonElement;

let displayDate: Date = new Date();

const animateDays = () => {
  animate(
    ".day",
    {
      scale: [0.5, 1],
      y: [20, 0],
      opacity: [0, 1],
    },
    {
      type: "spring",
      stiffness: 300,
      damping: 15,
      delay: stagger(0.05),
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
