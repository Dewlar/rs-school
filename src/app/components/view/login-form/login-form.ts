import './login-form.scss';
import createElement from '../../../utils/lib';
import { USER_DATA_KEY } from '../../../models/const';
import EventBus from '../../../services/event-bus';

export default class LoginForm {
  private readonly firstNameInput: HTMLInputElement;

  private readonly lastNameInput: HTMLInputElement;

  private readonly loginButton: HTMLButtonElement;

  private readonly firstNameErrorMessage: HTMLElement;

  private readonly lastNameErrorMessage: HTMLElement;

  private readonly formWrapper: HTMLElement;

  constructor() {
    this.firstNameInput = createElement('input', {
      classList: ['first-name-input'],
      attrList: { type: 'text', placeholder: 'First Name', maxlength: '15' },
    });
    this.lastNameInput = createElement('input', {
      classList: ['last-name-input'],
      attrList: { type: 'text', placeholder: 'Last Name', maxlength: '15' },
    });
    this.loginButton = createElement('button', {
      classList: ['Login'],
      attrList: { type: 'button', disabled: 'true' },
      textContent: 'Login',
    });
    this.formWrapper = createElement('div', { classList: ['form-wrapper', 'hidden'] });
    this.firstNameErrorMessage = createElement('div', { classList: ['error-messages', 'first-error'] });
    this.lastNameErrorMessage = createElement('div', { classList: ['error-messages', 'first-error'] });
  }

  createLoginForm() {
    const firstNameContainer = createElement('div', {
      classList: ['first-name'],
      childNodeList: [this.firstNameInput, this.firstNameErrorMessage],
    });
    const lastNameContainer = createElement('div', {
      classList: ['last-name'],
      childNodeList: [this.lastNameInput, this.lastNameErrorMessage],
    });

    const form = createElement('form', {
      classList: ['login-form'],
      childNodeList: [firstNameContainer, lastNameContainer, this.loginButton],
    });
    this.formWrapper.append(form);

    this.addEventListeners();
    setTimeout(() => {
      this.formWrapper.classList.remove('hidden');
    }, 200);
    return this.formWrapper;
  }

  private addEventListeners(): void {
    this.firstNameInput.addEventListener('input', () => this.validateForm(this.firstNameInput));
    this.lastNameInput.addEventListener('input', () => this.validateForm(this.lastNameInput));
    this.loginButton.addEventListener('click', this.handleLogin.bind(this));
  }

  private validateForm(input: HTMLInputElement): void {
    const [isInputValid, errorMessage] = this.validateName(input);
    if (input.classList.contains('first-name-input')) {
      this.firstNameInput.classList.toggle('invalid', !isInputValid);
      if (!isInputValid) {
        this.firstNameErrorMessage.textContent = errorMessage;
      } else this.firstNameErrorMessage.textContent = '';
    }
    if (input.classList.contains('last-name-input')) {
      this.lastNameInput.classList.toggle('invalid', !isInputValid);
      if (!isInputValid) {
        this.lastNameErrorMessage.textContent = errorMessage;
      } else this.lastNameErrorMessage.textContent = '';
    }
    this.loginButton.disabled =
      this.firstNameInput.classList.contains('invalid') ||
      this.lastNameInput.classList.contains('invalid') ||
      this.firstNameInput.value.length === 0 ||
      this.lastNameInput.value.length === 0;
  }

  private validateName(input: HTMLInputElement): [boolean, string] {
    const name = input.value.trim();

    if (input.value.length === 0) return [false, 'The field is required'];
    if (!/^[A-Z]/.test(input.value)) return [false, 'First letter capitalize required'];
    if (/^[A-Z]{2,}/.test(input.value)) return [false, 'One letter capitalized'];
    if (!/^[A-Z][a-z]*(?:-[a-z]*)?$/.test(input.value)) return [false, 'English letters or a hyphen'];

    if (input.classList.contains('first-name-input')) {
      if (name.length < 3) return [false, 'Minimum 3 symbols required'];
    } else if (name.length < 4) return [false, 'Minimum 4 symbols required'];
    if (!/^[A-Z].*[a-z]$/.test(input.value)) return [false, 'First and last letters required'];

    return [true, ''];
  }

  private handleLogin(event: Event): void {
    event.preventDefault();
    const firstName = this.firstNameInput.value.trim();
    const lastName = this.lastNameInput.value.trim();

    const userData = {
      firstName,
      lastName,
    };

    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

    this.formWrapper.classList.add('hidden');
    setTimeout(() => {
      this.formWrapper.remove();
      EventBus.publish('login');
    }, 200);
  }
}
