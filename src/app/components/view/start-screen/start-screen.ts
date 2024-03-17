import './start-screen.scss';
import { USER_DATA_KEY } from '../../../models';
import EventBus from '../../../services/event-bus';
import createElement from '../../../utils/lib';

export default class StartScreen {
  private readonly wrapper: HTMLElement;

  private readonly header: HTMLElement;

  private readonly gameWrapper: HTMLElement;

  private readonly localStorageData: string | null;

  constructor() {
    this.wrapper = createElement('div', { classList: ['start-screen', 'hidden'] });
    this.header = createElement('div', { classList: ['header'] });
    this.gameWrapper = createElement('div', { classList: ['game-wrapper'] });
    this.localStorageData = localStorage.getItem(USER_DATA_KEY);
    this.createHeaderContent();

    setTimeout(() => {
      this.wrapper.classList.remove('hidden');
    }, 200);
  }

  public createStartScreen(): HTMLElement {
    this.wrapper.append(this.header, this.gameWrapper);
    return this.wrapper;
  }

  private createHeaderContent(): void {
    let userData;
    const title = createElement('h1', { classList: ['title'], textContent: 'RSS-PUZZLE' });

    const userInfo = createElement('div', { classList: ['user-name'] });
    if (this.localStorageData !== null) {
      userData = JSON.parse(this.localStorageData);
    }

    if (userData && userData.firstName && userData.lastName) {
      userInfo.textContent = `${userData.firstName} ${userData.lastName}`;
    }

    const logoutButton = createElement('button', { classList: ['logout-button'] });
    logoutButton.textContent = 'Logout';
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem(USER_DATA_KEY);

      this.wrapper.classList.add('hidden');
      setTimeout(() => {
        this.wrapper.remove();

        EventBus.publish('logout');
      }, 200);
    });

    this.header.append(title, userInfo, logoutButton);
  }
}
