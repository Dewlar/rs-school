export default class Input {
  private readonly input: HTMLInputElement;

  constructor(
    private type: string,
    private className?: string
  ) {
    this.input = document.createElement('input');
    this.addType();
    this.addClass();
  }

  private addType() {
    this.input.type = this.type;
  }

  private addClass() {
    if (this.className) this.input.className = this.className;
  }

  enable() {
    this.input.disabled = false;
  }

  disable() {
    this.input.disabled = true;
  }

  get node() {
    return this.input;
  }
}
