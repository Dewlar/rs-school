import Button from '../components/button';
import Input from '../components/input';
import './login.scss';
// import { USER_STORAGE_DATA_KEY } from '../models/const';

export default class LoginForm {
  private readonly container: HTMLDivElement;

  private inputLogin: Input;

  private inputPassword: Input;

  private button: Button;

  private readonly form: HTMLDivElement;

  private readonly inputLoginError: HTMLDivElement;

  private readonly inputPasswordError: HTMLDivElement;

  private reviewerMessage: HTMLHeadingElement;

  constructor() {
    this.container = document.createElement('div');
    this.form = document.createElement('div');

    this.inputLogin = new Input('text');
    this.inputPassword = new Input('text');
    this.inputLoginError = document.createElement('div');
    this.inputPasswordError = document.createElement('div');

    this.reviewerMessage = document.createElement('h1');

    this.button = new Button('Login');
    this.button.disable();
    this.setAttribute();
    this.addEventListeners();
  }

  setAttribute() {
    this.container.className = 'login-container hidden';
    // this.container.classList.add('hidden');
    this.form.className = 'login-form';
    this.inputLogin.node.className = 'login';
    this.inputLogin.node.placeholder = 'Login';
    this.inputLoginError.className = 'login-error';
    this.inputLogin.node.value = '';
    this.inputPassword.node.className = 'password';
    this.inputPassword.node.placeholder = 'Password';
    this.inputPassword.node.type = 'password';
    this.inputPasswordError.className = 'password-error';
    this.inputPassword.node.value = '';
    this.reviewerMessage.innerHTML = `I'm still working on making it better.<br>But check it out as is.<br>Thank you for waiting and helping me!`;
    this.reviewerMessage.style.textAlign = 'center';
  }

  private addEventListeners(): void {
    this.inputLogin.node.addEventListener('input', () => this.validateForm(this.inputLogin.node));
    this.inputPassword.node.addEventListener('input', () => this.validateForm(this.inputPassword.node));
    // this.button.node.addEventListener('click', this.handleLogin.bind(this));
  }

  private validateForm(input: HTMLInputElement): void {
    const [isInputValid, errorMessage] = this.validateName(input);
    if (input.classList.contains('login')) {
      this.inputLogin.node.classList.toggle('invalid', !isInputValid);
      if (!isInputValid) {
        this.inputLoginError.textContent = errorMessage;
      } else this.inputLoginError.textContent = '';
    }
    if (input.classList.contains('password')) {
      this.inputPassword.node.classList.toggle('invalid', !isInputValid);
      if (!isInputValid) {
        this.inputPasswordError.textContent = errorMessage;
      } else this.inputPasswordError.textContent = '';
    }
    this.button.node.disabled =
      this.inputLogin.node.classList.contains('invalid') ||
      this.inputPassword.node.classList.contains('invalid') ||
      this.inputLogin.node.value.length === 0 ||
      this.inputPassword.node.value.length === 0;
  }

  private validateName(input: HTMLInputElement): [boolean, string] {
    const name = input.value.trim();

    if (input.value.length === 0) return [false, 'The field is required'];
    if (!/^[A-Z]/.test(input.value)) return [false, 'First letter capitalize required'];
    if (/^[A-Z]{2,}/.test(input.value)) return [false, 'One letter capitalized'];
    if (!/^[A-Z][a-z0-9-]*$/i.test(input.value)) return [false, 'English letters or a hyphen'];
    // !/^[A-Z][a-z]*(?:-[a-z]*)?$/

    if (input.classList.contains('login')) {
      if (name.length < 3) return [false, 'Minimum 3 symbols required'];
    } else if (name.length < 4) return [false, 'Minimum 4 symbols required'];
    if (!/^[A-Z].*[a-z]$/.test(input.value)) return [false, 'First and last letters required'];

    return [true, ''];
  }

  // private handleLogin(event: Event): void {
  //   event.preventDefault();
  //   const login = this.inputLogin.node.value.trim();
  //   const password = this.inputPassword.node.value.trim();
  //
  //   const userData = {
  //     login,
  //     password,
  //   };
  //
  //   sessionStorage.setItem(USER_STORAGE_DATA_KEY, JSON.stringify(userData));
  //
  //   // this.formWrapper.classList.add('hidden');
  //   // setTimeout(() => {
  //   //   this.formWrapper.remove();
  //   //   EventBus.publish('login');
  //   // }, 200);
  // }

  get formElements() {
    return {
      login: this.inputLogin.node,
      password: this.inputPassword.node,
      button: this.button.node,
      container: this.container,
    };
  }

  render() {
    this.form.append(
      this.inputLogin.node,
      this.inputLoginError,
      this.inputPassword.node,
      this.inputPasswordError,
      this.button.node
    );
    this.container.append(this.form, this.reviewerMessage);
    setTimeout(() => this.container.classList.remove('hidden'), 200);
    return this.container;
  }
}
