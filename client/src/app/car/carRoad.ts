import { svg, svgCar, svgFire, svgSmoke /* , svgMoto */ } from './svg/svg';
import Button from '../components/button';

export default class CarRoad {
  private readonly container: HTMLDivElement;

  private readonly road: HTMLDivElement;

  private readonly car: HTMLDivElement;

  private readonly finish: HTMLDivElement;

  private readonly start: Button;

  private readonly stop: Button;

  private readonly btnWrapper: HTMLDivElement;

  private readonly fire: HTMLDivElement;

  private smoke: HTMLDivElement;

  constructor(private color: string) {
    this.container = document.createElement('div');
    this.road = document.createElement('div');
    this.car = document.createElement('div');
    this.finish = document.createElement('div');
    this.start = new Button('start', 'start');
    this.stop = new Button('stop', 'stop');
    this.fire = document.createElement('div');
    this.smoke = document.createElement('div');
    this.road.append(this.car, this.finish);

    this.btnWrapper = document.createElement('div');
    this.btnWrapper.append(this.start.node, this.stop.node);
    this.container.append(this.btnWrapper, this.road);
    this.addAttribute();
  }

  private addAttribute() {
    this.container.className = 'car-road';
    this.road.className = 'road';
    this.car.className = 'car';
    this.car.innerHTML = svgCar(this.color);
    this.car.append(this.fire, this.smoke);
    this.fire.innerHTML = svgFire();
    this.smoke.innerHTML = svgSmoke();
    this.finish.className = 'finish';
    this.finish.innerHTML = svg();
    this.stop.disable();
    this.btnWrapper.className = 'start-stop-wrapper';
    this.fire.className = 'fire';
    this.smoke.className = 'smoke';
  }

  get getNode() {
    return {
      start: this.start.node,
      stop: this.stop.node,
      car: this.car,
      line: this.road,
      fire: this.fire,
      smoke: this.smoke,
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
