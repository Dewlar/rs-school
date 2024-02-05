import { createNode } from "./functions-lib";

export class RankTable {
  constructor() {
  }

  getRankTable(ranks) {
    const container = createNode('div', ['modal__scores']);
    const title = createNode('h2', ['modal__title'], null, 'Scores');
    const table = createNode('div', ['modal__table']);
    container.append(title, table);

    table.append(this.#createTableRow('modal__table-header', '№', 'Name', 'Difficulty', 'Time'));
    ranks.forEach((rank, i) => {
      const row = this.#createTableRow('modal__table-row', i+1, rank.name, rank.size, rank.time);
      table.append(row);
    });

    return container;
  }

  #createTableRow(className, n, name, difficulty, time) {
    const row = createNode('div', [className]);
    const sN = createNode('span', null, null, n);
    const sName = createNode('span', null, null, name);
    const sDifficulty = createNode('span', null, null, difficulty);
    const sTime = createNode('span', null, null, time);
    row.append(sN, sName, sDifficulty, sTime);

    return row;
  }
}
