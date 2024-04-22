import Header from './header';
import Footer from './footer';
import './chat.scss';

export default class Chat {
  private readonly container: HTMLDivElement;

  private readonly chat: HTMLDivElement;

  private header: Header;

  private footer: Footer;

  constructor() {
    this.container = document.createElement('div');
    this.chat = document.createElement('div');
    this.header = new Header();
    this.footer = new Footer();
    this.setAttribute();
  }

  setAttribute() {
    this.container.className = 'chat-container hidden';
    // this.container.classList.add('hidden');
    this.chat.className = 'chat-wrapper';
  }

  get chatElements() {
    return {
      header: this.header.headerElements,
      container: this.container,
    };
  }

  render(userName: string) {
    this.chat.append(this.header.render(userName), this.footer.render());
    this.container.append(this.chat);
    return this.container;
  }
}
