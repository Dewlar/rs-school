import './scss/style.scss';
import { matricees } from "./js/matrices";
import { createNode } from "./js/functions-lib";
import { Field } from "./js/field";

console.log(matricees);

window.onload = function () {
  const newField = new Field(matricees[0].matrix.length, matricees[0].matrix, matricees[0].image);
  // const newField = new Field(matricees[1].matrix.length, matricees[1].matrix, matricees[1].image);
  // const newField = new Field(matricees[2].matrix.length, matricees[2].matrix, matricees[2].image);
  const gameContainer = createNode('div', ['container']);
  gameContainer.append(newField.generateField());
  document.body.append(gameContainer);
  listeners();
};

const listeners = () => {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell) => {
    cell.onclick = () => {
      cell.classList.toggle("dark");
    };
  });
};
