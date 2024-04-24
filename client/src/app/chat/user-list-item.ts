import './user-list-item.scss';

export default class UserListItem {
  private readonly li: HTMLLIElement;

  private readonly dot: HTMLDivElement;

  private readonly userLogin: HTMLSpanElement;

  constructor(
    private login: string,
    private isLogined: boolean
  ) {
    this.li = document.createElement('li');
    this.dot = document.createElement('div');
    this.userLogin = document.createElement('span');
    this.setAttribute();
    this.changeOnlineStatus(this.isLogined);
  }

  setAttribute() {
    this.li.className = 'list-item';
    this.dot.className = 'dot';
    this.userLogin.className = 'user-login';
    this.userLogin.textContent = `${this.login}`;
    this.li.setAttribute('data-login', this.login);
  }

  setIsLogined(value: boolean) {
    this.isLogined = value;
    this.changeOnlineStatus(this.isLogined);
  }

  private changeOnlineStatus(isOnline: boolean) {
    if (isOnline) this.dot.classList.add('green');
    else this.dot.classList.remove('green');
  }

  get elements() {
    return {
      li: this.li,
      dot: this.dot,
      userLogin: this.userLogin,
      isLogined: this.isLogined,
    };
  }

  render() {
    this.li.append(this.dot, this.userLogin);
    return this.li;
  }
}
