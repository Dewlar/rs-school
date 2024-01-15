let questions = [];
let guessWordNode;
let letterNodelist = [];
let keyboardButtonsNodelist = [];
let currentQuestionNode;
let mistakeCounterNode;
let word;
let hint;
let guessLetters = [];
let bodyPartsNodelist = [];


window.onload = function () {
  console.log('hangman game started');
  // loadQuestions();
  document.body.append(generateTemplate());
  document.addEventListener('keydown', keyboardPressHandler);
  bodyPartsNodelist = document.querySelectorAll('.body-part');
  startNewGame();
};

const loadQuestions = async () => {
  const response = await fetch("./db/questions.json");
  questions = await response.json();
};

const getQuestion = async () => {
  await loadQuestions();
  // console.log(questions[~~(Math.random() * questions.length)]);
  return questions[~~(Math.random() * questions.length)];
};

const startNewGame = async () => {
  letterNodelist.forEach(el => el.remove());
  letterNodelist = [];
  currentQuestionNode.textContent = '';
  mistakeCounterNode.textContent = '0';
  guessLetters = [];
  bodyPartsNodelist.forEach(bodyPart => bodyPart.classList.add('hide'))
  console.log(bodyPartsNodelist);

  let question = await getQuestion();
  hint = question.hint;
  word = question.word;

  console.log(word, hint);
  currentQuestionNode.textContent = hint;
  createLettersList(word.length);
};

const createLettersList = (letterCount) => {
  for (let i = 0; i < letterCount; i++) {
    let li = document.createElement('li');
    li.className = 'letter';
    li.style.width = `calc(100% / ${letterCount} - 1rem)`;
    letterNodelist.push(li);
    guessWordNode.append(li);
  }
};

// function keyPressHandler(event) {
//   console.log(event.key, event.code);
// };
const keyboardPressHandler = (event) => {
  console.log(event, event.key, event.code);
};
const keyboardClickHandler = (button, letter) => {
  console.log(button, letter);
  button.classList.add('disabled');

  let mistakes = Number(mistakeCounterNode.textContent);

  if (word.includes(letter)) {
    word.split('').forEach((char, i) => {
      if (char === letter) {
        letterNodelist[i].textContent = letter;
        guessLetters.push(letter);
      }
    });
    console.log('есть такая буква', guessLetters);
  } else {
    bodyPartsNodelist[mistakes].classList.remove('hide')
    mistakeCounterNode.textContent = (++mistakes).toString();
  }

  if (mistakes >= 6) gameOver(true);
  if (guessLetters.length === word.length) gameOver(false);
};

const gameOver = (isLoss) => {
  if (isLoss === false) {
    console.log('ты победил');
  }
  if (isLoss === true) {
    console.log('ты проиграл');
  }
};

const generateTemplate = () => {
  let wrapper = document.createElement('div');
  wrapper.className = 'wrapper';

  let gallowsContainer = generateGallows();
  let gameContainer = generateGameControls();

  wrapper.append(gallowsContainer, gameContainer);
  return wrapper;
};

const generateGallows = () => {
  let gallowsContainer = document.createElement('div');
  gallowsContainer.className = 'gallows-container';

  let svg = '';
  svg += `<svg height="250" width="200" class="gallows">`;
  svg += `<line x1="60" y1="20" x2="60" y2="200"/>`;
  svg += `<line x1="60" y1="20" x2="140" y2="20"/>`;
  svg += `<line x1="140" y1="20" x2="140" y2="50"/>`;
  svg += `<line x1="60" y1="60" x2="90" y2="20"/>`;
  svg += `<line x1="20" y1="200" x2="170" y2="200"/>`;
  svg += `<circle cx="140" cy="70" r="20" class="body-part hide"/>`;
  svg += `<line x1="140" y1="90" x2="140" y2="130" class="body-part hide"/>`;
  svg += `<line x1="140" y1="100" x2="120" y2="120" class="body-part hide"/>`;
  svg += `<line x1="140" y1="100" x2="160" y2="120" class="body-part hide"/>`;
  svg += `<line x1="140" y1="130" x2="130" y2="170" class="body-part hide"/>`;
  svg += `<line x1="140" y1="130" x2="150" y2="170" class="body-part hide"/>`;
  svg += `</svg>`;

  gallowsContainer.innerHTML = svg;

  let hangmanTitle = document.createElement('h1');
  hangmanTitle.className = 'hangman-title';
  hangmanTitle.textContent = 'Hangman Game';

  gallowsContainer.append(hangmanTitle);
  return gallowsContainer;
};

const generateGameControls = () => {
  let gameContainer = document.createElement('div');
  gameContainer.className = 'game-container';

  guessWordNode = document.createElement('ul');
  guessWordNode.className = 'guess-word';

  let question = document.createElement('p');
  question.className = 'hint';
  question.textContent = 'Hint: ';
  currentQuestionNode = document.createElement('span');
  question.append(currentQuestionNode);


  let incorrectGuess = document.createElement('p');
  incorrectGuess.className = 'incorrect-guess';
  incorrectGuess.textContent = 'Incorrect guesses: ';
  mistakeCounterNode = document.createElement('span');
  mistakeCounterNode.textContent = '0';
  let maxMistakes = document.createElement('span');
  maxMistakes.textContent = ' / 6';
  incorrectGuess.append(mistakeCounterNode, maxMistakes);


  let keyboard = generateKeyboardButtons();
  gameContainer.append(guessWordNode, question, incorrectGuess, keyboard);
  return gameContainer;
};

const generateKeyboardButtons = () => {
  let keyboard = document.createElement('div');
  keyboard.className = 'keyboard';

  for (let i = 97; i <= 122; i++) {
    const button = document.createElement('div');
    button.textContent = String.fromCharCode(i);
    keyboard.append(button);
    keyboardButtonsNodelist.push(button);
    button.addEventListener('click', e => keyboardClickHandler(e.target, String.fromCharCode(i)));
  }

  return keyboard;
};
