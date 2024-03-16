import './login-form.scss';
import createElement from '../../../utils/lib';

export default class LoginForm {
  private readonly firstNameInput: HTMLInputElement;

  private readonly lastNameInput: HTMLInputElement;

  private readonly loginButton: HTMLButtonElement;

  private readonly errorMessages: HTMLElement;

  constructor() {
    this.firstNameInput = createElement('input', { attrList: { type: 'text', placeholder: 'First Name' } });
    this.lastNameInput = createElement('input', { attrList: { type: 'text', placeholder: 'Last Name' } });
    this.loginButton = createElement('button', {
      classList: ['Login'],
      attrList: { disabled: 'true' },
      textContent: 'Login',
    });
    this.errorMessages = createElement('div', { classList: ['error-messages'] });
  }

  createLoginForm() {
    const form = createElement('form', {
      classList: ['login-form'],
      childNodeList: [this.firstNameInput, this.lastNameInput, this.loginButton, this.errorMessages],
    });
    const formWrapper = createElement('div', { classList: ['form-wrapper'], childNodeList: [form] });

    this.addEventListeners();
    return formWrapper;
  }

  private addEventListeners(): void {
    this.firstNameInput.addEventListener('input', this.validateForm.bind(this));
    this.lastNameInput.addEventListener('input', this.validateForm.bind(this));
    this.loginButton.addEventListener('click', this.handleLogin.bind(this));
  }

  private validateForm(): void {
    const firstNameValid = this.validateName(this.firstNameInput.value.trim());
    const lastNameValid = this.validateName(this.lastNameInput.value.trim());

    this.firstNameInput.classList.toggle('invalid', !firstNameValid);
    this.lastNameInput.classList.toggle('invalid', !lastNameValid);

    this.loginButton.disabled = !firstNameValid || !lastNameValid;

    if (!firstNameValid) {
      this.showError('First Name is not valid');
    }

    if (!lastNameValid) {
      this.showError('Last Name is not valid');
    }
  }

  private validateName(name: string): boolean {
    return /^[a-zA-Z]{3,15}$/.test(name);
  }

  private handleLogin(): void {
    const firstName = this.firstNameInput.value.trim();
    const lastName = this.lastNameInput.value.trim();

    // if (!this.validateName(firstName)) {
    //   this.showError('First Name is not valid');
    //   return;
    // }
    //
    // if (!this.validateName(lastName)) {
    //   this.showError('Last Name is not valid');
    //   return;
    // }

    const userData = {
      firstName,
      lastName,
    };

    localStorage.setItem('userData', JSON.stringify(userData));
  }

  private showError(message: string) {
    this.errorMessages.textContent = message;
  }
}
