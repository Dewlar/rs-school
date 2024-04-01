import Button from './button';
import Input from './input';
import { getRandomColor } from '../libs/lib';
import './carBuilderPanel.scss';

export default class CarBuilderPanel {
  private readonly container: HTMLDivElement;

  private inputCarName: Input;

  private inputColor: Input;

  private button: Button;

  getId: number;

  selectedCar: { name: undefined | HTMLDivElement; color: undefined | HTMLDivElement };

  constructor(private buttonName: string) {
    this.container = document.createElement('div');
    this.container.className = 'car-builder-panel';
    this.inputCarName = new Input('text');
    this.inputColor = new Input('color');
    this.button = new Button(this.buttonName);
    this.getId = 0;
    this.selectedCar = { name: undefined, color: undefined };
    this.setAttribute();
  }

  setAttribute() {
    this.inputCarName.node.value = '';
    this.inputColor.node.value = getRandomColor();
    this.inputCarName.node.className = 'input-car-name';
    this.inputColor.node.className = 'input-color-picker';
  }

  disable() {
    this.inputCarName.disable();
    this.inputColor.disable();
    this.button.disable();
  }

  enable() {
    this.inputCarName.enable();
    this.inputColor.enable();
    this.button.enable();
  }

  get carBuilderPanelElements() {
    return {
      name: this.inputCarName.node,
      color: this.inputColor.node,
      button: this.button.node,
    };
  }

  render() {
    this.container.append(this.inputCarName.node, this.inputColor.node, this.button.node);
    return this.container;
  }
}
