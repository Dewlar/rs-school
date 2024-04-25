import User from './user';
import WebSocketManager from './webSocket-manager';
import { getFormatedDate, USER_STORAGE_DATA_KEY } from './models/const';
import LoginForm from './login/login';
import Chat from './chat/chat';
import About from './about/about';
import './app.scss';
import ErrorMessage from './components/error-message';
import UserListItem from './chat/user-list-item';
import { IMessage, IUserAuth } from './models/models';
import Message from './chat/message';

export default class ChatApp {
  private currentUser: User | null;

  private sendTo: User | null;

  private websocketManager: WebSocketManager;

  private readonly sessionStorageData: string | null;

  private loginForm: LoginForm;

  private chat: Chat;

  private readonly user: User;

  private about: About;

  private readonly errorBox: HTMLDivElement;

  private usersList: UserListItem[];

  private historyMessages: Message[];

  constructor() {
    this.loginForm = new LoginForm();
    this.currentUser = null;
    this.sendTo = null;
    this.websocketManager = new WebSocketManager('ws://localhost:4000');
    this.sessionStorageData = sessionStorage.getItem(USER_STORAGE_DATA_KEY);
    this.user = new User('', '');
    this.chat = new Chat();
    this.about = new About();
    this.addEventListeners();
    this.errorBox = document.createElement('div');
    this.errorBox.className = 'error-box';
    document.body.append(this.errorBox);
    this.usersList = [];
    this.historyMessages = [];
  }

  init(): void {
    this.websocketManager.onOpen(() => {
      console.log('WebSocket opened');
      this.loginFormSubmit();
    });
    const { login = '', password = '' } = JSON.parse(this.sessionStorageData ?? '{}');
    this.user.setLogin(login);
    this.user.setPassword(password);
    // console.log('vvv: ', this.user, password);
    if (!this.user.getPassword()) {
      // console.log('abc');
      document.body.append(this.loginForm.render());
    } else {
      document.body.append(this.chat.render(this.user.getLogin()));
    }
    this.websocketManager.onMessage((e: MessageEvent) => {
      const { type, payload } = JSON.parse(e.data);
      // console.log('connect%%%%%', type, payload);
      switch (type) {
        case 'USER_LOGIN':
          // console.log('*****', type, payload.user.isLogined);
          if (payload.user.isLogined) {
            this.loginUserApply();
          }
          break;
        case 'USER_LOGOUT':
          // console.log('*****', type, payload.user.isLogined);
          if (!payload.user.isLogined) {
            this.logoutUserApply();
          }
          break;
        case 'USER_ACTIVE':
          console.log('active*****: ', type, payload.users);
          this.chat.chatElements.userList.userList.append(...this.createUserList(payload.users));
          // this.usersList.forEach((user) => user.elements.dot.classList.add('green'));
          this.usersList.forEach((user) => user.setIsLogined(true));
          break;
        case 'USER_INACTIVE':
          console.log('inActive*****:', type, payload.users);
          this.chat.chatElements.userList.userList.append(...this.createUserList(payload.users));
          break;
        case 'USER_EXTERNAL_LOGIN':
          console.log('USER_EXTERNAL_LOGIN!!!', payload.user.login);
          if (this.usersList.findIndex((user) => user.elements.userLogin.textContent === payload.user.login) === -1) {
            const newUser = new UserListItem(payload.user.login, payload.user.isLogined);
            this.usersList.push(newUser);
            this.chat.chatElements.userList.userList.innerHTML = '';
            this.chat.chatElements.userList.userList.append(...this.updateUsersList(this.usersList));
          }
          this.usersList.forEach((user) => {
            // if (user.elements.userLogin.textContent === payload.user.login) user.elements.dot.classList.add('green');
            if (user.elements.userLogin.textContent === payload.user.login) user.setIsLogined(true);
            if (this.chat.chatElements.dialog.userName.textContent === payload.user.login) {
              this.updateChat(payload.user.login);
            }
          });
          break;
        case 'USER_EXTERNAL_LOGOUT':
          console.log('USER_EXTERNAL_LOGOUT!!!', payload.user.login);
          this.usersList.forEach((user) => {
            // if (user.elements.userLogin.textContent === payload.user.login) user.elements.dot.classList.remove('green');
            if (user.elements.userLogin.textContent === payload.user.login) user.setIsLogined(false);
            if (this.chat.chatElements.dialog.userName.textContent === payload.user.login) {
              this.updateChat(payload.user.login);
            }
          });
          break;
        case 'MSG_SEND':
          // console.log('!!!!!!', payload.message);
          // console.log('!!!!!!!!!! - update-chat');
          this.createMessage(payload.message);
          // this.chat.chatElements.dialog.dialog.innerHTML = '';
          // this.chat.chatElements.dialog.dialog.append(...this.historyMessages.map((msg) => msg.render()));
          this.updateChat(
            this.chat.chatElements.dialog.userName.textContent ? this.chat.chatElements.dialog.userName.textContent : ''
          );
          break;
        case 'MSG_FROM_USER':
          // console.log('message from user: ', payload.messages[0]);
          this.historyMessages = [];
          payload.messages.forEach((msg: IMessage) => this.createMessage(msg));
          // this.chat.chatElements.dialog.dialog.innerHTML = '';
          // this.chat.chatElements.dialog.dialog.append(...this.historyMessages.map((msg) => msg.render()));
          // this.readMessages();
          this.updateChat(
            this.chat.chatElements.dialog.userName.textContent ? this.chat.chatElements.dialog.userName.textContent : ''
          );
          // console.log('zaraza', this.chat.chatElements.dialog.userName.textContent);
          break;
        case 'ERROR':
          // console.log(payload.error);
          this.errorBox.append(new ErrorMessage(payload.error).node);
          break;
        default:
        // console.log('Unhandled message type:', type);
      }
    });
  }

