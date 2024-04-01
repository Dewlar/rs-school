import Button from '../components/button';
import './winners-header.scss';

export default class WinnersHeader {
  private readonly header: HTMLDivElement;

  private readonly number: HTMLParagraphElement;

  private readonly car: HTMLParagraphElement;

  private readonly name: HTMLParagraphElement;

  private wins: Button;

  private time: Button;

  constructor() {
    this.header = document.createElement('div');
    this.number = document.createElement('p');
    this.car = document.createElement('p');
    this.name = document.createElement('p');
    this.wins = new Button('Wins', 'wins');
    this.time = new Button('Time', 'time');
    this.addAttributes();
  }

  private addAttributes() {
    this.header.className = 'winner-header';
    this.number.textContent = '#';
    this.number.className = 'number';
    this.car.textContent = 'Car';
    this.car.className = 'car';
    this.name.textContent = 'Name';
    this.name.className = 'name';
    this.time.node.textContent = 'time';
    this.wins.node.textContent = 'wins';
  }

  get getNode() {
    return {
      wins: this.wins.node,
      time: this.time.node,
    };
  }

  public render() {
    this.header.append(this.number, this.car, this.name, this.wins.node, this.time.node);
    return this.header;
  }
}
