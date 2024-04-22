import Button from '../components/button';
import './header.scss';

export default class Header {
  private readonly user: HTMLSpanElement;

  private readonly header: HTMLDivElement;

  private buttonLogout: Button;

  private buttonInfo: Button;

  private readonly title: HTMLSpanElement;

  constructor() {
    this.header = document.createElement('div');
    this.user = document.createElement('span');
    this.title = document.createElement('span');

    this.buttonLogout = new Button('Logout');
    this.buttonInfo = new Button('Info');
    this.setAttribute();
  }

  setAttribute() {
    this.header.className = 'header';
    this.user.className = 'user-name';
    this.title.className = 'title';
    this.title.textContent = `Fun chat`;
  }

  get headerElements() {
    return {
      buttonInfo: this.buttonInfo.node,
      buttonLogout: this.buttonLogout.node,
    };
  }

  render(name: string) {
    this.user.textContent = `User: ${name}`;

    this.header.append(this.user, this.title, this.buttonInfo.node, this.buttonLogout.node);
    return this.header;
  }
}
