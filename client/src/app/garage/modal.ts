import { createWinner, getWinner, getWinners, updateWinner } from '../api/api';
import { ICar } from '../api/interface';
import './modal.scss';

export default class ModalWinner {
  private readonly container: HTMLDivElement;

  private readonly title: HTMLHeadingElement;

  public state: { race: boolean };

  private winners: Array<number>;

  constructor() {
    this.container = document.createElement('div');
    this.title = document.createElement('h1');
    this.state = { race: false };
    this.winners = [];
  }

  public async viewWinner(car: ICar, velocity: number): Promise<void> {
    if (this.state.race) {
      this.removeModal();
      const speed = +(velocity / 10).toFixed(2);
      console.log(speed, velocity);
      this.container.className = 'modal';
      this.title.className = 'modal-title';
      this.title.textContent = `${car.name} wins! With ${speed}s!`;
      this.container.append(this.title);
      await this.getWinners();
      if (this.winners.includes(car.id)) {
        const winnerCar = await getWinner(car.id);
        await updateWinner({
          id: car.id,
          time: winnerCar.time < speed ? winnerCar.time : speed,
          wins: (winnerCar.wins += 1),
        });
      } else {
        await createWinner({
          id: car.id,
          time: speed,
          wins: 1,
        });
      }
    }
    this.state.race = false;
  }

  private async getWinners(): Promise<void> {
    const arr = await getWinners(1, 'id', 'ASC', 1000);
    this.winners = arr.result.map((el) => el.id);
  }

  private removeModal(): void {
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
