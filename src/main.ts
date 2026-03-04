const monthTitle = document.getElementById("monthTitle") as HTMLElement;
const calendarDays = document.getElementById("calendarDays") as HTMLElement;
const prevBtn = document.getElementById("prevMonth") as HTMLButtonElement;
const nextBtn = document.getElementById("nextMonth") as HTMLButtonElement;

// State: initialized to current date
let displayDate: Date = new Date();

function render(): void {
  // Clear previous content
  calendarDays.innerHTML = "";

  const year: number = displayDate.getFullYear();
  const month: number = displayDate.getMonth();

  // 1. Update Header
  const monthName: string = displayDate.toLocaleString("default", {
    month: "long",
  });
  monthTitle.innerText = `${monthName} ${year}`;

  // 2. Logic: Find start of month and total days
  const firstDayOfMonth: number = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth: number = new Date(year, month + 1, 0).getDate();

  // 3. Create Padding (Empty slots for days of previous month)
  for (let i = 0; i < firstDayOfMonth; i++) {
    const slot: HTMLDivElement = document.createElement("div");
    slot.classList.add("day", "empty");
    calendarDays.appendChild(slot);
  }

  // 4. Create Day elements
  const today: Date = new Date();

  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement: HTMLDivElement = document.createElement("div");
    dayElement.classList.add("day");
    dayElement.innerText = i.toString();

    // Check if it's "Today"
    if (
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayElement.classList.add("today");
    }

    calendarDays.appendChild(dayElement);
  }
}

// Event Listeners
prevBtn.onclick = (): void => {
  displayDate.setMonth(displayDate.getMonth() - 1);
  render();
};

nextBtn.onclick = (): void => {
  displayDate.setMonth(displayDate.getMonth() + 1);
  render();
};

// Initial load
render();
