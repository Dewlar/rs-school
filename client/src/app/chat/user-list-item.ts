import './user-list-item.scss';

export default class UserListItem {
  private readonly li: HTMLLIElement;

  private readonly dot: HTMLDivElement;

  private readonly userLogin: HTMLSpanElement;

  constructor(private login: string) {
    this.li = document.createElement('li');
    this.dot = document.createElement('div');
    this.userLogin = document.createElement('span');
    this.setAttribute();
  }

  setAttribute() {
    this.li.className = 'list-item';
    this.dot.className = 'dot';
    this.userLogin.className = 'user-login';
    this.userLogin.textContent = `${this.login}`;
  }

  get elements() {
    return {
      li: this.li,
      dot: this.dot,
      userLogin: this.userLogin,
    };
  }

  render() {
    this.li.append(this.dot, this.userLogin);
    return this.li;
  }
}
