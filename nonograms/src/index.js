import './scss/style.scss';
import { matricees } from "./js/matrices";
import { createNode } from "./js/functions-lib";
import { Field } from "./js/field";
import { Timer } from "./js/timer";
import { Modal } from "./js/modal";
import { RankTable } from "./js/rank-table";

let save;
let gameField;
const nonogramsSizes = [5, 10, 15];
let table = null;
const tabsContent = [];
const tabLinks = [];
const tabs = [];
const field = createNode('div', ['field']);
const timerNode = createNode('div', ['timer'], null, '00:00');
const timer = new Timer(timerNode);
//todo: field listener context menu with `e.preventDefault();`
let currentGameIndex;
const saveGameKeyStorage = 'NonogramsSavedGame2207';
const bestScoreKeyStorage = 'NonogramsBestSc0res2207';
const modal = new Modal();
// let tableWidth;
let tableSize;
window.addEventListener('resize', () => {
  // console.log(parseInt(getComputedStyle(field).width) - parseInt(getComputedStyle(table).width));
  // console.log('table', tableWidth, 'field', parseInt(getComputedStyle(field).width));
  // const scaleRatio = parseInt(getComputedStyle(field).width) / tableWidth;
  // table.style.transform = `scale(${scaleRatio})`;
  setTableCellsSize();
});

window.onload = function () {
  const gameContainer = createNode('div', ['container']);
  const fieldWrapper = createNode('div', ['field-wrapper']);
  fieldWrapper.append(field, createOptions());
  gameContainer.append(createHeader(), createTab(), fieldWrapper);
  document.body.append(gameContainer);
  newGameWithIndex(0);
  // modal.buildModal('asd')
};

function newGame(index) {
  currentGameIndex = index;
  save.classList.remove('disabled');
  timer.reset();
  if (table) table.remove();
  const gameData = matricees[index];
  gameField = new Field(timer, timerNode, gameData, saveGameKeyStorage, bestScoreKeyStorage);
  table = gameField.generateField();
  field.append(table);
  field.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // timer.reset();
  // timer.start();
  // let cells = { 5: 7, 10: 4, 15: 2.8 };
  // document.documentElement.style.setProperty('--cell', cells[gameData.size]+'rem');
  // tableWidth = parseInt(getComputedStyle(table).width);
  tableSize = gameData.size;
  setTableCellsSize();
}

function setTableCellsSize() {
  if (window.matchMedia('(width > 500px)').matches) {
    let cells = { 5: 7, 10: 4, 15: 2.8 };
    document.documentElement.style.setProperty('--cell', cells[tableSize] + 'rem');
  }
  if (window.matchMedia('(max-width: 500px)').matches) {
    let cells = { 5: 6, 10: 3, 15: 2.4 };
    document.documentElement.style.setProperty('--cell', cells[tableSize] + 'rem');
  }
  if (window.matchMedia('(max-width: 430px)').matches) {
    let cells = { 5: 6, 10: 3, 15: 1.9 };
    document.documentElement.style.setProperty('--cell', cells[tableSize] + 'rem');
  }
}

function createHeader() {
  const header = createNode('div', ['header']);
  const scores = createNode('div', ['scores', 'btn'], null, 'Scores');
  const themes = createNode('div', ['themes']);

  header.append(scores, timerNode, themes);

  header.addEventListener('click', ({ target }) => {
    if (target.classList.contains('themes')) document.body.classList.toggle('theme-dark');
    if (target.classList.contains('scores')) showScore();
  });

  return header;
}

function showScore() {
  const scoreTable = new RankTable();
  const rankingArray = JSON.parse(localStorage.getItem(bestScoreKeyStorage));
  modal.buildModal(scoreTable.getRankTable(rankingArray ? rankingArray : []));
  // console.log('local', JSON.parse(localStorage.getItem(bestScoreKeyStorage)))
}

