import challenges from "../data/daily-challenge.json";
import type { DailyChallenge } from "../types/daily-challenge.type";
import { getRelativeTime } from "../utils/time";
import { Animate } from "./Animate";
import type { MainUI } from "./MainUI";

export class DailyChallengeUI {
  mainUI: MainUI;
  dailyChallengeText: HTMLParagraphElement;
  input: HTMLInputElement;
  uploadText: HTMLSpanElement;
  finishChallengeButton: HTMLButtonElement;
  recentListUL: HTMLUListElement;
  noChallengeUI: HTMLElement;

  imageBase64: string = "";
  todayDate: Date = new Date();
  todayChallenge: string = "";

  constructor(mainUI: MainUI) {
    const $ = <T extends HTMLElement>(id: string) =>
      document.getElementById(id) as T;

    this.mainUI = mainUI;
    this.dailyChallengeText = $("daily-challenge-text");
    this.input = $("imageInput");
    this.uploadText = $("upload-text");
    this.finishChallengeButton = $("finish-challenge-btn");
    this.recentListUL = $("recent-challenges-list");
    this.noChallengeUI = $("no-challenge-ui");

    this.input.addEventListener("change", () => {
      const file = this.input.files?.[0];
      if (!file) return;

      this.uploadText.textContent = file.name;

      const reader = new FileReader();

      reader.onload = () => {
        this.imageBase64 = reader.result as string;

        console.log("Base64:", this.imageBase64);
      };

      reader.readAsDataURL(file);
    });

    this.finishChallengeButton.addEventListener("click", () => {
      try {
        mainUI.Calendar.addDailyChallengeEntry(
          this.todayChallenge,
          this.imageBase64,
        );
        this.renderRecentChallenges();
        alert("Challenge completed! Your proof has been saved.");
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
          alert(err.message);
        }
      }
    });
  }

  render() {
    this.showTodayChallenge();

    if (localStorage.getItem("dailyChallenge")) {
      this.noChallengeUI.style.display = "none";
      this.recentListUL.style.display = "block";
    } else {
      this.noChallengeUI.style.display = "flex";
      this.recentListUL.style.display = "none";
    }

    this.renderRecentChallenges();
  }

  showTodayChallenge() {
    const today = this.todayDate.toDateString();
    const index =
      today.split("").reduce((a, b) => a + b.charCodeAt(0), 0) %
      challenges.length;
    this.todayChallenge = challenges[index];
    Animate.decryptionAnimation(this.dailyChallengeText, this.todayChallenge);
  }

  renderRecentChallenges() {
    const dailyChallengeData = localStorage.getItem("dailyChallenge")
      ? (JSON.parse(
          localStorage.getItem("dailyChallenge")!,
        ) as DailyChallenge[])
      : [];

    this.recentListUL.innerHTML = "";
    dailyChallengeData.slice(0, 10).forEach((element) => {
      const li = document.createElement("li");
      li.innerHTML = `
      <p class="list-style-header" style="font-weight: bold">
          ${getRelativeTime(element.date)}
      </p>

      <p>- ${element.challenge}</p>

      <img
        width="100%"
        style="
          height: 200px;
          border-radius: 0.5rem;
          object-fit: cover;
          aspect-ratio: 16/9;
        "
        src=${element.proofImage}
        alt=${element.challenge + " proof image"}
       />
    `;
      this.recentListUL.appendChild(li);
    });
  }
}
