export function createNode(type, classlist, attrlist, text) {
  let node;
  if (type) {
    node = document.createElement(type);
  }
  if (classlist) {
    node.classList.add(...classlist);
  }
  if (attrlist) {
    if (Object.keys(attrlist)) {
      for (let key in attrlist) {
        node.setAttribute(key, attrlist[key]);
      }
    }
  }
  if (text) {
    node.textContent = text;
    // node.append(...content);
  }
  return node;
}

export function createVictoryMessage(name, time) {
  const message = createNode('div', ['victory-message'])

  let template = '';

  // template += `<div class="victory-wrapper">`

  template += `<h2>Congratulation!</h2>`
  template += `<h2>You solved <span class="accent-text">${name}</span> nonograms</h2>`
  template += `<div><span>Your time:</span><span class="accent-text">${time}</span></div>`

  // template += `</div>`

  message.innerHTML = template;
  return message;
}
