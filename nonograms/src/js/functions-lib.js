export function createNode(type, classlist, attrlist, content) {
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
  if (content) {
    node.textContent = content;
    // node.append(...content);
  }
  return node;
}
