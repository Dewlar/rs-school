export default class Button {
  private readonly button: HTMLButtonElement;

  constructor(
    private buttonName: string,
    private className?: string
  ) {
    this.button = document.createElement('button');
    this.addButtonText();
    this.addClass();
  }

  disable() {
    this.button.disabled = true;
  }

  enable() {
    this.button.disabled = false;
  }

  private addButtonText() {
    this.button.textContent = this.buttonName;
  }

  private addClass() {
    if (this.className) this.button.className = this.className;
  }

  get node() {
    return this.button;
  }
}
