import './garage.scss';
import { getCars } from '../api/api';
import PageDataCounter from '../components/pageDataCounter';
import Car from '../car/car';
import ModalWinner from './modal';
import PaginationButton from '../components/paginationButton';
import ControlPanel from './controlPanel';
import { randomCarGenerator } from '../libs/lib';
import { IDirection } from '../api/interface';

export default class Garage {
  private readonly garage: HTMLDivElement;

  private page: number;

  private pageDataCounter: PageDataCounter;

  private count: number;

  private readonly list: HTMLDivElement;

  private cars: Car[];

  private readonly modalWinner: ModalWinner;

  private paginationButton: PaginationButton;

  private controlPanel: ControlPanel;

  constructor() {
    this.garage = document.createElement('div');
    this.garage.className = 'garage';
    this.page = 1;
    this.count = 0;
    this.pageDataCounter = new PageDataCounter();
    this.list = document.createElement('div');
    this.list.className = 'garage-list';
    this.cars = [];
    this.paginationButton = new PaginationButton();
    this.controlPanel = new ControlPanel(this.renderList.bind(this));

    this.renderList();
    this.modalWinner = new ModalWinner();
    this.addListeners();
  }

  private async renderList(id?: number): Promise<void> {
    await this.garageView();
    const carsOnPage = await getCars(this.page);
    // console.log(carsOnPage);

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
              this.brokenRace.bind(this)
            )
          );
        }
      });
      this.list.innerHTML = '';
      this.cars.forEach((car) => this.list.append(car.render()));
    }
    this.checkCarsCount();
    if (carsOnPage.items.length === 0) {
      await this.pagination(IDirection.prev);
    }
  }

  private async checkRaceReset(): Promise<void> {
    if (!this.modalWinner.state.race) {
      const carsInRace = this.cars.filter((car) => car.state.stateCar === 'started');
      if (carsInRace.length > 0) {
        this.controlPanel.carBuilderPanels.buttons.reset.enable();
        this.controlPanel.carBuilderPanels.buttons.race.disable();
      } else {
        this.controlPanel.carBuilderPanels.buttons.reset.disable();
        this.controlPanel.carBuilderPanels.buttons.race.enable();
      }
      this.checkCarsCount();
    } else {
      this.controlPanel.carBuilderPanels.buttons.reset.disable();
      this.controlPanel.carBuilderPanels.buttons.race.disable();
      this.paginationButton.getButton.prev.disable();
      this.paginationButton.getButton.next.disable();
    }
  }

  private async pagination(direction: IDirection): Promise<void> {
    this.paginationButton.getButton.prev.disable();
    this.paginationButton.getButton.next.disable();
    if (direction === IDirection.next) this.page += 1;
    else if (this.page - 1 < 1) return;
    else this.page -= 1;

    this.cars.forEach(async (car) => {
      await car.stopCar();
    });
    // await Promise.all(
    //   this.cars.map(async (car) => {
    //     await car.stopCar();
    //   })
    // );
    this.cars.length = 0;
    await this.renderList();
    this.checkCarsCount();
  }

  private checkCarsCount(): void {
    if (this.page <= 1) this.paginationButton.getButton.prev.disable();
    else this.paginationButton.getButton.prev.enable();

    if (this.count / 7 <= this.page) this.paginationButton.getButton.next.disable();
    else this.paginationButton.getButton.next.enable();
  }

  private brokenRace(): void {
    const cars: Car[] = this.cars.filter((car) => car.state.check);
    if (cars.length === 0) {
      this.modalWinner.setState = false;
    }
  }

  private async raceStart(): Promise<void> {
    this.modalWinner.setState = true;
    this.cars.forEach((car) => {
      if (!car.state.check) {
        car.startCar();
      }
    });
  }

  private async raceReset(): Promise<void> {
    this.cars.forEach((car) => {
      if (car.state.btnStop) {
        car.stopCar();
      } else {
        this.controlPanel.carBuilderPanels.buttons.reset.disable();
      }
    });
  }

  private async generatorCars(): Promise<void> {
    this.controlPanel.carBuilderPanels.buttons.generator.disable();
    await randomCarGenerator();
    await this.garageView();
    await this.renderList();
    this.controlPanel.carBuilderPanels.buttons.generator.enable();
  }

  private async garageView(): Promise<void> {
    const carsOnPage = await getCars(this.page);
    if (carsOnPage.count) {
      this.pageDataCounter.updateState(this.page, 'Total cars in garage', Number(carsOnPage.count));
      this.count = Number(carsOnPage.count);
    }
  }

  private addListeners(): void {
    this.paginationButton.getNode.next.addEventListener('click', () => this.pagination(IDirection.next));
    this.paginationButton.getNode.prev.addEventListener('click', () => this.pagination(IDirection.prev));
    this.controlPanel.getNode.buttons.getNode.race.addEventListener('click', () => this.raceStart());
    this.controlPanel.getNode.buttons.getNode.reset.addEventListener('click', () => this.raceReset());
    this.controlPanel.getNode.buttons.getNode.generator.addEventListener('click', () => this.generatorCars());
  }

  public render(): HTMLDivElement {
    this.garageView();
    this.garage.append(
      this.modalWinner.render(),
      this.controlPanel.render(),
      this.pageDataCounter.render(),
      this.list,
      this.paginationButton.render()
    );
    return this.garage;
  }
}
