import './footer.scss';

export default class Footer {
  private readonly logo: HTMLSpanElement;

  private readonly footer: HTMLDivElement;

  private readonly year: HTMLSpanElement;

  private readonly author: HTMLSpanElement;

  constructor() {
    this.footer = document.createElement('div');
    this.logo = document.createElement('span');
    this.author = document.createElement('span');
    this.year = document.createElement('span');
    this.setAttribute();
  }

  setAttribute() {
    this.footer.className = 'footer';
    this.logo.textContent = 'RSSchool';
    this.author.textContent = 'Dewlar';
    this.year.textContent = `2024`;
  }

  get headerElements() {
    return {
      footer: this.footer,
    };
  }

  render() {
    this.footer.append(this.logo, this.author, this.year);
    return this.footer;
  }
}
