import './car.scss';
import { EOrder, ESort, ICar } from '../api/interface';
import CarRoad from './carRoad';
import Button from '../components/button';
import ModalWinner from '../garage/modal';
import { engineStatus, driveMode, getWinners, deleteCar, deleteWinner } from '../api/api';
import { calculateVelocity } from '../libs/lib';
import CarBuilderPanel from '../components/carBuilderPanel';

export default class Car {
  private readonly container: HTMLDivElement;

  private readonly title: HTMLHeadingElement;

  public id: number;

  // private data: ICar;

  private carRoad: CarRoad;

  private remove: Button;

  private select: Button;

  public state: { stateCar: string; distance: number; bool: boolean; btnStop: boolean; check: boolean };

  constructor(
    private car: ICar,
    private update: CarBuilderPanel,
    private renderList: (id?: number) => Promise<void>,
    private checkRace: () => Promise<void>,
    private winner: ModalWinner,
    private brokenRace: () => void
  ) {
    this.container = document.createElement('div');
    this.container.className = 'car-item';
    this.title = document.createElement('p');
    this.title.textContent = this.car.name;
    this.id = this.car.id;
    this.remove = new Button('remove');
    this.select = new Button('select');

    this.carRoad = new CarRoad(this.car.color);
    // this.renderList = renderList;
    this.state = {
      stateCar: 'stopped',
      distance: 0,
      bool: false,
      check: false,
      btnStop: true,
    };
    // this.checkRace = checkRace;
    // this.poorRun = poorRun;

    // this.car = car;
    this.createCar();
  }

  async startCar() {
    const finish = this.carRoad.getNode.line.clientWidth;
    this.remove.disable();
    this.state.check = true;
    this.state.btnStop = true;
    this.carRoad.getButtons.start.disable();
    this.carRoad.getButtons.stop.enable();
    const carStatus = await engineStatus(this.id, 'started');
    this.state.stateCar = 'started';
    // const car: this = this;
    const drive = driveMode(this.id);
    this.state.bool = true;
    const animate = async () => {
      await this.checkRace();
      const time = +((finish / carStatus.velocity) * calculateVelocity(finish)).toFixed(2);
      this.state.distance += carStatus.velocity * (0.016 / calculateVelocity(finish));
      this.carRoad.getNode.car.style.left = `${this.state.distance}px`;
      this.checkRaceStart();
      if (this.state.distance < finish - 48 && this.state.bool && this.state.stateCar === 'started') {
        requestAnimationFrame(animate);
      } else if (this.state.distance >= finish - 48) {
        await this.winner.viewWinner(this.car, time);
        this.winner.setState = false;
      }
      if ((await drive).status === 500) {
        this.brokenRace();
        if (this.state.check) this.carRoad.getButtons.stop.enable();
        this.state.bool = false;
        this.state.check = false;
        this.remove.enable();
      }
    };

    requestAnimationFrame(animate);
  }

  checkRaceStart() {
    if (this.state.check) {
      if (this.winner.state.race) {
        this.carRoad.getButtons.stop.disable();
        this.remove.disable();
      } else {
        this.carRoad.getButtons.stop.enable();
        this.remove.enable();
        this.state.check = false;
      }
    }
  }

  async stopCar() {
    this.state.btnStop = false;
    this.carRoad.getButtons.stop.disable();
    await engineStatus(this.id, 'stopped');
    this.state.stateCar = 'stopped';
    await this.checkRace();
    this.state.distance = 0;
    this.state.check = false;
    this.state.bool = false;
    this.carRoad.getButtons.start.enable();
    if (!this.state.btnStop) {
      this.state.distance = 0;
      this.carRoad.getButtons.stop.disable();
      this.carRoad.getButtons.start.enable();
    }
    this.carRoad.getNode.car.style.left = `${this.state.distance}%`;
  }

  async removeButton() {
    this.remove.disable();
    this.select.disable();
    const arr = await getWinners(1, ESort.id, EOrder.ASC, 9999);
    const winners = arr.result.find((winner) => winner.id === this.id);
    if (winners) {
      await deleteWinner(this.id);
    }
    await this.stopCar();
    await deleteCar(this.id);
    await this.renderList(this.id);
  }

  selectButton() {
    this.update.enable();
    this.update.carBuilderPanelElements.name.focus();
    this.update.carBuilderPanelElements.name.value = this.car.name;
    this.update.carBuilderPanelElements.color.value = this.car.color;
    this.update.getId = this.id;
    this.update.selectedCar.name = this.title;
    this.update.selectedCar.color = this.carRoad.getNode.car;
  }

  addListeners() {
    this.carRoad.getNode.start.addEventListener('click', () => this.startCar());
    this.carRoad.getNode.stop.addEventListener('click', () => this.stopCar());
    this.remove.node.addEventListener('click', () => this.removeButton());
    this.select.node.addEventListener('click', () => this.selectButton());
  }

  createCar() {
    this.addListeners();
    this.container.append(this.remove.node, this.select.node, this.title, this.carRoad.render());
  }

  render() {
    return this.container;
  }
}
