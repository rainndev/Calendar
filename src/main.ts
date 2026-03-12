import challenges from "./data/daily-challenge.json";
import { MainUI } from "./js/MainUI";

const mainUI = new MainUI();
mainUI.render();

const dailyChallengeText = document.getElementById(
  "daily-challenge-text",
) as HTMLParagraphElement;

const today = new Date().toDateString();

const index =
  today.split("").reduce((a, b) => a + b.charCodeAt(0), 0) % challenges.length;

const todayChallenge = challenges[index];

dailyChallengeText!.textContent = todayChallenge;
