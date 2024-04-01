import './pageDataCounter.scss';

export default class PageDataCounter {
  private readonly pageNumber: HTMLHeadingElement;

  private readonly container: HTMLDivElement;

  private readonly carCount: HTMLHeadingElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'page-data-counter';
    this.pageNumber = document.createElement('p');
    this.carCount = document.createElement('p');
  }

  updateState(page: number, counterTitle: string, count: number = 0): void {
    this.pageNumber.innerHTML = `Page: ${page}`;
    this.carCount.innerHTML = `${counterTitle}: ${count}`;
  }

  render() {
    this.container.append(this.pageNumber, this.carCount);
    return this.container;
  }
}
