import './start-screen.scss';
import { USER_DATA_KEY, UserData } from '../../../models';
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
    this.gameWrapper.append(this.createGreetingScreen());
    this.wrapper.append(this.header, this.gameWrapper);
    return this.wrapper;
  }

  private createGreetingScreen(): HTMLElement {
    const greetingWrapper = createElement('div', { classList: ['greeting'] });
    const userData = this.getUserData();
    if (userData) {
      const { firstName, lastName } = userData;
      const welcome = createElement('p', { classList: ['welcome'], textContent: `Welcome, ${firstName} ${lastName}` });
      const title = createElement('p', { textContent: 'RSS-Puzzle' });
      const description = createElement('p', {
        textContent:
          'RSS Puzzle is an interactive mini game aimed at enhancing English language skills. The game integrates various levels of difficulty, hint options and a unique puzzle-like experience with artwork',
      });
      const button = createElement('button', { classList: ['start-game-button'], textContent: 'Start game' });
      button.addEventListener('click', () => {
        console.log('Start game');
        greetingWrapper.classList.add('hidden');
        setTimeout(() => {
          greetingWrapper.remove();
          EventBus.publish('StartGame');
        }, 200);
      });
      greetingWrapper.append(welcome, title, description, button);
    } else throw new Error('No user data found in greeting');
    return greetingWrapper;
  }

  private getUserData(): UserData | null {
    return this.localStorageData ? JSON.parse(this.localStorageData) : null;
  }

  private createHeaderContent(): void {
    const userData: UserData | null = this.getUserData();
    const title = createElement('h1', { classList: ['title'], textContent: 'RSS-PUZZLE' });

    const userInfo = createElement('div', { classList: ['user-name'] });

    if (userData && userData.firstName && userData.lastName) {
      userInfo.textContent = `${userData.firstName} ${userData.lastName}`;
    }

    const logoutButton = createElement('button', { classList: ['logout-button'], textContent: 'Logout' });
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
