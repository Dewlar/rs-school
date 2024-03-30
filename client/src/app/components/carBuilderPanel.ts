import Button from './button';
import Input from './input';

export default class InputContainer {
  private readonly container: HTMLDivElement;

  private name: Input;

  private color: Input;

  private button: Button;

  constructor(textBtn: string) {
    this.container = document.createElement('div');
    this.container.className = 'car-builder-panel';
    this.name = new Input('text');
    this.color = new Input('color');
    this.button = new Button(textBtn);
  }

  setColor() {
    const color = `${Math.random().toString(16)}000000`.slice(2, 8);
    this.name.node.value = '';
    this.color.node.value = `#${color}`;
  }

  render() {
    this.container.append(this.name.node, this.color.node, this.button.node);
    return this.container;
  }
}
