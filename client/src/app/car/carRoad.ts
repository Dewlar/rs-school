import { svg, svgCar } from './svg/svg';

export default class CarRoad {
  private readonly container: HTMLDivElement;

  private readonly road: HTMLDivElement;

  private readonly car: HTMLDivElement;

  private readonly finish: HTMLDivElement;

  constructor(color: string) {
    this.container = document.createElement('div');
    this.road = document.createElement('div');
    this.car = document.createElement('div');
    this.finish = document.createElement('div');
    this.addAttribute(color);
    this.road.append(this.car, this.finish);
    this.container.append(this.road);
  }

  private addAttribute(color: string) {
    this.container.className = 'car-road';
    this.road.className = 'road';
    this.car.className = 'car';
    this.car.innerHTML = svgCar(color);
    this.finish.className = 'finish';
    this.finish.innerHTML = svg();
  }

  get getNode() {
    return {
      car: this.car,
      line: this.road,
    };
  }

  public render() {
    return this.container;
  }
}
