import './app.scss';
import Button from './button/button';

export default class App {
  private garageButton: Button;

  private winnerButton: Button;

  private readonly page: HTMLDivElement;

  private readonly buttonContainer: HTMLDivElement;

  private readonly main: HTMLElement;

  constructor() {
    this.main = document.createElement('main');
    this.page = document.createElement('div');
    this.buttonContainer = document.createElement('div');
    this.garageButton = new Button('garage', 'page-button');
    this.winnerButton = new Button('winners', 'page-button');
  }

  addBtnListeners() {
    this.garageButton.node.addEventListener('click', () => this.renderGarage());
    this.winnerButton.node.addEventListener('click', () => this.renderWinner());
  }

  private renderGarage() {
    this.main.innerHTML = '';
    this.garageButton.node.classList.add('active');
    this.winnerButton.node.classList.remove('active');
  }

  private renderWinner() {
    this.main.innerHTML = '';
    this.winnerButton.node.classList.add('active');
    this.garageButton.node.classList.remove('active');
  }

  render() {
    this.buttonContainer.className = 'page-buttons-container';
    this.page.className = 'page';
    this.addBtnListeners();
    this.buttonContainer.append(this.garageButton.node, this.winnerButton.node);
    this.page.append(this.buttonContainer, this.main);
    document.body.append(this.page);
  }
}
