import './game.scss';
import createElement from '../../../utils/lib';
import CanvasPuzzle from './game';
import { PuzzleBoard } from './tmp';
// import GameBoard from './game';

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
    const wordsExample = [
      { textExample: 'We need to study because we have a test tomorrow' },
      { textExample: 'My friend drives an expensive sports car' },
      { textExample: 'She gave pink flowers to her grandmother' },
      { textExample: 'We need to study because we have a test tomorrow' },
      { textExample: 'My friend drives an expensive sports car' },
      { textExample: 'She pink flowers to her bb' },
      { textExample: 'We need to aa because we have a test tomorrow' },
      { textExample: 'My friend drives an expensive sports car' },
      { textExample: 'She gave pink flowers to her grandmother' },
      { textExample: 'She gave pink   to her grandmother' },
    ];

    // const canvas = document.createElement('canvas');
    // const puzzleBoard = new PuzzleBoard(canvas, wordsExample);
    // console.log(puzzleBoard);
    // puzzleBoard.animate();
    const puzzleBoard = new PuzzleBoard(wordsExample, 700, 500);
    // const gameBoard = new GameBoard(600, 450);
    // const canvasElement = gameBoard.getCanvas();

    const canvasPuzzle = new CanvasPuzzle(200, 200);
    // const canvasElement = canvasPuzzle.getCanvas();
    this.gameContainer.append(canvasPuzzle.getCanvas(), puzzleBoard.getCanvas());
    // this.gameContainer.append(gameBoard.getCanvas());
    return this.gameContainer;
  }
}
