import { getCars, getWinners } from '../api/api';
import { GarageData, ICar, IOrder, ISort, IWinners } from '../api/interface';
import { svgCar } from '../car/svg/svg';
import './winners.scss';
import PaginationButton from '../components/paginationButton';
import PageDataCounter from '../components/pageDataCounter';

export default class Winners {
  private readonly container: HTMLDivElement;

  sort: ISort;

  order: IOrder;

  page: number;

  pageWinners: HTMLDivElement;

  listWinner: HTMLDivElement;

  private paginationButton: PaginationButton;

  private pageDataCounter: PageDataCounter;

  constructor() {
    this.container = document.createElement('div');
    this.pageWinners = document.createElement('div');
    this.listWinner = document.createElement('div');
    this.paginationButton = new PaginationButton();
    this.pageDataCounter = new PageDataCounter();
    this.order = 'ASC';
    this.sort = 'id';
    this.page = 1;
    this.addClass();
    this.addListeners();
  }

  addClass() {
    this.container.className = 'winners-container';
    this.pageWinners.className = 'page-winners';
    this.listWinner.className = 'list-winner';
  }

  async createListWinner() {
    const winCars: ICar[] = [];
    const winners: {
      result: IWinners[];
      totalCount: string;
    } = await getWinners(this.page, this.sort, this.order);
    const allCars: GarageData = await getCars(1, 9999);
    if (winners && allCars) {
      winners.result.forEach((winner) => {
        const winCar = allCars.items.find((car) => car.id === winner.id);
        if (winCar) winCars.push(winCar);
      });
    }
    this.checkPaginationButtonStatus(Number(winners.totalCount));
    this.pageDataCounter.updateState(this.page, 'Winners', Number(winners.totalCount));
    this.listWinner.innerHTML = '';
    winners.result.forEach((winner, i) => {
      this.createCarWinner(winner, i, winCars[i]);
    });
  }

  changePage(value: 'next' | 'prev') {
    if (value === 'next') this.page += 1;
    if (value === 'prev') this.page -= 1;
    this.createListWinner();
  }

  addListeners() {
    this.paginationButton.getNode.next.addEventListener('click', () => this.changePage('next'));
    this.paginationButton.getNode.prev.addEventListener('click', () => this.changePage('prev'));
  }

  checkPaginationButtonStatus(count: number) {
    if (this.page <= 1) this.paginationButton.getButton.prev.disable();
    else this.paginationButton.getButton.prev.enable();
    if (count / 10 <= this.page) this.paginationButton.getButton.next.disable();
    else this.paginationButton.getButton.next.enable();
  }

  async createCarWinner(winner: IWinners, index: number, car: ICar) {
    const container: HTMLDivElement = document.createElement('div');
    container.innerHTML = `
      <div class='number'>${index + 1}</div>
      <div class="car">${svgCar(car.color)}</div>
      <div class='name'>${car.name}</div>
      <div class='wins'>${winner.wins}</div>
      <div class='time'>${winner.time}</div>
    `;
    container.className = 'winner-item';
    this.listWinner.append(container);
  }

  render() {
    this.createListWinner();
    this.pageWinners.append(this.pageDataCounter.render(), this.listWinner, this.paginationButton.render());
    this.container.append(this.pageWinners);
    return this.container;
  }
}
