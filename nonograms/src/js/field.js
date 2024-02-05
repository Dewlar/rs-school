import { createNode } from "./functions-lib";
import { createVictoryMessage } from "./functions-lib";
import { Modal } from "./modal";

export class Field {
  constructor(timer, timerNode, gameData, saveGameKeyStorage, bestScoreKeyStorage) {
    this.cells = [];
    this.cellsMatrix = [];
    this.timer = timer;
    this.timerNode = timerNode;
    this.mousedown = false;
    this.mouseButton = 1;
    this.rowHints = [];
    this.columnHints = [];
    this.isMove = false;
    this.table = null;
    this.isGameBegin = false;
    this.gameData = gameData;
    this.saveGameKeyStorage = saveGameKeyStorage;
    this.bestScoreKeyStorage = bestScoreKeyStorage;
  };

  generateField() {
    for (let i = 0; i < this.gameData.size + 1; i++) {
      const row = [];
      const matrixRow = [];
      for (let j = 0; j < this.gameData.size + 1; j++) {
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
      if (!this.isGameBegin) {
        this.isGameBegin = true;
        this.timer.start();
      }
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
    // this.getSolution();
    // this.saveSolution();
    return table;
  }

  #getMatrix() {
    return this.cellsMatrix.map(row => row.map(cell => cell.classList.contains('cell-on') ? 1 : 0));
    // const matrix = [];
    // for (let i = 1; i < this.gameData.size + 1; i++) {
    //   const row = [];
    //   for (let j = 1; j < this.gameData.size + 1; j++) {
    //     row.push(this.cells[i][j].classList.contains('cell-on') ? 1 : 0);
    //   }
    //   matrix.push(row);
    // }
    // return matrix;
  }

  checkResult(table) {
    if (this.#getMatrix().toString() === this.gameData.matrix.toString()) {
      table.style.pointerEvents = 'none';
      console.log('ты выйграл', this.gameData.size, this.gameData.name, this.timerNode.textContent);
      this.timer.pause();
      const currentScore = {
        size: this.gameData.size + 'x' + this.gameData.size,
        name: this.gameData.name,
        time: this.timerNode.textContent,
        date: new Date().getTime(),
      };

      if (localStorage.getItem(this.bestScoreKeyStorage)) {
        const bestScore = JSON.parse(localStorage.getItem(this.bestScoreKeyStorage));
        bestScore.push(currentScore);
        if (bestScore.length > 5) {
          const min = bestScore.reduce((min, el) => min.date < el.date ? min : el)
          const minIndex = bestScore.indexOf(min);
          bestScore.splice(minIndex, 1);
        }
        bestScore.sort((a, b) => this.#getSeconds(a.time) - this.#getSeconds(b.time));

        localStorage.setItem(this.bestScoreKeyStorage, JSON.stringify(bestScore));
      } else {
        localStorage.setItem(this.bestScoreKeyStorage, JSON.stringify([currentScore]));
      }

      const modal = new Modal();
      modal.buildModal(createVictoryMessage(this.gameData.name, this.timerNode.textContent))
      ;
    }
  }

  #getSeconds(str) {
    // console.log(str);
    const seconds = str.split(':').map(t => parseInt(t));
    return seconds[0] * 60 + seconds[1];
  }

  resetSolution() {
    this.isGameBegin = false;
    this.cellsMatrix.map(row => row.map(cell => {
      cell.classList.remove('cell-on');
      cell.innerHTML = '';
    }));
    this.table.style.pointerEvents = 'auto';
  }

  getSolution() {
    this.isGameBegin = false;
    this.table.style.pointerEvents = 'none';
    for (let i = 0; i < this.gameData.size; i++) {
      for (let j = 0; j < this.gameData.size; j++) {
        setTimeout(() => {
          this.#changeCellState(i, j);
        }, i * this.gameData.size * 10 + j * 10);
      }
    }
  }

  #getMatrixCellsState() {
    return this.cellsMatrix.map(row => row.map(cell => {
      if (cell.classList.contains('cell-on')) return 1;
      if (cell.textContent === '') return 0;
      else return 2;
    }));
  }

  saveSolution(gameIndex, time) {
    this.table.style.pointerEvents = 'auto';
    // const currentMatrix = JSON.stringify();
    const savedGame = JSON.stringify({
      'index': gameIndex,
      'time': time,
      'matrix': this.#getMatrixCellsState(),
    });
    localStorage.setItem(this.saveGameKeyStorage, savedGame);
  }

  loadSolution(matrix) {
    this.isGameBegin = true;
    for (let i = 0; i < this.gameData.size; i++) {
      for (let j = 0; j < this.gameData.size; j++) {
        if (matrix[i][j] === 1) {
          this.cellsMatrix[i][j].classList.add('cell-on');
          this.cellsMatrix[i][j].innerHTML = '';
        }
        if (matrix[i][j] === 0) {
          this.cellsMatrix[i][j].classList.remove('cell-on');
          this.cellsMatrix[i][j].innerHTML = '';
        }
        if (matrix[i][j] === 2) {
          this.cellsMatrix[i][j].classList.remove('cell-on');
          this.cellsMatrix[i][j].innerHTML = '&#x2717;';
        }
      }
    }
  }

  #changeCellState(i, j) {
    if (this.gameData.matrix[i][j] === 0) {
      this.cellsMatrix[i][j].classList.remove('cell-on');
      this.cellsMatrix[i][j].innerHTML = '&#x2717;';
    }
    if (this.gameData.matrix[i][j] === 1) {
      this.cellsMatrix[i][j].classList.add('cell-on');
      this.cellsMatrix[i][j].innerHTML = '';
    }
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
    const img = createNode('img', ['preview'], { src: this.gameData.image, alt: 'preview image' });
    this.cells[0][0].append(img);
    for (let i = 1; i < this.gameData.size + 1; i++) {
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
    this.rowHints = this.gameData.matrix.map(getRowHints);
    this.columnHints = Array.from({ length: this.gameData.matrix[0].length }, (_, i) => getColumnHints(this.gameData.matrix, i));

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
