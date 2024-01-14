let questions = [];
let guessWord;
let currentQuestion;
let mistakeCounter;

window.onload = function () {
  console.log('hangman game started');
  // loadQuestions();
  document.body.append(generateTemplate());
  startNewGame();

  // console.log(getQuestion());
  // console.log(hint);
};

const loadQuestions = async () => {
  const response = await fetch("./db/questions.json");
  questions = await response.json();
};

const getQuestion = async () => {
  await loadQuestions();
  console.log(questions[~~(Math.random() * questions.length)]);
  return questions[~~(Math.random() * questions.length)];
};

const startNewGame = async () => {
  let { word, hint } = await getQuestion();
  console.log(word, hint);
  currentQuestion.textContent = hint;
  let lettersNodeList = createLettersList(word.length);
};

const createLettersList = (letterCount) => {
  let letterNodelist = [];
  for (let i = 0; i < letterCount; i++) {
    let li = document.createElement('li');
    li.className = 'letter';
    li.style.width = `calc(100% / ${letterCount} - 1rem)`
    letterNodelist.push(li);
    guessWord.append(li);
  }

  return letterNodelist;
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
  svg += `<circle cx="140" cy="70" r="20" class="hide"/>`;
  svg += `<line x1="140" y1="90" x2="140" y2="130" class="hide"/>`;
  svg += `<line x1="140" y1="100" x2="120" y2="120" class="hide"/>`;
  svg += `<line x1="140" y1="100" x2="160" y2="120" class="hide"/>`;
  svg += `<line x1="140" y1="130" x2="130" y2="170" class="hide"/>`;
  svg += `<line x1="140" y1="130" x2="150" y2="170" class="hide"/>`;
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

  guessWord = document.createElement('ul');
  guessWord.className = 'guess-word';

  let question = document.createElement('p');
  question.className = 'hint';
  question.textContent = 'Hint: ';
  currentQuestion = document.createElement('span');
  question.append(currentQuestion);


  let incorrectGuess = document.createElement('p');
  incorrectGuess.className = 'incorrect-guess';
  incorrectGuess.textContent = 'Incorrect guesses: ';
  mistakeCounter = document.createElement('span');
  mistakeCounter.textContent = '0';
  let maxMistakes = document.createElement('span');
  maxMistakes.textContent = ' / 6';
  incorrectGuess.append(mistakeCounter, maxMistakes);


  let keyboard = generateKeyboardButtons();
  gameContainer.append(guessWord, question, incorrectGuess, keyboard);
  return gameContainer;
};

const generateKeyboardButtons = () => {
  let keyboard = document.createElement('div');
  keyboard.className = 'keyboard';

  for (let i = 97; i <= 122; i++) {
    const button = document.createElement('div');
    button.textContent = String.fromCharCode(i);
    keyboard.append(button);
    button.addEventListener('click', (e) => {
      console.log(e.target);
    });
  }

  return keyboard;
};