  private createMessage(msg: IMessage) {
    const { id, from, datetime, text, status, to } = msg;
    const message = new Message(
      id,
      from,
      to,
      getFormatedDate(datetime),
      text,
      status.isDelivered,
      status.isReaded,
      status.isEdited
    );
    if (from === this.user.getLogin()) {
      message.elements.container.style.justifyContent = 'flex-end';
      message.elements.message.style.borderRadius = '1rem 0 1rem 1rem';
    } else {
      message.elements.container.style.justifyContent = 'flex-start';
      message.elements.message.style.borderRadius = '0 1rem 1rem 1rem';
    }
    this.historyMessages.push(message);
  }

  private createUserList(users: IUserAuth[]) {
    const list = users
      .filter((user: IUserAuth) => user.login !== this.user.getLogin())
      .map((user: IUserAuth) => new UserListItem(user.login, user.isLogined));

    this.usersList.push(...list);

    return this.updateUsersList(list);
  }

  private addEventListeners(): void {
    this.loginForm.formElements.button.addEventListener('click', this.loginFormSubmit.bind(this));
    this.chat.chatElements.header.buttonLogout.addEventListener('click', this.logoutHandler.bind(this));
    this.chat.chatElements.header.buttonInfo.addEventListener('click', this.aboutHandler.bind(this));
    this.about.aboutElements.buttonReturn.addEventListener('click', this.aboutReturnHandler.bind(this));
    this.chat.chatElements.userList.filter.addEventListener('input', this.userFilterHandler.bind(this));
    this.chat.chatElements.dialog.buttonSubmit.node.addEventListener('click', this.sendMessageSubmit.bind(this));
    this.chat.chatElements.dialog.input.node.addEventListener('keypress', this.sendMessageSubmit.bind(this));
    this.chat.chatElements.dialog.input.node.addEventListener('click', this.selectUser.bind(this));
    this.chat.chatElements.dialog.container.addEventListener('click', this.selectUser.bind(this));
  }

  private userFilterHandler() {
    // console.log(this.chat.chatElements.userList.filter.value);
    const searchString = this.chat.chatElements.userList.filter.value.toLowerCase();
    const updateList = this.usersList.filter((user) =>
      user.elements.userLogin.textContent
        ? user.elements.userLogin.textContent.toLowerCase().includes(searchString)
        : ''
    );
    this.chat.chatElements.userList.userList.innerHTML = '';
    this.chat.chatElements.userList.userList.append(...this.updateUsersList(updateList));
  }

  private aboutReturnHandler() {
    this.about.aboutElements.container.classList.add('hidden');
    setTimeout(() => {
      this.about.aboutElements.container.remove();
      document.body.append(this.chat.render(this.user.getLogin()));
      this.updateChat('');
    }, 200);
  }

  private aboutHandler() {
    this.chat.chatElements.container.classList.add('hidden');
    setTimeout(() => {
      this.chat.chatElements.container.remove();
      document.body.append(this.about.render());
    }, 200);

    this.cleanInput();
  }

  private logoutHandler() {
    // console.log('logout', this.user);
    this.websocketManager.send(
      JSON.stringify({
        id: '1',
        type: 'USER_LOGOUT',
        payload: { user: this.user },
      })
    );
  }

  private logoutUserApply() {
    sessionStorage.removeItem(USER_STORAGE_DATA_KEY);
    this.chat.chatElements.userList.userList.innerHTML = '';
    this.updateChat('');

    this.chat.chatElements.container.classList.add('hidden');
    setTimeout(() => {
      this.chat.chatElements.container.remove();
      document.body.append(this.loginForm.render());
    }, 200);
  }

  private loginFormSubmit(event?: Event) {
    if (event) event.preventDefault();
    const loginValue = this.loginForm.formElements.login.value.trim();
    const passwordValue = this.loginForm.formElements.password.value.trim();

    if (loginValue && passwordValue) {
      this.user.setLogin(loginValue);
      this.user.setPassword(passwordValue);
    }
    // console.log('loginsubmit', this.user);

    if (this.user.getLogin() && this.user.getPassword()) {
      this.websocketManager.send(
        JSON.stringify({
          id: '1',
          type: 'USER_LOGIN',
          payload: { user: this.user },
        })
      );
    }
  }

