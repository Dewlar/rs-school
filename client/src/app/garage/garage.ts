import './garage.scss';
import { getCars } from '../api/garageApi';
import GarageDataCounter from './garageDataCounter';

export default class Garage {
  private readonly garage: HTMLDivElement;

  private readonly page: number;

  private data: GarageDataCounter;

  private count: number;

  constructor() {
    this.garage = document.createElement('div');
    this.page = 1;
    this.count = 0;
    this.garage.className = 'garage';
    this.data = new GarageDataCounter();
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
