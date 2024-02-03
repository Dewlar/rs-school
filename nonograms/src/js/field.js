import { createNode } from "./functions-lib";

export class Field {
  constructor(size, matrix, imageUrl) {
    this.cells = [];
    this.size = size;
    this.mousedown = false;
    this.matrix = matrix;
    this.imageUrl = imageUrl;
    this.rowHints = [];
    this.columnHints = [];
  };

  generateField() {
    const rowHints = this.matrix.map(getRowHints);
    const columnHints = Array.from({ length: this.matrix[0].length }, (_, i) => getColumnHints(this.matrix, i));

    for (let i = 0; i < this.size + 1; i++) {
      const row = [];
      for (let j = 0; j < this.size + 1; j++) {
        const cell = createNode('div', ['cell']);
        // let cell;
        // if (i === 0) {
        //   cell = createNode('div', ['hint', 'hint_row']);
        // } else if(j === 0){
        //   cell = createNode('div', ['hint', 'hint_column']);
        // } else {
        //   cell = createNode('div', ['cell']);
        // }
        row.push(cell);
      }
      this.cells.push(row);
    }
    const field = createNode('div', ['field']);
    const rows = this.cells.map(row => {
      const newRow = createNode('div', ['row']);
      newRow.append(...row);
      return newRow;
    });
    field.append(...rows);
    this.#writeClues(rowHints, columnHints);

    // console.log(rows);

    function getRowHints(row) {
      const hints = [];
      let currentCount = 0;

      for (const element of row) {
        if (element === 1) {
          currentCount++;
        } else if (currentCount > 0) {
          hints.push(currentCount);
          currentCount = 0;
        }
      }

      if (currentCount > 0) {
        hints.push(currentCount);
      }

      return hints.length === 0 ? [0] : hints;
    }

    function getColumnHints(array, columnIndex) {
      const column = array.map(row => row[columnIndex]);
      return getRowHints(column);
    }

    // console.log(rowHints, columnHints);
    return field;
  }

  #writeClues(rowHints, columnHints) {
    const img = createNode('img', ['preview'], { src: this.imageUrl, alt: 'preview image' });
    this.cells[0][0].append(img);
    for (let i = 1; i < this.size + 1; i++) {
      let hintR = [];
      let hintC = [];
      for (let j = 0; j < rowHints[i - 1].length; j++) {
        const span = document.createElement('span');
        span.textContent = rowHints[i - 1][j];
        hintR.push(span);
      }
      for (let j = 0; j < columnHints[i - 1].length; j++) {
        const span = document.createElement('span');
        span.textContent = columnHints[i - 1][j];
        hintC.push(span);
      }
      this.cells[i][0].append(...hintR);
      this.cells[0][i].append(...hintC);
      this.cells[i][0].classList.add('hint');
      this.cells[0][i].classList.add('hint');
    }
  }
}
