const monthTitle = document.getElementById("monthTitle") as HTMLElement;
const calendarDays = document.getElementById("calendarDays") as HTMLElement;
const prevBtn = document.getElementById("prevMonth") as HTMLButtonElement;
const nextBtn = document.getElementById("nextMonth") as HTMLButtonElement;

let displayDate: Date = new Date();

const render = (): void => {
  calendarDays.innerHTML = "";

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const monthName = displayDate.toLocaleString("default", { month: "long" });
  monthTitle.innerText = `${monthName} ${year}`;

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
};

const animate = (direction: "next" | "prev") => {
  calendarDays.classList.remove("flip-next", "flip-prev");

  void calendarDays.offsetWidth;

  calendarDays.classList.add(direction === "next" ? "flip-next" : "flip-prev");
};

prevBtn.onclick = () => {
  animate("prev");
  displayDate.setMonth(displayDate.getMonth() - 1);
  setTimeout(render, 200);
};

nextBtn.onclick = () => {
  animate("next");
  displayDate.setMonth(displayDate.getMonth() + 1);
  setTimeout(render, 200);
};

render();
