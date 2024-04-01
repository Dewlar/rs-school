import './car.scss';
import { ICar } from '../api/interface';
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
    private poorRun: () => void
  ) {
    this.container = document.createElement('div');
    this.container.className = 'car-item';
    this.title = document.createElement('h4');
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
    this.carRoad.getStartStopButton.start.disable();
    this.carRoad.getStartStopButton.stop.enable();
    const carStatus = await engineStatus(this.id, 'started');
    this.state.stateCar = 'started';
    // const car: this = this;
    const drive = driveMode(this.id);
    this.state.bool = true;
    const animate = async () => {
      this.checkRace();
      // console.log(carStatus.velocity);
      this.state.distance += carStatus.velocity / calculateVelocity(finish);
      this.carRoad.getNode.car.style.left = `${this.state.distance}px`;
      this.checkRaceStart();
      if (this.state.distance < finish - 48 && this.state.bool && this.state.stateCar === 'started') {
        if (this.state.distance > finish - 65) {
          this.winner.viewWinner(this.car, carStatus.velocity);
          this.winner.setState = false;
        }
        requestAnimationFrame(animate);
      }
      if ((await drive).status === 500) {
        this.poorRun();
        if (this.state.check) this.carRoad.getStartStopButton.stop.enable();
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
        this.carRoad.getStartStopButton.stop.disable();
        this.remove.disable();
      } else {
        this.carRoad.getStartStopButton.stop.enable();
        this.remove.enable();
        this.state.check = false;
      }
    }
  }

  async stopCar() {
    this.state.btnStop = false;
    this.carRoad.getStartStopButton.stop.disable();
    await engineStatus(this.id, 'stopped');
    this.state.stateCar = 'stopped';
    await this.checkRace();
    this.state.distance = 0;
    this.state.check = false;
    this.state.bool = false;
    this.carRoad.getStartStopButton.start.enable();
    if (!this.state.btnStop) {
      this.state.distance = 0;
      this.carRoad.getStartStopButton.stop.disable();
      this.carRoad.getStartStopButton.start.enable();
    }
    this.carRoad.getNode.car.style.left = `${this.state.distance}%`;
  }

  async removeBtn() {
    this.remove.disable();
    this.select.disable();
    const arr = await getWinners(1, 'id', 'ASC', 1000);
    const el = arr.result.find((item) => item.id === this.id);
    if (el) {
      await deleteWinner(this.id);
    }
    await this.stopCar();
    await deleteCar(this.id);
    await this.renderList(this.id);
  }

  selectBtn() {
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
    this.remove.node.addEventListener('click', () => this.removeBtn());
    this.select.node.addEventListener('click', () => this.selectBtn());
  }

  createCar() {
    this.addListeners();
    this.container.append(this.remove.node, this.select.node, this.title, this.carRoad.render());
  }

  render() {
    return this.container;
  }
}
