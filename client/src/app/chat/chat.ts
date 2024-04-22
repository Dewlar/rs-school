import Header from './header';
import Footer from './footer';
import UserList from './user-list';
import './chat.scss';

export default class Chat {
  private readonly container: HTMLDivElement;

  private readonly chat: HTMLDivElement;

  private header: Header;

  private footer: Footer;

  private readonly chatContent: HTMLDivElement;

  private userList: UserList;

  constructor() {
    this.container = document.createElement('div');
    this.chat = document.createElement('div');
    this.chatContent = document.createElement('div');
    this.header = new Header();
    this.footer = new Footer();
    this.userList = new UserList();
    this.setAttribute();
  }

  setAttribute() {
    this.container.className = 'chat-container hidden';
    this.chatContent.className = 'chat-content';
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
    this.chatContent.append(this.userList.render());
    this.chat.append(this.header.render(userName), this.chatContent, this.footer.render());
    this.container.append(this.chat);
    setTimeout(() => this.container.classList.remove('hidden'), 200);
    return this.container;
  }
}
