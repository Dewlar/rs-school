import './app.scss';
import Button from './button/button';
import Garage from './garage/garage';

export default class App {
  private garageButton: Button;

  private winnerButton: Button;

  private readonly page: HTMLDivElement;

  private readonly buttonContainer: HTMLDivElement;

  private readonly main: HTMLElement;

  private garage: Garage;

  constructor() {
    this.main = document.createElement('main');
    this.page = document.createElement('div');
    this.buttonContainer = document.createElement('div');
    this.garageButton = new Button('garage', 'page-button');
    this.winnerButton = new Button('winners', 'page-button');
    this.garage = new Garage();
  }

  addBtnListeners() {
    this.garageButton.node.addEventListener('click', () => this.renderGarage());
    this.winnerButton.node.addEventListener('click', () => this.renderWinner());
  }

  private renderGarage() {
    this.main.innerHTML = '';
    this.main.append(this.garage.render());
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
    this.renderGarage();
    this.buttonContainer.append(this.garageButton.node, this.winnerButton.node);
    this.page.append(this.buttonContainer, this.main);
    document.body.append(this.page);
  }
}
