export class Timer {
  constructor(timerNode) {
    this.timerNode = timerNode;
    this.timerInterval = null;
    this.seconds = 0;
    this.minutes = 0;
  }

  start(minutes, seconds) {
    if (minutes) this.minutes = minutes;
    if (seconds) this.seconds = seconds;
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
  }

  pause() {
    clearInterval(this.timerInterval);
  }

  reset() {
    clearInterval(this.timerInterval);
    this.seconds = -1;
    this.minutes = 0;
    this.updateTimer();
  }

  updateTimer() {
    this.seconds++;

    if (this.seconds === 60) {
      this.seconds = 0;
      this.minutes++;
    }

    if (this.minutes === 60) {
      this.minutes = 0;
    }

    this.timerNode.textContent = this.#formatTime();
  }

  #formatTime() {
    return (
      String(this.minutes).padStart(2, "0") +
      ":" +
      String(this.seconds).padStart(2, "0")
    );
  }
}
