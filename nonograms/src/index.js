import './scss/style.scss';
import { matricees } from "./js/matrices";
import { createNode } from "./js/functions-lib";
import { Field } from "./js/field";
let gameField;
const nonogramsSizes = [5, 10, 15];
let table = null;
const tabsContent = [];
const tabLinks = [];
const tabs = [];
// let isFirstTime = true;
const field = createNode('div', ['field']);
//todo: field listener context menu with `e.preventDefault();`

// window.addEventListener('resize', () => {
//   const scaleRatio = parseInt(getComputedStyle(field).width) / parseInt(getComputedStyle(table).height);
//   table.style.transform = `scale(${scaleRatio})`;
// });

window.onload = function () {
  const gameContainer = createNode('div', ['container']);
  gameContainer.append(createTab(), field);
  document.body.append(gameContainer);
  newGameWithIndex(0);
};

function newGame(index) {
  if (table) table.remove();
  const gameData = matricees[index];
  gameField = new Field(gameData.matrix.length, gameData.matrix, gameData.image);
  table = gameField.generateField();
  field.append(table);
  // let cells = { 5: 87, 10: 48, 15: 33 };
  // document.documentElement.style.setProperty('--cell', cells[gameData.size]+'px');
}

function createTab() {
  const difficultNavigation = createNode('nav', ['difficult']);
  const tab = createNode('div', ['tabs']);
  // const firstLoadClasses = isFirstTime ? ['tab-links', 'small', 'active'] : ['tab-links', 'small'];
  const small = createNode('div', ['tab-links', 'small'], { 'data-size': 5 }, 'small');
  const medium = createNode('div', ['tab-links', 'medium'], { 'data-size': 10 }, 'medium');
  const large = createNode('div', ['tab-links', 'large'], { 'data-size': 15 }, 'large');
  const random = createNode('div', ['tab-links', 'random'], { 'data-size': 0 }, 'random');
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
      // console.log(e.target.classList.contains('random'));
      !e.target.classList.contains('random') ? openTab(e.target) : newGameWithIndex();
  });

  return difficultNavigation;
}

function newGameWithIndex(i) {
  let index;
  if (typeof i === 'number' && i >= 0) index = i;
  else index = Math.floor(Math.random() * matricees.length);

  newGame(index);
  tabLinks.forEach(el => {
    if (el.dataset.name === matricees[index].name) {
      switchActiveClass(el);
    }
  });
  tabs.forEach(el => {
    if (matricees[index].size === +el.dataset.size) openTab(el);
  });
}

function createTabButtons(size) {
  let tabContent;

  const matrix = matricees.filter(el => el.size === size);
  // const firstLoadClasses = isFirstTime ? ['tab-content', 'active'] : ['tab-content'];

  if (matrix[0].size === 5) {
    tabContent = createNode('div', ['tab-content'], { id: 'small' });
  }
  if (matrix[0].size === 10) {
    tabContent = createNode('div', ['tab-content'], { id: 'medium' });
  }
  if (matrix[0].size === 15) {
    tabContent = createNode('div', ['tab-content'], { id: 'large' });
  }

  matrix.forEach(el => {
    // let firstLoadClasses;
    // if (isFirstTime) {
    //   firstLoadClasses = ['tab-links', 'active'];
    //   isFirstTime = false;
    // } else {
    //   firstLoadClasses = ['tab-links'];
    // }
    const tabLink = createNode('div', ['tab-links'], {
      'data-size': el.size,
      'data-name': el.name,
    }, el.name);
    // const firstLoadClasses = isFirstTime ? ['tab-links', 'active'] : ['tab-links'];
    tabLinks.push(tabLink);
    tabContent.append(tabLink);
  });

  tabContent.addEventListener('click', (e) => {
    let index;
    if (e.target.classList.contains('tab-links')) {
      index = matricees.findIndex(el => el.name === e.target.dataset.name);
      newGame(index);
    }
    // console.log('asd');
    switchActiveClass(e.target);
    // tabLinks.forEach(link => link.classList.remove('active'));
    // e.target.classList.add('active');
  });

  // console.log('tab-links: ',tabLinks);
  return tabContent;
}

function switchActiveClass(element) {
  tabLinks.forEach(link => link.classList.remove('active'));
  element.classList.add('active');
}

function openTab(element) {

  // console.log('open tab');
  // console.log(element);

  // const tabContent = document.querySelectorAll(".tab-content");
  // tabsContent.forEach(tab => tab.style.display = 'none');
  tabsContent.forEach(tab => tab.classList.remove('active'));

  // console.log(tabsContent);
  // const tabLinks = document.querySelectorAll(".tab-links");
  tabs.forEach(link => link.classList.remove('active'));

  const [small, medium, large] = tabsContent;
  // console.log(tabsContent);
  if (element.classList.contains('small')) small.classList.add('active');
  // document.getElementById('small').classList.add('active');
  //   document.getElementById('small').style.display = "flex";
  if (element.classList.contains('medium')) medium.classList.add('active');
  // document.getElementById('medium').classList.add('active');
  //   document.getElementById('medium').style.display = "flex";
  if (element.classList.contains('large')) large.classList.add('active');
  // document.getElementById('large').classList.add('active');
  //   document.getElementById('large').style.display = "flex";

  element.classList.add('active');
}