function createTab() {
  const difficultNavigation = createNode('nav', ['difficult']);
  const tab = createNode('div', ['tabs']);
  const small = createNode('div', ['tab-links', 'small', 'btn'], { 'data-size': 5 }, 'Small');
  const medium = createNode('div', ['tab-links', 'medium', 'btn'], { 'data-size': 10 }, 'Medium');
  const large = createNode('div', ['tab-links', 'large', 'btn'], { 'data-size': 15 }, 'Large');
  const random = createNode('div', ['tab-links', 'random', 'btn'], { 'data-size': 0 }, 'Random');
  tabs.push(small, medium, large, random);
  tab.append(small, medium, large, random);
  difficultNavigation.append(tab);
  /////////
  nonogramsSizes.forEach(size => {
    const tabContent = createTabButtons(size);
    tabsContent.push(tabContent);
    difficultNavigation.append(tabContent);
  });
  // difficultNavigation.append(createTabButtons());
  tab.addEventListener('click', e => {
    if (e.target.classList.contains('tab-links'))
      !e.target.classList.contains('random') ? openTab(e.target) : newGameWithIndex();
  });

  return difficultNavigation;
}

function newGameWithIndex(i) {
  let index;
  if (typeof i === 'number' && i >= 0) index = i;
  else index = Math.floor(Math.random() * matricees.length);

  newGame(index);
  tabLinks.forEach(tabLink => {
    if (tabLink.dataset.name === matricees[index].name) {
      switchActiveClass(tabLink);
    }
  });
  tabs.forEach(el => {
    if (matricees[index].size === +el.dataset.size) openTab(el);
  });
}

function createTabButtons(size) {
  let tabContent;

  const matrix = matricees.filter(el => el.size === size);
  if (matrix[0].size === 5)
    tabContent = createNode('div', ['tab-content'], { id: 'small' });
  if (matrix[0].size === 10)
    tabContent = createNode('div', ['tab-content'], { id: 'medium' });
  if (matrix[0].size === 15)
    tabContent = createNode('div', ['tab-content'], { id: 'large' });

  matrix.forEach(el => {
    const tabLink = createNode('div', ['tab-links', 'btn'], {
      'data-size': el.size,
      'data-name': el.name,
    }, el.name);
    tabLinks.push(tabLink);
    tabContent.append(tabLink);
  });

  tabContent.addEventListener('click', (e) => {
    let index;
    if (e.target.classList.contains('tab-links')) {
      index = matricees.findIndex(el => el.name === e.target.dataset.name);
      newGame(index);
    }
    switchActiveClass(e.target);
  });

  return tabContent;
}

function switchActiveClass(tabLink) {
  tabLinks.forEach(link => link.classList.remove('active'));
  tabLink.classList.add('active');
}

function openTab(element) {

  tabsContent.forEach(tab => tab.classList.remove('active'));

  tabs.forEach(link => link.classList.remove('active'));

  const [small, medium, large] = tabsContent;
  if (element.classList.contains('small')) small.classList.add('active');
  if (element.classList.contains('medium')) medium.classList.add('active');
  if (element.classList.contains('large')) large.classList.add('active');

  element.classList.add('active');
}

function createOptions() {
  const options = createNode('div', ['options']);
  save = createNode('div', ['options__buttons', 'save', 'btn'], null, 'Save game');
  const resume = createNode('div', ['options__buttons', 'resume', 'btn'], null, 'Resume saved game');
  const solution = createNode('div', ['options__buttons', 'solution', 'btn'], null, 'Show solution');
  const reset = createNode('div', ['options__buttons', 'reset', 'btn'], null, 'Reset game field');
  options.append(save, resume, solution, reset);

  options.addEventListener('click', ({ target }) => {
    if (target.classList.contains('save')) {
      gameField.saveSolution(currentGameIndex, timerNode.textContent);
    }

    if (target.classList.contains('resume')) {
      const storageData = localStorage.getItem(saveGameKeyStorage);
      const { index, time, matrix } = JSON.parse(storageData);
      newGameWithIndex(index);
      const [minutes, seconds] = time.split(':').map(t => +t);
      timerNode.textContent = time;
      timer.pause();
      timer.start(minutes, seconds);
      gameField.loadSolution(matrix);
      save.classList.remove('disabled');
    }

    if (target.classList.contains('solution')) {
      gameField.getSolution();
      save.classList.add('disabled');
      timer.reset();
    }

    if (target.classList.contains('reset')) {
      gameField.resetSolution();
      save.classList.remove('disabled');
      timer.reset();
      // timer.start();
    }
  });

  return options;
}
