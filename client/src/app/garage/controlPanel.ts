import CarBuilderPanel from '../components/carBuilderPanel';
import { createCar } from '../api/api';

export default class ControlPanel {
  private readonly container: HTMLDivElement;

  private readonly createInput: CarBuilderPanel;

  private readonly updateInput: CarBuilderPanel;

  constructor(
    private renderList: (id?: number) => Promise<void>,
    private view: () => Promise<void>
  ) {
    this.container = document.createElement('div');
    this.container.className = 'panel';
    this.createInput = new CarBuilderPanel('create');
    this.updateInput = new CarBuilderPanel('update');
    this.updateInput.disable();

    this.addListeners();
  }

  private async createCar() {
    if (this.createInput.carBuilderPanelElements.name.value) {
      await createCar({
        name: this.createInput.carBuilderPanelElements.name.value,
        color: this.createInput.carBuilderPanelElements.color.value,
      });
      this.renderList();
    }
  }

  addListeners() {
    this.createInput.carBuilderPanelElements.button.addEventListener('click', () => this.createCar());
  }

  get getNode() {
    return {
      create: this.createInput.carBuilderPanelElements,
      update: this.updateInput.carBuilderPanelElements,
    };
  }

  public render() {
    this.container.append(this.createInput.render(), this.updateInput.render());
    return this.container;
  }
}
