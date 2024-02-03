import { createNode } from "./functions-lib";

export class Field {
  constructor(size, matrix, imageUrl) {
    this.cells = [];
    this.cellsMatrix = [];
    this.size = size;
    this.mousedown = false;
    this.mouseButton = 1;
    this.matrix = matrix;
    this.imageUrl = imageUrl;
    this.rowHints = [];
    this.columnHints = [];
    this.isMove = false;
    this.table = null;
  };

  generateField() {
    for (let i = 0; i < this.size + 1; i++) {
      const row = [];
      const matrixRow = [];
      for (let j = 0; j < this.size + 1; j++) {
        let cell;
        if (i === 0) {
          cell = createNode('th', ['hint', 'hint-c']);
        } else if (j === 0) {
          cell = createNode('th', ['hint', 'hint-r']);
        } else {
          cell = createNode('td', ['cell']);
          matrixRow.push(cell);
        }
        row.push(cell);
      }
      this.cells.push(row);
      if (i !== 0) this.cellsMatrix.push(matrixRow);
    }
    // const field = createNode('div', ['field']);
    const table = createNode('table', ['table']);
    const rows = this.cells.map(row => {
      const newRow = createNode('tr', ['row']);
      newRow.append(...row);
      return newRow;
    });
    table.append(...rows);
    // field.append(table);
    this.#getHints();
    this.#writeHintsIntoTable();

    table.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('cell')) {
        if (e.button === 0) {
          this.mouseButton = 0;
        } else if (e.button === 2) {
          this.mouseButton = 2;
        }
        this.mousedown = true;
        this.isMove = !e.target.classList.contains('cell-on');
        this.#changeCellFill(e.target, this.mouseButton);
      }
    });
    table.addEventListener('mouseover', (e) => {
      if (this.mousedown && e.target.classList.contains('cell')) {
        this.#changeCellFill(e.target, this.mouseButton);
      }
    });
    table.addEventListener('mouseup', () => {
      this.mousedown = false;
      this.checkResult(table);
    });
    table.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.mouseButton = 2;
      this.#changeCellFill(e.target, this.mouseButton);
    });

    this.table = table;
    return table;
  }

  getMatrix() {
    return this.cellsMatrix.map(row => row.map(cell => cell.classList.contains('cell-on') ? 1 : 0));
    // const matrix = [];
    // for (let i = 1; i < this.size + 1; i++) {
    //   const row = [];
    //   for (let j = 1; j < this.size + 1; j++) {
    //     row.push(this.cells[i][j].classList.contains('cell-on') ? 1 : 0);
    //   }
    //   matrix.push(row);
    // }
    // return matrix;
  }

  checkResult(table) {
    if (this.getMatrix().toString() === this.matrix.toString()) {
      table.style.pointerEvents = 'none';
      console.log('ты выйграл');
    }
  }

  reset() {
    this.cellsMatrix.map(row => row.map(cell => {
      cell.classList.remove('cell-on');
      cell.innerHTML = '';
    }))
    this.table.style.pointerEvents = 'auto';
  }

  #changeCellFill(cell, button) {
    if (button === 0) {
      cell.innerHTML = '';
      cell.classList.toggle('cell-on', this.isMove);
    }
    if (button === 2) {
      cell.innerHTML = '&#x2717;';
      cell.classList.remove('cell-on');
      // cell.classList.add('cell-x');
    }
  }

  #writeHintsIntoTable() {
    const img = createNode('img', ['preview'], { src: this.imageUrl, alt: 'preview image' });
    this.cells[0][0].append(img);
    for (let i = 1; i < this.size + 1; i++) {
      let hintR = [];
      let hintC = [];
      for (let j = 0; j < this.rowHints[i - 1].length; j++) {
        const span = document.createElement('span');
        span.textContent = this.rowHints[i - 1][j];
        hintR.push(span);
      }
      for (let j = 0; j < this.columnHints[i - 1].length; j++) {
        const span = document.createElement('span');
        span.textContent = this.columnHints[i - 1][j];
        hintC.push(span);
      }
      const rowWrap = createNode('div', ['hint_row']);
      rowWrap.append(...hintR);
      const colWrap = createNode('div', ['hint_column']);
      colWrap.append(...hintC);
      this.cells[i][0].append(rowWrap);
      this.cells[0][i].append(colWrap);
      // this.cells[i][0].classList.add('hint');
      // this.cells[0][i].classList.add('hint');
    }
  }

  #getHints() {
    this.rowHints = this.matrix.map(getRowHints);
    this.columnHints = Array.from({ length: this.matrix[0].length }, (_, i) => getColumnHints(this.matrix, i));

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
  }
}
