import { createWinner, getWinner, getWinners, updateWinner } from '../api/api';
import { EOrder, ESort, ICar } from '../api/interface';
import './modal.scss';

export default class ModalWinner {
  private readonly container: HTMLDivElement;

  private readonly title: HTMLHeadingElement;

  public state: { race: boolean };

  private winners: Array<number>;

  constructor() {
    this.container = document.createElement('div');
    // this.container.className = 'modal';
    this.title = document.createElement('h2');
    this.state = { race: false };
    this.winners = [];
  }

  public async viewWinner(car: ICar, time: number): Promise<void> {
    if (this.state.race) {
      this.addRemoveModalListener();
      this.container.className = 'modal';
      this.title.className = 'modal-title';
      this.title.innerHTML = `${car.name} wins! <br> With ${time}s!`;
      this.container.append(this.title);
      await this.getWinners();
      if (this.winners.includes(car.id)) {
        const winnerCar = await getWinner(car.id);
        await updateWinner({
          id: car.id,
          time: winnerCar.time < time ? winnerCar.time : time,
          wins: (winnerCar.wins += 1),
        });
      } else {
        await createWinner({
          id: car.id,
          time,
          wins: 1,
        });
      }
    }
    this.state.race = false;
  }

  private async getWinners(): Promise<void> {
    const arr = await getWinners(1, ESort.id, EOrder.ASC, 1000);
    this.winners = arr.result.map((winner) => winner.id);
  }

  private addRemoveModalListener(): void {
    this.container.addEventListener('click', () => {
      this.container.className = '';
      this.container.innerHTML = '';
    });
  }

  public set setState(value: boolean) {
    this.state.race = value;
  }

  public render(): HTMLDivElement {
    return this.container;
  }
}
