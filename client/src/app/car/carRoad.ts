import { svg, svgCar /* , svgMoto */ } from './svg/svg';
import Button from '../components/button';

export default class CarRoad {
  private readonly container: HTMLDivElement;

  private readonly road: HTMLDivElement;

  private readonly car: HTMLDivElement;

  private readonly finish: HTMLDivElement;

  private readonly start: Button;

  private readonly stop: Button;

  constructor(private color: string) {
    this.container = document.createElement('div');
    this.road = document.createElement('div');
    this.car = document.createElement('div');
    this.finish = document.createElement('div');
    this.start = new Button('start', 'start');
    this.stop = new Button('stop', 'stop');
    this.addAttribute();
    this.road.append(this.car, this.finish);
    this.container.append(this.start.node, this.stop.node, this.road);
  }

  private addAttribute() {
    this.container.className = 'car-road';
    this.road.className = 'road';
    this.car.className = 'car';
    this.car.innerHTML = svgCar(this.color);
    this.finish.className = 'finish';
    this.finish.innerHTML = svg();
    this.stop.disable();
  }

  get getNode() {
    return {
      start: this.start.node,
      stop: this.stop.node,
      car: this.car,
      line: this.road,
    };
  }

  get getButtons() {
    return {
      start: this.start,
      stop: this.stop,
    };
  }

  public render() {
    return this.container;
  }
}
