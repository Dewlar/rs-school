import './garage.scss';
import { getCars } from '../api/api';
import GarageDataCounter from './garageDataCounter';
import Car from '../car/car';
import ModalWinner from './modal';

export default class Garage {
  private readonly garage: HTMLDivElement;

  private readonly page: number;

  private data: GarageDataCounter;

  private count: number;

  private readonly list: HTMLDivElement;

  private cars: Car[];

  private readonly modalWinner: ModalWinner;

  constructor() {
    this.garage = document.createElement('div');
    this.garage.className = 'garage';
    this.page = 1;
    this.count = 0;
    this.data = new GarageDataCounter();
    this.list = document.createElement('div');
    this.list.className = 'garage-list';
    this.cars = [];

    this.renderList();
    this.modalWinner = new ModalWinner();
  }

  private async renderList(id?: number): Promise<void> {
    this.garageView();
    const carsOnPage = await getCars(this.page);
    const carsId = this.cars.map((el) => el.id);
    if (id) {
      this.cars = this.cars.filter((item) => item.id !== id);
    }
    if (this.cars.length < 7) {
      carsOnPage.items.forEach((item) => {
        if (!carsId.includes(item.id)) {
          this.cars.push(
            new Car(
              item,
              this.renderList.bind(this),
              this.checkRaceReset.bind(this),
              this.modalWinner,
              this.poorRun.bind(this)
            )
          );
        }
      });
      this.list.innerHTML = '';
      this.cars.forEach((car) => this.list.append(car.render()));
    }
  }

  private async checkRaceReset(): Promise<void> {
    if (!this.modalWinner.state.race) {
      // console.log('checkRaceReset');
    }
  }

  private poorRun(): void {
    const arr = this.cars.filter((el) => el.state.check);
    if (arr.length === 0) {
      this.modalWinner.setState = false;
    }
    // console.log('bad-race', arr);
  }

  private async garageView(): Promise<void> {
    const res = await getCars(this.page);
    if (res.count) {
      this.data.updateState(this.page, Number(res.count));
      this.count = Number(res.count);
    }
  }

  public render(): HTMLDivElement {
    this.garageView();
    this.garage.append(this.modalWinner.render(), this.data.render(), this.list);
    return this.garage;
  }
}
