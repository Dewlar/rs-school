import './login-form.scss';
import createElement from '../../../utils/lib';

export default class LoginForm {
  private readonly firstNameInput: HTMLInputElement;

  private readonly lastNameInput: HTMLInputElement;

  private readonly loginButton: HTMLButtonElement;

  private readonly firstNameErrorMessage: HTMLElement;

  private readonly lastNameErrorMessage: HTMLElement;

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
      attrList: { disabled: 'true' },
      textContent: 'Login',
    });
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
    const formWrapper = createElement('div', { classList: ['form-wrapper'], childNodeList: [form] });

    this.addEventListeners();
    return formWrapper;
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

  private handleLogin(): void {
    const firstName = this.firstNameInput.value.trim();
    const lastName = this.lastNameInput.value.trim();

    const userData = {
      firstName,
      lastName,
    };

    localStorage.setItem('userData', JSON.stringify(userData));
  }
}
