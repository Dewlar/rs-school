import Button from '../components/button';
import './pageChangeButton.scss';

export default class PageChangeButton {
  private readonly prev: Button;

  private readonly next: Button;

  private readonly container: HTMLDivElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'page-change-button';
    this.prev = new Button('prev', 'prev');
    this.next = new Button('next', 'next');
  }

  public get getNode(): { prev: HTMLButtonElement; next: HTMLButtonElement } {
    return {
      prev: this.prev.node,
      next: this.next.node,
    };
  }

  public get getButton(): { prev: Button; next: Button } {
    return {
      prev: this.prev,
      next: this.next,
    };
  }

  public render() {
    this.container.append(this.prev.node, this.next.node);
    return this.container;
  }
}
