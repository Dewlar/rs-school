import User from './user';
import WebSocketManager from './webSocket-manager';
import { USER_STORAGE_DATA_KEY } from './models/const';
import LoginForm from './login/login';
import Chat from './chat/chat';

export default class ChatApp {
  private currentUser: User | null;

  private sendTo: User | null;

  private websocketManager: WebSocketManager;

  private readonly sessionStorageData: string | null;

  private loginForm: LoginForm;

  private chat: Chat;

  private user: User;

  constructor() {
    this.loginForm = new LoginForm();
    this.currentUser = null;
    this.sendTo = null;
    this.websocketManager = new WebSocketManager('ws://localhost:4000');
    this.sessionStorageData = sessionStorage.getItem(USER_STORAGE_DATA_KEY);
    this.user = new User('', '');
    this.chat = new Chat();
    this.addEventListeners();
  }

  init(): void {
    const { login = '', password = '' } = JSON.parse(this.sessionStorageData ?? '{}');
    this.user.setLogin(login);
    this.user.setPassword(password);
    console.log('vvv: ', this.user);
    if (!this.sessionStorageData) {
      document.body.append(this.loginForm.render());
      setTimeout(() => this.loginForm.formElements.container.classList.remove('hidden'), 200);
    } else {
      document.body.append(this.chat.render(this.user.getLogin()));
      setTimeout(() => this.chat.chatElements.container.classList.remove('hidden'), 200);
    }
    this.websocketManager.onOpen(() => {
      console.log('WebSocket opened');
    });
  }

  private addEventListeners(): void {
    this.loginForm.formElements.button.addEventListener('click', this.loginFormSubmit.bind(this));
    this.chat.chatElements.header.buttonLogout.addEventListener('click', this.logoutHandler.bind(this));
  }

  private logoutHandler() {
    sessionStorage.removeItem(USER_STORAGE_DATA_KEY);

    this.chat.chatElements.container.classList.add('hidden');
    setTimeout(() => {
      this.chat.chatElements.container.remove();
      document.body.append(this.loginForm.render());
      setTimeout(() => this.loginForm.formElements.container.classList.remove('hidden'), 200);
    }, 200);
  }

  private loginFormSubmit(event: Event) {
    event.preventDefault();
    this.user.setLogin(this.loginForm.formElements.login.value.trim());
    this.user.setPassword(this.loginForm.formElements.password.value.trim());

    sessionStorage.setItem(USER_STORAGE_DATA_KEY, JSON.stringify(this.user));

    this.loginForm.formElements.container.classList.add('hidden');
    this.loginForm.formElements.login.value = '';
    this.loginForm.formElements.password.value = '';
    setTimeout(() => {
      this.loginForm.formElements.container.remove();
      document.body.append(this.chat.render(this.user.getLogin()));
      setTimeout(() => this.chat.chatElements.container.classList.remove('hidden'), 200);
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
