import CarBuilderPanel from '../components/carBuilderPanel';

export default class ControlPanel {
  private readonly container: HTMLDivElement;

  private readonly createInput: CarBuilderPanel;

  private readonly updateInput: CarBuilderPanel;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'panel';
    this.createInput = new CarBuilderPanel('create');
    this.updateInput = new CarBuilderPanel('update');
    this.updateInput.disable();
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
