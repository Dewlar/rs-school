import './scss/style.scss';
import { matricees } from "./js/matrices";
import { createNode } from "./js/functions-lib";
import { Field } from "./js/field";
const nonogramsSizes = [5,10,15];
let table = null;
// console.log(matricees);
const field = createNode('div', ['field']);

window.onload = function () {
  // const newField = new Field(matricees[0].matrix.length, matricees[0].matrix, matricees[0].image);
  // const newField = new Field(matricees[1].matrix.length, matricees[1].matrix, matricees[1].image);
  // const newField = new Field(matricees[2].matrix.length, matricees[2].matrix, matricees[2].image);
  const gameContainer = createNode('div', ['container']);
  // table = newField.generateField();
  newGame(2);
  // field.append(newGame(2))
  gameContainer.append(createTab(), field);
  // gameContainer.append();
  document.body.append(gameContainer);

  // openCity(document.querySelector('.tab-links'), 'small');
  // document.querySelector('.tab').addEventListener('click', e => openTab(e.target));
};

function newGame(index){
  if (table) table.remove();
  const newField = new Field(matricees[index].matrix.length, matricees[index].matrix, matricees[index].image);
  table = newField.generateField()
  field.append(table)
  // return table;
}

function createTab() {
  const difficultNavigation = createNode('nav', ['difficult']);
  const tab = createNode('div', ['tab']);
  const small = createNode('div', ['tab-links', 'small'], null, 'small');
  const medium = createNode('div', ['tab-links', 'medium'], null, 'medium');
  const large = createNode('div', ['tab-links', 'large'], null, 'large');
  const random = createNode('div', ['tab-links', 'random'], null, 'random');
  tab.append(small, medium, large, random);
  difficultNavigation.append(tab);
  /////////
  nonogramsSizes.forEach(size => {
    difficultNavigation.append(createTabButtons(size))
  });
  // difficultNavigation.append(createTabButtons());
  tab.addEventListener('click', e => openTab(e.target));

  return difficultNavigation;
}

function createTabButtons(size) {
  let tabContent;

  const matrix = matricees.filter(el => el.size === size);

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
      tabContent.append(createNode('div', ['tab-links'], {
        'data-size': el.size,
        'data-name': el.name,
      }, el.name));
    })

  tabContent.addEventListener('click', (e) => {
    const index = matricees.findIndex(el => el.name === e.target.dataset.name)
    newGame(index);
  })

  return tabContent;
}

function openTab(element) {
  console.log('open tab');

  const tabContent = document.querySelectorAll(".tab-content");
  tabContent.forEach(tab => tab.style.display = 'none');

  const tabLinks = document.querySelectorAll(".tab-links");
  tabLinks.forEach(link => link.classList.remove('active'));

  if (element.classList.contains('small'))
    document.getElementById('small').style.display = "flex";
  if (element.classList.contains('medium'))
    document.getElementById('medium').style.display = "flex";
  if (element.classList.contains('large'))
    document.getElementById('large').style.display = "flex";

  element.classList.add('active');
}