  private loginUserApply() {
    sessionStorage.setItem(USER_STORAGE_DATA_KEY, JSON.stringify(this.user));
    this.websocketManager.send(JSON.stringify({ id: '1', type: 'USER_ACTIVE', payload: null }));
    this.websocketManager.send(JSON.stringify({ id: '1', type: 'USER_INACTIVE', payload: null }));
    this.loginForm.formElements.container.classList.add('hidden');
    // this.loginForm.formElements.login.value = '';
    // this.loginForm.formElements.password.value = '';
    this.cleanInput();
    setTimeout(() => {
      this.loginForm.formElements.container.remove();
      document.body.append(this.chat.render(this.user.getLogin()));
    }, 200);
  }

  private updateUsersList(list: UserListItem[]): HTMLLIElement[] {
    // console.log('Update users', list);
    const listNode = list.map((user) => user.render());
    listNode.forEach((userNode) => userNode.addEventListener('click', this.selectUser.bind(this)));
    return listNode;
  }

  // private readMessages() {
  //   this.historyMessages.forEach((message) => {
  //     if (message.elements.from.textContent !== this.user.getLogin()) {
  //       this.websocketManager.send(
  //         JSON.stringify({
  //           id: '1',
  //           type: 'MSG_READ',
  //           payload: { message: { id: message.elements.id } },
  //         })
  //       );
  //     }
  //   });
  //   this.selectUser();
  // }

  private selectUser(event?: Event) {
    let target;
    let userLogin;
    if (event) {
      target = event.currentTarget as HTMLElement;
      userLogin = target.getAttribute('data-login') || this.chat.chatElements.dialog.userName.textContent;
      // console.log('selectUser', userLogin);
    } else {
      userLogin = this.chat.chatElements.dialog.userName.textContent
        ? this.chat.chatElements.dialog.userName.textContent
        : '';
    } // todo: refactor this sh*t code
    // console.log('select user - login -> ', userLogin, this.chat.chatElements.dialog.userName.textContent);

    this.historyMessages.forEach((message) => {
      if (message.elements.from.textContent !== this.user.getLogin()) {
        this.websocketManager.send(
          JSON.stringify({
            id: '1',
            type: 'MSG_READ',
            payload: { message: { id: message.elements.id } },
          })
        );
      }
    });

    this.chat.chatElements.dialog.dialog.innerHTML = '';
    if (userLogin) {
      this.websocketManager.send(
        JSON.stringify({
          id: '1',
          type: 'MSG_FROM_USER',
          payload: { user: { login: `${userLogin}` } },
        })
      );
      this.updateChat(userLogin);
    }
    this.cleanInput();
  }

  private updateChat(userLogin: string): void {
    // console.log('update-chat: ', userLogin);
    if (userLogin) {
      const [userNameDialog] = this.usersList.filter((user) => user.elements.userLogin.textContent === userLogin);
      this.chat.chatElements.dialog.userName.textContent = userLogin;
      // console.log(userNameDialog.elements.isLogined);
      if (userNameDialog.elements.isLogined) {
        this.chat.chatElements.dialog.userStatus.textContent = 'online';
        this.chat.chatElements.dialog.userStatus.style.color = 'green';
      } else {
        this.chat.chatElements.dialog.userStatus.textContent = 'offline';
        this.chat.chatElements.dialog.userStatus.style.color = 'red';
      }
      this.chat.chatElements.dialog.input.enable();
      this.chat.chatElements.dialog.buttonSubmit.enable();
      this.chat.chatElements.dialog.dialog.innerHTML = '';
      this.chat.chatElements.dialog.dialog.append(...this.historyMessages.map((msg) => msg.render()));
      this.chat.chatElements.dialog.dialog.scrollTo(0, this.chat.chatElements.dialog.dialog.scrollHeight);
    } else {
      this.chat.chatElements.dialog.input.disable();
      this.chat.chatElements.dialog.buttonSubmit.disable();
      this.chat.chatElements.dialog.userName.textContent = '';
      this.chat.chatElements.dialog.userStatus.textContent = '';
      this.chat.chatElements.dialog.dialog.innerHTML = '';
      // this.chat.chatElements.dialog.initialMessage.remove();
      // console.log('чат ощичен');
    }
  }

  private sendMessageHandler() {
    const message = this.chat.chatElements.dialog.input.node.value;
    if (message) {
      // console.log(message);
      this.websocketManager.send(
        JSON.stringify({
          id: '1',
          type: 'MSG_SEND',
          payload: { message: { to: `${this.chat.chatElements.dialog.userName.textContent}`, text: `${message}` } },
        })
      );
    }
    // this.updateChat(this.user.getLogin());
    this.cleanInput();
  }

  private sendMessageSubmit(event?: KeyboardEvent | MouseEvent) {
    if (event && event instanceof KeyboardEvent && event.key === 'Enter') {
      this.sendMessageHandler();
    }
    if (event && event instanceof MouseEvent) {
      this.sendMessageHandler();
    }
  }

  private cleanInput() {
    this.chat.chatElements.dialog.input.node.value = '';
    this.loginForm.formElements.login.value = '';
    this.loginForm.formElements.password.value = '';
  }
}
