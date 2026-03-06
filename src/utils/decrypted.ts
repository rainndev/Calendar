export const decryptText = (el: HTMLElement, finalText: string) => {
  const chars = "0123456789";
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
