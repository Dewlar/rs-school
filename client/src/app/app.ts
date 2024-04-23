import User from './user';
import WebSocketManager from './webSocket-manager';
import { USER_STORAGE_DATA_KEY } from './models/const';
import LoginForm from './login/login';
import Chat from './chat/chat';
import About from './about/about';
import './app.scss';
import ErrorMessage from './components/error-message';

export default class ChatApp {
  private currentUser: User | null;

  private sendTo: User | null;

  private websocketManager: WebSocketManager;

  private readonly sessionStorageData: string | null;

  private loginForm: LoginForm;

  private chat: Chat;

  private readonly user: User;

  private about: About;

  private errorBox: HTMLDivElement;

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
  }

  init(): void {
    this.websocketManager.onOpen(() => {
      console.log('WebSocket opened');
      this.loginFormSubmit();
    });
    const { login = '', password = '' } = JSON.parse(this.sessionStorageData ?? '{}');
    this.user.setLogin(login);
    this.user.setPassword(password);
    console.log('vvv: ', this.user, password);
    if (!this.user.getPassword()) {
      // console.log('abc');
      document.body.append(this.loginForm.render());
    } else {
      document.body.append(this.chat.render(this.user.getLogin()));
    }
    this.websocketManager.onMessage((e: MessageEvent) => {
      const { type, payload } = JSON.parse(e.data);
      console.log('%%%%%', type, payload);
      switch (type) {
        case 'USER_LOGIN':
          console.log('*****', type, payload.user.isLogined);
          if (payload.user.isLogined) {
            this.loginUserApply();
          }
          break;
        case 'USER_LOGOUT':
          console.log('*****', type, payload.user.isLogined);
          if (!payload.user.isLogined) {
            this.logoutUserApply();
          }
          break;
        case 'USER_ACTIVE':
          console.log('*****', type, payload.users);
          break;
        case 'USER_INACTIVE':
          console.log('*****', type, payload.users);
          break;
        case 'USER_EXTERNAL_LOGIN':
          console.log('USER_EXTERNAL_LOGIN!!!', payload.user.login);
          break;
        case 'USER_EXTERNAL_LOGOUT':
          console.log('USER_EXTERNAL_LOGOUT!!!', payload.user.login);
          break;
        case 'MSG_SEND':
          console.log('!!!!!!', payload.message.text);
          break;
        case 'MSG_FROM_USER':
          console.log(payload.messages);
          break;
        case 'ERROR':
          console.log(payload.error);
          this.errorBox.append(new ErrorMessage(payload.error).node);
          break;
        default:
          console.log('Unhandled message type:', type);
      }
    });
  }

  private addEventListeners(): void {
    this.loginForm.formElements.button.addEventListener('click', this.loginFormSubmit.bind(this));
    this.chat.chatElements.header.buttonLogout.addEventListener('click', this.logoutHandler.bind(this));
    this.chat.chatElements.header.buttonInfo.addEventListener('click', this.aboutHandler.bind(this));
    this.about.aboutElements.buttonReturn.addEventListener('click', this.aboutReturnHandler.bind(this));
  }

  private aboutReturnHandler() {
    this.about.aboutElements.container.classList.add('hidden');
    setTimeout(() => {
      this.about.aboutElements.container.remove();
      document.body.append(this.chat.render(this.user.getLogin()));
    }, 200);
  }

  private aboutHandler() {
    this.chat.chatElements.container.classList.add('hidden');
    setTimeout(() => {
      this.chat.chatElements.container.remove();
      document.body.append(this.about.render());
    }, 200);
  }

  private logoutHandler() {
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

    this.websocketManager.send(
      JSON.stringify({
        id: '1',
        type: 'USER_LOGIN',
        payload: { user: this.user },
      })
    );
  }

  private loginUserApply() {
    sessionStorage.setItem(USER_STORAGE_DATA_KEY, JSON.stringify(this.user));
    this.loginForm.formElements.container.classList.add('hidden');
    this.loginForm.formElements.login.value = '';
    this.loginForm.formElements.password.value = '';
    setTimeout(() => {
      this.loginForm.formElements.container.remove();
      document.body.append(this.chat.render(this.user.getLogin()));
    }, 200);
  }

  updateUsers(userData: string, isLogined: boolean): void {
    console.log('Update users', userData, isLogined);
  }

  selectElement(query: string): HTMLElement {
    const element = document.querySelector(query);
    if (!(element instanceof HTMLElement)) {
      throw new Error(`Element is not an instance of HTMLElement! ${query}`);
    }
    return element;
  }

  updateChat(data: string): void {
    console.log('updateChat', data);
  }
}
