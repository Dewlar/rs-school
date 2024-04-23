import './error-message.scss';

export default class ErrorMessage {
  private readonly error: HTMLDivElement;

  constructor(private message: string) {
    this.error = document.createElement('div');
    this.setAttribute();
    setTimeout(() => this.error.remove(), 2500);
  }

  private setAttribute() {
    this.error.textContent = this.message;
    this.error.className = 'error-message';
  }

  get node() {
    return this.error;
  }
}
