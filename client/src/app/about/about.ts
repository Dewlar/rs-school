import Button from '../components/button';
import './about.scss';

export default class About {
  private readonly about: HTMLDivElement;

  private readonly title: HTMLHeadingElement;

  private readonly message: HTMLParagraphElement;

  private readonly author: HTMLAnchorElement;

  private readonly container: HTMLDivElement;

  private buttonReturn: Button;

  constructor() {
    this.container = document.createElement('div');
    this.about = document.createElement('div');
    this.title = document.createElement('h3');
    this.message = document.createElement('p');
    this.author = document.createElement('a');

    this.buttonReturn = new Button('Return');
    this.setAttribute();
  }

  setAttribute() {
    this.container.className = 'about-container hidden';
    this.about.className = 'about-wrapper';
    this.title.className = 'about-title';
    this.title.textContent = 'Fun chat';
    this.message.textContent = `The application is designed to demonstrate the Fun Chat task as part of the RSSchool JS/FE 2023Q3 course`;
    this.author.textContent = `Dewlar`;
    this.author.href = `https://github.com/Dewlar`;
    this.author.className = 'author-link';
    this.author.target = '_blank';
  }

  get aboutElements() {
    return {
      container: this.container,
      buttonReturn: this.buttonReturn.node,
    };
  }

  render() {
    this.about.append(this.title, this.message, this.author, this.buttonReturn.node);
    this.container.append(this.about);
    setTimeout(() => this.container.classList.remove('hidden'), 200);
    return this.container;
  }
}
