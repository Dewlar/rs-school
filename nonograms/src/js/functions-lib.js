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
