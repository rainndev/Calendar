import challenges from "../data/daily-challenge.json";
import type { DailyChallenge } from "../types/daily-challenge.type";
import { getRelativeTime } from "../utils/time";
import { Animate } from "./Animate";
import type { MainUI } from "./MainUI";
import { SoundEffect } from "./SoundEffect";

export class DailyChallengeUI {
  mainUI: MainUI;
  dailyChallengeText: HTMLParagraphElement;
  input: HTMLInputElement;
  uploadText: HTMLSpanElement;
  finishChallengeButton: HTMLButtonElement;
  recentListUL: HTMLUListElement;
  noChallengeUI: HTMLElement;
  imageChallengePreview: HTMLImageElement;

  imageBase64: string = "";
  todayDate: Date = new Date();
  todayChallenge: string = "";

  constructor(mainUI: MainUI) {
    const $ = <T extends HTMLElement>(id: string) =>
      document.getElementById(id) as T;

    this.mainUI = mainUI;
    this.dailyChallengeText = $("daily-challenge-text");
    this.input = $("imageInput");
    this.uploadText = $("upload-image-text");
    this.finishChallengeButton = $("finish-challenge-btn");
    this.recentListUL = $("recent-challenges-list");
    this.noChallengeUI = $("no-challenge-ui");
    this.imageChallengePreview = $("challenge-image-preview");

    this.input.addEventListener("change", () => {
      SoundEffect.playShow();
      const file = this.input.files?.[0];
      if (!file) return;

      this.uploadText.textContent = file.name;

      const reader = new FileReader();

      reader.onload = () => {
        this.imageBase64 = reader.result as string;
        this.imageChallengePreview.src = this.imageBase64;
      };

      reader.readAsDataURL(file);
    });

    this.finishChallengeButton.addEventListener("click", () => {
      SoundEffect.playClick();
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

      this.input.value = "";
      this.uploadText.textContent = "Upload proof image";
      this.imageChallengePreview.src = "./image-solid.svg";
    });
  }

  render() {
    this.showTodayChallenge();
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
    if (localStorage.getItem("dailyChallenge")) {
      this.noChallengeUI.style.display = "none";
      this.recentListUL.style.display = "block";
    } else {
      this.noChallengeUI.style.display = "flex";
      this.recentListUL.style.display = "none";
    }

    const dailyChallengeData = localStorage.getItem("dailyChallenge")
      ? (JSON.parse(
          localStorage.getItem("dailyChallenge")!,
        ) as DailyChallenge[])
      : [];

    this.recentListUL.innerHTML = "";
    dailyChallengeData
      .slice()
      .reverse() // newest first
      .slice(0, 20) // limit to 10
      .forEach((element) => {
        const li = document.createElement("li");

        li.innerHTML = `
      <p class="list-style-header" style="font-weight: bold">
        ${getRelativeTime(element.date)}
      </p>
      <p>- ${element.challenge}</p>
    `;

        this.recentListUL.appendChild(li);
      });
  }
}
