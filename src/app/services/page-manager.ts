import { USER_DATA_KEY } from '../models';
import EventBus from './event-bus';
import StartScreen from '../components/view/start-screen/start-screen';
import LoginForm from '../components/view/login-form/login-form';
import GameContainer from '../components/view/game/game-container';

export default class PageManager {
  static initialize(): void {
    EventBus.subscribe('login', () => {
      this.login();
    });

    EventBus.subscribe('logout', () => {
      this.logout();
    });

    EventBus.subscribe('startGame', (args: unknown) => {
      this.startGame(args);
    });
  }

  static login(): void {
    const startScreen = new StartScreen();
    document.body.innerHTML = '';
    document.body.append(startScreen.createStartScreen());
  }

  static logout(): void {
    localStorage.removeItem(USER_DATA_KEY);
    const loginForm = new LoginForm();
    document.body.innerHTML = '';
    document.body.append(loginForm.createLoginForm());
  }

  static startGame(args: unknown): void {
    const gameWrapper = args as HTMLElement;
    const gameContainer = new GameContainer();
    gameWrapper.append(gameContainer.createGameContainer());
  }
}
