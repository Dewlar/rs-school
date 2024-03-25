import './car.scss';
import { ICar } from '../api/interface';
import CarRoad from './carRoad';

export default class Car {
  private readonly container: HTMLDivElement;

  private readonly title: HTMLHeadingElement;

  public id: number;

  private data: ICar;

  private carRoad: CarRoad;

  constructor(
    private car: ICar,
    private renderList: (id?: number) => Promise<void>
  ) {
    this.container = document.createElement('div');
    this.container.className = 'car-item';
    this.title = document.createElement('h4');
    this.title.textContent = car.name;
    this.id = car.id;

    this.carRoad = new CarRoad(car.color);

    this.data = car;
    this.createCar();
  }

  createCar() {
    this.container.append(this.title, this.carRoad.render());
  }

  render() {
    return this.container;
  }
}
