export default class Button {
  private readonly button: HTMLButtonElement;

  constructor(text: string, className?: string) {
    this.button = document.createElement('button');
    this.addButtonText(text);
    if (className) {
      this.addClass(className);
    }
  }

  disabled() {
    this.button.disabled = true;
  }

  enabled() {
    this.button.disabled = false;
  }

  private addButtonText(text: string) {
    this.button.textContent = text;
  }

  private addClass(className: string) {
    this.button.className = className;
  }

  get node() {
    return this.button;
  }
}
