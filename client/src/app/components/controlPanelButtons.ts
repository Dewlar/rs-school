import Button from './button';

export default class ControlButtons {
  private readonly container: HTMLDivElement;

  private readonly race: Button;

  private readonly reset: Button;

  private readonly carsGenerator: Button;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'control-buttons';
    this.race = new Button('race', 'race');
    this.reset = new Button('reset', 'reset');
    this.carsGenerator = new Button('generate 100 models', 'cars-generator');
  }

  get getNode() {
    return {
      race: this.race.node,
      reset: this.reset.node,
      generator: this.carsGenerator.node,
    };
  }

  get controlButtons() {
    return {
      race: this.race,
      reset: this.reset,
      generator: this.carsGenerator,
    };
  }

  render() {
    this.container.append(this.race.node, this.reset.node, this.carsGenerator.node);
    return this.container;
  }
}
