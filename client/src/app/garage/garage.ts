import './garage.scss';
import { getCars } from '../api/api';
import GarageDataCounter from './garageDataCounter';
import Car from '../car/car';

export default class Garage {
  private readonly garage: HTMLDivElement;

  private readonly page: number;

  private data: GarageDataCounter;

  private count: number;

  private list: HTMLDivElement;

  private cars: Car[];

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
          this.cars.push(new Car(item, this.renderList.bind(this)));
        }
      });
      this.list.innerHTML = '';
      this.cars.forEach((car) => this.list.append(car.render()));
    }
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
    this.garage.append(this.data.render());
    return this.garage;
  }
}
