import CarBuilderPanel from '../components/carBuilderPanel';
import { createCar, updateCar } from '../api/api';
import { svgCar /* , svgMoto */ } from '../car/svg/svg';
import ControlButtons from '../components/controlPanelButtons';
import './controlPanel.scss';

export default class ControlPanel {
  private readonly container: HTMLDivElement;

  private readonly createInput: CarBuilderPanel;

  private readonly updateInput: CarBuilderPanel;

  private readonly controlButtons: ControlButtons;

  constructor(private renderList: (id?: number) => Promise<void>) {
    this.container = document.createElement('div');
    this.container.className = 'panel';
    this.createInput = new CarBuilderPanel('create');
    this.updateInput = new CarBuilderPanel('update');
    this.updateInput.disable();
    this.controlButtons = new ControlButtons();

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

  private async updateBtn() {
    await updateCar(this.updateInput.getId, {
      name: this.updateInput.carBuilderPanelElements.name.value,
      color: this.updateInput.carBuilderPanelElements.color.value,
    });
    if (this.updateInput.selectedCar.color && this.updateInput.selectedCar.name) {
      this.updateInput.selectedCar.name.textContent = this.updateInput.carBuilderPanelElements.name.value;
      this.updateInput.selectedCar.color.innerHTML = svgCar(this.updateInput.carBuilderPanelElements.color.value);
    }
    this.updateInput.disable();
  }

  addListeners() {
    this.createInput.carBuilderPanelElements.button.addEventListener('click', () => this.createCar());
    this.updateInput.carBuilderPanelElements.button.addEventListener('click', () => this.updateBtn());
  }

  get getNode() {
    return {
      create: this.createInput.carBuilderPanelElements,
      update: this.updateInput.carBuilderPanelElements,
      buttons: this.controlButtons,
    };
  }

  get carBuilderPanels() {
    return {
      create: this.createInput,
      update: this.updateInput,
      buttons: this.controlButtons.controlButtons,
    };
  }

  public render() {
    this.container.append(this.createInput.render(), this.updateInput.render(), this.controlButtons.render());
    return this.container;
  }
}
