import Input from '../components/input';
import './user-list.scss';

export default class UserList {
  private readonly userList: HTMLDivElement;

  private readonly list: HTMLUListElement;

  private readonly li: HTMLLIElement;

  private filter: Input;

  private readonly dot: HTMLDivElement;

  private readonly userLogin: HTMLSpanElement;

  constructor() {
    this.userList = document.createElement('div');
    this.list = document.createElement('ul');
    this.li = document.createElement('li');
    this.dot = document.createElement('div');
    this.userLogin = document.createElement('span');

    this.filter = new Input('text');
    this.setAttribute();
  }

  setAttribute() {
    this.userList.className = 'user-list';
    this.list.className = 'list';
    this.li.className = 'list-item';
    this.filter.node.className = 'filter';
    this.filter.node.placeholder = 'filter';
    this.dot.className = 'dot';
    this.userLogin.className = 'user-login';
    this.userLogin.textContent = 'user-login';
  }

  get userListElements() {
    return {
      userList: this.list,
      filter: this.filter.node,
    };
  }

  render() {
    this.li.append(this.dot, this.userLogin);
    this.list.append(this.li);

    this.userList.append(this.filter.node, this.list);
    return this.userList;
  }
}
