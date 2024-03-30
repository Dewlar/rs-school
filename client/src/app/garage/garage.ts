import './garage.scss';
import { getCars } from '../api/api';
import GarageDataCounter from './garageDataCounter';
import Car from '../car/car';
import ModalWinner from './modal';
import PageChangeButton from './pageChangeButton';
import ControlPanel from './controlPanel';

export default class Garage {
  private readonly garage: HTMLDivElement;

  private page: number;

  private data: GarageDataCounter;

  private count: number;

  private readonly list: HTMLDivElement;

  private cars: Car[];

  private readonly modalWinner: ModalWinner;

  private prevNextBtn: PageChangeButton;

  private controlPanel: ControlPanel;

  constructor() {
    this.garage = document.createElement('div');
    this.garage.className = 'garage';
    this.page = 1;
    this.count = 0;
    this.data = new GarageDataCounter();
    this.list = document.createElement('div');
    this.list.className = 'garage-list';
    this.cars = [];
    this.prevNextBtn = new PageChangeButton();
    this.controlPanel = new ControlPanel(this.renderList.bind(this), this.garageView.bind(this));

    this.renderList();
    this.modalWinner = new ModalWinner();
    this.addListeners();
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
              this.controlPanel.carBuilderPanels.update,
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
    this.checkCarsCount();
  }

  private async checkRaceReset(): Promise<void> {
    if (!this.modalWinner.state.race) {
      // console.log('checkRaceReset');
    }
  }

  private async pagePrevNext(value: 'next' | 'prev'): Promise<void> {
    this.prevNextBtn.getButton.prev.disable();
    this.prevNextBtn.getButton.next.disable();
    if (value === 'next') this.page += 1;
    else this.page -= 1;

    this.cars.forEach(async (el) => {
      await el.stopCar();
    });
    this.cars.length = 0;
    await this.renderList();
    this.checkCarsCount();
  }

  private checkCarsCount(): void {
    if (this.page <= 1) this.prevNextBtn.getButton.prev.disable();
    else this.prevNextBtn.getButton.prev.enable();

    if (this.count / 7 <= this.page) this.prevNextBtn.getButton.next.disable();
    else this.prevNextBtn.getButton.next.enable();
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

  private addListeners(): void {
    this.prevNextBtn.getNode.next.addEventListener('click', () => this.pagePrevNext('next'));
    this.prevNextBtn.getNode.prev.addEventListener('click', () => this.pagePrevNext('prev'));
  }

  public render(): HTMLDivElement {
    this.garageView();
    this.garage.append(
      this.modalWinner.render(),
      this.controlPanel.render(),
      this.data.render(),
      this.list,
      this.prevNextBtn.render()
    );
    return this.garage;
  }
}
