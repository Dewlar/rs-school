import Header from './header';
import './chat.scss';

export default class Chat {
  private readonly container: HTMLDivElement;

  private readonly chat: HTMLDivElement;

  private header: Header;

  constructor() {
    this.container = document.createElement('div');
    this.chat = document.createElement('div');
    this.header = new Header();
    this.setAttribute();
  }

  setAttribute() {
    this.container.className = 'chat-container';
    this.chat.className = 'chat-wrapper';
  }

  get chatElements() {
    return {
      header: this.header.headerElements,
      container: this.container,
    };
  }

  render(userName: string) {
    this.chat.append(this.header.render(userName));
    this.container.append(this.chat);
    return this.container;
  }
}
