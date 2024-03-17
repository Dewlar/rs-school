import './game.scss';
import createElement from '../../../utils/lib';

export default class GameContainer {
  private readonly gameContainer: HTMLElement;

  constructor() {
    this.gameContainer = createElement('div', { classList: ['game-container', 'hidden'] });
    // this.gameContainer = createElement('div', {
    //   classList: ['first-name-input'],
    //   attrList: { type: 'text', placeholder: 'First Name', maxlength: '15' },
    // });
    setTimeout(() => {
      this.gameContainer.classList.remove('hidden');
    }, 200);
  }

  createGameContainer() {
    return this.gameContainer;
  }
}
