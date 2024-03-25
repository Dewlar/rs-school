import { ICar } from '../api/interface';

export default class Car {
  private container: HTMLDivElement;

  private title: HTMLHeadingElement;

  public id: number;

  private data: ICar;

  constructor(
    private car: ICar,
    private renderList: (id?: number) => Promise<void>
  ) {
    this.container = document.createElement('div');
    this.container.className = 'car-item';
    this.title = document.createElement('h4');
    this.title.textContent = car.name;
    this.id = car.id;

    this.data = car;
  }

  render() {
    return this.container;
  }
}
