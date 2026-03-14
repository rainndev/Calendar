import { animate, stagger } from "motion";

export class Animate {
  static animateListStagger(element: string) {
    animate(
      element,
      {
        scale: [0, 1],
        transform: ["translateY(20px)", "translateY(0px)"],
        opacity: [0, 1],
      },
      {
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay: stagger(0.02),
      },
    );
  }

  static async exitListStagger(element: string) {
    await animate(
      element,
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
  }

  static decryptionAnimation = (el: HTMLElement, finalText: string) => {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?";
    let iterations = 0;

    const interval = setInterval(() => {
      el.innerText = finalText
        .split("")
        .map((_, index) => {
          if (index < iterations) {
            return finalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iterations >= finalText.length) {
        clearInterval(interval);
      }

      iterations += 0.5;
    }, 50);
  };

  static popUpAnimation(el: HTMLElement) {
    animate(
      el,
      {
        scale: [0, 1],
        opacity: [0, 1],
      },
      {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    );
  }

  static popDownAnimation(el: HTMLElement) {
    animate(
      el,
      {
        scale: [1, 0],
        opacity: [1, 0],
      },
      {
        duration: 0.3,
      },
    );
  }

  static slideUpFadeInAnimation(el: HTMLElement) {
    animate(
      el,
      {
        opacity: [0, 1],
        y: [50, 0],
      },
      {
        duration: 0.1,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    );
  }

  static slideDownFadeOutAnimation(el: HTMLElement) {
    animate(
      el,
      {
        y: [0, 50],
        opacity: [1, 0],
      },
      {
        duration: 0.1,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    );
  }
}
