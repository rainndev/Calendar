export class SoundEffect {
  private static clickSoundEffect: HTMLAudioElement = new Audio(
    "./sounds/hit-sound-effect.mp3",
  );
  private static showSoundEffect: HTMLAudioElement = new Audio(
    "./sounds/show-effect.mp3",
  );
  static keyboardSoundEffect: HTMLAudioElement = new Audio(
    "./sounds/keyboard-sound-effect.mp3",
  );
  private static bgMusic: HTMLAudioElement = new Audio("./sounds/bg-music.mp3");

  static initialize(volume: number = 1) {
    SoundEffect.clickSoundEffect.volume = volume;
    SoundEffect.showSoundEffect.volume = volume;
    SoundEffect.keyboardSoundEffect.volume = volume;
    SoundEffect.bgMusic.play();
    SoundEffect.bgMusic.volume = volume * 0.15;
    SoundEffect.bgMusic.loop = true;
    SoundEffect.bgMusic.muted = true;
  }

  static playClick() {
    SoundEffect.clickSoundEffect.currentTime = 0;
    SoundEffect.clickSoundEffect.play();
  }

  static playShow() {
    SoundEffect.showSoundEffect.currentTime = 0;
    SoundEffect.showSoundEffect.play();
  }

  static playKeyboard() {
    SoundEffect.keyboardSoundEffect.currentTime = 0;
    SoundEffect.keyboardSoundEffect.play();
  }

  static playBgMusic() {
    if (SoundEffect.bgMusic.paused) {
      SoundEffect.bgMusic.muted = false;
      SoundEffect.bgMusic.play();
    }
  }

  static muteAllSoundEffect(muted: boolean) {
    SoundEffect.clickSoundEffect.muted = muted;
    SoundEffect.showSoundEffect.muted = muted;
    SoundEffect.keyboardSoundEffect.muted = muted;
  }

  static muteBgMusic(muted: boolean) {
    SoundEffect.bgMusic.muted = muted;
  }
}
